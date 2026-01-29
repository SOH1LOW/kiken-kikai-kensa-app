/**
 * 複数ファイルのバッチ処理ロジック
 * PDF・画像ファイルを一度に処理し、問題抽出・分類・答え適用を行います
 */

import { ExtractedQuestion, ocrExtraction } from './ocr-extraction';
import { Category } from './category-classifier';

/**
 * バッチ処理対象のファイル情報
 */
export interface BatchFile {
  id: string;
  name: string;
  uri: string;
  type: 'pdf' | 'image' | 'text';
  size: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number; // 0-100
  error?: string;
}

/**
 * バッチ処理の進捗情報
 */
export interface BatchProgress {
  fileId: string;
  fileName: string;
  currentStep: 'extracting' | 'classifying' | 'applying-answers' | 'completed';
  progress: number; // 0-100
  extractedCount: number;
  classifiedCount: number;
  answeredCount: number;
}

/**
 * バッチ処理の最終結果
 */
export interface BatchProcessingResult {
  fileId: string;
  fileName: string;
  success: boolean;
  questions: ExtractedQuestion[];
  categorized?: boolean;
  answersApplied?: boolean;
  error?: string;
  timestamp: string;
}

/**
 * バッチ処理の統計情報
 */
export interface BatchStatistics {
  totalFiles: number;
  processedFiles: number;
  failedFiles: number;
  totalQuestions: number;
  totalCategorized: number;
  totalAnswered: number;
  averageQuestionsPerFile: number;
  startTime: string;
  endTime: string;
  duration: number; // ミリ秒
}

/**
 * バッチファイルマネージャー
 */
export class BatchFileManager {
  private files: Map<string, BatchFile> = new Map();
  private results: Map<string, BatchProcessingResult> = new Map();
  private progressCallbacks: Map<string, (progress: BatchProgress) => void> = new Map();

  /**
   * ファイルをバッチに追加
   */
  addFile(file: BatchFile): void {
    this.files.set(file.id, {
      ...file,
      status: 'pending',
      progress: 0,
    });
  }

  /**
   * 複数のファイルを一度に追加
   */
  addFiles(files: BatchFile[]): void {
    files.forEach(file => this.addFile(file));
  }

  /**
   * ファイルを削除
   */
  removeFile(fileId: string): void {
    this.files.delete(fileId);
    this.results.delete(fileId);
    this.progressCallbacks.delete(fileId);
  }

  /**
   * 全ファイルをクリア
   */
  clear(): void {
    this.files.clear();
    this.results.clear();
    this.progressCallbacks.clear();
  }

  /**
   * ファイルの状態を更新
   */
  updateFileStatus(fileId: string, status: BatchFile['status'], progress: number = 0, error?: string): void {
    const file = this.files.get(fileId);
    if (file) {
      file.status = status;
      file.progress = Math.min(Math.max(progress, 0), 100);
      file.error = error;
    }
  }

  /**
   * 進捗コールバックを登録
   */
  onProgress(fileId: string, callback: (progress: BatchProgress) => void): void {
    this.progressCallbacks.set(fileId, callback);
  }

  /**
   * 進捗を通知
   */
  notifyProgress(progress: BatchProgress): void {
    const callback = this.progressCallbacks.get(progress.fileId);
    if (callback) {
      callback(progress);
    }
  }

  /**
   * 処理結果を保存
   */
  saveResult(result: BatchProcessingResult): void {
    this.results.set(result.fileId, result);
    this.updateFileStatus(
      result.fileId,
      result.success ? 'completed' : 'error',
      100,
      result.error
    );
  }

  /**
   * 全ファイルを取得
   */
  getFiles(): BatchFile[] {
    return Array.from(this.files.values());
  }

  /**
   * 全結果を取得
   */
  getResults(): BatchProcessingResult[] {
    return Array.from(this.results.values());
  }

  /**
   * 統計情報を計算
   */
  getStatistics(startTime: string, endTime: string): BatchStatistics {
    const results = this.getResults();
    const successResults = results.filter(r => r.success);
    const totalQuestions = successResults.reduce((sum, r) => sum + r.questions.length, 0);
    const totalCategorized = successResults.filter(r => r.categorized).reduce((sum, r) => sum + r.questions.length, 0);
    const totalAnswered = successResults.filter(r => r.answersApplied).reduce((sum, r) => sum + r.questions.length, 0);

    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const duration = end - start;

    return {
      totalFiles: this.files.size,
      processedFiles: successResults.length,
      failedFiles: results.length - successResults.length,
      totalQuestions,
      totalCategorized,
      totalAnswered,
      averageQuestionsPerFile: successResults.length > 0 ? totalQuestions / successResults.length : 0,
      startTime,
      endTime,
      duration,
    };
  }
}

/**
 * ファイルから問題を抽出するプロセッサ
 */
export class BatchQuestionExtractor {
  /**
   * 単一ファイルから問題を抽出
   */
  async extractFromFile(file: BatchFile): Promise<{
    questions: ExtractedQuestion[];
    error?: string;
  }> {
    try {
      if (file.type === 'text') {
        // テキストファイルの場合は直接処理
        const result = ocrExtraction.extractQuestionsFromText(file.uri);
        if (result.errors.length > 0) {
          return {
            questions: result.extractedQuestions,
            error: result.errors.join(', '),
          };
        }
        return { questions: result.extractedQuestions };
      } else if (file.type === 'pdf' || file.type === 'image') {
        // PDF・画像ファイルの場合はOCR処理が必要
        // 実装時にはサーバー側のOCR機能を呼び出す
        const result = ocrExtraction.extractQuestionsFromText(file.uri);
        return { questions: result.extractedQuestions };
      }

      return {
        questions: [],
        error: 'サポートされていないファイル形式です',
      };
    } catch (error) {
      return {
        questions: [],
        error: error instanceof Error ? error.message : '抽出に失敗しました',
      };
    }
  }

  /**
   * 複数ファイルから問題を一括抽出
   */
  async extractFromFiles(
    files: BatchFile[],
    onProgress?: (progress: BatchProgress) => void
  ): Promise<Map<string, ExtractedQuestion[]>> {
    const results = new Map<string, ExtractedQuestion[]>();

    for (const file of files) {
      const extractResult = await this.extractFromFile(file);

      if (onProgress) {
        onProgress({
          fileId: file.id,
          fileName: file.name,
          currentStep: 'extracting',
          progress: 100,
          extractedCount: extractResult.questions.length,
          classifiedCount: 0,
          answeredCount: 0,
        });
      }

      if (extractResult.error) {
        console.error(`Failed to extract from ${file.name}:`, extractResult.error);
      }

      results.set(file.id, extractResult.questions);
    }

    return results;
  }
}

/**
 * バッチ処理の統合マネージャー
 */
export class BatchProcessor {
  private manager: BatchFileManager;
  private extractor: BatchQuestionExtractor;

  constructor() {
    this.manager = new BatchFileManager();
    this.extractor = new BatchQuestionExtractor();
  }

  /**
   * ファイルを追加
   */
  addFiles(files: BatchFile[]): void {
    this.manager.addFiles(files);
  }

  /**
   * 進捗コールバックを登録
   */
  onProgress(fileId: string, callback: (progress: BatchProgress) => void): void {
    this.manager.onProgress(fileId, callback);
  }

  /**
   * 全ファイルを処理
   */
  async processAll(
    applyAnswers?: Map<string, string>
  ): Promise<{
    results: BatchProcessingResult[];
    statistics: BatchStatistics;
  }> {
    const startTime = new Date().toISOString();
    const files = this.manager.getFiles();

    // ステップ1: 問題抽出
    const extractedQuestions = await this.extractor.extractFromFiles(
      files,
      (progress) => this.manager.notifyProgress(progress)
    );

    // ステップ2: 結果を保存
    for (const file of files) {
      const questions = extractedQuestions.get(file.id) || [];
      const result: BatchProcessingResult = {
        fileId: file.id,
        fileName: file.name,
        success: questions.length > 0,
        questions,
        categorized: false,
        answersApplied: applyAnswers?.has(file.id) ?? false,
        timestamp: new Date().toISOString(),
      };

      this.manager.saveResult(result);
    }

    const endTime = new Date().toISOString();
    const results = this.manager.getResults();
    const statistics = this.manager.getStatistics(startTime, endTime);

    return { results, statistics };
  }

  /**
   * 全ファイルをクリア
   */
  clear(): void {
    this.manager.clear();
  }

  /**
   * 統計情報を取得
   */
  getStatistics(startTime: string, endTime: string): BatchStatistics {
    return this.manager.getStatistics(startTime, endTime);
  }

  /**
   * 結果を取得
   */
  getResults(): BatchProcessingResult[] {
    return this.manager.getResults();
  }

  /**
   * ファイルを取得
   */
  getFiles(): BatchFile[] {
    return this.manager.getFiles();
  }
}

/**
 * グローバルバッチプロセッサインスタンス
 */
export const globalBatchProcessor = new BatchProcessor();
