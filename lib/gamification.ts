import AsyncStorage from "@react-native-async-storage/async-storage";

export type BadgeType =
  | "first_test"
  | "ten_tests"
  | "fifty_tests"
  | "hundred_tests"
  | "perfect_score"
  | "high_accuracy"
  | "consistency"
  | "weak_master"
  | "all_categories";

export type TitleType =
  | "beginner"
  | "apprentice"
  | "skilled"
  | "expert"
  | "master"
  | "legend";

export interface Badge {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface Title {
  id: TitleType;
  name: string;
  description: string;
  requiredCondition: string;
  icon: string;
  isActive: boolean;
}

export interface UserProfile {
  currentTitle: TitleType;
  totalTests: number;
  averageScore: number;
  totalCorrectAnswers: number;
  totalQuestions: number;
  badges: Badge[];
  titles: Title[];
  level: number;
  experience: number;
  joinedDate: string;
}

const PROFILE_STORAGE_KEY = "user_profile";

// Badge definitions
const BADGE_DEFINITIONS: Record<BadgeType, Omit<Badge, "isUnlocked"> & { isUnlocked?: boolean }> = {
  first_test: {
    id: "first_test",
    name: "初心者",
    description: "初めてのテストを完了",
    icon: "🎯",
    isUnlocked: false,
  },
  ten_tests: {
    id: "ten_tests",
    name: "10回チャレンジ",
    description: "10回のテストを完了",
    icon: "🔟",
    isUnlocked: false,
  },
  fifty_tests: {
    id: "fifty_tests",
    name: "50回マスター",
    description: "50回のテストを完了",
    icon: "🏆",
    isUnlocked: false,
  },
  hundred_tests: {
    id: "hundred_tests",
    name: "100回達成",
    description: "100回のテストを完了",
    icon: "👑",
    isUnlocked: false,
  },
  perfect_score: {
    id: "perfect_score",
    name: "完璧",
    description: "100点を獲得",
    icon: "💯",
    isUnlocked: false,
  },
  high_accuracy: {
    id: "high_accuracy",
    name: "高精度",
    description: "平均正答率80%以上を達成",
    icon: "⭐",
    isUnlocked: false,
  },
  consistency: {
    id: "consistency",
    name: "安定感",
    description: "5回連続で70点以上を獲得",
    icon: "📈",
    isUnlocked: false,
  },
  weak_master: {
    id: "weak_master",
    name: "克服者",
    description: "苦手分野を60%以上に改善",
    icon: "💪",
    isUnlocked: false,
  },
  all_categories: {
    id: "all_categories",
    name: "全分野制覇",
    description: "全カテゴリで70%以上を達成",
    icon: "🌟",
    isUnlocked: false,
  },
};

// Title definitions
const TITLE_DEFINITIONS: Record<TitleType, Omit<Title, "isActive"> & { isActive?: boolean }> = {
  beginner: {
    id: "beginner",
    name: "見習い",
    description: "学習を開始したばかり",
    requiredCondition: "テスト1回以上",
    icon: "🌱",
    isActive: false,
  },
  apprentice: {
    id: "apprentice",
    name: "修行中",
    description: "基礎を習得中",
    requiredCondition: "テスト10回以上、平均50%以上",
    icon: "📚",
    isActive: false,
  },
  skilled: {
    id: "skilled",
    name: "熟練者",
    description: "実力を身につけた",
    requiredCondition: "テスト30回以上、平均60%以上",
    icon: "🎓",
    isActive: false,
  },
  expert: {
    id: "expert",
    name: "エキスパート",
    description: "高い技術を持つ",
    requiredCondition: "テスト50回以上、平均70%以上",
    icon: "🏅",
    isActive: false,
  },
  master: {
    id: "master",
    name: "マスター",
    description: "分野の達人",
    requiredCondition: "テスト100回以上、平均80%以上",
    icon: "🥇",
    isActive: false,
  },
  legend: {
    id: "legend",
    name: "伝説",
    description: "最高の栄誉",
    requiredCondition: "テスト150回以上、平均85%以上、全バッジ取得",
    icon: "👑",
    isActive: false,
  },
};

/**
 * Initialize user profile
 */
export async function initializeProfile(): Promise<UserProfile> {
  const profile: UserProfile = {
    currentTitle: "beginner",
    totalTests: 0,
    averageScore: 0,
    totalCorrectAnswers: 0,
    totalQuestions: 0,
    badges: Object.values(BADGE_DEFINITIONS).map((b) => ({
      ...b,
      isUnlocked: false,
    })),
    titles: Object.values(TITLE_DEFINITIONS).map((t) => ({
      ...t,
      isActive: false,
    })),
    level: 1,
    experience: 0,
    joinedDate: new Date().toISOString(),
  };

  await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

/**
 * Get user profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const data = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return await initializeProfile();
  } catch (error) {
    console.error("Failed to get user profile:", error);
    return await initializeProfile();
  }
}

/**
 * Update user profile with test results
 */
export async function updateProfileWithTestResult(
  score: number,
  correctAnswers: number,
  totalQuestions: number
): Promise<UserProfile> {
  const profile = await getUserProfile();

  // Update stats
  profile.totalTests += 1;
  profile.totalCorrectAnswers += correctAnswers;
  profile.totalQuestions += totalQuestions;
  profile.averageScore = Math.round(
    (profile.totalCorrectAnswers / profile.totalQuestions) * 100
  );
  profile.experience += Math.round(score / 10);

  // Update level
  profile.level = Math.floor(profile.experience / 100) + 1;

  // Check and unlock badges
  checkAndUnlockBadges(profile);

  // Update title
  updateTitle(profile);

  await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

/**
 * Check and unlock badges
 */
function checkAndUnlockBadges(profile: UserProfile): void {
  const now = new Date().toISOString();

  // First test badge
  if (profile.totalTests === 1) {
    unlockBadge(profile, "first_test", now);
  }

  // 10 tests badge
  if (profile.totalTests === 10) {
    unlockBadge(profile, "ten_tests", now);
  }

  // 50 tests badge
  if (profile.totalTests === 50) {
    unlockBadge(profile, "fifty_tests", now);
  }

  // 100 tests badge
  if (profile.totalTests === 100) {
    unlockBadge(profile, "hundred_tests", now);
  }

  // Perfect score badge
  const perfectScoreBadge = profile.badges.find((b) => b.id === "perfect_score");
  if (!perfectScoreBadge?.isUnlocked && profile.totalTests > 0) {
    // This would need to be checked from individual test results
    // For now, we'll check if average is 100 (which is rare)
    if (profile.averageScore === 100) {
      unlockBadge(profile, "perfect_score", now);
    }
  }

  // High accuracy badge
  if (profile.averageScore >= 80) {
    unlockBadge(profile, "high_accuracy", now);
  }
}

/**
 * Unlock a badge
 */
function unlockBadge(
  profile: UserProfile,
  badgeId: BadgeType,
  unlockedAt: string
): void {
  const badge = profile.badges.find((b) => b.id === badgeId);
  if (badge && !badge.isUnlocked) {
    badge.isUnlocked = true;
    badge.unlockedAt = unlockedAt;
  }
}

/**
 * Update user title based on profile stats
 */
function updateTitle(profile: UserProfile): void {
  let newTitle: TitleType = "beginner";

  if (
    profile.totalTests >= 150 &&
    profile.averageScore >= 85 &&
    profile.badges.filter((b) => b.isUnlocked).length === Object.keys(BADGE_DEFINITIONS).length
  ) {
    newTitle = "legend";
  } else if (profile.totalTests >= 100 && profile.averageScore >= 80) {
    newTitle = "master";
  } else if (profile.totalTests >= 50 && profile.averageScore >= 70) {
    newTitle = "expert";
  } else if (profile.totalTests >= 30 && profile.averageScore >= 60) {
    newTitle = "skilled";
  } else if (profile.totalTests >= 10 && profile.averageScore >= 50) {
    newTitle = "apprentice";
  }

  profile.currentTitle = newTitle;

  // Update title active status
  profile.titles.forEach((title) => {
    title.isActive = title.id === newTitle;
  });
}

/**
 * Get newly unlocked badges
 */
export function getNewlyUnlockedBadges(
  oldProfile: UserProfile,
  newProfile: UserProfile
): Badge[] {
  return newProfile.badges.filter((badge) => {
    const oldBadge = oldProfile.badges.find((b) => b.id === badge.id);
    return badge.isUnlocked && !oldBadge?.isUnlocked;
  });
}

/**
 * Get title by ID
 */
export function getTitleById(titleId: TitleType): Title | undefined {
  const profile = TITLE_DEFINITIONS[titleId];
  if (profile) {
    return {
      ...profile,
      isActive: false,
    };
  }
  return undefined;
}

/**
 * Get experience progress to next level
 */
export function getExperienceProgress(experience: number): {
  current: number;
  required: number;
  percentage: number;
} {
  const currentLevel = Math.floor(experience / 100);
  const currentExp = experience % 100;
  const requiredExp = 100;
  const percentage = Math.round((currentExp / requiredExp) * 100);

  return {
    current: currentExp,
    required: requiredExp,
    percentage,
  };
}
