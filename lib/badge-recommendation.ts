import { type UserProfile } from "./gamification";

export interface RecommendedBadge {
  badge: any;
  progress: number;
  reason: string;
  nextMilestone: string;
}

/**
 * ユーザーのプロフィールに基づいて、次に獲得できる可能性が高いバッジを推奨する
 */
export function getRecommendedBadges(profile: UserProfile): RecommendedBadge[] {
  const unlockedBadges = profile.badges.filter((b) => b.isUnlocked);
  const lockedBadges = profile.badges.filter((b) => !b.isUnlocked);

  const recommendations: RecommendedBadge[] = [];

  // 各ロックされたバッジについて、獲得可能性を計算
  for (const badge of lockedBadges) {
    const progress = calculateBadgeProgress(badge.id, profile);
    const reason = getBadgeReason(badge.id, profile);
    const nextMilestone = getNextMilestone(badge.id, profile);

    if (progress > 0) {
      recommendations.push({
        badge,
        progress,
        reason,
        nextMilestone,
      });
    }
  }

  // 進捗度でソート（高い順）
  recommendations.sort((a, b) => b.progress - a.progress);

  // トップ3を返す
  return recommendations.slice(0, 3);
}

/**
 * 特定のバッジの獲得進捗を計算（0-100%）
 */
function calculateBadgeProgress(badgeId: string, profile: UserProfile): number {
  const totalTests = profile.totalTests;
  const averageScore = profile.averageScore;
  const level = profile.level;
  const totalCorrectAnswers = profile.totalCorrectAnswers;

  switch (badgeId) {
    case "badge_1": // 初級者
      return Math.min((totalTests / 5) * 100, 100);

    case "badge_2": // 学習者
      return Math.min((totalTests / 10) * 100, 100);

    case "badge_3": // 中級者
      return Math.min((averageScore / 70) * 100, 100);

    case "badge_4": // 上級者
      return Math.min((averageScore / 85) * 100, 100);

    case "badge_5": // 完璧主義者
      return Math.min((totalTests / 20) * 100, 100);

    case "badge_6": // 知識の達人
      return Math.min((level / 10) * 100, 100);

    case "badge_7": // 連続学習者
      return Math.min((totalTests / 30) * 100, 100);

    case "badge_8": // 復習マスター
      return Math.min((totalCorrectAnswers / 100) * 100, 100);

    case "badge_9": // 伝説
      return Math.min((level / 20) * 100, 100);

    default:
      return 0;
  }
}

/**
 * バッジ獲得の理由を取得
 */
function getBadgeReason(badgeId: string, profile: UserProfile): string {
  const totalTests = profile.totalTests;
  const averageScore = profile.averageScore;
  const level = profile.level;

  switch (badgeId) {
    case "badge_1":
      return `あと${Math.max(0, 5 - totalTests)}回のテストで獲得`;

    case "badge_2":
      return `あと${Math.max(0, 10 - totalTests)}回のテストで獲得`;

    case "badge_3":
      return `正答率をあと${Math.max(0, 70 - averageScore)}%上げることで獲得`;

    case "badge_4":
      return `正答率をあと${Math.max(0, 85 - averageScore)}%上げることで獲得`;

    case "badge_5":
      return `あと${Math.max(0, 20 - totalTests)}回のテストで獲得`;

    case "badge_6":
      return `あとレベル${Math.max(0, 10 - level)}上げることで獲得`;

    case "badge_7":
      return `あと${Math.max(0, 30 - totalTests)}回のテストで獲得`;

    case "badge_8":
      return `継続的な学習で獲得可能`;

    case "badge_9":
      return `最高レベルのマスターバッジ`;

    default:
      return "条件を満たすことで獲得";
  }
}

/**
 * 次のマイルストーンを取得
 */
function getNextMilestone(badgeId: string, profile: UserProfile): string {
  const totalTests = profile.totalTests;
  const averageScore = profile.averageScore;
  const level = profile.level;

  switch (badgeId) {
    case "badge_1":
      return `${totalTests}/5 テスト完了`;

    case "badge_2":
      return `${totalTests}/10 テスト完了`;

    case "badge_3":
      return `正答率: ${averageScore}% (目標: 70%)`;

    case "badge_4":
      return `正答率: ${averageScore}% (目標: 85%)`;

    case "badge_5":
      return `${totalTests}/20 テスト完了`;

    case "badge_6":
      return `レベル: ${level} (目標: 10)`;

    case "badge_7":
      return `${totalTests}/30 テスト完了`;

    case "badge_8":
      return `継続学習中`;

    case "badge_9":
      return `レベル: ${level} (目標: 20)`;

    default:
      return "進捗中";
  }
}
