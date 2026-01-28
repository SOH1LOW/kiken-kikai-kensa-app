import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Platform,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import {
  calculateCategoryAnalytics,
  getCorrectRateColor,
  getDifficultyLabel,
  type AnalyticsData,
  type CategoryAnalytics,
} from "@/lib/analytics";
import { useColors } from "@/hooks/use-colors";

export default function AnalyticsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    const data = await calculateCategoryAnalytics();
    setAnalytics(data);
    setLoading(false);
  };

  const handleRefresh = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    loadAnalytics();
  };

  if (loading) {
    return (
      <ScreenContainer className="p-4 justify-center">
        <Text className="text-lg text-foreground text-center">
          分析中...
        </Text>
      </ScreenContainer>
    );
  }

  if (!analytics || analytics.categories.length === 0) {
    return (
      <ScreenContainer className="p-4">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center items-center gap-4">
            <Text className="text-lg text-foreground text-center">
              分析データがありません
            </Text>
            <Text className="text-sm text-muted text-center">
              テストを実施すると分析データが表示されます
            </Text>
            <Pressable
              onPress={() => router.back()}
              className="mt-4 px-6 py-3 bg-primary rounded-lg"
            >
              <Text className="text-white font-bold">戻る</Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  const weakCategories = analytics.categories.filter(
    (c) => c.correctRate < 60
  );
  const strongCategories = analytics.categories.filter(
    (c) => c.correctRate >= 80
  );

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold text-foreground">
              弱点分析
            </Text>
            <Pressable
              onPress={handleRefresh}
              className="px-3 py-2 bg-surface rounded-lg border border-border"
            >
              <Text className="text-primary font-semibold">更新</Text>
            </Pressable>
          </View>
        </View>

        {/* Overall Score */}
        <View className="mb-6 bg-surface rounded-lg p-6 items-center border border-border">
          <Text className="text-sm text-muted mb-2">総合正答率</Text>
          <Text className="text-5xl font-bold text-primary mb-2">
            {analytics.overallCorrectRate}%
          </Text>
          <View className="w-full h-2 bg-border rounded-full overflow-hidden">
            <View
              className="h-full bg-primary"
              style={{
                width: `${analytics.overallCorrectRate}%`,
              }}
            />
          </View>
        </View>

        {/* Strong Categories */}
        {strongCategories.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-success mb-3">
              得意分野 ({strongCategories.length})
            </Text>
            {strongCategories.map((category) => (
              <CategoryCard key={category.categoryName} category={category} />
            ))}
          </View>
        )}

        {/* Weak Categories */}
        {weakCategories.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-error mb-3">
              苦手分野 ({weakCategories.length})
            </Text>
            {weakCategories.map((category) => (
              <CategoryCard key={category.categoryName} category={category} />
            ))}
          </View>
        )}

        {/* All Categories */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">
            全分野の正答率
          </Text>
          {analytics.categories.map((category) => (
            <CategoryCard key={category.categoryName} category={category} />
          ))}
        </View>

        {/* Recommendations */}
        {weakCategories.length > 0 && (
          <View className="mb-6 bg-warning/10 rounded-lg p-4 border border-warning">
            <Text className="text-sm font-bold text-warning mb-2">
              学習のアドバイス
            </Text>
            <Text className="text-sm text-foreground leading-relaxed">
              {weakCategories.length}個の苦手分野が見つかりました。
              カテゴリ別学習モードでこれらの分野に集中して学習することをお勧めします。
            </Text>
          </View>
        )}

        {/* Action buttons */}
        <View className="gap-3">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className="p-4 rounded-lg bg-primary"
          >
            <Text className="text-center text-white font-bold text-lg">
              戻る
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function CategoryCard({ category }: { category: CategoryAnalytics }) {
  const colors = useColors();
  const rateColor = getCorrectRateColor(category.correctRate);
  const difficultyLabel = getDifficultyLabel(category.difficulty);

  return (
    <View className="mb-3 bg-surface rounded-lg p-4 border border-border">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">
            {category.categoryName}
          </Text>
          <Text className="text-xs text-muted mt-1">
            {category.correctAnswers}/{category.totalQuestions}問正解
          </Text>
        </View>
        <View className="items-end">
          <Text
            className="text-2xl font-bold"
            style={{ color: rateColor }}
          >
            {category.correctRate}%
          </Text>
          <Text className="text-xs text-muted mt-1">{difficultyLabel}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View className="w-full h-2 bg-border rounded-full overflow-hidden">
        <View
          className="h-full"
          style={{
            width: `${category.correctRate}%`,
            backgroundColor: rateColor,
          }}
        />
      </View>

      {/* Difficulty indicator */}
      <View className="mt-3 flex-row gap-2">
        {category.difficulty === "hard" && (
          <View className="px-2 py-1 bg-error/10 rounded">
            <Text className="text-xs font-semibold text-error">
              集中学習推奨
            </Text>
          </View>
        )}
        {category.difficulty === "medium" && (
          <View className="px-2 py-1 bg-warning/10 rounded">
            <Text className="text-xs font-semibold text-warning">
              復習推奨
            </Text>
          </View>
        )}
        {category.difficulty === "easy" && (
          <View className="px-2 py-1 bg-success/10 rounded">
            <Text className="text-xs font-semibold text-success">
              得意分野
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
