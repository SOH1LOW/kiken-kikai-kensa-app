import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserRankingData {
  userId: string;
  userName: string;
  level: number;
  totalTests: number;
  averageScore: number;
  highestScore: number;
  totalCorrectAnswers: number;
  totalQuestions: number;
  experience: number;
  badges: number;
  lastTestDate: string;
}

export interface RankingEntry extends UserRankingData {
  rank: number;
  scorePercentage: number;
}

const RANKING_STORAGE_KEY = "user_ranking_data";
const LEADERBOARD_STORAGE_KEY = "leaderboard_data";

/**
 * Initialize user ranking data
 */
export async function initializeUserRankingData(
  userId: string,
  userName: string
): Promise<UserRankingData> {
  const userData: UserRankingData = {
    userId,
    userName,
    level: 1,
    totalTests: 0,
    averageScore: 0,
    highestScore: 0,
    totalCorrectAnswers: 0,
    totalQuestions: 0,
    experience: 0,
    badges: 0,
    lastTestDate: new Date().toISOString(),
  };

  await AsyncStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(userData));
  return userData;
}

/**
 * Get current user ranking data
 */
export async function getUserRankingData(): Promise<UserRankingData> {
  try {
    const data = await AsyncStorage.getItem(RANKING_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // Initialize with default user if not found
    return await initializeUserRankingData("user_" + Date.now(), "プレイヤー");
  } catch (error) {
    console.error("Failed to get user ranking data:", error);
    return await initializeUserRankingData("user_" + Date.now(), "プレイヤー");
  }
}

/**
 * Update user ranking data with test result
 */
export async function updateUserRankingData(
  score: number,
  correctAnswers: number,
  totalQuestions: number,
  level: number,
  experience: number,
  badges: number
): Promise<UserRankingData> {
  const userData = await getUserRankingData();

  userData.totalTests += 1;
  userData.totalCorrectAnswers += correctAnswers;
  userData.totalQuestions += totalQuestions;
  userData.averageScore = Math.round(
    (userData.totalCorrectAnswers / userData.totalQuestions) * 100
  );
  userData.highestScore = Math.max(userData.highestScore, score);
  userData.level = level;
  userData.experience = experience;
  userData.badges = badges;
  userData.lastTestDate = new Date().toISOString();

  await AsyncStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(userData));
  return userData;
}

/**
 * Generate mock leaderboard data (simulating multiple users)
 */
export async function generateMockLeaderboard(): Promise<RankingEntry[]> {
  const currentUser = await getUserRankingData();

  const mockUsers: UserRankingData[] = [
    {
      userId: "user_001",
      userName: "太郎",
      level: 5,
      totalTests: 150,
      averageScore: 88,
      highestScore: 100,
      totalCorrectAnswers: 4620,
      totalQuestions: 5250,
      experience: 450,
      badges: 8,
      lastTestDate: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      userId: "user_002",
      userName: "花子",
      level: 4,
      totalTests: 120,
      averageScore: 85,
      highestScore: 98,
      totalCorrectAnswers: 3900,
      totalQuestions: 4590,
      experience: 380,
      badges: 7,
      lastTestDate: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      userId: "user_003",
      userName: "次郎",
      level: 3,
      totalTests: 95,
      averageScore: 78,
      highestScore: 95,
      totalCorrectAnswers: 2850,
      totalQuestions: 3650,
      experience: 280,
      badges: 5,
      lastTestDate: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
      userId: "user_004",
      userName: "美咲",
      level: 2,
      totalTests: 60,
      averageScore: 72,
      highestScore: 90,
      totalCorrectAnswers: 1620,
      totalQuestions: 2250,
      experience: 150,
      badges: 3,
      lastTestDate: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    },
    currentUser,
  ];

  // Sort by average score (descending)
  const sortedUsers = mockUsers.sort((a, b) => b.averageScore - a.averageScore);

  // Create ranking entries
  const rankings: RankingEntry[] = sortedUsers.map((user, index) => ({
    ...user,
    rank: index + 1,
    scorePercentage: user.averageScore,
  }));

  return rankings;
}

/**
 * Get user rank position
 */
export async function getUserRankPosition(): Promise<number> {
  const rankings = await generateMockLeaderboard();
  const currentUser = await getUserRankingData();
  const userRank = rankings.find((r) => r.userId === currentUser.userId);
  return userRank?.rank || rankings.length;
}

/**
 * Get top 10 users
 */
export async function getTopUsers(limit: number = 10): Promise<RankingEntry[]> {
  const rankings = await generateMockLeaderboard();
  return rankings.slice(0, limit);
}

/**
 * Calculate ranking score (weighted formula)
 */
export function calculateRankingScore(user: UserRankingData): number {
  const scoreWeight = 0.4;
  const testCountWeight = 0.3;
  const levelWeight = 0.3;

  const maxScore = 100;
  const maxTestCount = 200;
  const maxLevel = 10;

  const scoreComponent = (user.averageScore / maxScore) * scoreWeight * 100;
  const testCountComponent =
    (Math.min(user.totalTests, maxTestCount) / maxTestCount) *
    testCountWeight *
    100;
  const levelComponent =
    (Math.min(user.level, maxLevel) / maxLevel) * levelWeight * 100;

  return Math.round(scoreComponent + testCountComponent + levelComponent);
}

/**
 * Get ranking tier based on score
 */
export function getRankingTier(score: number): string {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "E";
}

/**
 * Get tier color
 */
export function getTierColor(tier: string): string {
  switch (tier) {
    case "S":
      return "#FF6B6B"; // Red
    case "A":
      return "#FFA500"; // Orange
    case "B":
      return "#FFD700"; // Gold
    case "C":
      return "#4ECDC4"; // Teal
    case "D":
      return "#95E1D3"; // Light teal
    case "E":
      return "#C0C0C0"; // Silver
    default:
      return "#CCCCCC";
  }
}

/**
 * Calculate ranking improvement
 */
export function calculateImprovement(
  previousScore: number,
  currentScore: number
): { improved: boolean; percentage: number } {
  const improvement = currentScore - previousScore;
  const percentage = Math.round((improvement / previousScore) * 100);
  return {
    improved: improvement > 0,
    percentage: Math.abs(percentage),
  };
}

/**
 * Format last test date
 */
export function formatLastTestDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "今";
  if (diffMins < 60) return `${diffMins}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;

  return date.toLocaleDateString("ja-JP");
}
