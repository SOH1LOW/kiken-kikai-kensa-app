import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useEffect, useState } from "react";
import { type Question } from "@/data/questions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { removeIncorrectQuestion } from "@/lib/incorrect-questions";

interface IncorrectQuestion {
  question: Question;
  userAnswer: boolean;
}

interface ReviewResult {
  question: Question;
  previousAnswer: boolean;
  currentAnswer: boolean;
  isCorrect: boolean;
}

export default function ReviewResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [improvedCount, setImprovedCount] = useState(0);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    calculateResults();
  }, []);

  const calculateResults = async () => {
    try {
      const questionsData = JSON.parse(
        params.questionsData as string
      ) as IncorrectQuestion[];
      const answersData = JSON.parse(params.answersData as string) as boolean[];

      let improved = 0;
      const reviewResults: ReviewResult[] = [];

      questionsData.forEach((item, index) => {
        const currentAnswer = answersData[index];
        const isCorrect = currentAnswer === item.question.answer;

        if (isCorrect && item.userAnswer !== item.question.answer) {
          improved++;
          removeIncorrectQuestion(item.question.id);
        }

        reviewResults.push({
          question: item.question,
          previousAnswer: item.userAnswer,
          currentAnswer,
          isCorrect,
        });
      });

      setResults(reviewResults);
      setImprovedCount(improved);

      if (improved > 0) {
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

  const handleHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace("/");
  };

  const totalQuestions = results.length;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const percentage = (correctCount / totalQuestions) * 100;

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* スコア表示 */}
          <View className="bg-surface rounded-2xl p-6 shadow-sm border border-border items-center">
            <Text className="text-lg text-muted mb-2">復習結果</Text>
            <Text className="text-5xl font-bold text-primary mb-2">
              {correctCount}/{totalQuestions}
            </Text>
            <Text className="text-3xl font-bold text-primary">
              {percentage.toFixed(1)}%
            </Text>

            {improvedCount > 0 && (
              <View className="mt-4 pt-4 border-t border-border w-full">
                <Text className="text-lg font-bold text-success text-center">
                  🎉 {improvedCount}問改善！
                </Text>
              </View>
            )}
          </View>

          {/* 復習結果リスト */}
          <View>
            <Text className="text-xl font-bold text-foreground mb-4">
              復習詳細
            </Text>

            {results.map((result, index) => {
              const isExpanded = expandedIds.has(result.question.id);
              const wasIncorrect =
                result.previousAnswer !== result.question.answer;
              const isNowCorrect = result.isCorrect;
              const isImproved = wasIncorrect && isNowCorrect;

              return (
                <TouchableOpacity
                  key={result.question.id}
                  onPress={() => toggleExplanation(result.question.id)}
                  className={`rounded-xl p-4 mb-3 border ${
                    result.isCorrect
                      ? "bg-success/10 border-success"
                      : "bg-surface border-border"
                  }`}
                  activeOpacity={0.7}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-xs text-primary font-semibold">
                      {result.question.category}
                    </Text>
                    <View className="flex-row gap-2">
                      {result.isCorrect && (
                        <Text className="text-xs font-bold text-success">
                          ✓ 正解
                        </Text>
                      )}
                      {!result.isCorrect && (
                        <Text className="text-xs font-bold text-error">
                          ✗ 不正解
                        </Text>
                      )}
                      {isImproved && (
                        <Text className="text-xs font-bold text-success">
                          改善！
                        </Text>
                      )}
                    </View>
                  </View>

                  <Text className="text-base text-foreground leading-relaxed mb-3">
                    {result.question.text}
                  </Text>

                  <View className="flex-row gap-4 mb-2">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm text-muted">前回:</Text>
                      <Text className="text-lg font-bold text-error">
                        {result.previousAnswer ? "◯" : "×"}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm text-muted">今回:</Text>
                      <Text
                        className={`text-lg font-bold ${
                          result.isCorrect ? "text-success" : "text-error"
                        }`}
                      >
                        {result.currentAnswer ? "◯" : "×"}
                      </Text>
                    </View>
                  </View>

                  {isExpanded && (
                    <View className="mt-3 pt-3 border-t border-border">
                      <Text className="text-sm font-semibold text-foreground mb-1">
                        解説
                      </Text>
                      <Text className="text-sm text-muted leading-relaxed">
                        {result.question.explanation}
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

          {/* アクションボタン */}
          <View className="gap-3 mt-4">
            <TouchableOpacity
              onPress={handleHome}
              className="bg-primary py-4 rounded-xl shadow-lg active:opacity-80"
            >
              <Text className="text-white text-lg font-bold text-center">
                ホームに戻る
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
