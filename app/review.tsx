import { Text, View, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useState, useEffect } from "react";
import { questions, type Question } from "@/data/questions";
import { getIncorrectQuestions, removeIncorrectQuestion } from "@/lib/incorrect-questions";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IncorrectQuestionData {
  question: Question;
  userAnswer: boolean;
}

export default function ReviewScreen() {
  const router = useRouter();
  const [incorrectQuestions, setIncorrectQuestions] = useState<IncorrectQuestionData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIncorrectQuestions();
  }, []);

  const loadIncorrectQuestions = async () => {
    try {
      const records = await getIncorrectQuestions();
      const questionData: IncorrectQuestionData[] = records
        .map((record) => {
          const question = questions.find((q) => q.id === record.questionId);
          return question ? { question, userAnswer: record.userAnswer } : null;
        })
        .filter((item): item is IncorrectQuestionData => item !== null);

      setIncorrectQuestions(questionData);
      setIsLoading(false);
    } catch (error) {
      console.error("間違い問題の読み込みに失敗しました:", error);
      setIsLoading(false);
    }
  };

  const handleAnswer = (userAnswer: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newAnswers = [...answers, userAnswer];
    setAnswers(newAnswers);

    if (currentIndex < incorrectQuestions.length - 1) {
      // 次の問題へ
      setCurrentIndex(currentIndex + 1);
    } else {
      // 復習終了 - 結果画面へ
      router.push({
        pathname: "/review-result",
        params: {
          questionsData: JSON.stringify(incorrectQuestions),
          answersData: JSON.stringify(newAnswers),
        },
      });
    }
  };

  const handleExit = () => {
    Alert.alert(
      "復習を終了",
      "復習を中断してホームに戻りますか？",
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

  if (isLoading || incorrectQuestions.length === 0) {
    return (
      <ScreenContainer className="p-6 justify-center items-center">
        <Text className="text-xl text-foreground">
          {isLoading ? "問題を準備中..." : "復習する問題がありません"}
        </Text>
      </ScreenContainer>
    );
  }

  const currentQuestion = incorrectQuestions[currentIndex];
  const progress = ((currentIndex + 1) / incorrectQuestions.length) * 100;

  return (
    <ScreenContainer className="p-6">
      <View className="flex-1 justify-between">
        {/* プログレスバー */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-muted">
              復習 {currentIndex + 1} / {incorrectQuestions.length}
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
              {currentQuestion.question.category}
            </Text>
            <Text className="text-xl text-foreground leading-relaxed mb-4">
              {currentQuestion.question.text}
            </Text>
            <View className="bg-warning/10 rounded-lg p-3 border border-warning">
              <Text className="text-xs text-muted mb-1">前回の回答:</Text>
              <Text className="text-lg font-bold text-error">
                {currentQuestion.userAnswer ? "◯" : "×"}
              </Text>
            </View>
          </View>
        </View>

        {/* 回答ボタン */}
        <View className="gap-4 mb-8">
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
