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
  getTopUsers,
  getUserRankingData,
  getRankingTier,
  getTierColor,
  formatLastTestDate,
  calculateRankingScore,
  type RankingEntry,
  type UserRankingData,
} from "../lib/ranking";
import { addFriend, isFriend, removeFriend } from "../lib/friends";
import { useColors } from "@/hooks/use-colors";

export default function LeaderboardScreen() {
  const router = useRouter();
  const colors = useColors();
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<UserRankingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [friendIds, setFriendIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    setLoading(true);
    const topUsers = await getTopUsers(10);
    const user = await getUserRankingData();
    
    // Load friend status for each user
    const friends = new Set<string>();
    for (const entry of topUsers) {
      const isFriendUser = await isFriend(entry.userId);
      if (isFriendUser) {
        friends.add(entry.userId);
      }
    }
    
    setRankings(topUsers);
    setCurrentUser(user);
    setFriendIds(friends);
    setLoading(false);
  };

  const handleRefresh = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    loadRankings();
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

  if (loading) {
    return (
      <ScreenContainer className="p-4 justify-center">
        <Text className="text-lg text-foreground text-center">
          ランキングを読み込み中...
        </Text>
      </ScreenContainer>
    );
  }

  const currentUserRank = rankings.find((r) => r.userId === currentUser?.userId);

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

        {/* Your Rank Card */}
        {currentUserRank && (
          <View className="mb-6 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-lg p-4 border border-primary/30">
            <Text className="text-sm font-semibold text-primary mb-2">
              あなたのランク
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 bg-primary rounded-full items-center justify-center">
                  <Text className="text-white font-bold text-lg">
                    {currentUserRank.rank}
                  </Text>
                </View>
                <View>
                  <Text className="font-bold text-foreground">
                    {currentUserRank.userName}
                  </Text>
                  <Text className="text-xs text-muted">
                    Lv. {currentUserRank.level}
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-2xl font-bold text-primary">
                  {currentUserRank.averageScore}%
                </Text>
                <Text className="text-xs text-muted">
                  {currentUserRank.totalTests}回
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Leaderboard */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">
            トップ10
          </Text>

          {rankings.map((entry) => {
            const tier = getRankingTier(calculateRankingScore(entry));
            const tierColor = getTierColor(tier);
            const isCurrentUser = entry.userId === currentUser?.userId;
            const isFriend = friendIds.has(entry.userId);

            return (
              <View
                key={entry.userId}
                className={`mb-2 p-3 rounded-lg border ${
                  isCurrentUser
                    ? "bg-primary/10 border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <View className="flex-row items-center gap-3">
                  {/* Rank */}
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: tierColor }}
                  >
                    <Text className="text-white font-bold text-sm">
                      {entry.rank}
                    </Text>
                  </View>

                  {/* User Info */}
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="font-bold text-foreground">
                        {entry.userName}
                      </Text>
                      <View className="px-2 py-1 bg-primary/20 rounded">
                        <Text className="text-xs font-bold text-primary">
                          {tier}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row gap-3">
                      <Text className="text-xs text-muted">
                        Lv. {entry.level}
                      </Text>
                      <Text className="text-xs text-muted">
                        {entry.totalTests}回
                      </Text>
                      <Text className="text-xs text-muted">
                        {formatLastTestDate(entry.lastTestDate)}
                      </Text>
                    </View>
                  </View>

                  {/* Score */}
                  <View className="items-end">
                    <Text className="text-lg font-bold text-foreground">
                      {entry.averageScore}%
                    </Text>
                    <Text className="text-xs text-muted">
                      {entry.badges}個のバッジ
                    </Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
                  <View
                    className="h-full bg-primary"
                    style={{
                      width: `${entry.averageScore}%`,
                    }}
                  />
                </View>

                {/* Follow button */}
                {!isCurrentUser && (
                  <View className="mt-3">
                    <Pressable
                      onPress={() => handleFollowUser(entry)}
                      style={({ pressed }) => [
                        {
                          opacity: pressed ? 0.8 : 1,
                          transform: [{ scale: pressed ? 0.97 : 1 }],
                        },
                      ]}
                      className={isFriend ? "px-3 py-2 rounded bg-primary" : "px-3 py-2 rounded bg-surface border border-border"}
                    >
                      <Text className={isFriend ? "text-center font-semibold text-sm text-white" : "text-center font-semibold text-sm text-foreground"}>
                        {isFriend ? "フォロー中" : "フォロー"}
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          })}
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
