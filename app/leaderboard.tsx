import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import {
  getRankingTier,
  getTierColor,
  formatLastTestDate,
  calculateRankingScore,
  type RankingEntry,
  type UserRankingData,
} from "../lib/ranking";
import { addFriend, isFriend, removeFriend } from "../lib/friends";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

export default function LeaderboardScreen() {
  const router = useRouter();
  const colors = useColors();
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [friendIds, setFriendIds] = useState<Set<string>>(new Set());

  const { data: cloudRankings, isLoading, refetch } = trpc.study.getRankings.useQuery();

  useEffect(() => {
    if (cloudRankings) {
      setRankings(cloudRankings);
      setLoading(false);
    }
  }, [cloudRankings]);

  const handleRefresh = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    refetch();
  };

  const handleFollowUser = async (user: RankingEntry) => {
    try {
      if (friendIds.has(user.userId)) {
        await removeFriend(user.userId);
        setFriendIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(user.userId);
          return newSet;
        });
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
        }
      } else {
        await addFriend(user);
        setFriendIds((prev) => new Set([...prev, user.userId]));
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
        }
      }
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  const handleViewFriends = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/friends" as any);
  };

  const handleViewUserProfile = (userId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/user-profile?userId=${userId}` as any);
  };

  if (loading) {
    return (
      <ScreenContainer className="p-4 justify-center">
        <Text className="text-lg text-foreground text-center">
          ランキングを読み込み中...
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold text-foreground">
              ランキング
            </Text>
            <Pressable
              onPress={handleRefresh}
              className="px-3 py-2 bg-surface rounded-lg border border-border"
            >
              <Text className="text-primary font-semibold">更新</Text>
            </Pressable>
          </View>
        </View>

        {/* Leaderboard */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">
            トッププレイヤー
          </Text>

          {rankings.map((entry, index) => {
            const rank = index + 1;
            const tier = rank === 1 ? "S" : rank <= 3 ? "A" : rank <= 10 ? "B" : "C";
            const tierColor = getTierColor(tier);

            return (
              <View
                key={index}
                className="mb-2 p-3 rounded-lg border bg-surface border-border"
              >
                <View className="flex-row items-center gap-3">
                  {/* Rank */}
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: tierColor }}
                  >
                    <Text className="text-white font-bold text-sm">
                      {rank}
                    </Text>
                  </View>

                  {/* User Info */}
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="font-bold text-foreground">
                        {entry.name || "匿名ユーザー"}
                      </Text>
                      <View className="px-2 py-1 bg-primary/20 rounded">
                        <Text className="text-xs font-bold text-primary">
                          {tier}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row gap-3">
                      <Text className="text-xs text-muted">
                        スコア: {entry.score}
                      </Text>
                      <Text className="text-xs text-muted">
                        {new Date(entry.updatedAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
          
          {rankings.length === 0 && (
            <Text className="text-center text-muted my-10">
              まだランキングデータがありません。テストを受けて最初のランクインを目指しましょう！
            </Text>
          )}
        </View>

        {/* Statistics */}
        <View className="mb-6 bg-surface rounded-lg p-4 border border-border">
          <Text className="text-lg font-bold text-foreground mb-4">
            ランキング情報
          </Text>

          <View className="gap-3">
            <View className="flex-row justify-between items-center pb-3 border-b border-border">
              <Text className="text-foreground">ランク評価基準</Text>
            </View>

            {[
              { tier: "S", label: "最高", color: "#FF6B6B" },
              { tier: "A", label: "優秀", color: "#FFA500" },
              { tier: "B", label: "良好", color: "#FFD700" },
              { tier: "C", label: "平均", color: "#4ECDC4" },
              { tier: "D", label: "初心者", color: "#95E1D3" },
              { tier: "E", label: "修行中", color: "#C0C0C0" },
            ].map((item) => (
              <View key={item.tier} className="flex-row items-center gap-3">
                <View
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <Text className="text-sm text-foreground flex-1">
                  {item.tier}ランク
                </Text>
                <Text className="text-xs text-muted">{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action buttons */}
        <View className="gap-3">
          <Pressable
            onPress={handleViewFriends}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className="p-4 rounded-lg bg-success"
          >
            <Text className="text-center text-white font-bold text-lg">
              👥 フレンド一覧
            </Text>
          </Pressable>
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
