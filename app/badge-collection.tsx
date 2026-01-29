import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  FlatList,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { getUserProfile, type UserProfile } from "@/lib/gamification";
import { getRecommendedBadges, type RecommendedBadge } from "@/lib/badge-recommendation";

export default function BadgeCollectionScreen() {
  const router = useRouter();
  const colors = useColors();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendedBadges, setRecommendedBadges] = useState<RecommendedBadge[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await getUserProfile();
      setProfile(profile);
      const recommended = getRecommendedBadges(profile);
      setRecommendedBadges(recommended);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load profile:", error);
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
          バッジ情報を読み込み中...
        </Text>
      </ScreenContainer>
    );
  }

  if (!profile) {
    return (
      <ScreenContainer className="p-4 justify-center">
        <Text className="text-lg text-foreground text-center">
          プロフィール情報が見つかりません
        </Text>
      </ScreenContainer>
    );
  }

  const unlockedBadges = profile.badges.filter((b) => b.isUnlocked);
  const lockedBadges = profile.badges.filter((b) => !b.isUnlocked);

  const renderBadgeItem = (badge: any, isUnlocked: boolean) => (
    <View
      key={badge.id}
      className={`mb-4 rounded-lg p-4 border ${
        isUnlocked
          ? "bg-surface border-border"
          : "bg-surface/50 border-border/50 opacity-60"
      }`}
    >
      <View className="flex-row items-start gap-4">
        <View className="items-center justify-center w-16 h-16 rounded-lg bg-background">
          <Text className="text-4xl">{badge.icon}</Text>
        </View>

        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-lg font-bold text-foreground flex-1">
              {badge.name}
            </Text>
            {isUnlocked && (
              <View className="px-2 py-1 bg-success rounded-full">
                <Text className="text-xs text-white font-bold">獲得済み</Text>
              </View>
            )}
          </View>

          <Text className="text-sm text-muted mb-2">{badge.description}</Text>

          <View className="bg-background rounded p-2">
            <Text className="text-xs text-muted font-semibold mb-1">
              取得条件：
            </Text>
            <Text className="text-xs text-foreground">{badge.condition}</Text>
          </View>

          {isUnlocked && badge.unlockedAt && (
            <Text className="text-xs text-muted mt-2">
              獲得日時: {new Date(badge.unlockedAt).toLocaleDateString("ja-JP")}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderRecommendedBadge = (rec: RecommendedBadge) => (
    <View
      key={rec.badge.id}
      className="mb-4 rounded-lg p-4 border border-primary bg-primary/5"
    >
      <View className="flex-row items-start gap-4">
        <View className="items-center justify-center w-16 h-16 rounded-lg bg-background">
          <Text className="text-4xl">{rec.badge.icon}</Text>
        </View>

        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-lg font-bold text-foreground flex-1">
              {rec.badge.name}
            </Text>
            <View className="px-2 py-1 bg-primary rounded-full">
              <Text className="text-xs text-white font-bold">
                {rec.progress.toFixed(0)}%
              </Text>
            </View>
          </View>

          <Text className="text-sm text-muted mb-2">{rec.reason}</Text>

          <View className="w-full h-2 bg-border rounded-full overflow-hidden mb-2">
            <View
              className="h-full bg-primary"
              style={{
                width: `${rec.progress}%`,
              }}
            />
          </View>

          <View className="bg-background rounded p-2">
            <Text className="text-xs text-muted font-semibold mb-1">
              進捗：
            </Text>
            <Text className="text-xs text-foreground">{rec.nextMilestone}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">
            バッジ図鑑
          </Text>
          <Text className="text-sm text-muted mt-1">
            獲得したバッジと取得条件を確認
          </Text>
        </View>

        <View className="mb-6 bg-surface rounded-lg p-4 border border-border">
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold text-success">
                {unlockedBadges.length}
              </Text>
              <Text className="text-xs text-muted mt-1">獲得済み</Text>
            </View>
            <View className="w-px bg-border" />
            <View className="items-center">
              <Text className="text-2xl font-bold text-warning">
                {lockedBadges.length}
              </Text>
              <Text className="text-xs text-muted mt-1">未獲得</Text>
            </View>
            <View className="w-px bg-border" />
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">
                {Math.round(
                  (unlockedBadges.length / profile.badges.length) * 100
                )}
                %
              </Text>
              <Text className="text-xs text-muted mt-1">進捗</Text>
            </View>
          </View>
        </View>

        {recommendedBadges.length > 0 && (
          <View className="mb-6">
            <View className="mb-3 flex-row items-center gap-2">
              <Text className="text-lg font-bold text-primary">⭐</Text>
              <Text className="text-lg font-bold text-foreground">
                おすすめバッジ ({recommendedBadges.length})
              </Text>
            </View>
            {recommendedBadges.map((rec) => renderRecommendedBadge(rec))}
          </View>
        )}

        {unlockedBadges.length > 0 && (
          <View className="mb-6">
            <View className="mb-3 flex-row items-center gap-2">
              <Text className="text-lg font-bold text-success">✓</Text>
              <Text className="text-lg font-bold text-foreground">
                獲得済みバッジ ({unlockedBadges.length})
              </Text>
            </View>
            {unlockedBadges.map((badge) => renderBadgeItem(badge, true))}
          </View>
        )}

        {lockedBadges.length > 0 && (
          <View className="mb-6">
            <View className="mb-3 flex-row items-center gap-2">
              <Text className="text-lg font-bold text-warning">◇</Text>
              <Text className="text-lg font-bold text-foreground">
                未獲得バッジ ({lockedBadges.length})
              </Text>
            </View>
            {lockedBadges.map((badge) => renderBadgeItem(badge, false))}
          </View>
        )}

        <View className="mb-6 bg-surface rounded-lg p-4 border border-border">
          <Text className="text-lg font-bold text-foreground mb-3">
            💡 バッジについて
          </Text>
          <View className="gap-2">
            <View className="flex-row gap-2">
              <Text className="text-foreground">•</Text>
              <Text className="text-sm text-foreground flex-1">
                テストを実施することでバッジを獲得できます
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Text className="text-foreground">•</Text>
              <Text className="text-sm text-foreground flex-1">
                各バッジには固有の取得条件があります
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Text className="text-foreground">•</Text>
              <Text className="text-sm text-foreground flex-1">
                バッジを集めることで称号がアップグレードされます
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Text className="text-foreground">•</Text>
              <Text className="text-sm text-foreground flex-1">
                すべてのバッジを獲得を目指してチャレンジしましょう
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-3">
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
