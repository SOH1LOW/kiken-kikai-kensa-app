import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Pressable, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import {
  saveMockExamSession,
  formatTime,
  type MockExamSession,
} from "@/lib/mock-exam";
import { useColors } from "@/hooks/use-colors";
import { type Question } from "@/data/questions";

export default function MockExamResultScreen() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams();

  const [session, setSession] = useState<MockExamSession | null>(null);
  const [incorrectQuestions, setIncorrectQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const score = parseInt(params.score as string, 10);
    const correctAnswers = parseInt(params.correctAnswers as string, 10);
    const totalQuestions = parseInt(params.totalQuestions as string, 10);
    const timeSpent = parseInt(params.timeSpent as string, 10);
    const answers = JSON.parse(params.answers as string);
    const selectedQuestions = JSON.parse(params.selectedQuestions as string);

    const newSession: MockExamSession = {
      id: `mock_${Date.now()}`,
      startTime: Date.now() - timeSpent,
      endTime: Date.now(),
      answers,
      timeSpent,
      score,
      totalQuestions,
      correctAnswers,
      date: new Date().toLocaleDateString("ja-JP"),
    };

    setSession(newSession);

    // Find incorrect questions
    const incorrect = selectedQuestions.filter(
      (q: Question) => answers[q.id] !== q.answer
    );
    setIncorrectQuestions(incorrect);

    // Save session
    saveMockExamSession(newSession);

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [params]);

  if (!session) {
    return (
      <ScreenContainer className="p-4 justify-center">
        <Text className="text-lg text-foreground text-center">
          結果を読み込み中...
        </Text>
      </ScreenContainer>
    );
  }

  const scorePercentage = session.score;
  const timeMinutes = Math.floor(session.timeSpent / 60000);
  const timeSeconds = Math.floor((session.timeSpent % 60000) / 1000);

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Score display */}
        <View className="mb-6 bg-surface rounded-lg p-6 items-center">
          <Text className="text-sm text-muted mb-2">模擬試験結果</Text>
          <View className="mb-4">
            <Text className="text-6xl font-bold text-primary text-center">
              {scorePercentage}
            </Text>
            <Text className="text-2xl text-foreground text-center">点</Text>
          </View>

          {/* Result message */}
          <Text
            className={`text-lg font-semibold text-center ${
              scorePercentage >= 70 ? "text-success" : "text-warning"
            }`}
          >
            {scorePercentage >= 70 ? "合格ライン達成！" : "もう少しです"}
          </Text>
        </View>

        {/* Statistics */}
        <View className="mb-6 bg-surface rounded-lg p-4">
          <Text className="text-lg font-bold text-foreground mb-4">
            詳細統計
          </Text>

          <View className="gap-3">
            <View className="flex-row justify-between items-center pb-3 border-b border-border">
              <Text className="text-foreground">正答数</Text>
              <Text className="font-bold text-primary">
                {session.correctAnswers}/{session.totalQuestions}
              </Text>
            </View>

            <View className="flex-row justify-between items-center pb-3 border-b border-border">
              <Text className="text-foreground">間違い数</Text>
              <Text className="font-bold text-error">
                {session.totalQuestions - session.correctAnswers}
              </Text>
            </View>

            <View className="flex-row justify-between items-center pb-3 border-b border-border">
              <Text className="text-foreground">所要時間</Text>
              <Text className="font-bold text-foreground">
                {timeMinutes}分{timeSeconds}秒
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-foreground">実施日</Text>
              <Text className="font-bold text-foreground">{session.date}</Text>
            </View>
          </View>
        </View>

        {/* Incorrect questions */}
        {incorrectQuestions.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">
              間違った問題（{incorrectQuestions.length}問）
            </Text>

            {incorrectQuestions.map((q, index) => (
              <View
                key={q.id}
                className="mb-3 bg-surface rounded-lg p-4 border border-error"
              >
                <Text className="text-sm text-error font-semibold mb-2">
                  問題 {index + 1}
                </Text>
                <Text className="text-foreground leading-relaxed mb-3">
                  {q.text}
                </Text>

                <View className="mb-2">
                  <Text className="text-xs text-muted mb-1">正解：</Text>
                  <Text className="text-sm font-bold text-success">
                    {q.answer ? "◯ 正しい" : "× 間違い"}
                  </Text>
                </View>

                <View>
                  <Text className="text-xs text-muted mb-1">解説：</Text>
                  <Text className="text-sm text-foreground leading-relaxed">
                    {q.explanation}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Action buttons */}
        <View className="gap-3">
          <Pressable
            onPress={() => router.push("/")}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className="p-4 rounded-lg bg-primary"
          >
            <Text className="text-center text-white font-bold text-lg">
              ホームに戻る
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/mock-exam")}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className="p-4 rounded-lg bg-surface border border-primary"
          >
            <Text className="text-center text-primary font-bold text-lg">
              もう一度受験する
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
