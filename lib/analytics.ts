// @ts-ignore - path alias resolution in test environment
import AsyncStorage from "@react-native-async-storage/async-storage";
import { questions, type Question } from "../data/questions";

export interface CategoryAnalytics {
  categoryName: string;
  totalQuestions: number;
  correctAnswers: number;
  correctRate: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface AnalyticsData {
  categories: CategoryAnalytics[];
  overallCorrectRate: number;
  totalTestsAttempted: number;
  lastUpdated: string;
}

const ANALYTICS_STORAGE_KEY = "analytics_data";

/**
 * Calculate category analytics from test history
 */
export async function calculateCategoryAnalytics(): Promise<AnalyticsData> {
  try {
    // Get all test history
    const historyData = await AsyncStorage.getItem("testHistory");
    const categoryStats: Record<
      string,
      { correct: number; total: number; questions: Question[] }
    > = {};

    // Initialize category stats
    questions.forEach((q) => {
      if (!categoryStats[q.category]) {
        categoryStats[q.category] = { correct: 0, total: 0, questions: [] };
      }
      categoryStats[q.category].questions.push(q);
    });

    // Get all quiz results to analyze
    const quizResultsData = await AsyncStorage.getItem("quizResults");
    if (quizResultsData) {
      const quizResults = JSON.parse(quizResultsData);
      quizResults.forEach((result: any) => {
        result.answers?.forEach((answer: any) => {
          const question = questions.find((q) => q.id === answer.questionId);
          if (question && categoryStats[question.category]) {
            categoryStats[question.category].total += 1;
            if (answer.isCorrect) {
              categoryStats[question.category].correct += 1;
            }
          }
        });
      });
    }

    // Get mock exam results
    const mockExamData = await AsyncStorage.getItem("mock_exam_sessions");
    if (mockExamData) {
      const sessions = JSON.parse(mockExamData);
      sessions.forEach((session: any) => {
        Object.entries(session.answers).forEach(([questionId, answer]: any) => {
          const question = questions.find((q) => q.id === parseInt(questionId));
          if (question && categoryStats[question.category]) {
            categoryStats[question.category].total += 1;
            if (answer === question.answer) {
              categoryStats[question.category].correct += 1;
            }
          }
        });
      });
    }

    // Calculate analytics
    const categories: CategoryAnalytics[] = Object.entries(categoryStats)
      .map(([categoryName, stats]) => {
        const correctRate =
          stats.total > 0
            ? Math.round((stats.correct / stats.total) * 100)
            : 0;

        let difficulty: "easy" | "medium" | "hard" = "medium";
        if (correctRate >= 80) {
          difficulty = "easy";
        } else if (correctRate < 60) {
          difficulty = "hard";
        }

        return {
          categoryName,
          totalQuestions: stats.total,
          correctAnswers: stats.correct,
          correctRate,
          difficulty,
        };
      })
      .sort((a, b) => a.correctRate - b.correctRate); // Sort by difficulty (ascending)

    const totalCorrect = categories.reduce((sum, c) => sum + c.correctAnswers, 0);
    const totalQuestions = categories.reduce((sum, c) => sum + c.totalQuestions, 0);
    const overallCorrectRate =
      totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    const analyticsData: AnalyticsData = {
      categories,
      overallCorrectRate,
      totalTestsAttempted: categories.length,
      lastUpdated: new Date().toISOString(),
    };

    // Save analytics
    await AsyncStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analyticsData));

    return analyticsData;
  } catch (error) {
    console.error("Failed to calculate category analytics:", error);
    return {
      categories: [],
      overallCorrectRate: 0,
      totalTestsAttempted: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Get cached analytics data
 */
export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    const data = await AsyncStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return await calculateCategoryAnalytics();
  } catch (error) {
    console.error("Failed to get analytics data:", error);
    return {
      categories: [],
      overallCorrectRate: 0,
      totalTestsAttempted: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Get weak categories (correctRate < 60%)
 */
export async function getWeakCategories(): Promise<CategoryAnalytics[]> {
  const analytics = await getAnalyticsData();
  return analytics.categories.filter((c) => c.correctRate < 60);
}

/**
 * Get strong categories (correctRate >= 80%)
 */
export async function getStrongCategories(): Promise<CategoryAnalytics[]> {
  const analytics = await getAnalyticsData();
  return analytics.categories.filter((c) => c.correctRate >= 80);
}

/**
 * Format correct rate with color coding
 */
export function getCorrectRateColor(rate: number): string {
  if (rate >= 80) return "#22C55E"; // success (green)
  if (rate >= 60) return "#F59E0B"; // warning (orange)
  return "#EF4444"; // error (red)
}

/**
 * Get difficulty label
 */
export function getDifficultyLabel(difficulty: "easy" | "medium" | "hard"): string {
  switch (difficulty) {
    case "easy":
      return "得意";
    case "medium":
      return "普通";
    case "hard":
      return "苦手";
    default:
      return "未判定";
  }
}
