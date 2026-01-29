import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserRankingData } from "./ranking";

export interface Friend extends UserRankingData {
  followedAt: string;
  comparison?: {
    scoreDiff: number;
    levelDiff: number;
    testCountDiff: number;
    badgeDiff: number;
  };
}

export interface FriendComparison {
  friend: Friend;
  scoreComparison: {
    yourScore: number;
    friendScore: number;
    difference: number;
    youAhead: boolean;
  };
  levelComparison: {
    yourLevel: number;
    friendLevel: number;
    difference: number;
    youAhead: boolean;
  };
  testCountComparison: {
    yourCount: number;
    friendCount: number;
    difference: number;
    youAhead: boolean;
  };
  badgeComparison: {
    yourBadges: number;
    friendBadges: number;
    difference: number;
    youAhead: boolean;
  };
}

const FRIENDS_STORAGE_KEY = "user_friends";

/**
 * Initialize friends list
 */
export async function initializeFriendsList(): Promise<Friend[]> {
  try {
    const data = await AsyncStorage.getItem(FRIENDS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to initialize friends list:", error);
  }
  return [];
}

/**
 * Get all friends
 */
export async function getFriends(): Promise<Friend[]> {
  try {
    const data = await AsyncStorage.getItem(FRIENDS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to get friends:", error);
  }
  return [];
}

/**
 * Add a friend
 */
export async function addFriend(user: UserRankingData): Promise<Friend> {
  const friends = await getFriends();

  // Check if already following
  if (friends.some((f) => f.userId === user.userId)) {
    throw new Error("既にこのユーザーをフォローしています");
  }

  const friend: Friend = {
    ...user,
    followedAt: new Date().toISOString(),
  };

  friends.push(friend);
  await AsyncStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(friends));

  return friend;
}

/**
 * Remove a friend
 */
export async function removeFriend(userId: string): Promise<void> {
  const friends = await getFriends();
  const filtered = friends.filter((f) => f.userId !== userId);
  await AsyncStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Check if user is a friend
 */
export async function isFriend(userId: string): Promise<boolean> {
  const friends = await getFriends();
  return friends.some((f) => f.userId === userId);
}

/**
 * Get friend by ID
 */
export async function getFriendById(userId: string): Promise<Friend | null> {
  const friends = await getFriends();
  return friends.find((f) => f.userId === userId) || null;
}

/**
 * Update friend data
 */
export async function updateFriendData(
  userId: string,
  updatedData: Partial<UserRankingData>
): Promise<Friend | null> {
  const friends = await getFriends();
  const friendIndex = friends.findIndex((f) => f.userId === userId);

  if (friendIndex === -1) {
    return null;
  }

  friends[friendIndex] = {
    ...friends[friendIndex],
    ...updatedData,
  };

  await AsyncStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(friends));
  return friends[friendIndex];
}

/**
 * Calculate comparison between current user and friend
 */
export function calculateComparison(
  currentUser: UserRankingData,
  friend: Friend
): FriendComparison {
  const scoreDiff = currentUser.averageScore - friend.averageScore;
  const levelDiff = currentUser.level - friend.level;
  const testCountDiff = currentUser.totalTests - friend.totalTests;
  const badgeDiff = currentUser.badges - friend.badges;

  return {
    friend,
    scoreComparison: {
      yourScore: currentUser.averageScore,
      friendScore: friend.averageScore,
      difference: Math.abs(scoreDiff),
      youAhead: scoreDiff > 0,
    },
    levelComparison: {
      yourLevel: currentUser.level,
      friendLevel: friend.level,
      difference: Math.abs(levelDiff),
      youAhead: levelDiff > 0,
    },
    testCountComparison: {
      yourCount: currentUser.totalTests,
      friendCount: friend.totalTests,
      difference: Math.abs(testCountDiff),
      youAhead: testCountDiff > 0,
    },
    badgeComparison: {
      yourBadges: currentUser.badges,
      friendBadges: friend.badges,
      difference: Math.abs(badgeDiff),
      youAhead: badgeDiff > 0,
    },
  };
}

/**
 * Get comparison summary
 */
export function getComparisonSummary(comparison: FriendComparison): {
  youAheadCount: number;
  friendAheadCount: number;
  tiedCount: number;
} {
  let youAheadCount = 0;
  let friendAheadCount = 0;
  let tiedCount = 0;

  if (comparison.scoreComparison.difference === 0) {
    tiedCount++;
  } else if (comparison.scoreComparison.youAhead) {
    youAheadCount++;
  } else {
    friendAheadCount++;
  }

  if (comparison.levelComparison.difference === 0) {
    tiedCount++;
  } else if (comparison.levelComparison.youAhead) {
    youAheadCount++;
  } else {
    friendAheadCount++;
  }

  if (comparison.testCountComparison.difference === 0) {
    tiedCount++;
  } else if (comparison.testCountComparison.youAhead) {
    youAheadCount++;
  } else {
    friendAheadCount++;
  }

  if (comparison.badgeComparison.difference === 0) {
    tiedCount++;
  } else if (comparison.badgeComparison.youAhead) {
    youAheadCount++;
  } else {
    friendAheadCount++;
  }

  return { youAheadCount, friendAheadCount, tiedCount };
}

/**
 * Get comparison result message
 */
export function getComparisonMessage(
  youAheadCount: number,
  friendAheadCount: number
): string {
  if (youAheadCount > friendAheadCount) {
    return "あなたが優勢です！";
  } else if (friendAheadCount > youAheadCount) {
    return "相手が優勢です";
  } else {
    return "互角です！";
  }
}

/**
 * Sort friends by score
 */
export async function sortFriendsByScore(): Promise<Friend[]> {
  const friends = await getFriends();
  return friends.sort((a, b) => b.averageScore - a.averageScore);
}

/**
 * Sort friends by level
 */
export async function sortFriendsByLevel(): Promise<Friend[]> {
  const friends = await getFriends();
  return friends.sort((a, b) => b.level - a.level);
}

/**
 * Get friends with recent activity
 */
export async function getFriendsWithRecentActivity(
  hoursThreshold: number = 24
): Promise<Friend[]> {
  const friends = await getFriends();
  const now = new Date();

  return friends.filter((friend) => {
    const lastTestDate = new Date(friend.lastTestDate);
    const hoursDiff = (now.getTime() - lastTestDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= hoursThreshold;
  });
}

/**
 * Get friend count
 */
export async function getFriendCount(): Promise<number> {
  const friends = await getFriends();
  return friends.length;
}

/**
 * Format follow date
 */
export function formatFollowDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "今日";
  if (diffDays === 1) return "昨日";
  if (diffDays < 7) return `${diffDays}日前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
  return `${Math.floor(diffDays / 30)}ヶ月前`;
}
