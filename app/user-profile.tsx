import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { getUserProfile, type UserProfile } from "@/lib/gamification";

export default function UserProfileScreen() {
  const router = useRouter();
  const colors = useColors();
  const { userId } = useLocalSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // 実際の実装では、userIdに基づいてサーバーからプロフィールを取得します
      // ここではデモンストレーション用に現在のユーザープロフィールを使用
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error("Failed to load user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
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
              onPress={handleBack}
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
  const unlockedBadges = profile.badges.filter((b) => b.isUnlocked);

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-foreground">
              ユーザープロフィール
            </Text>
            <Text className="text-sm text-muted mt-1">
              プロフィール
            </Text>
          </View>
          <Pressable
            onPress={handleBack}
            className="p-2"
          >
            <Text className="text-2xl">✕</Text>
          </Pressable>
        </View>

        {/* Title Section */}
        {currentTitle && (
          <View className="mb-6 bg-gradient-to-br from-primary to-blue-600 rounded-lg p-6 items-center">
            <Text className="text-5xl mb-2">{currentTitle.icon}</Text>
            <Text className="text-2xl font-bold text-white">
              {currentTitle.name}
            </Text>
            <Text className="text-sm text-blue-100 mt-1">
              {currentTitle.description}
            </Text>
          </View>
        )}

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

          <View className="w-full h-3 bg-border rounded-full overflow-hidden">
            <View
              className="h-full bg-primary"
              style={{
                width: `${Math.min(100, (profile.experience % 100) / 100 * 100)}%`,
              }}
            />
          </View>
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

        {/* Action Buttons */}
        <View className="gap-3 mt-4">
          <Pressable
            onPress={handleBack}
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
