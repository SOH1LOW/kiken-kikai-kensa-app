/**
 * ファイルからテキストを抽出するユーティリティ
 * PDFおよび画像ファイルをサポート
 */

export interface FileExtractionResult {
  fileName: string;
  fileType: 'pdf' | 'image' | 'text' | 'unknown';
  extractedText: string;
  confidence: number;
  error?: string;
}

export const fileExtraction = {
  /**
   * ファイルタイプを判定
   */
  getFileType(fileName: string, mimeType?: string): 'pdf' | 'image' | 'text' | 'unknown' {
    const ext = fileName.toLowerCase().split('.').pop() || '';
    const mime = mimeType?.toLowerCase() || '';

    // PDF
    if (ext === 'pdf' || mime === 'application/pdf') {
      return 'pdf';
    }

    // 画像
    if (
      ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'].includes(ext) ||
      mime.startsWith('image/')
    ) {
      return 'image';
    }

    // テキスト
    if (
      ['txt', 'csv', 'json'].includes(ext) ||
      mime === 'text/plain' ||
      mime === 'text/csv'
    ) {
      return 'text';
    }

    return 'unknown';
  },

  /**
   * テキストファイルを読み込む
   */
  async readTextFile(file: File): Promise<FileExtractionResult> {
    try {
      const text = await file.text();
      return {
        fileName: file.name,
        fileType: 'text',
        extractedText: text,
        confidence: 1.0,
      };
    } catch (error) {
      return {
        fileName: file.name,
        fileType: 'text',
        extractedText: '',
        confidence: 0,
        error: `テキスト読み込みエラー: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },

  /**
   * 画像ファイルをBase64に変換
   */
  async imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => {
        reject(new Error('画像ファイルの読み込みに失敗しました'));
      };
      reader.readAsDataURL(file);
    });
  },

  /**
   * PDFファイルをBase64に変換
   */
  async pdfToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => {
        reject(new Error('PDFファイルの読み込みに失敗しました'));
      };
      reader.readAsDataURL(file);
    });
  },

  /**
   * ファイルサイズをチェック
   */
  validateFileSize(file: File, maxSizeMB: number = 10): { valid: boolean; error?: string } {
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return {
        valid: false,
        error: `ファイルサイズが大きすぎます（最大${maxSizeMB}MB）`,
      };
    }
    return { valid: true };
  },

  /**
   * ファイルタイプをチェック
   */
  validateFileType(
    file: File,
    allowedTypes: ('pdf' | 'image' | 'text')[] = ['pdf', 'image', 'text']
  ): { valid: boolean; error?: string } {
    const fileType = this.getFileType(file.name, file.type);

    if (fileType === 'unknown') {
      return {
        valid: false,
        error: 'サポートされていないファイル形式です',
      };
    }

    if (!allowedTypes.includes(fileType)) {
      return {
        valid: false,
        error: `このファイル形式は許可されていません（許可: ${allowedTypes.join(', ')})`,
      };
    }

    return { valid: true };
  },

  /**
   * ファイルを検証
   */
  validateFile(
    file: File,
    maxSizeMB: number = 10,
    allowedTypes: ('pdf' | 'image' | 'text')[] = ['pdf', 'image', 'text']
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    const sizeCheck = this.validateFileSize(file, maxSizeMB);
    if (!sizeCheck.valid) {
      errors.push(sizeCheck.error!);
    }

    const typeCheck = this.validateFileType(file, allowedTypes);
    if (!typeCheck.valid) {
      errors.push(typeCheck.error!);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * 複数ファイルを検証
   */
  validateFiles(
    files: File[],
    maxSizeMB: number = 10,
    allowedTypes: ('pdf' | 'image' | 'text')[] = ['pdf', 'image', 'text']
  ): { valid: boolean; fileErrors: { fileName: string; errors: string[] }[] } {
    const fileErrors: { fileName: string; errors: string[] }[] = [];

    files.forEach(file => {
      const validation = this.validateFile(file, maxSizeMB, allowedTypes);
      if (!validation.valid) {
        fileErrors.push({
          fileName: file.name,
          errors: validation.errors,
        });
      }
    });

    return {
      valid: fileErrors.length === 0,
      fileErrors,
    };
  },

  /**
   * ファイルから抽出可能なテキストの推定
   */
  estimateExtractableText(file: File): { estimatedLines: number; estimatedWords: number } {
    // ファイルサイズから推定
    // 平均的なテキストは1行あたり約50バイト
    const estimatedLines = Math.ceil(file.size / 50);
    const estimatedWords = Math.ceil(file.size / 5); // 平均的な単語は5バイト

    return {
      estimatedLines,
      estimatedWords,
    };
  },

  /**
   * 複数のファイルから抽出されたテキストを結合
   */
  combineExtractedTexts(results: FileExtractionResult[]): string {
    return results
      .filter(r => !r.error && r.extractedText)
      .map(r => r.extractedText)
      .join('\n\n---\n\n');
  },

  /**
   * 抽出結果のサマリーを生成
   */
  generateExtractionSummary(results: FileExtractionResult[]): string {
    const successful = results.filter(r => !r.error).length;
    const failed = results.filter(r => r.error).length;
    const totalChars = results.reduce((sum, r) => sum + r.extractedText.length, 0);

    let summary = `ファイル処理完了\n`;
    summary += `成功: ${successful}/${results.length}\n`;
    if (failed > 0) {
      summary += `失敗: ${failed}\n`;
    }
    summary += `抽出文字数: ${totalChars}`;

    return summary;
  },
};
