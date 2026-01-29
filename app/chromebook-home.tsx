import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/use-colors';
import { LearningDashboard } from '@/components/learning-dashboard';
import { ChromebookToolbar, useResponsive } from '@/components/chromebook-layout';
import { getWindowManager } from '@/lib/window-manager';
import { KEYBOARD_SHORTCUTS, KeyboardShortcutManager } from '@/lib/keyboard-utils';

/**
 * Chromebook向けホーム画面
 * 大画面に対応した学習統計ダッシュボード、最近使用したカテゴリ、クイックアクセスボタン
 */

interface RecentCategory {
  id: string;
  name: string;
  questionsCount: number;
  lastStudyDate: string;
}

export default function ChromebookHomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { isChromebook, isLandscape } = useResponsive();
  const [recentCategories, setRecentCategories] = useState<RecentCategory[]>([]);
  const [shortcutManager] = useState(() => new KeyboardShortcutManager());

  useEffect(() => {
    setupKeyboardShortcuts();

    const windowManager = getWindowManager();
    const unsubscribe = windowManager.subscribe(() => {
      // ウィンドウが変更されたときの処理
    });

    return () => {
      unsubscribe();
      shortcutManager.disable();
    };
  }, []);

  useEffect(() => {
    loadRecentCategories();
  }, []);

  const setupKeyboardShortcuts = () => {
    shortcutManager.register(KEYBOARD_SHORTCUTS.NEXT_CATEGORY, () => {
      console.log('[Chromebook Home] Next category');
    });

    shortcutManager.register(KEYBOARD_SHORTCUTS.PREV_CATEGORY, () => {
      console.log('[Chromebook Home] Previous category');
    });

    shortcutManager.register('Control+n', () => {
      openNewWindow('questions-list');
    });

    shortcutManager.register('Control+d', () => {
      openNewWindow('dashboard');
    });

    shortcutManager.enable();
  };

  const loadRecentCategories = () => {
    const mockCategories: RecentCategory[] = [
      {
        id: 'cat1',
        name: '安全管理',
        questionsCount: 15,
        lastStudyDate: '2024-01-28',
      },
      {
        id: 'cat2',
        name: '機械安全',
        questionsCount: 12,
        lastStudyDate: '2024-01-27',
      },
      {
        id: 'cat3',
        name: '電気安全',
        questionsCount: 10,
        lastStudyDate: '2024-01-26',
      },
      {
        id: 'cat4',
        name: '化学安全',
        questionsCount: 8,
        lastStudyDate: '2024-01-25',
      },
    ];

    setRecentCategories(mockCategories);
  };

  const openNewWindow = (type: 'questions-list' | 'dashboard' | 'settings') => {
    const windowManager = getWindowManager();
    windowManager.createWindow(type, getWindowTitle(type), {});
    console.log('[Chromebook Home] New window opened');
  };

  const getWindowTitle = (type: string): string => {
    switch (type) {
      case 'questions-list':
        return '問題一覧';
      case 'dashboard':
        return 'ダッシュボード';
      case 'settings':
        return '設定';
      default:
        return 'ウィンドウ';
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    const windowManager = getWindowManager();
    windowManager.createWindow('question-detail', '問題詳細', { categoryId });
    console.log('[Chromebook Home] Category window opened');
  };

  // Chromebook向けの大画面レイアウト
  if (isChromebook && isLandscape) {
    return (
      <View className="flex-1 bg-background">
        <ChromebookToolbar
          title="機械検査3級 学習アプリ"
          subtitle="Chromebook版"
          actions={[
            {
              label: '📚 新しいウィンドウ',
              onPress: () => openNewWindow('questions-list'),
            },
            {
              label: '📤 インポート',
              onPress: () => console.log('Import'),
            },
          ]}
        />

        <View className="flex-1 flex-row">
          {/* 左側：ダッシュボード */}
          <View className="flex-1 border-r border-border">
            <LearningDashboard />
          </View>

          {/* 右側：最近使用したカテゴリとクイックアクション */}
          <ScrollView className="w-96 bg-surface">
            <View className="gap-4 p-4">
              {/* 最近使用したカテゴリ */}
              <View className="gap-2">
                <Text className="text-lg font-bold text-foreground">最近使用したカテゴリ</Text>
                {recentCategories.map((category) => (
                  <Pressable
                    key={category.id}
                    onPress={() => handleCategoryPress(category.id)}
                    className="rounded-lg border border-border bg-background p-3 active:opacity-70"
                  >
                    <View className="gap-1">
                      <Text className="font-semibold text-foreground">{category.name}</Text>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-xs text-muted">
                          {category.questionsCount}問
                        </Text>
                        <Text className="text-xs text-muted">{category.lastStudyDate}</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>

              {/* クイックアクション */}
              <View className="gap-2">
                <Text className="text-lg font-bold text-foreground">クイックアクション</Text>

                <Pressable
                  onPress={() => openNewWindow('questions-list')}
                  className="flex-row items-center gap-3 rounded-lg bg-primary p-3 active:opacity-80"
                >
                  <Text className="text-2xl">📚</Text>
                  <View className="flex-1">
                    <Text className="font-bold text-white">問題を学習</Text>
                    <Text className="text-xs text-white/70">Ctrl+N</Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => openNewWindow('questions-list')}
                  className="flex-row items-center gap-3 rounded-lg border border-primary bg-primary/10 p-3 active:opacity-70"
                >
                  <Text className="text-2xl">📤</Text>
                  <View className="flex-1">
                    <Text className="font-bold text-primary">ファイルをインポート</Text>
                    <Text className="text-xs text-primary/70">PDF・画像から問題を抽出</Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => openNewWindow('dashboard')}
                  className="flex-row items-center gap-3 rounded-lg border border-primary bg-primary/10 p-3 active:opacity-70"
                >
                  <Text className="text-2xl">📊</Text>
                  <View className="flex-1">
                    <Text className="font-bold text-primary">統計を表示</Text>
                    <Text className="text-xs text-primary/70">Ctrl+D</Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => openNewWindow('settings')}
                  className="flex-row items-center gap-3 rounded-lg border border-primary bg-primary/10 p-3 active:opacity-70"
                >
                  <Text className="text-2xl">⚙️</Text>
                  <View className="flex-1">
                    <Text className="font-bold text-primary">設定</Text>
                    <Text className="text-xs text-primary/70">アプリ設定を変更</Text>
                  </View>
                </Pressable>
              </View>

              {/* キーボードショートカット */}
              <View className="gap-2 rounded-lg border border-border bg-background p-3">
                <Text className="text-sm font-bold text-foreground">キーボードショートカット</Text>
                <View className="gap-1">
                  <Text className="text-xs text-muted">
                    <Text className="font-semibold">↑↓</Text> カテゴリを移動
                  </Text>
                  <Text className="text-xs text-muted">
                    <Text className="font-semibold">Ctrl+N</Text> 新しいウィンドウ
                  </Text>
                  <Text className="text-xs text-muted">
                    <Text className="font-semibold">Ctrl+D</Text> ダッシュボード
                  </Text>
                  <Text className="text-xs text-muted">
                    <Text className="font-semibold">Ctrl+S</Text> 保存
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  // タブレット・中サイズ画面
  if (isLandscape) {
    return (
      <View className="flex-1 bg-background">
        <ChromebookToolbar
          title="学習ダッシュボード"
          actions={[
            {
              label: '📤 インポート',
              onPress: () => console.log('Import'),
            },
          ]}
        />

        <ScrollView className="flex-1">
          <View className="gap-4 p-4">
            <LearningDashboard />

            {/* 最近使用したカテゴリ */}
            <View className="gap-2">
              <Text className="text-lg font-bold text-foreground">最近使用したカテゴリ</Text>
              <View className="gap-2">
                {recentCategories.map((category) => (
                  <Pressable
                    key={category.id}
                    onPress={() => handleCategoryPress(category.id)}
                    className="rounded-lg border border-border bg-surface p-3 active:opacity-70"
                  >
                    <View className="gap-1">
                      <Text className="font-semibold text-foreground">{category.name}</Text>
                      <Text className="text-xs text-muted">
                        {category.questionsCount}問 - {category.lastStudyDate}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // スマートフォン・小さい画面
  return (
    <View className="flex-1 bg-background">
      <ChromebookToolbar
        title="学習アプリ"
        actions={[
          {
            label: '📤',
            onPress: () => console.log('Import'),
          },
        ]}
      />

      <ScrollView className="flex-1">
        <View className="gap-4 p-4">
          <LearningDashboard />
        </View>
      </ScrollView>
    </View>
  );
}
