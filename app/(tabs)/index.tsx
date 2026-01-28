import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

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

  useEffect(() => {
    loadHistory();
  }, []);

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

  const handleStartTest = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/quiz");
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-8 justify-center">
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
          <View className="items-center my-8">
            <TouchableOpacity
              onPress={handleStartTest}
              className="bg-primary px-12 py-5 rounded-2xl shadow-lg active:opacity-80"
              activeOpacity={0.8}
            >
              <Text className="text-white text-xl font-bold">
                テスト開始
              </Text>
            </TouchableOpacity>
            <Text className="text-sm text-muted mt-3">
              30問の◯×問題にチャレンジ
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

          {/* 説明テキスト */}
          <View className="w-full max-w-sm self-center">
            <Text className="text-sm text-muted text-center leading-relaxed">
              このアプリは技能検定機械検査3級の学習をサポートします。
              測定機器、硬さ試験、寸法測定など、幅広い分野から出題されます。
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
