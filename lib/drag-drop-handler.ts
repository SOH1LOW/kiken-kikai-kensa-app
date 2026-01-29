/**
 * ドラッグ&ドロップハンドラー
 * ファイルのドラッグ&ドロップ処理を管理します
 */

import { BatchFile } from './batch-file-processor';

/**
 * ドラッグ&ドロップイベントの状態
 */
export interface DragDropState {
  isDragging: boolean;
  draggedFileCount: number;
  validFiles: BatchFile[];
  invalidFiles: { name: string; reason: string }[];
}

/**
 * ファイル検証結果
 */
export interface FileValidationResult {
  isValid: boolean;
  file?: BatchFile;
  error?: string;
}

/**
 * サポートされているファイルタイプ
 */
const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'text/plain',
];

const SUPPORTED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.txt'];

/**
 * ファイルサイズの制限（MB）
 */
const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * ドラッグ&ドロップハンドラー
 */
export class DragDropHandler {
  /**
   * ファイルが有効かどうかを検証
   */
  static validateFile(file: File): FileValidationResult {
    // ファイルサイズをチェック
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        isValid: false,
        error: `ファイルサイズが大きすぎます（最大${MAX_FILE_SIZE_MB}MB）`,
      };
    }

    // MIMEタイプをチェック
    if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
      // 拡張子でも確認
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!SUPPORTED_EXTENSIONS.includes(extension)) {
        return {
          isValid: false,
          error: `サポートされていないファイル形式です（${file.name}）`,
        };
      }
    }

    // ファイル名が空でないかチェック
    if (!file.name || file.name.trim().length === 0) {
      return {
        isValid: false,
        error: 'ファイル名が無効です',
      };
    }

    return { isValid: true };
  }

  /**
   * ファイルをBatchFileに変換
   */
  static fileToBatchFile(file: File): FileValidationResult {
    const validation = this.validateFile(file);

    if (!validation.isValid) {
      return validation;
    }

    // ファイルタイプを判定
    let type: 'pdf' | 'image' | 'text' = 'text';
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      type = 'pdf';
    } else if (file.type.startsWith('image/')) {
      type = 'image';
    }

    const batchFile: BatchFile = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      uri: URL.createObjectURL(file),
      type,
      size: file.size,
      status: 'pending',
      progress: 0,
    };

    return { isValid: true, file: batchFile };
  }

  /**
   * 複数のファイルを検証して変換
   */
  static processFiles(files: FileList | File[]): {
    validFiles: BatchFile[];
    invalidFiles: { name: string; reason: string }[];
  } {
    const validFiles: BatchFile[] = [];
    const invalidFiles: { name: string; reason: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = this.fileToBatchFile(file);

      if (result.isValid && result.file) {
        validFiles.push(result.file);
      } else {
        invalidFiles.push({
          name: file.name,
          reason: result.error || '不明なエラー',
        });
      }
    }

    return { validFiles, invalidFiles };
  }

  /**
   * DataTransferからファイルを抽出
   */
  static extractFilesFromDataTransfer(dataTransfer: DataTransfer): {
    validFiles: BatchFile[];
    invalidFiles: { name: string; reason: string }[];
  } {
    const files: File[] = [];

    // ファイルを抽出
    if (dataTransfer.files && dataTransfer.files.length > 0) {
      for (let i = 0; i < dataTransfer.files.length; i++) {
        files.push(dataTransfer.files[i]);
      }
    }

    // ドラッグ&ドロップされたアイテムからもファイルを抽出
    if (dataTransfer.items && dataTransfer.items.length > 0) {
      for (let i = 0; i < dataTransfer.items.length; i++) {
        if (dataTransfer.items[i].kind === 'file') {
          const file = dataTransfer.items[i].getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }
    }

    return this.processFiles(files);
  }

  /**
   * ドラッグオーバーイベントを処理
   */
  static handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  /**
   * ドラッグリーブイベントを処理
   */
  static handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * ドロップイベントを処理
   */
  static handleDrop(event: DragEvent): {
    validFiles: BatchFile[];
    invalidFiles: { name: string; reason: string }[];
  } {
    event.preventDefault();
    event.stopPropagation();

    if (!event.dataTransfer) {
      return { validFiles: [], invalidFiles: [] };
    }

    return this.extractFilesFromDataTransfer(event.dataTransfer);
  }

  /**
   * ファイルサイズをフォーマット
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * サポートされているファイル形式の説明を取得
   */
  static getSupportedFormatsDescription(): string {
    return 'PDF、画像（JPEG、PNG、GIF、WebP）、テキストファイル';
  }

  /**
   * ファイル検証エラーメッセージを生成
   */
  static getValidationErrorMessage(invalidFiles: { name: string; reason: string }[]): string {
    if (invalidFiles.length === 0) {
      return '';
    }

    const messages = invalidFiles.map(f => `• ${f.name}: ${f.reason}`).join('\n');
    return `以下のファイルは処理できません:\n${messages}`;
  }

  /**
   * ドラッグ&ドロップ対応ブラウザかどうかを確認
   */
  static isDragDropSupported(): boolean {
    const div = document.createElement('div');
    return (
      ('draggable' in div || ('ondragstart' in div && 'ondrop' in div)) &&
      'FormData' in window &&
      'FileReader' in window
    );
  }
}

/**
 * ドラッグ&ドロップ状態マネージャー
 */
export class DragDropStateManager {
  private state: DragDropState = {
    isDragging: false,
    draggedFileCount: 0,
    validFiles: [],
    invalidFiles: [],
  };

  private listeners: Set<(state: DragDropState) => void> = new Set();

  /**
   * 状態をリセット
   */
  reset(): void {
    this.state = {
      isDragging: false,
      draggedFileCount: 0,
      validFiles: [],
      invalidFiles: [],
    };
    this.notifyListeners();
  }

  /**
   * ドラッグ開始
   */
  startDrag(fileCount: number): void {
    this.state.isDragging = true;
    this.state.draggedFileCount = fileCount;
    this.notifyListeners();
  }

  /**
   * ドラッグ終了
   */
  endDrag(): void {
    this.state.isDragging = false;
    this.state.draggedFileCount = 0;
    this.notifyListeners();
  }

  /**
   * ファイルを設定
   */
  setFiles(validFiles: BatchFile[], invalidFiles: { name: string; reason: string }[]): void {
    this.state.validFiles = validFiles;
    this.state.invalidFiles = invalidFiles;
    this.notifyListeners();
  }

  /**
   * ファイルを追加
   */
  addFiles(validFiles: BatchFile[], invalidFiles: { name: string; reason: string }[]): void {
    this.state.validFiles = [...this.state.validFiles, ...validFiles];
    this.state.invalidFiles = [...this.state.invalidFiles, ...invalidFiles];
    this.notifyListeners();
  }

  /**
   * ファイルを削除
   */
  removeFile(fileId: string): void {
    this.state.validFiles = this.state.validFiles.filter(f => f.id !== fileId);
    this.notifyListeners();
  }

  /**
   * 現在の状態を取得
   */
  getState(): DragDropState {
    return { ...this.state };
  }

  /**
   * リスナーを登録
   */
  subscribe(listener: (state: DragDropState) => void): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * リスナーに通知
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }
}

/**
 * グローバルドラッグ&ドロップ状態マネージャー
 */
export const globalDragDropStateManager = new DragDropStateManager();
