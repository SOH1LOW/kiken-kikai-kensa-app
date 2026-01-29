import { Question } from '@/data/questions';

/**
 * OCR抽出結果の型定義
 */
export interface OCRExtractionResult {
  rawText: string;
  extractedQuestions: ExtractedQuestion[];
  confidence: number;
  errors: string[];
}

export interface ExtractedQuestion {
  text: string;
  answer: boolean | null; // null = 不確定
  explanation?: string;
  category?: string;
  confidence: number;
}

/**
 * テキストから◯×問題を抽出するユーティリティ
 */
export const ocrExtraction = {
  /**
   * テキストから◯×問題を抽出
   * サポートされるフォーマット:
   * - "問題文 ◯" または "問題文 ○"
   * - "問題文 ×" または "問題文 ✕"
   * - "問題文 正" または "問題文 誤"
   * - "問題文 True/False"
   * - "問題文\n◯" (改行区切り)
   */
  extractQuestionsFromText(text: string): OCRExtractionResult {
    const errors: string[] = [];
    const extractedQuestions: ExtractedQuestion[] = [];

    if (!text || text.trim().length === 0) {
      errors.push('入力テキストが空です');
      return {
        rawText: text,
        extractedQuestions: [],
        confidence: 0,
        errors,
      };
    }

    // テキストを行単位で分割
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      // 行が短すぎる場合はスキップ
      if (line.length < 5) {
        i++;
        continue;
      }

      // 問題文と答えを分離
      const result = this.parseQuestionLine(line);

      if (result) {
        extractedQuestions.push({
          text: result.questionText,
          answer: result.answer,
          confidence: result.confidence,
        });
      } else {
        // 次の行が答えかもしれない
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          const answerResult = this.parseAnswerLine(nextLine);

          if (answerResult) {
            extractedQuestions.push({
              text: line,
              answer: answerResult.answer,
              confidence: answerResult.confidence,
            });
            i++; // 次の行をスキップ
          }
        }
      }

      i++;
    }

    const confidence = extractedQuestions.length > 0
      ? extractedQuestions.reduce((sum, q) => sum + q.confidence, 0) / extractedQuestions.length
      : 0;

    return {
      rawText: text,
      extractedQuestions,
      confidence,
      errors: errors.length > 0 ? errors : [],
    };
  },

  /**
   * 単一行から問題と答えを抽出
   */
  parseQuestionLine(line: string): { questionText: string; answer: boolean; confidence: number } | null {
    // パターン1: "問題文 ◯" または "問題文 ○"
    const circleMatch = line.match(/^(.+?)\s*[◯○][\s]*$/);
    if (circleMatch) {
      return {
        questionText: circleMatch[1].trim(),
        answer: true,
        confidence: 0.95,
      };
    }

    // パターン2: "問題文 ×" または "問題文 ✕"
    const crossMatch = line.match(/^(.+?)\s*[×✕][\s]*$/);
    if (crossMatch) {
      return {
        questionText: crossMatch[1].trim(),
        answer: false,
        confidence: 0.95,
      };
    }

    // パターン3: "問題文 正" または "問題文 誤"
    const correctMatch = line.match(/^(.+?)\s*正[\s]*$/);
    if (correctMatch) {
      return {
        questionText: correctMatch[1].trim(),
        answer: true,
        confidence: 0.90,
      };
    }

    const incorrectMatch = line.match(/^(.+?)\s*誤[\s]*$/);
    if (incorrectMatch) {
      return {
        questionText: incorrectMatch[1].trim(),
        answer: false,
        confidence: 0.90,
      };
    }

    // パターン4: "問題文 True" または "問題文 False"
    const trueMatch = line.match(/^(.+?)\s*(?:True|true|TRUE)[\s]*$/);
    if (trueMatch) {
      return {
        questionText: trueMatch[1].trim(),
        answer: true,
        confidence: 0.85,
      };
    }

    const falseMatch = line.match(/^(.+?)\s*(?:False|false|FALSE)[\s]*$/);
    if (falseMatch) {
      return {
        questionText: falseMatch[1].trim(),
        answer: false,
        confidence: 0.85,
      };
    }

    // パターン5: "問題文\t◯" (タブ区切り)
    const tabMatch = line.match(/^(.+?)\t+[◯○×✕正誤][\s]*$/);
    if (tabMatch) {
      const answerChar = line.match(/[◯○×✕正誤]$/)?.[0];
      if (answerChar) {
        return {
          questionText: tabMatch[1].trim(),
          answer: ['◯', '○', '正'].includes(answerChar),
          confidence: 0.90,
        };
      }
    }

    return null;
  },

  /**
   * 答えのみの行をパース
   */
  parseAnswerLine(line: string): { answer: boolean; confidence: number } | null {
    // ◯ または ○
    if (/^[◯○][\s]*$/.test(line)) {
      return { answer: true, confidence: 0.95 };
    }

    // × または ✕
    if (/^[×✕][\s]*$/.test(line)) {
      return { answer: false, confidence: 0.95 };
    }

    // 正 または 誤
    if (/^正[\s]*$/.test(line)) {
      return { answer: true, confidence: 0.90 };
    }

    if (/^誤[\s]*$/.test(line)) {
      return { answer: false, confidence: 0.90 };
    }

    // True/False
    if (/^(?:True|true|TRUE)[\s]*$/.test(line)) {
      return { answer: true, confidence: 0.85 };
    }

    if (/^(?:False|false|FALSE)[\s]*$/.test(line)) {
      return { answer: false, confidence: 0.85 };
    }

    return null;
  },

  /**
   * 抽出された問題をQuestion型に変換
   */
  convertToQuestions(
    extractedQuestions: ExtractedQuestion[],
    category: string = '過去問題',
    setId: string = ''
  ): Question[] {
    return extractedQuestions
      .filter(eq => eq.text && eq.text.trim().length > 0 && eq.answer !== null)
      .map((eq, index) => ({
        id: parseInt(`${Date.now()}${index}`, 10),
        text: eq.text.trim(),
        answer: eq.answer as boolean,
        explanation: eq.explanation || '説明は後で追加してください。',
        category: eq.category || category,
      }));
  },

  /**
   * 複数のテキストブロックから問題を抽出
   */
  extractFromMultipleTexts(texts: string[], category: string = '過去問題'): Question[] {
    const allQuestions: Question[] = [];

    texts.forEach((text, index) => {
      const result = this.extractQuestionsFromText(text);
      const questions = this.convertToQuestions(result.extractedQuestions, category);
      allQuestions.push(...questions);
    });

    return allQuestions;
  },

  /**
   * 信頼度が低い問題をフィルタリング
   */
  filterByConfidence(questions: ExtractedQuestion[], threshold: number = 0.80): ExtractedQuestion[] {
    return questions.filter(q => q.confidence >= threshold);
  },

  /**
   * 重複する問題を検出
   */
  detectDuplicates(questions: Question[]): { original: Question; duplicates: Question[] }[] {
    const duplicates: { original: Question; duplicates: Question[] }[] = [];
    const seen = new Map<string, Question>();

    questions.forEach(q => {
      const normalized = q.text.toLowerCase().trim();
      if (seen.has(normalized)) {
        const original = seen.get(normalized)!;
        const existing = duplicates.find(d => d.original.id === original.id);
        if (existing) {
          existing.duplicates.push(q);
        } else {
          duplicates.push({
            original,
            duplicates: [q],
          });
        }
      } else {
        seen.set(normalized, q);
      }
    });

    return duplicates;
  },

  /**
   * 問題の品質をチェック
   */
  validateQuestion(question: ExtractedQuestion): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!question.text || question.text.trim().length === 0) {
      issues.push('問題文が空です');
    }

    if (question.text && question.text.length < 5) {
      issues.push('問題文が短すぎます（5文字以上が必要）');
    }

    if (question.text && question.text.length > 500) {
      issues.push('問題文が長すぎます（500文字以下が必要）');
    }

    if (question.answer === null) {
      issues.push('答えが不確定です');
    }

    if (question.confidence < 0.70) {
      issues.push(`信頼度が低いです（${(question.confidence * 100).toFixed(0)}%）`);
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  },

  /**
   * 抽出結果のサマリーを生成
   */
  generateSummary(result: OCRExtractionResult): string {
    const validCount = result.extractedQuestions.filter(q => q.answer !== null).length;
    const avgConfidence = (result.confidence * 100).toFixed(1);

    let summary = `抽出結果: ${validCount}問\n`;
    summary += `平均信頼度: ${avgConfidence}%\n`;

    if (result.errors.length > 0) {
      summary += `エラー: ${result.errors.join(', ')}\n`;
    }

    return summary;
  },
};
