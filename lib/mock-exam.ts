import AsyncStorage from "@react-native-async-storage/async-storage";

export interface MockExamSession {
  id: string;
  startTime: number;
  endTime?: number;
  answers: Record<number, boolean>; // questionId -> answer
  timeSpent: number; // milliseconds
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  date: string;
}

export interface MockExamStats {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  averageTimeSpent: number;
  sessions: MockExamSession[];
}

const MOCK_EXAM_STORAGE_KEY = "mock_exam_sessions";
const MOCK_EXAM_STATS_KEY = "mock_exam_stats";

export async function saveMockExamSession(
  session: MockExamSession
): Promise<void> {
  try {
    const sessions = await getMockExamSessions();
    sessions.push(session);
    await AsyncStorage.setItem(
      MOCK_EXAM_STORAGE_KEY,
      JSON.stringify(sessions)
    );
  } catch (error) {
    console.error("Failed to save mock exam session:", error);
  }
}

export async function getMockExamSessions(): Promise<MockExamSession[]> {
  try {
    const data = await AsyncStorage.getItem(MOCK_EXAM_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to get mock exam sessions:", error);
    return [];
  }
}

export async function getMockExamStats(): Promise<MockExamStats> {
  try {
    const sessions = await getMockExamSessions();

    if (sessions.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
        averageTimeSpent: 0,
        sessions: [],
      };
    }

    const scores = sessions.map((s) => s.score);
    const timeSpents = sessions.map((s) => s.timeSpent);

    return {
      totalAttempts: sessions.length,
      averageScore: Math.round(
        scores.reduce((a, b) => a + b, 0) / sessions.length
      ),
      bestScore: Math.max(...scores),
      worstScore: Math.min(...scores),
      averageTimeSpent: Math.round(
        timeSpents.reduce((a, b) => a + b, 0) / sessions.length
      ),
      sessions: sessions.sort(
        (a, b) => (b.endTime || 0) - (a.endTime || 0)
      ),
    };
  } catch (error) {
    console.error("Failed to get mock exam stats:", error);
    return {
      totalAttempts: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
      averageTimeSpent: 0,
      sessions: [],
    };
  }
}

export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function calculateScore(
  correctAnswers: number,
  totalQuestions: number
): number {
  return Math.round((correctAnswers / totalQuestions) * 100);
}
