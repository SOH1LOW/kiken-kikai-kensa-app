import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { questions, type Question } from "@/data/questions";
import { formatTime, calculateScore } from "@/lib/mock-exam";
import { useColors } from "@/hooks/use-colors";

const TOTAL_QUESTIONS = 30;
const TIME_LIMIT = 60 * 60 * 1000; // 60 minutes in milliseconds

export default function MockExamScreen() {
  const router = useRouter();
  const colors = useColors();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT);
  const [startTime] = useState(Date.now());
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Initialize random questions
  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setSelectedQuestions(shuffled.slice(0, TOTAL_QUESTIONS));
  }, []);

  // Timer effect
  useEffect(() => {
    if (isTimeUp || selectedQuestions.length === 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1000) {
          setIsTimeUp(true);
          if (Platform.OS !== "web") {
            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Warning
            );
          }
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimeUp, selectedQuestions.length]);

  const handleAnswer = (answer: boolean) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const newAnswers = {
      ...answers,
      [selectedQuestions[currentQuestionIndex].id]: answer,
    };
    setAnswers(newAnswers);

    // Move to next question
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleFinishExam = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    const endTime = Date.now();
    const timeSpent = endTime - startTime;
    const correctAnswers = selectedQuestions.filter(
      (q) => answers[q.id] === q.answer
    ).length;
    const score = calculateScore(correctAnswers, TOTAL_QUESTIONS);

    router.push({
      pathname: "/mock-exam-result",
      params: {
        score: score.toString(),
        correctAnswers: correctAnswers.toString(),
        totalQuestions: TOTAL_QUESTIONS.toString(),
        timeSpent: timeSpent.toString(),
        answers: JSON.stringify(answers),
        selectedQuestions: JSON.stringify(selectedQuestions),
      },
    });
  };

  const handleTimeUp = () => {
    Alert.alert(
      "時間切れ",
      "制限時間に達しました。試験を終了します。",
      [
        {
          text: "OK",
          onPress: handleFinishExam,
        },
      ]
    );
  };

  if (selectedQuestions.length === 0) {
    return (
      <ScreenContainer className="p-4 justify-center">
        <Text className="text-lg text-foreground text-center">
          問題を読み込み中...
        </Text>
      </ScreenContainer>
    );
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const isAnswered = currentQuestion.id in answers;
  const answeredCount = Object.keys(answers).length;
  const timeMinutes = Math.floor(timeRemaining / 60000);
  const timeSeconds = Math.floor((timeRemaining % 60000) / 1000);
  const isTimeWarning = timeRemaining < 5 * 60 * 1000; // 5 minutes warning

  useEffect(() => {
    if (isTimeUp) {
      handleTimeUp();
    }
  }, [isTimeUp]);

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header with timer */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-foreground">
              模擬試験
            </Text>
            <View
              className={`px-3 py-2 rounded-lg ${
                isTimeWarning ? "bg-error" : "bg-primary"
              }`}
            >
              <Text className="text-white font-bold text-center">
                {timeMinutes.toString().padStart(2, "0")}:
                {timeSeconds.toString().padStart(2, "0")}
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View className="bg-surface rounded-lg p-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-muted">進捗</Text>
              <Text className="text-sm font-bold text-foreground">
                {currentQuestionIndex + 1}/{TOTAL_QUESTIONS}
              </Text>
            </View>
            <View className="w-full h-2 bg-border rounded-full overflow-hidden">
              <View
                className="h-full bg-primary"
                style={{
                  width: `${((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100}%`,
                }}
              />
            </View>
          </View>
        </View>

        {/* Question */}
        <View className="mb-6 bg-surface rounded-lg p-4">
          <Text className="text-sm text-muted mb-2">
            問題 {currentQuestionIndex + 1}
          </Text>
          <Text className="text-lg font-semibold text-foreground leading-relaxed">
            {currentQuestion.text}
          </Text>
        </View>

        {/* Answer buttons */}
        <View className="gap-3 mb-6">
          <Pressable
            onPress={() => handleAnswer(true)}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className={`p-4 rounded-lg border-2 ${
              answers[currentQuestion.id] === true
                ? "bg-success border-success"
                : "bg-surface border-border"
            }`}
          >
            <Text
              className={`text-center text-lg font-bold ${
                answers[currentQuestion.id] === true
                  ? "text-white"
                  : "text-foreground"
              }`}
            >
              ◯ 正しい
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleAnswer(false)}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className={`p-4 rounded-lg border-2 ${
              answers[currentQuestion.id] === false
                ? "bg-error border-error"
                : "bg-surface border-border"
            }`}
          >
            <Text
              className={`text-center text-lg font-bold ${
                answers[currentQuestion.id] === false
                  ? "text-white"
                  : "text-foreground"
              }`}
            >
              × 間違い
            </Text>
          </Pressable>
        </View>

        {/* Navigation buttons */}
        <View className="flex-row gap-3 mb-6">
          <Pressable
            onPress={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
              }
            }}
            disabled={currentQuestionIndex === 0}
            style={({ pressed }) => [
              {
                opacity: currentQuestionIndex === 0 ? 0.5 : pressed ? 0.8 : 1,
              },
            ]}
            className="flex-1 p-3 rounded-lg bg-surface border border-border"
          >
            <Text className="text-center font-semibold text-foreground">
              ← 前へ
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              }
            }}
            disabled={currentQuestionIndex === TOTAL_QUESTIONS - 1}
            style={({ pressed }) => [
              {
                opacity:
                  currentQuestionIndex === TOTAL_QUESTIONS - 1
                    ? 0.5
                    : pressed
                      ? 0.8
                      : 1,
              },
            ]}
            className="flex-1 p-3 rounded-lg bg-surface border border-border"
          >
            <Text className="text-center font-semibold text-foreground">
              次へ →
            </Text>
          </Pressable>
        </View>

        {/* Question navigator */}
        <View className="mb-6 bg-surface rounded-lg p-4">
          <Text className="text-sm font-semibold text-foreground mb-3">
            問題一覧（{answeredCount}/{TOTAL_QUESTIONS}）
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {selectedQuestions.map((q, index) => (
              <Pressable
                key={q.id}
                onPress={() => setCurrentQuestionIndex(index)}
                className={`w-12 h-12 rounded-lg items-center justify-center border ${
                  index === currentQuestionIndex
                    ? "bg-primary border-primary"
                    : q.id in answers
                      ? "bg-success border-success"
                      : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`font-bold ${
                    index === currentQuestionIndex || q.id in answers
                      ? "text-white"
                      : "text-foreground"
                  }`}
                >
                  {index + 1}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Finish button */}
        <Pressable
          onPress={handleFinishExam}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            },
          ]}
          className="p-4 rounded-lg bg-primary mb-4"
        >
          <Text className="text-center text-white font-bold text-lg">
            試験を終了する
          </Text>
        </Pressable>

        {/* Cancel button */}
        <Pressable
          onPress={() => {
            Alert.alert(
              "試験を中止しますか？",
              "現在の回答は保存されません。",
              [
                {
                  text: "キャンセル",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "中止する",
                  onPress: () => router.back(),
                  style: "destructive",
                },
              ]
            );
          }}
          className="p-4 rounded-lg bg-surface border border-border"
        >
          <Text className="text-center text-foreground font-semibold">
            中止する
          </Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
