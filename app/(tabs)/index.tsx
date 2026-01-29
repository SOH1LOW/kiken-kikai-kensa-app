import { ScrollView, Text, View, TouchableOpacity, Pressable } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { getIncorrectQuestionCount } from "@/lib/incorrect-questions";
import { getUserProfile, type UserProfile } from "@/lib/gamification";

interface TestHistory {
  totalTests: number;
  averageScore: number;
  highestScore: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<TestHistory>({
    totalTests: 0,
    averageScore: 0,
    highestScore: 0,
  });
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadHistory();
    loadIncorrectCount();
    loadProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadIncorrectCount();
      loadProfile();
    }, [])
  );

  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem("testHistory");
      if (historyData) {
        setHistory(JSON.parse(historyData));
      }
    } catch (error) {
      console.error("履歴の読み込みに失敗しました:", error);
    }
  };

  const loadIncorrectCount = async () => {
    try {
      const count = await getIncorrectQuestionCount();
      setIncorrectCount(count);
    } catch (error) {
      console.error("復習問題の読み込みに失敗しました:", error);
    }
  };

  const loadProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error("プロフィールの読み込みに失敗しました:", error);
    }
  };

  const handleStartTest = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/quiz");
  };

  const handleStartReview = () => {
    if (incorrectCount === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/review");
  };

  const handleCategoryMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/category-select");
  };

  const handleMockExam = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/mock-exam");
  };

  const handleAnalytics = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/analytics");
  };

  const handleProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/profile");
  };

  const handleLeaderboard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/leaderboard");
  };

  const handleSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/settings");
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-5 justify-center">
          {/* タイトルセクション */}
          <View className="items-center gap-3">
            <Text className="text-4xl font-bold text-foreground text-center">
              機械検査3級
            </Text>
            <Text className="text-2xl font-semibold text-primary text-center">
              ◯×問題アプリ
            </Text>
            <Text className="text-base text-muted text-center mt-2">
              技能検定の学習をサポート
            </Text>
          </View>

          {/* テスト開始ボタン */}
          <View className="items-center gap-3">
            <TouchableOpacity
              onPress={handleStartTest}
              className="w-full max-w-xs bg-primary py-5 rounded-2xl shadow-lg active:opacity-80"
              activeOpacity={0.8}
            >
              <Text className="text-white text-xl font-bold text-center">
                テスト開始
              </Text>
            </TouchableOpacity>
            <Text className="text-sm text-muted text-center">
              30問の◯×問題にチャレンジ
            </Text>
          </View>

          {/* 復習モードボタン */}
          <View className="items-center gap-3">
            <TouchableOpacity
              onPress={handleStartReview}
              disabled={incorrectCount === 0}
              className={`w-full max-w-xs py-5 rounded-2xl shadow-lg active:opacity-80 ${
                incorrectCount === 0 ? "bg-border opacity-50" : "bg-warning"
              }`}
              activeOpacity={incorrectCount === 0 ? 1 : 0.8}
            >
              <Text className="text-white text-xl font-bold text-center">
                復習モード
              </Text>
            </TouchableOpacity>
            <Text className="text-sm text-muted text-center">
              {incorrectCount === 0
                ? "間違えた問題がありません"
                : `${incorrectCount}問の間違えた問題を復習`}
            </Text>
          </View>

          {/* 模擬試験モードボタン */}
          <View className="items-center gap-3">
            <TouchableOpacity
              onPress={handleMockExam}
              className="w-full max-w-xs bg-success py-5 rounded-2xl shadow-lg active:opacity-80"
              activeOpacity={0.8}
            >
              <Text className="text-white text-xl font-bold text-center">
                模擬試験
              </Text>
            </TouchableOpacity>
            <Text className="text-sm text-muted text-center">
              60分で30問に挑戦
            </Text>
          </View>

          {/* カテゴリ別学習モードボタン */}
          <View className="items-center gap-3">
            <TouchableOpacity
              onPress={handleCategoryMode}
              className="w-full max-w-xs bg-primary py-5 rounded-2xl shadow-lg active:opacity-80"
              activeOpacity={0.8}
            >
              <Text className="text-white text-xl font-bold text-center">
                カテゴリ別学習
              </Text>
            </TouchableOpacity>
            <Text className="text-sm text-muted text-center">
              特定分野に絞って学習
            </Text>
          </View>

          {/* 弱点分析ボタン */}
          <View className="items-center gap-3">
            <TouchableOpacity
              onPress={handleAnalytics}
              className="w-full max-w-xs bg-purple-500 py-5 rounded-2xl shadow-lg active:opacity-80"
              activeOpacity={0.8}
            >
              <Text className="text-white text-xl font-bold text-center">
                弱点分析
              </Text>
            </TouchableOpacity>
            <Text className="text-sm text-muted text-center">
              分野別正答率を分析
            </Text>
          </View>

          {/* プロフィールカード */}
          {profile && (
            <View className="w-full max-w-sm self-center bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-5 shadow-sm border border-purple-300/30 mb-5">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-3">
                  <Text className="text-4xl">{profile.titles.find(t => t.isActive)?.icon || '🌱'}</Text>
                  <View>
                    <Text className="text-base font-bold text-foreground">
                      {profile.titles.find(t => t.isActive)?.name || '見習い'}
                    </Text>
                    <Text className="text-xs text-muted">Lv. {profile.level}</Text>
                  </View>
                </View>
                <Pressable
                  onPress={handleProfile}
                  className="px-3 py-2 bg-purple-500 rounded-lg"
                >
                  <Text className="text-white text-xs font-bold">詳細</Text>
                </Pressable>
              </View>
              <View className="h-2 bg-border rounded-full overflow-hidden mb-2">
                <View
                  className="h-full bg-purple-500"
                  style={{
                    width: `${Math.round((profile.experience % 100) / 100 * 100)}%`,
                  }}
                />
              </View>
              <Text className="text-xs text-muted text-center">
                {profile.badges.filter(b => b.isUnlocked).length}個のバッジ • {profile.totalTests}回のテスト
              </Text>
            </View>
          )}

          {/* ランキングボタン */}
          <View className="items-center gap-2">
            <TouchableOpacity
              onPress={handleLeaderboard}
              className="w-full max-w-sm bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 rounded-full active:opacity-80"
            >
              <Text className="text-white font-bold text-center text-lg">
                🏆 ランキング
              </Text>
            </TouchableOpacity>
            <Text className="text-sm text-muted text-center">
              伝説の技能者と竞う
            </Text>
          </View>

          {/* 統計情報カード */}
          <View className="w-full max-w-sm self-center bg-surface rounded-2xl p-6 shadow-sm border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">
              学習記録
            </Text>

            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">総テスト回数</Text>
                <Text className="text-xl font-bold text-foreground">
                  {history.totalTests}回
                </Text>
              </View>

              <View className="h-px bg-border" />

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">平均正答率</Text>
                <Text className="text-xl font-bold text-primary">
                  {history.averageScore.toFixed(1)}%
                </Text>
              </View>

              <View className="h-px bg-border" />

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">最高得点</Text>
                <Text className="text-xl font-bold text-success">
                  {history.highestScore}点
                </Text>
              </View>
            </View>
          </View>

          {/* 設定ボタン */}
          <View className="items-center gap-2">
            <TouchableOpacity
              onPress={handleSettings}
              className="w-full max-w-sm bg-surface px-6 py-4 rounded-full border border-border active:opacity-80"
            >
              <Text className="text-foreground font-bold text-center text-lg">
                ⚙️ 設定
              </Text>
            </TouchableOpacity>
            <Text className="text-sm text-muted text-center">
              アカウント設定
            </Text>
          </View>

          {/* 設明テキスト */}
          <View className="w-full max-w-sm self-center">
            <Text className="text-sm text-muted text-center leading-relaxed">
              このアプリは技能検定機械検査3級の学習をサポートします。
              測定機器、硅さ試験、寸法測定など、幅広い分野から出題されます。
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
