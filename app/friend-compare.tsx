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
import {
  getFriendById,
  calculateComparison,
  getComparisonSummary,
  getComparisonMessage,
  type FriendComparison,
} from "../lib/friends";
import { getUserRankingData, type UserRankingData } from "../lib/ranking";
import { useColors } from "@/hooks/use-colors";

export default function FriendCompareScreen() {
  const router = useRouter();
  const colors = useColors();
  const { friendId } = useLocalSearchParams();
  const [currentUser, setCurrentUser] = useState<UserRankingData | null>(null);
  const [comparison, setComparison] = useState<FriendComparison | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComparison();
  }, [friendId]);

  const loadComparison = async () => {
    setLoading(true);
    const user = await getUserRankingData();
    const friend = await getFriendById(friendId as string);

    if (friend) {
      const comp = calculateComparison(user, friend);
      setCurrentUser(user);
      setComparison(comp);
    }
    setLoading(false);
  };

  if (loading || !comparison || !currentUser) {
    return (
      <ScreenContainer className="p-4 justify-center">
        <Text className="text-lg text-foreground text-center">
          比較データを読み込み中...
        </Text>
      </ScreenContainer>
    );
  }

  const summary = getComparisonSummary(comparison);
  const message = getComparisonMessage(summary.youAheadCount, summary.friendAheadCount);

  const ComparisonRow = ({
    label,
    yourValue,
    friendValue,
    youAhead,
  }: {
    label: string;
    yourValue: string | number;
    friendValue: string | number;
    youAhead: boolean;
  }) => (
    <View className="mb-4 p-3 bg-surface rounded-lg border border-border">
      <Text className="text-sm font-semibold text-muted mb-2">{label}</Text>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 items-center">
          <Text className="text-lg font-bold text-foreground">
            {yourValue}
          </Text>
          <Text className="text-xs text-muted mt-1">あなた</Text>
        </View>
        <View className="px-3">
          <View
            className={`px-2 py-1 rounded ${
              youAhead ? "bg-primary/20" : "bg-error/20"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                youAhead ? "text-primary" : "text-error"
              }`}
            >
              {youAhead ? "優勢" : "劣勢"}
            </Text>
          </View>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-lg font-bold text-foreground">
            {friendValue}
          </Text>
          <Text className="text-xs text-muted mt-1">
            {comparison.friend.userName}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="mb-6 items-center">
          <Text className="text-2xl font-bold text-foreground mb-2">
            比較
          </Text>
          <View className="bg-primary/20 px-4 py-2 rounded-full">
            <Text className="text-primary font-bold">{message}</Text>
          </View>
        </View>

        {/* Summary */}
        <View className="mb-6 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-lg p-4 border border-primary/30">
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">
                {summary.youAheadCount}
              </Text>
              <Text className="text-xs text-muted mt-1">あなたが優勢</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-muted">
                {summary.tiedCount}
              </Text>
              <Text className="text-xs text-muted mt-1">互角</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-error">
                {summary.friendAheadCount}
              </Text>
              <Text className="text-xs text-muted mt-1">相手が優勢</Text>
            </View>
          </View>
        </View>

        {/* Comparisons */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">
            詳細比較
          </Text>

          <ComparisonRow
            label="正答率"
            yourValue={`${comparison.scoreComparison.yourScore}%`}
            friendValue={`${comparison.scoreComparison.friendScore}%`}
            youAhead={comparison.scoreComparison.youAhead}
          />

          <ComparisonRow
            label="レベル"
            yourValue={`Lv. ${comparison.levelComparison.yourLevel}`}
            friendValue={`Lv. ${comparison.levelComparison.friendLevel}`}
            youAhead={comparison.levelComparison.youAhead}
          />

          <ComparisonRow
            label="テスト回数"
            yourValue={comparison.testCountComparison.yourCount}
            friendValue={comparison.testCountComparison.friendCount}
            youAhead={comparison.testCountComparison.youAhead}
          />

          <ComparisonRow
            label="獲得バッジ"
            yourValue={comparison.badgeComparison.yourBadges}
            friendValue={comparison.badgeComparison.friendBadges}
            youAhead={comparison.badgeComparison.youAhead}
          />
        </View>

        {/* Motivation message */}
        <View className="mb-6 bg-warning/10 rounded-lg p-4 border border-warning/30">
          <Text className="text-sm text-foreground text-center">
            {summary.youAheadCount > summary.friendAheadCount
              ? "素晴らしい！このペースで頑張ってください！"
              : "相手に追いつくまであと少し！もう一頑張り！"}
          </Text>
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
