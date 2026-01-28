import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useEffect, useState } from "react";
import { type Question } from "@/data/questions";
import { getCategoryColor } from "@/lib/categories";
import * as Haptics from "expo-haptics";

interface IncorrectQuestion {
  question: Question;
  userAnswer: boolean;
}

export default function CategoryResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryName = params.category as string;

  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [incorrectQuestions, setIncorrectQuestions] = useState<
    IncorrectQuestion[]
  >([]);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    calculateResults();
  }, []);

  const calculateResults = () => {
    try {
      const questionsData = JSON.parse(
        params.questionsData as string
      ) as Question[];
      const answersData = JSON.parse(params.answersData as string) as boolean[];

      let correctCount = 0;
      const incorrect: IncorrectQuestion[] = [];

      questionsData.forEach((question, index) => {
        const userAnswer = answersData[index];
        if (userAnswer === question.answer) {
          correctCount++;
        } else {
          incorrect.push({ question, userAnswer });
        }
      });

      setScore(correctCount);
      setTotalQuestions(questionsData.length);
      setIncorrectQuestions(incorrect);

      if (correctCount === questionsData.length) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("結果の計算に失敗しました:", error);
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
    router.push({
      pathname: "/category-quiz",
      params: { category: categoryName },
    });
  };

  const handleHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace("/");
  };

  const percentage = (score / totalQuestions) * 100;
  const categoryColor = getCategoryColor(categoryName);

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* スコア表示 */}
          <View className="bg-surface rounded-2xl p-6 shadow-sm border border-border items-center">
            <Text
              className="text-lg font-bold mb-2"
              style={{ color: categoryColor }}
            >
              {categoryName}
            </Text>
            <Text className="text-5xl font-bold text-primary mb-2">
              {score}/{totalQuestions}
            </Text>
            <Text className="text-3xl font-bold text-primary">
              {percentage.toFixed(1)}%
            </Text>

            {score === totalQuestions && (
              <View className="mt-4 pt-4 border-t border-border w-full">
                <Text className="text-lg font-bold text-success text-center">
                  🎉 満点です！
                </Text>
              </View>
            )}
          </View>

          {/* 間違い問題 */}
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
                    className="rounded-xl p-4 mb-3 border bg-surface border-border active:opacity-70"
                    activeOpacity={0.7}
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="text-xs text-primary font-semibold">
                        問題 {index + 1}
                      </Text>
                      <Text className="text-xs font-bold text-error">
                        ✗ 不正解
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
            <View className="bg-success/10 rounded-xl p-6 border border-success items-center">
              <Text className="text-lg font-bold text-success text-center">
                全問正解です！素晴らしい成績です。
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
                もう一度チャレンジ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleHome}
              className="bg-border py-4 rounded-xl shadow-lg active:opacity-80"
            >
              <Text className="text-foreground text-lg font-bold text-center">
                ホームに戻る
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
