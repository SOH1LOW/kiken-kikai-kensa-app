import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Question } from "@/data/questions";

export interface IncorrectQuestionRecord {
  questionId: number;
  userAnswer: boolean;
  timestamp: number;
  attemptCount: number;
}

const INCORRECT_QUESTIONS_KEY = "incorrectQuestions";

/**
 * 間違えた問題を記録する
 */
export async function recordIncorrectQuestion(
  questionId: number,
  userAnswer: boolean
): Promise<void> {
  try {
    const data = await AsyncStorage.getItem(INCORRECT_QUESTIONS_KEY);
    const records: IncorrectQuestionRecord[] = data ? JSON.parse(data) : [];

    // 既に記録されているかチェック
    const existingIndex = records.findIndex((r) => r.questionId === questionId);

    if (existingIndex >= 0) {
      // 既に記録されている場合は更新
      records[existingIndex].attemptCount += 1;
      records[existingIndex].timestamp = Date.now();
      records[existingIndex].userAnswer = userAnswer;
    } else {
      // 新規記録
      records.push({
        questionId,
        userAnswer,
        timestamp: Date.now(),
        attemptCount: 1,
      });
    }

    await AsyncStorage.setItem(INCORRECT_QUESTIONS_KEY, JSON.stringify(records));
  } catch (error) {
    console.error("間違い問題の記録に失敗しました:", error);
  }
}

/**
 * 全ての間違い問題を取得
 */
export async function getIncorrectQuestions(): Promise<IncorrectQuestionRecord[]> {
  try {
    const data = await AsyncStorage.getItem(INCORRECT_QUESTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("間違い問題の取得に失敗しました:", error);
    return [];
  }
}

/**
 * 間違い問題をクリア
 */
export async function clearIncorrectQuestions(): Promise<void> {
  try {
    await AsyncStorage.removeItem(INCORRECT_QUESTIONS_KEY);
  } catch (error) {
    console.error("間違い問題のクリアに失敗しました:", error);
  }
}

/**
 * 特定の問題が間違い問題リストに含まれているかチェック
 */
export async function isQuestionIncorrect(questionId: number): Promise<boolean> {
  try {
    const records = await getIncorrectQuestions();
    return records.some((r) => r.questionId === questionId);
  } catch (error) {
    console.error("問題のチェックに失敗しました:", error);
    return false;
  }
}

/**
 * 間違い問題の数を取得
 */
export async function getIncorrectQuestionCount(): Promise<number> {
  try {
    const records = await getIncorrectQuestions();
    return records.length;
  } catch (error) {
    console.error("間違い問題数の取得に失敗しました:", error);
    return 0;
  }
}

/**
 * 特定の問題を間違い問題リストから削除
 */
export async function removeIncorrectQuestion(questionId: number): Promise<void> {
  try {
    const data = await AsyncStorage.getItem(INCORRECT_QUESTIONS_KEY);
    if (!data) return;

    const records: IncorrectQuestionRecord[] = JSON.parse(data);
    const filtered = records.filter((r) => r.questionId !== questionId);

    await AsyncStorage.setItem(INCORRECT_QUESTIONS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("間違い問題の削除に失敗しました:", error);
  }
}
