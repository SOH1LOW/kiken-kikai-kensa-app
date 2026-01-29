/**
 * 答えキー解析ユーティリティ
 * ユーザーが入力した◯×の答えキーを解析し、問題に適用します
 */

/**
 * 答えキー解析結果
 */
export interface AnswerKeyParseResult {
  answers: boolean[]; // true = ◯, false = ×
  count: number;
  format: 'circle_cross' | 'true_false' | 'correct_incorrect' | 'mixed';
  errors: string[];
}

/**
 * 答えキーの検証結果
 */
export interface AnswerKeyValidationResult {
  isValid: boolean;
  questionCount: number;
  answerCount: number;
  mismatch: boolean;
  message: string;
}

/**
 * 答えキーを解析して boolean 配列に変換
 * サポートされるフォーマット:
 * - "◯◯×◯×" (円記号)
 * - "○○×○×" (丸記号)
 * - "✓✓✕✓✕" (チェック記号)
 * - "正誤正正誤" (日本語)
 * - "True False True" (英語)
 * - "T F T T F" (略記)
 * - 混合形式（複数の形式が混在）
 */
export function parseAnswerKey(input: string): AnswerKeyParseResult {
  const errors: string[] = [];
  const answers: boolean[] = [];
  let format: 'circle_cross' | 'true_false' | 'correct_incorrect' | 'mixed' = 'mixed';

  if (!input || input.trim().length === 0) {
    errors.push('答えキーが空です');
    return { answers: [], count: 0, format, errors };
  }

  // 入力を正規化（スペース、改行を削除）
  const normalized = input.trim().replace(/[\s\n\r]+/g, '');

  if (normalized.length === 0) {
    errors.push('答えキーが空です');
    return { answers: [], count: 0, format, errors };
  }

  let detectedFormats = new Set<string>();

  // 各文字を処理
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];

    // ◯/○ -> true
    if (char === '◯' || char === '○' || char === '⭕') {
      answers.push(true);
      detectedFormats.add('circle_cross');
    }
    // × -> false
    else if (char === '×' || char === '✕') {
      answers.push(false);
      detectedFormats.add('circle_cross');
    }
    // 正 -> true
    else if (char === '正') {
      answers.push(true);
      detectedFormats.add('correct_incorrect');
    }
    // 誤 -> false
    else if (char === '誤') {
      answers.push(false);
      detectedFormats.add('correct_incorrect');
    }
    // T/True -> true
    else if (char === 'T' || char === 't') {
      answers.push(true);
      detectedFormats.add('true_false');
    }
    // F/False -> false
    else if (char === 'F' || char === 'f') {
      answers.push(false);
      detectedFormats.add('true_false');
    }
    // ✓/✔ -> true
    else if (char === '✓' || char === '✔') {
      answers.push(true);
      detectedFormats.add('circle_cross');
    }
    // その他の文字はエラー
    else {
      errors.push(`無効な文字が見つかりました: "${char}" (位置: ${i + 1})`);
    }
  }

  // フォーマットを決定
  if (detectedFormats.size === 1) {
    const format_str = Array.from(detectedFormats)[0];
    if (format_str === 'circle_cross') format = 'circle_cross';
    else if (format_str === 'true_false') format = 'true_false';
    else if (format_str === 'correct_incorrect') format = 'correct_incorrect';
  } else if (detectedFormats.size > 1) {
    format = 'mixed';
  }

  return {
    answers,
    count: answers.length,
    format,
    errors,
  };
}

/**
 * 答えキーが問題数と一致するか検証
 */
export function validateAnswerKey(
  answerKey: AnswerKeyParseResult,
  questionCount: number
): AnswerKeyValidationResult {
  const mismatch = answerKey.count !== questionCount;

  let message = '';
  if (answerKey.errors.length > 0) {
    message = `エラー: ${answerKey.errors.join(', ')}`;
  } else if (mismatch) {
    message = `答えキーが${answerKey.count}個ですが、問題は${questionCount}問です`;
  } else {
    message = `✓ ${questionCount}問の答えキーが正しく読み込まれました`;
  }

  return {
    isValid: answerKey.errors.length === 0 && !mismatch,
    questionCount,
    answerCount: answerKey.count,
    mismatch,
    message,
  };
}

/**
 * 答えキーの形式を人間が読みやすい文字列に変換
 */
export function formatAnswerKeyForDisplay(answers: boolean[]): string {
  return answers.map(a => (a ? '◯' : '×')).join('');
}

/**
 * 答えキーをプレビュー用に整形（改行付き）
 * 1行10問ずつ表示
 */
export function formatAnswerKeyForPreview(answers: boolean[], itemsPerLine: number = 10): string {
  const lines: string[] = [];

  for (let i = 0; i < answers.length; i += itemsPerLine) {
    const slice = answers.slice(i, i + itemsPerLine);
    const line = slice.map(a => (a ? '◯' : '×')).join('');
    lines.push(line);
  }

  return lines.join('\n');
}

/**
 * 答えキーを検証して、エラーメッセージを生成
 */
export function getAnswerKeyErrorMessage(
  input: string,
  questionCount: number
): { isValid: boolean; message: string } {
  const parsed = parseAnswerKey(input);
  const validation = validateAnswerKey(parsed, questionCount);

  return {
    isValid: validation.isValid,
    message: validation.message,
  };
}

/**
 * 答えキーを複数の形式で試す（ユーザーが形式を忘れた場合）
 */
export function tryParseAnswerKeyFlexible(input: string): AnswerKeyParseResult {
  // 最初に標準的な解析を試す
  const result = parseAnswerKey(input);

  // エラーがなければそのまま返す
  if (result.errors.length === 0) {
    return result;
  }

  // エラーがある場合は、より緩い解析を試す
  const flexible: boolean[] = [];
  const flexErrors: string[] = [];

  for (const char of input) {
    if (char === '◯' || char === '○' || char === '⭕' || char === '✓' || char === '✔' || char === '正' || char === 'T' || char === 't' || char === 'Y' || char === 'y' || char === '1') {
      flexible.push(true);
    } else if (char === '×' || char === '✕' || char === '誤' || char === 'F' || char === 'f' || char === 'N' || char === 'n' || char === '0') {
      flexible.push(false);
    } else if (!/[\s\n\r]/.test(char)) {
      flexErrors.push(`無効な文字: "${char}"`);
    }
  }

  if (flexible.length > 0 && flexErrors.length === 0) {
    return {
      answers: flexible,
      count: flexible.length,
      format: 'mixed',
      errors: [],
    };
  }

  // 柔軟な解析でもエラーがある場合は、元の結果を返す
  return result;
}

/**
 * 答えキーの統計情報を取得
 */
export function getAnswerKeyStatistics(answers: boolean[]): {
  totalCount: number;
  circleCount: number;
  crossCount: number;
  circlePercentage: number;
  crossPercentage: number;
} {
  const totalCount = answers.length;
  const circleCount = answers.filter(a => a).length;
  const crossCount = totalCount - circleCount;

  return {
    totalCount,
    circleCount,
    crossCount,
    circlePercentage: totalCount > 0 ? (circleCount / totalCount) * 100 : 0,
    crossPercentage: totalCount > 0 ? (crossCount / totalCount) * 100 : 0,
  };
}
