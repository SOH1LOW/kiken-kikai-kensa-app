import { Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useState, useEffect } from "react";
import { getRandomQuestions, type Question } from "@/data/questions";
import * as Haptics from "expo-haptics";

export default function QuizScreen() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 30問をランダムに選択
    const selectedQuestions = getRandomQuestions(30);
    setQuestions(selectedQuestions);
    setIsLoading(false);
  }, []);

  const handleAnswer = (userAnswer: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const newAnswers = [...answers, userAnswer];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      // 次の問題へ
      setCurrentIndex(currentIndex + 1);
    } else {
      // テスト終了 - 結果画面へ
      router.push({
        pathname: "/result",
        params: {
          questionsData: JSON.stringify(questions),
          answersData: JSON.stringify(newAnswers),
        },
      });
    }
  };

  const handleExit = () => {
    Alert.alert(
      "テストを終了",
      "テストを中断してホームに戻りますか？",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "終了",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
  };

  if (isLoading || questions.length === 0) {
    return (
      <ScreenContainer className="p-6 justify-center items-center">
        <Text className="text-xl text-foreground">問題を準備中...</Text>
      </ScreenContainer>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <ScreenContainer className="p-6">
      <View className="flex-1 justify-between">
        {/* プログレスバー */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-muted">
              問題 {currentIndex + 1} / {questions.length}
            </Text>
            <TouchableOpacity onPress={handleExit}>
              <Text className="text-sm text-error">終了</Text>
            </TouchableOpacity>
          </View>
          <View className="h-2 bg-surface rounded-full overflow-hidden">
            <View
              className="h-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>

        {/* 問題文 */}
        <View className="flex-1 justify-center">
          <View className="bg-surface rounded-2xl p-6 shadow-sm border border-border">
            <Text className="text-xs text-primary font-semibold mb-2">
              {currentQuestion.category}
            </Text>
            <Text className="text-xl text-foreground leading-relaxed">
              {currentQuestion.text}
            </Text>
          </View>
        </View>

        {/* 回答ボタン */}
        <View className="gap-4 mb-8">
          <TouchableOpacity
            onPress={() => handleAnswer(true)}
            className="bg-success py-6 rounded-2xl shadow-lg active:opacity-80"
            style={{ transform: [{ scale: 1 }] }}
          >
            <Text className="text-white text-3xl font-bold text-center">
              ◯
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleAnswer(false)}
            className="bg-error py-6 rounded-2xl shadow-lg active:opacity-80"
            style={{ transform: [{ scale: 1 }] }}
          >
            <Text className="text-white text-3xl font-bold text-center">
              ×
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
