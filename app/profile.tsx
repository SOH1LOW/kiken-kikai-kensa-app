import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import { ScreenContainer } from "@/components/screen-container";
import {
  getUserProfile,
  getExperienceProgress,
  type UserProfile,
} from "../lib/gamification";
import { useColors } from "@/hooks/use-colors";

export default function ProfileScreen() {
  const router = useRouter();
  const colors = useColors();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    setLoading(true);
    const data = await getUserProfile();
    setProfile(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <ScreenContainer className="p-4 justify-center">
        <Text className="text-lg text-foreground text-center">
          プロフィールを読み込み中...
        </Text>
      </ScreenContainer>
    );
  }

  if (!profile) {
    return (
      <ScreenContainer className="p-4">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center items-center gap-4">
            <Text className="text-lg text-foreground text-center">
              プロフィールが見つかりません
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

  const currentTitle = profile.titles.find((t) => t.isActive);
  const expProgress = getExperienceProgress(profile.experience);
  const unlockedBadges = profile.badges.filter((b) => b.isUnlocked);

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">
            プロフィール
          </Text>
        </View>

        {/* Title Section */}
        <View className="mb-6 bg-gradient-to-br from-primary to-blue-600 rounded-lg p-6 items-center">
          <Text className="text-5xl mb-2">{currentTitle?.icon}</Text>
          <Text className="text-2xl font-bold text-white">
            {currentTitle?.name}
          </Text>
          <Text className="text-sm text-blue-100 mt-1">
            {currentTitle?.description}
          </Text>
        </View>

        {/* Level and Experience */}
        <View className="mb-6 bg-surface rounded-lg p-4 border border-border">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-foreground">
              レベル {profile.level}
            </Text>
            <Text className="text-sm text-muted">
              {profile.experience} EXP
            </Text>
          </View>

          {/* Experience bar */}
          <View className="w-full h-3 bg-border rounded-full overflow-hidden mb-2">
            <View
              className="h-full bg-primary"
              style={{
                width: `${expProgress.percentage}%`,
              }}
            />
          </View>

          <Text className="text-xs text-muted text-center">
            {expProgress.current} / {expProgress.required} EXP
          </Text>
        </View>

        {/* Statistics */}
        <View className="mb-6 bg-surface rounded-lg p-4 border border-border">
          <Text className="text-lg font-bold text-foreground mb-4">
            統計情報
          </Text>

          <View className="gap-3">
            <View className="flex-row justify-between items-center pb-3 border-b border-border">
              <Text className="text-foreground">総テスト回数</Text>
              <Text className="font-bold text-primary">
                {profile.totalTests}回
              </Text>
            </View>

            <View className="flex-row justify-between items-center pb-3 border-b border-border">
              <Text className="text-foreground">平均正答率</Text>
              <Text className="font-bold text-primary">
                {profile.averageScore}%
              </Text>
            </View>

            <View className="flex-row justify-between items-center pb-3 border-b border-border">
              <Text className="text-foreground">正解数</Text>
              <Text className="font-bold text-success">
                {profile.totalCorrectAnswers}/{profile.totalQuestions}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-foreground">参加日</Text>
              <Text className="font-bold text-foreground">
                {new Date(profile.joinedDate).toLocaleDateString("ja-JP")}
              </Text>
            </View>
          </View>
        </View>

        {/* Badges */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">
            バッジ ({unlockedBadges.length}/{profile.badges.length})
          </Text>

          {/* Unlocked badges */}
          {unlockedBadges.length > 0 && (
            <View className="mb-4">
              <Text className="text-sm font-semibold text-success mb-2">
                獲得済み
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {unlockedBadges.map((badge) => (
                  <View
                    key={badge.id}
                    className="items-center bg-success/10 rounded-lg p-3 border border-success flex-1 min-w-[45%]"
                  >
                    <Text className="text-3xl mb-1">{badge.icon}</Text>
                    <Text className="text-xs font-bold text-success text-center">
                      {badge.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Locked badges */}
          {profile.badges.filter((b) => !b.isUnlocked).length > 0 && (
            <View>
              <Text className="text-sm font-semibold text-muted mb-2">
                未獲得
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {profile.badges
                  .filter((b) => !b.isUnlocked)
                  .map((badge) => (
                    <View
                      key={badge.id}
                      className="items-center bg-border/50 rounded-lg p-3 border border-border flex-1 min-w-[45%] opacity-50"
                    >
                      <Text className="text-3xl mb-1 opacity-50">
                        {badge.icon}
                      </Text>
                      <Text className="text-xs font-bold text-muted text-center">
                        {badge.name}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          )}
        </View>

        {/* Titles */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">
            称号
          </Text>

          {profile.titles.map((title) => (
            <View
              key={title.id}
              className={`mb-2 p-3 rounded-lg border ${
                title.isActive
                  ? "bg-primary/10 border-primary"
                  : "bg-surface border-border"
              }`}
            >
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="text-2xl">{title.icon}</Text>
                <View className="flex-1">
                  <Text
                    className={`font-bold ${
                      title.isActive ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {title.name}
                  </Text>
                  <Text className="text-xs text-muted">
                    {title.description}
                  </Text>
                </View>
                {title.isActive && (
                  <Text className="text-xs font-bold text-primary">
                    現在
                  </Text>
                )}
              </View>
              <Text className="text-xs text-muted ml-10">
                条件: {title.requiredCondition}
              </Text>
            </View>
          ))}
        </View>

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
