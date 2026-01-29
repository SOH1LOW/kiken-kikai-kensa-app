import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Platform,
  FlatList,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import {
  getFriends,
  removeFriend,
  formatFollowDate,
  sortFriendsByScore,
  type Friend,
} from "../lib/friends";
import { useColors } from "@/hooks/use-colors";

export default function FriendsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"score" | "level">("score");

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    setLoading(true);
    const friendsList = await getFriends();
    setFriends(friendsList);
    setLoading(false);
  };

  const handleRemoveFriend = (friendId: string, friendName: string) => {
    Alert.alert(
      "フレンド削除",
      `${friendName}さんをフレンドから削除しますか？`,
      [
        {
          text: "キャンセル",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "削除",
          onPress: async () => {
            await removeFriend(friendId);
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
            }
            loadFriends();
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleCompareFriend = (friend: Friend) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push({
      pathname: "/friend-compare" as any,
      params: { friendId: friend.userId },
    });
  };

  const handleSort = async (type: "score" | "level") => {
    setSortBy(type);
    if (type === "score") {
      const sorted = await sortFriendsByScore();
      setFriends([...sorted]);
    } else {
      const sorted = [...friends].sort((a, b) => b.level - a.level);
      setFriends(sorted);
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="p-4 justify-center">
        <Text className="text-lg text-foreground text-center">
          フレンドを読み込み中...
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
              フレンド
            </Text>
            <View className="bg-primary/20 px-3 py-1 rounded-full">
              <Text className="text-primary font-bold text-sm">
                {friends.length}人
              </Text>
            </View>
          </View>

          {/* Sort buttons */}
          {friends.length > 0 && (
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => handleSort("score")}
                className={`flex-1 px-3 py-2 rounded-lg border ${
                  sortBy === "score"
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    sortBy === "score" ? "text-white" : "text-foreground"
                  }`}
                >
                  スコア順
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleSort("level")}
                className={`flex-1 px-3 py-2 rounded-lg border ${
                  sortBy === "level"
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    sortBy === "level" ? "text-white" : "text-foreground"
                  }`}
                >
                  レベル順
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Friends list */}
        {friends.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-4">
            <Text className="text-lg text-muted text-center">
              フレンドがまだいません
            </Text>
            <Text className="text-sm text-muted text-center">
              ランキングからユーザーをフォローしましょう
            </Text>
          </View>
        ) : (
          <View className="gap-3 mb-6">
            {friends.map((friend) => (
              <View
                key={friend.userId}
                className="bg-surface rounded-lg p-4 border border-border"
              >
                {/* Friend info */}
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-1">
                    <Text className="font-bold text-foreground text-lg">
                      {friend.userName}
                    </Text>
                    <View className="flex-row gap-3 mt-1">
                      <Text className="text-xs text-muted">
                        Lv. {friend.level}
                      </Text>
                      <Text className="text-xs text-muted">
                        {friend.totalTests}回
                      </Text>
                      <Text className="text-xs text-muted">
                        フォロー: {formatFollowDate(friend.followedAt)}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-2xl font-bold text-primary">
                      {friend.averageScore}%
                    </Text>
                    <Text className="text-xs text-muted">
                      {friend.badges}個のバッジ
                    </Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View className="mb-3 h-1.5 bg-border rounded-full overflow-hidden">
                  <View
                    className="h-full bg-primary"
                    style={{
                      width: `${friend.averageScore}%`,
                    }}
                  />
                </View>

                {/* Action buttons */}
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => handleCompareFriend(friend)}
                    style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.8 : 1,
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                      },
                    ]}
                    className="flex-1 px-3 py-2 bg-primary rounded-lg"
                  >
                    <Text className="text-center text-white font-semibold text-sm">
                      比較
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      if (Platform.OS !== "web") {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                      handleRemoveFriend(friend.userId, friend.userName);
                    }}
                    style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.8 : 1,
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                      },
                    ]}
                    className="flex-1 px-3 py-2 bg-error/20 rounded-lg"
                  >
                    <Text className="text-center text-error font-semibold text-sm">
                      削除
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
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
