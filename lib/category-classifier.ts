/**
 * 問題のカテゴリ自動分類機能
 * LLMを使用して抽出された問題を既存のカテゴリに分類します
 */

import { ExtractedQuestion } from './ocr-extraction';
import { Question } from '@/data/questions';

// 既存の17カテゴリ
export const AVAILABLE_CATEGORIES = [
  '測定機器',
  '寸法測定',
  '角度測定',
  '歯車測定',
  'ねじ測定',
  '光学測定',
  '表面性状',
  '非破壊検査',
  '硬さ試験',
  '材料試験',
  '材料',
  '機械要素',
  '加工方法',
  '図面',
  '幾何公差',
  '品質管理',
  '安全管理',
] as const;

export type Category = typeof AVAILABLE_CATEGORIES[number];

export interface ClassificationResult {
  questionText: string;
  suggestedCategory: Category;
  confidence: number;
  reasoning: string;
}

export interface BatchClassificationResult {
  results: ClassificationResult[];
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  averageConfidence: number;
}

/**
 * カテゴリ分類用のシステムプロンプトを生成
 */
function generateSystemPrompt(): string {
  const categoriesDescription = AVAILABLE_CATEGORIES.map((cat, idx) => {
    const descriptions: Record<Category, string> = {
      '測定機器': 'マイクロメータ、ノギス、ダイヤルゲージなどの測定工具',
      '寸法測定': '長さ、厚さ、直径などの寸法測定方法と技術',
      '角度測定': '角度、勾配、直角度などの角度測定',
      '歯車測定': '歯車の歯厚、ピッチ、精度測定',
      'ねじ測定': 'ねじのピッチ、有効径、精度測定',
      '光学測定': '光学式測定機器、投影機、顕微鏡',
      '表面性状': '表面粗さ、表面性状記号、粗さ測定',
      '非破壊検査': '浸透探傷、磁粉探傷、超音波探傷、渦電流探傷',
      '硬さ試験': 'ロックウェル硬さ、ブリネル硬さ、ビッカース硬さ',
      '材料試験': '引張試験、圧縮試験、曲げ試験、衝撃試験',
      '材料': '鋼、アルミニウム、銅などの材料特性と分類',
      '機械要素': 'ベアリング、ギア、ベルト、チェーンなどの機械要素',
      '加工方法': '旋盤加工、フライス加工、研削加工などの加工方法',
      '図面': '図面の読み方、寸法記入、公差記入',
      '幾何公差': '幾何公差の種類、記号、測定方法',
      '品質管理': '品質管理手法、統計的管理、不良率',
      '安全管理': '安全管理、危険予知、労働安全衛生',
    };
    return `${idx + 1}. ${cat}: ${descriptions[cat]}`;
  }).join('\n');

  return `あなたは機械検査3級技能検定の問題分類専門家です。
与えられた問題文を以下の17カテゴリのいずれかに分類してください。

【カテゴリ一覧】
${categoriesDescription}

【分類ルール】
1. 問題文の主要なキーワードと内容から最も適切なカテゴリを選択してください
2. 複数のカテゴリに該当する場合は、最も主要なカテゴリを選択してください
3. 信頼度は0.0～1.0の値で、分類の確実性を示してください
4. 必ずJSON形式で応答してください

【応答形式】
{
  "category": "カテゴリ名",
  "confidence": 0.95,
  "reasoning": "分類の理由を簡潔に説明"
}`;
}

/**
 * 単一の問題をLLMで分類（クライアント側では使用しない、サーバー側で使用）
 * このメソッドはサーバー側のtRPC手続きから呼び出されることを想定しています
 */
export async function classifyQuestionWithLLM(
  questionText: string,
  llmResponse: string
): Promise<ClassificationResult> {
  try {
    // LLMからのレスポンスをパース
    const parsed = JSON.parse(llmResponse);

    // カテゴリが有効か確認
    if (!AVAILABLE_CATEGORIES.includes(parsed.category)) {
      throw new Error(`Invalid category: ${parsed.category}`);
    }

    return {
      questionText,
      suggestedCategory: parsed.category as Category,
      confidence: Math.min(Math.max(parsed.confidence || 0.5, 0), 1),
      reasoning: parsed.reasoning || '',
    };
  } catch (error) {
    throw new Error(`Failed to classify question: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 複数の問題をバッチで分類（サーバー側で使用）
 */
export async function classifyQuestionsWithLLM(
  questions: ExtractedQuestion[],
  llmResponses: string[]
): Promise<BatchClassificationResult> {
  const results: ClassificationResult[] = [];
  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < questions.length; i++) {
    try {
      const result = await classifyQuestionWithLLM(
        questions[i].text,
        llmResponses[i]
      );
      results.push(result);
      successCount++;
    } catch (error) {
      failureCount++;
      // フォールバック：最初のカテゴリを使用
      results.push({
        questionText: questions[i].text,
        suggestedCategory: AVAILABLE_CATEGORIES[0],
        confidence: 0.3,
        reasoning: 'LLM分類に失敗しました。デフォルトカテゴリを使用しています。',
      });
    }
  }

  const averageConfidence = results.length > 0
    ? results.reduce((sum, r) => sum + r.confidence, 0) / results.length
    : 0;

  return {
    results,
    totalProcessed: questions.length,
    successCount,
    failureCount,
    averageConfidence,
  };
}

/**
 * 抽出された問題をカテゴリ分類済みのQuestion型に変換
 */
export function convertToQuestionsWithCategory(
  classificationResults: ClassificationResult[]
): Question[] {
  return classificationResults.map((result, index) => ({
    id: Math.random(),
    text: result.questionText,
    answer: true, // デフォルト値（実際には抽出時に決定）
    explanation: `信頼度: ${(result.confidence * 100).toFixed(1)}%\n理由: ${result.reasoning}`,
    category: result.suggestedCategory,
  }));
}

/**
 * LLMプロンプトを生成（デバッグ用）
 */
export function generateClassificationPrompt(questionText: string): string {
  return `${generateSystemPrompt()}

【分類対象の問題】
${questionText}`;
}

/**
 * カテゴリ分類結果をサマリーとして生成
 */
export function generateClassificationSummary(result: BatchClassificationResult): string {
  const categoryCount = new Map<Category, number>();

  result.results.forEach(r => {
    categoryCount.set(r.suggestedCategory, (categoryCount.get(r.suggestedCategory) || 0) + 1);
  });

  const categorySummary = Array.from(categoryCount.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([cat, count]) => `  ${cat}: ${count}問`)
    .join('\n');

  return `【カテゴリ分類結果】
処理済み: ${result.totalProcessed}問
成功: ${result.successCount}問
失敗: ${result.failureCount}問
平均信頼度: ${(result.averageConfidence * 100).toFixed(1)}%

【カテゴリ別分類数】
${categorySummary}`;
}

/**
 * 信頼度に基づいて分類結果をフィルタリング
 */
export function filterByConfidence(
  results: ClassificationResult[],
  minConfidence: number = 0.7
): ClassificationResult[] {
  return results.filter(r => r.confidence >= minConfidence);
}

/**
 * 低信頼度の結果を検出
 */
export function detectLowConfidenceResults(
  results: ClassificationResult[],
  threshold: number = 0.6
): ClassificationResult[] {
  return results.filter(r => r.confidence < threshold);
}
