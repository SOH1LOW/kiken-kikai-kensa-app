/**
 * サーバー側のカテゴリ分類ロジック
 * LLMを使用して問題をカテゴリに分類します
 */

import { invokeLLM } from './_core/llm';
import { AVAILABLE_CATEGORIES, type Category } from '../lib/category-classifier';

interface ClassificationRequest {
  questionText: string;
}

interface ClassificationResponse {
  category: Category;
  confidence: number;
  reasoning: string;
}

/**
 * システムプロンプトを生成
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
3. 信頼度は0.0～1.0の値で、分類の確実性を示してください（例：0.95）
4. 必ず以下のJSON形式で応答してください

【応答形式（JSON）】
{
  "category": "カテゴリ名",
  "confidence": 0.95,
  "reasoning": "分類の理由を簡潔に説明"
}

重要: JSONのみを応答してください。他のテキストは含めないでください。`;
}

/**
 * 単一の問題をLLMで分類
 */
export async function classifyQuestionWithLLM(
  questionText: string
): Promise<ClassificationResponse> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: generateSystemPrompt(),
        },
        {
          role: 'user',
          content: `以下の問題を分類してください：\n\n${questionText}`,
        },
      ],
      response_format: {
        type: 'json_object',
      },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response from LLM');
    }

    // contentが文字列型であることを確認
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    const parsed = JSON.parse(contentStr);

    // カテゴリが有効か確認
    if (!AVAILABLE_CATEGORIES.includes(parsed.category)) {
      throw new Error(`Invalid category: ${parsed.category}`);
    }

    return {
      category: parsed.category as Category,
      confidence: Math.min(Math.max(parsed.confidence || 0.5, 0), 1),
      reasoning: parsed.reasoning || '',
    };
  } catch (error) {
    console.error('Classification error:', error);
    throw new Error(`Failed to classify question: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 複数の問題をバッチで分類
 */
export async function classifyQuestionsWithLLM(
  questions: string[]
): Promise<ClassificationResponse[]> {
  const results: ClassificationResponse[] = [];

  for (const question of questions) {
    try {
      const result = await classifyQuestionWithLLM(question);
      results.push(result);
    } catch (error) {
      console.error(`Failed to classify question: ${question}`, error);
      // フォールバック：最初のカテゴリを使用
      results.push({
        category: AVAILABLE_CATEGORIES[0],
        confidence: 0.3,
        reasoning: 'LLM分類に失敗しました。デフォルトカテゴリを使用しています。',
      });
    }
  }

  return results;
}

/**
 * 複数の問題を効率的にバッチ処理で分類（バッチサイズを指定可能）
 */
export async function classifyQuestionsWithLLMBatch(
  questions: string[],
  batchSize: number = 5
): Promise<ClassificationResponse[]> {
  const results: ClassificationResponse[] = [];

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    const batchResults = await classifyQuestionsWithLLM(batch);
    results.push(...batchResults);
  }

  return results;
}
