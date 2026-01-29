import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { getStorageStats } from '@/lib/offline-storage';

/**
 * 学習統計ダッシュボード
 * 学習進捗、カテゴリ別の統計、最近の活動を表示
 */

interface LearningStats {
  totalQuestions: number;
  answeredQuestions: number;
  correctRate: number;
  categoriesLearned: number;
  totalCategories: number;
  streakDays: number;
  lastStudyDate: string | null;
}

interface CategoryStats {
  id: string;
  name: string;
  questionsCount: number;
  correctCount: number;
  correctRate: number;
}

interface RecentActivity {
  id: string;
  type: 'question_answered' | 'category_completed' | 'file_imported';
  title: string;
  timestamp: number;
}

export function LearningDashboard() {
  const colors = useColors();
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // ストレージ統計を取得
      const storageStats = await getStorageStats();

      // ダミーの統計データ（実際はデータベースから取得）
      const mockStats: LearningStats = {
        totalQuestions: storageStats.questionsCount,
        answeredQuestions: Math.floor(storageStats.questionsCount * 0.7),
        correctRate: 0.78,
        categoriesLearned: 8,
        totalCategories: 17,
        streakDays: 5,
        lastStudyDate: new Date().toLocaleDateString('ja-JP'),
      };

      setStats(mockStats);

      // ダミーのカテゴリ統計
      const mockCategoryStats: CategoryStats[] = [
        {
          id: 'cat1',
          name: '安全管理',
          questionsCount: 15,
          correctCount: 12,
          correctRate: 0.8,
        },
        {
          id: 'cat2',
          name: '機械安全',
          questionsCount: 12,
          correctCount: 9,
          correctRate: 0.75,
        },
        {
          id: 'cat3',
          name: '電気安全',
          questionsCount: 10,
          correctCount: 8,
          correctRate: 0.8,
        },
      ];

      setCategoryStats(mockCategoryStats);

      // ダミーの最近の活動
      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'question_answered',
          title: '安全管理 - 問題5を回答',
          timestamp: Date.now() - 3600000,
        },
        {
          id: '2',
          type: 'file_imported',
          title: 'exam_2024.pdf をインポート',
          timestamp: Date.now() - 86400000,
        },
        {
          id: '3',
          type: 'category_completed',
          title: '機械安全 カテゴリ完了',
          timestamp: Date.now() - 172800000,
        },
      ];

      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('[Learning Dashboard] Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground">読み込み中...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="gap-6 p-6">
        {/* ヘッダー */}
        <View className="gap-2">
          <Text className="text-3xl font-bold text-foreground">学習ダッシュボード</Text>
          <Text className="text-sm text-muted">
            最後の学習: {stats.lastStudyDate}
          </Text>
        </View>

        {/* 統計カード */}
        <View className="gap-4">
          {/* 学習進捗 */}
          <View className="rounded-lg border border-border bg-surface p-4">
            <Text className="mb-3 text-lg font-bold text-foreground">学習進捗</Text>
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-muted">回答した問題</Text>
                <Text className="font-semibold text-foreground">
                  {stats.answeredQuestions} / {stats.totalQuestions}
                </Text>
              </View>
              <View className="h-2 overflow-hidden rounded-full bg-border">
                <View
                  className="h-full bg-primary"
                  style={{
                    width: `${(stats.answeredQuestions / stats.totalQuestions) * 100}%`,
                  }}
                />
              </View>
            </View>
          </View>

          {/* 正答率 */}
          <View className="rounded-lg border border-border bg-surface p-4">
            <Text className="mb-3 text-lg font-bold text-foreground">正答率</Text>
            <View className="flex-row items-center gap-4">
              <View className="flex-1">
                <Text className="text-4xl font-bold text-primary">
                  {Math.round(stats.correctRate * 100)}%
                </Text>
              </View>
              <View className="flex-1 gap-2">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-muted">目標</Text>
                  <Text className="text-sm font-semibold text-foreground">80%</Text>
                </View>
                <View className="h-2 overflow-hidden rounded-full bg-border">
                  <View
                    className="h-full bg-success"
                    style={{ width: `${Math.min(stats.correctRate * 100, 100)}%` }}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* カテゴリ進捗 */}
          <View className="rounded-lg border border-border bg-surface p-4">
            <Text className="mb-3 text-lg font-bold text-foreground">カテゴリ進捗</Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-3xl font-bold text-primary">
                  {stats.categoriesLearned}
                </Text>
                <Text className="text-sm text-muted">学習済み</Text>
              </View>
              <View className="flex-1">
                <Text className="text-3xl font-bold text-muted">
                  {stats.totalCategories}
                </Text>
                <Text className="text-sm text-muted">全カテゴリ</Text>
              </View>
              <View className="flex-1">
                <Text className="text-3xl font-bold text-success">{stats.streakDays}</Text>
                <Text className="text-sm text-muted">連続日数</Text>
              </View>
            </View>
          </View>
        </View>

        {/* カテゴリ別統計 */}
        <View className="gap-3">
          <Text className="text-lg font-bold text-foreground">カテゴリ別統計</Text>
          {categoryStats.map((category) => (
            <Pressable
              key={category.id}
              className="rounded-lg border border-border bg-surface p-3 active:opacity-70"
            >
              <View className="gap-2">
                <View className="flex-row items-center justify-between">
                  <Text className="font-semibold text-foreground">{category.name}</Text>
                  <Text className="text-sm text-muted">
                    {category.correctCount} / {category.questionsCount}
                  </Text>
                </View>
                <View className="h-2 overflow-hidden rounded-full bg-border">
                  <View
                    className="h-full bg-primary"
                    style={{ width: `${category.correctRate * 100}%` }}
                  />
                </View>
                <Text className="text-xs text-muted">
                  正答率: {Math.round(category.correctRate * 100)}%
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* 最近の活動 */}
        <View className="gap-3">
          <Text className="text-lg font-bold text-foreground">最近の活動</Text>
          {recentActivity.map((activity) => (
            <View
              key={activity.id}
              className="flex-row items-center gap-3 rounded-lg border border-border bg-surface p-3"
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Text className="text-lg">
                  {activity.type === 'question_answered'
                    ? '✓'
                    : activity.type === 'category_completed'
                      ? '🏆'
                      : '📁'}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">{activity.title}</Text>
                <Text className="text-xs text-muted">
                  {formatTime(activity.timestamp)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* クイックアクション */}
        <View className="gap-3">
          <Text className="text-lg font-bold text-foreground">クイックアクション</Text>
          <View className="gap-2">
            <Pressable className="flex-row items-center gap-3 rounded-lg bg-primary p-4 active:opacity-80">
              <Text className="text-2xl">📚</Text>
              <View className="flex-1">
                <Text className="font-bold text-white">学習を続ける</Text>
                <Text className="text-xs text-white/70">最後のカテゴリから再開</Text>
              </View>
            </Pressable>

            <Pressable className="flex-row items-center gap-3 rounded-lg border border-primary bg-primary/10 p-4 active:opacity-70">
              <Text className="text-2xl">📤</Text>
              <View className="flex-1">
                <Text className="font-bold text-primary">新しい問題をインポート</Text>
                <Text className="text-xs text-primary/70">ファイルから問題を追加</Text>
              </View>
            </Pressable>

            <Pressable className="flex-row items-center gap-3 rounded-lg border border-primary bg-primary/10 p-4 active:opacity-70">
              <Text className="text-2xl">📊</Text>
              <View className="flex-1">
                <Text className="font-bold text-primary">詳細な統計を表示</Text>
                <Text className="text-xs text-primary/70">学習分析とレポート</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

/**
 * 時間をフォーマット
 */
function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) {
    return `${minutes}分前`;
  } else if (hours < 24) {
    return `${hours}時間前`;
  } else if (days < 7) {
    return `${days}日前`;
  } else {
    return new Date(timestamp).toLocaleDateString('ja-JP');
  }
}
