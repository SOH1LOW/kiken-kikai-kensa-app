import { Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useState, useEffect } from "react";
import { getQuestionsByCategory, getCategoryColor } from "@/lib/categories";
import { type Question } from "@/data/questions";
import * as Haptics from "expo-haptics";

export default function CategoryQuizScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryName = params.category as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = () => {
    try {
      const categoryQuestions = getQuestionsByCategory(categoryName);
      // ランダムに並び替え
      const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setIsLoading(false);
    } catch (error) {
      console.error("問題の読み込みに失敗しました:", error);
      setIsLoading(false);
    }
  };

  const handleAnswer = (userAnswer: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newAnswers = [...answers, userAnswer];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // テスト終了 - 結果画面へ
      router.push({
        pathname: "/category-result",
        params: {
          category: categoryName,
          questionsData: JSON.stringify(questions),
          answersData: JSON.stringify(newAnswers),
        },
      });
    }
  };

  const handleExit = () => {
    Alert.alert(
      "テストを終了",
      "テストを中断してカテゴリ選択に戻りますか？",
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
        <Text className="text-xl text-foreground">
          {isLoading ? "問題を準備中..." : "このカテゴリに問題がありません"}
        </Text>
      </ScreenContainer>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const categoryColor = getCategoryColor(categoryName);

  return (
    <ScreenContainer className="p-6">
      <View className="flex-1 justify-between">
        {/* プログレスバー */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-muted">
              {currentIndex + 1} / {questions.length}
            </Text>
            <TouchableOpacity onPress={handleExit}>
              <Text className="text-sm text-error">終了</Text>
            </TouchableOpacity>
          </View>
          <View className="h-2 bg-surface rounded-full overflow-hidden">
            <View
              className="h-full"
              style={{ width: `${progress}%`, backgroundColor: categoryColor }}
            />
          </View>
        </View>

        {/* カテゴリ情報 */}
        <View className="mb-4">
          <Text
            className="text-xs font-bold px-3 py-1 rounded-full inline-block"
            style={{
              backgroundColor: `${categoryColor}20`,
              color: categoryColor,
            }}
          >
            {categoryName}
          </Text>
        </View>

        {/* 問題文 */}
        <View className="flex-1 justify-center mb-8">
          <View className="bg-surface rounded-2xl p-6 shadow-sm border border-border">
            <Text className="text-xl text-foreground leading-relaxed font-medium">
              {currentQuestion.text}
            </Text>
          </View>
        </View>

        {/* 回答ボタン */}
        <View className="gap-4">
          <TouchableOpacity
            onPress={() => handleAnswer(true)}
            className="bg-success py-6 rounded-2xl shadow-lg active:opacity-80"
          >
            <Text className="text-white text-3xl font-bold text-center">
              ◯
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleAnswer(false)}
            className="bg-error py-6 rounded-2xl shadow-lg active:opacity-80"
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
