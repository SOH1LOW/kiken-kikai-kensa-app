import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useEffect, useState } from "react";
import { type Question } from "@/data/questions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { recordIncorrectQuestion } from "@/lib/incorrect-questions";

interface IncorrectQuestion {
  question: Question;
  userAnswer: boolean;
}

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [incorrectQuestions, setIncorrectQuestions] = useState<IncorrectQuestion[]>([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(30);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    calculateResults();
  }, []);

  const calculateResults = async () => {
    try {
      const questionsData = JSON.parse(params.questionsData as string) as Question[];
      const answersData = JSON.parse(params.answersData as string) as boolean[];

      let correctCount = 0;
      const incorrect: IncorrectQuestion[] = [];

      questionsData.forEach((question, index) => {
        const userAnswer = answersData[index];
        if (userAnswer === question.answer) {
          correctCount++;
        } else {
          incorrect.push({ question, userAnswer });
          recordIncorrectQuestion(question.id, userAnswer);
        }
      });

      setScore(correctCount);
      setTotalQuestions(questionsData.length);
      setIncorrectQuestions(incorrect);

      // 履歴を保存
      await saveHistory(correctCount, questionsData.length);

      // 結果に応じたハプティクス
      const percentage = (correctCount / questionsData.length) * 100;
      if (percentage >= 80) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (percentage >= 60) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch (error) {
      console.error("結果の計算に失敗しました:", error);
    }
  };

  const saveHistory = async (correctCount: number, total: number) => {
    try {
      const historyData = await AsyncStorage.getItem("testHistory");
      let history = historyData
        ? JSON.parse(historyData)
        : { totalTests: 0, averageScore: 0, highestScore: 0 };

      const newScore = (correctCount / total) * 100;
      const newTotalTests = history.totalTests + 1;
      const newAverageScore =
        (history.averageScore * history.totalTests + newScore) / newTotalTests;
      const newHighestScore = Math.max(history.highestScore, correctCount);

      history = {
        totalTests: newTotalTests,
        averageScore: newAverageScore,
        highestScore: newHighestScore,
      };

      await AsyncStorage.setItem("testHistory", JSON.stringify(history));
    } catch (error) {
      console.error("履歴の保存に失敗しました:", error);
    }
  };

  const toggleExplanation = (questionId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace("/quiz");
  };

  const handleHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace("/");
  };

  const percentage = (score / totalQuestions) * 100;
  const getScoreColor = () => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-primary";
    return "text-error";
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return "素晴らしい！";
    if (percentage >= 80) return "よくできました！";
    if (percentage >= 70) return "もう少し！";
    if (percentage >= 60) return "頑張りましょう！";
    return "復習が必要です";
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* スコア表示 */}
          <View className="bg-surface rounded-2xl p-6 shadow-sm border border-border items-center">
            <Text className="text-lg text-muted mb-2">テスト結果</Text>
            <Text className={`text-5xl font-bold ${getScoreColor()} mb-2`}>
              {score}/{totalQuestions}
            </Text>
            <Text className={`text-3xl font-bold ${getScoreColor()}`}>
              {percentage.toFixed(1)}%
            </Text>
            <Text className="text-lg text-foreground mt-3 font-semibold">
              {getScoreMessage()}
            </Text>
          </View>

          {/* 間違えた問題リスト */}
          {incorrectQuestions.length > 0 && (
            <View>
              <Text className="text-xl font-bold text-foreground mb-4">
                間違えた問題 ({incorrectQuestions.length}問)
              </Text>

              {incorrectQuestions.map((item, index) => {
                const isExpanded = expandedIds.has(item.question.id);
                return (
                  <TouchableOpacity
                    key={item.question.id}
                    onPress={() => toggleExplanation(item.question.id)}
                    className="bg-surface rounded-xl p-4 mb-3 border border-border"
                    activeOpacity={0.7}
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="text-xs text-primary font-semibold">
                        {item.question.category}
                      </Text>
                      <Text className="text-xs text-muted">
                        問題 {index + 1}
                      </Text>
                    </View>

                    <Text className="text-base text-foreground leading-relaxed mb-3">
                      {item.question.text}
                    </Text>

                    <View className="flex-row gap-4 mb-2">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm text-muted">あなたの回答:</Text>
                        <Text className="text-lg font-bold text-error">
                          {item.userAnswer ? "◯" : "×"}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm text-muted">正解:</Text>
                        <Text className="text-lg font-bold text-success">
                          {item.question.answer ? "◯" : "×"}
                        </Text>
                      </View>
                    </View>

                    {isExpanded && (
                      <View className="mt-3 pt-3 border-t border-border">
                        <Text className="text-sm font-semibold text-foreground mb-1">
                          解説
                        </Text>
                        <Text className="text-sm text-muted leading-relaxed">
                          {item.question.explanation}
                        </Text>
                      </View>
                    )}

                    <Text className="text-xs text-primary mt-2">
                      {isExpanded ? "▲ 閉じる" : "▼ 解説を見る"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {incorrectQuestions.length === 0 && (
            <View className="bg-success/10 rounded-xl p-6 items-center border border-success">
              <Text className="text-2xl font-bold text-success mb-2">
                🎉 完璧です！
              </Text>
              <Text className="text-base text-foreground text-center">
                全問正解おめでとうございます！
              </Text>
            </View>
          )}

          {/* アクションボタン */}
          <View className="gap-3 mt-4">
            <TouchableOpacity
              onPress={handleRetry}
              className="bg-primary py-4 rounded-xl shadow-lg active:opacity-80"
            >
              <Text className="text-white text-lg font-bold text-center">
                もう一度テスト
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleHome}
              className="bg-surface py-4 rounded-xl border border-border active:opacity-70"
            >
              <Text className="text-foreground text-lg font-semibold text-center">
                ホームに戻る
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
