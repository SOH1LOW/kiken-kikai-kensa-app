import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [playerName, setPlayerName] = useState("");
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayerName();
  }, []);

  const loadPlayerName = async () => {
    try {
      const stored = await AsyncStorage.getItem("playerName");
      const name = stored || "プレイヤー";
      setPlayerName(name);
      setNewPlayerName(name);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load player name:", error);
      setLoading(false);
    }
  };

  const handleSavePlayerName = async () => {
    if (!newPlayerName.trim()) {
      if (Platform.OS !== "web") {
        Alert.alert("エラー", "プレイヤー名を入力してください");
      }
      return;
    }

    if (newPlayerName.trim().length > 20) {
      if (Platform.OS !== "web") {
        Alert.alert("エラー", "プレイヤー名は20文字以内で入力してください");
      }
      return;
    }

    setIsSaving(true);
    try {
      await AsyncStorage.setItem("playerName", newPlayerName.trim());
      setPlayerName(newPlayerName.trim());
      setIsEditing(false);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Failed to save player name:", error);
      if (Platform.OS !== "web") {
        Alert.alert("エラー", "プレイヤー名の保存に失敗しました");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setNewPlayerName(playerName);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <ScreenContainer className="p-4 justify-center">
        <Text className="text-lg text-foreground text-center">
          設定を読み込み中...
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">
            アカウント設定
          </Text>
          <Text className="text-sm text-muted mt-1">
            プロフィール情報を管理
          </Text>
        </View>

        {/* Player Name Section */}
        <View className="mb-6 bg-surface rounded-lg p-4 border border-border">
          <Text className="text-lg font-bold text-foreground mb-4">
            プレイヤー名
          </Text>

          {!isEditing ? (
            <View>
              <View className="mb-4 p-3 bg-background rounded-lg border border-border">
                <Text className="text-foreground font-semibold text-center text-lg">
                  {playerName}
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setIsEditing(true);
                }}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
                className="px-4 py-3 rounded-lg bg-primary"
              >
                <Text className="text-center text-white font-bold">
                  編集
                </Text>
              </Pressable>
            </View>
          ) : (
            <View>
              <TextInput
                value={newPlayerName}
                onChangeText={setNewPlayerName}
                placeholder="プレイヤー名を入力"
                placeholderTextColor={colors.muted}
                maxLength={20}
                className="mb-2 p-3 bg-background rounded-lg border border-border text-foreground"
              />
              <Text className="text-xs text-muted mb-4 text-right">
                {newPlayerName.length}/20
              </Text>

              <View className="gap-2">
                <Pressable
                  onPress={handleSavePlayerName}
                  disabled={isSaving}
                  style={({ pressed }) => [
                    {
                      opacity: pressed || isSaving ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                  ]}
                  className="px-4 py-3 rounded-lg bg-success"
                >
                  <Text className="text-center text-white font-bold">
                    {isSaving ? "保存中..." : "保存"}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleCancel}
                  disabled={isSaving}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                  ]}
                  className="px-4 py-3 rounded-lg bg-surface border border-border"
                >
                  <Text className="text-center text-foreground font-bold">
                    キャンセル
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* Information Section */}
        <View className="mb-6 bg-surface rounded-lg p-4 border border-border">
          <Text className="text-lg font-bold text-foreground mb-4">
            プレイヤー名について
          </Text>
          <View className="gap-2">
            <View className="flex-row gap-2">
              <Text className="text-foreground">•</Text>
              <Text className="text-sm text-foreground flex-1">
                プレイヤー名は20文字以内で設定できます
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Text className="text-foreground">•</Text>
              <Text className="text-sm text-foreground flex-1">
                ランキングに表示される名前です
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Text className="text-foreground">•</Text>
              <Text className="text-sm text-foreground flex-1">
                いつでも変更できます
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Text className="text-foreground">•</Text>
              <Text className="text-sm text-foreground flex-1">
                変更後は全てのランキングに反映されます
              </Text>
            </View>
          </View>
        </View>

        {/* App Information Section */}
        <View className="mb-6 bg-surface rounded-lg p-4 border border-border">
          <Text className="text-lg font-bold text-foreground mb-4">
            アプリ情報
          </Text>
          <View className="gap-3">
            <View className="flex-row justify-between items-center pb-3 border-b border-border">
              <Text className="text-foreground">アプリ名</Text>
              <Text className="text-foreground font-semibold">
                機械検査3級 ◯×問題
              </Text>
            </View>
            <View className="flex-row justify-between items-center pb-3 border-b border-border">
              <Text className="text-foreground">バージョン</Text>
              <Text className="text-foreground font-semibold">1.0.0</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-foreground">開発</Text>
              <Text className="text-foreground font-semibold">Manus</Text>
            </View>
          </View>
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
