import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  Pressable,
  FlatList,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { ExtractedQuestion, ocrExtraction } from '@/lib/ocr-extraction';
import { pastQuestionsManager, PastQuestionSet } from '@/lib/past-questions';
import { AVAILABLE_CATEGORIES, type Category } from '@/lib/category-classifier';
import { trpc } from '@/lib/trpc';

// ID生成関数
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

interface QuestionWithCategory extends ExtractedQuestion {
  category?: Category;
  categoryConfidence?: number;
  categoryReasoning?: string;
}

export default function ReviewExtractedQuestionsWithClassifierScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [questions, setQuestions] = useState<QuestionWithCategory[]>([]);
  const [setName, setSetName] = useState('');
  const [setYear, setSetYear] = useState(new Date().getFullYear().toString());
  const [setSeason, setSetSeason] = useState<'spring' | 'autumn'>('spring');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuestionWithCategory | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationProgress, setClassificationProgress] = useState(0);

  // tRPC mutation
  const classifyMutation = trpc.categoryClassifier.classifyQuestions.useMutation();

  useEffect(() => {
    // パラメータから抽出された問題を取得
    if (params.questions) {
      try {
        const parsed = JSON.parse(params.questions as string);
        setQuestions(parsed);
      } catch (error) {
        Alert.alert('エラー', '問題の解析に失敗しました');
        router.back();
      }
    }
  }, [params.questions]);

  // 問題を削除
  const handleDeleteQuestion = (index: number) => {
    Alert.alert(
      '確認',
      'この問題を削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            setQuestions(prev => prev.filter((_, i) => i !== index));
          },
        },
      ]
    );
  };

  // 問題を編集
  const handleEditQuestion = (index: number) => {
    setEditingIndex(index);
    setEditingQuestion({ ...questions[index] });
    setShowEditModal(true);
  };

  // 編集を保存
  const handleSaveEdit = () => {
    if (!editingQuestion || editingIndex === null) return;

    if (!editingQuestion.text || editingQuestion.text.trim().length === 0) {
      Alert.alert('エラー', '問題文を入力してください');
      return;
    }

    setQuestions(prev => {
      const updated = [...prev];
      updated[editingIndex!] = editingQuestion;
      return updated;
    });

    setShowEditModal(false);
    setEditingQuestion(null);
    setEditingIndex(null);
  };

  // カテゴリ分類を実行
  const handleClassifyQuestions = useCallback(async () => {
    if (questions.length === 0) {
      Alert.alert('エラー', '問題がありません');
      return;
    }

    setIsClassifying(true);
    setClassificationProgress(0);

    try {
      const questionTexts = questions.map(q => q.text);
      
      // tRPC mutation を実行
      const result = await classifyMutation.mutateAsync({
        questions: questionTexts,
        batchSize: 5,
      });

      if (!result.success) {
        Alert.alert('エラー', result.error || 'カテゴリ分類に失敗しました');
        return;
      }

      // 分類結果を問題に統合
      if (result.data) {
        const updatedQuestions = questions.map((q, index) => ({
          ...q,
          category: result.data!.results[index].category,
          categoryConfidence: result.data!.results[index].confidence,
          categoryReasoning: result.data!.results[index].reasoning,
        }));

        setQuestions(updatedQuestions);

        // 統計情報を表示
        const stats = result.data.statistics;
        Alert.alert(
          '分類完了',
          `${stats.totalProcessed}問を分類しました\n平均信頼度: ${(stats.averageConfidence * 100).toFixed(1)}%`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('エラー', `分類中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsClassifying(false);
      setClassificationProgress(0);
    }
  }, [questions, classifyMutation]);

  // 問題セットを保存
  const handleSaveQuestionSet = async () => {
    if (!setName.trim()) {
      Alert.alert('エラー', 'セット名を入力してください');
      return;
    }

    if (questions.length === 0) {
      Alert.alert('エラー', '最低1問は必要です');
      return;
    }

    setIsSaving(true);

    try {
      // ExtractedQuestionをQuestion型に変換
      const convertedQuestions = questions.map(q => ({
        id: Math.random(),
        text: q.text,
        answer: q.answer ?? true,
        explanation: q.categoryReasoning || '自動分類された問題です',
        category: q.category || '未分類',
      }));

      const newSet: PastQuestionSet = {
        id: `past_${Date.now()}`,
        name: setName,
        year: parseInt(setYear),
        season: setSeason,
        questions: convertedQuestions,
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      await pastQuestionsManager.savePastQuestionSet(newSet);
      await pastQuestionsManager.activatePastQuestionSet(newSet.id);

      Alert.alert(
        '成功',
        `${convertedQuestions.length}問を保存しました`,
        [
          {
            text: 'OK',
            onPress: () => {
              router.navigate('/(tabs)' as any);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('エラー', `保存に失敗しました: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const renderQuestionItem = ({ item, index }: { item: QuestionWithCategory; index: number }) => (
    <View className="mb-3 p-4 rounded-lg border border-border bg-surface">
      <View className="mb-2 flex-row items-start justify-between">
        <Text className="flex-1 text-sm font-semibold text-foreground">
          問題 {index + 1}
        </Text>
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => handleEditQuestion(index)}
            className="px-3 py-1 rounded bg-primary"
          >
            <Text className="text-xs font-semibold text-white">編集</Text>
          </Pressable>
          <Pressable
            onPress={() => handleDeleteQuestion(index)}
            className="px-3 py-1 rounded bg-error"
          >
            <Text className="text-xs font-semibold text-white">削除</Text>
          </Pressable>
        </View>
      </View>

      <Text className="mb-2 text-base text-foreground">{item.text}</Text>

      <View className="mb-2 flex-row items-center gap-2">
        <Text className="text-xs font-semibold text-muted">答え:</Text>
        <Text className="text-sm font-semibold text-foreground">
          {item.answer ? '◯' : '×'}
        </Text>
      </View>

      {item.category && (
        <View className="mb-2 rounded bg-primary/10 p-2">
          <Text className="text-xs font-semibold text-primary">
            カテゴリ: {item.category}
          </Text>
          {item.categoryConfidence !== undefined && (
            <Text className="text-xs text-muted">
              信頼度: {(item.categoryConfidence * 100).toFixed(1)}%
            </Text>
          )}
          {item.categoryReasoning && (
            <Text className="mt-1 text-xs text-muted">{item.categoryReasoning}</Text>
          )}
        </View>
      )}
    </View>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-4">
          {/* ヘッダー */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">
              抽出結果の確認・編集
            </Text>
            <Text className="text-sm text-muted">
              {questions.length}問が抽出されました
            </Text>
          </View>

          {/* カテゴリ分類ボタン */}
          <Pressable
            onPress={handleClassifyQuestions}
            disabled={isClassifying || questions.length === 0}
            className={`px-4 py-3 rounded-lg ${
              isClassifying || questions.length === 0
                ? 'bg-muted opacity-50'
                : 'bg-blue-500'
            }`}
          >
            {isClassifying ? (
              <View className="flex-row items-center justify-center gap-2">
                <ActivityIndicator color="white" size="small" />
                <Text className="text-center font-semibold text-white">
                  分類中... {classificationProgress}%
                </Text>
              </View>
            ) : (
              <Text className="text-center font-semibold text-white">
                🤖 AIでカテゴリを自動分類
              </Text>
            )}
          </Pressable>

          {/* 問題一覧 */}
          <View>
            <Text className="mb-2 text-lg font-bold text-foreground">問題一覧</Text>
            <FlatList
              data={questions}
              renderItem={renderQuestionItem}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={false}
            />
          </View>

          {/* セット情報フォーム */}
          <View className="gap-3 rounded-lg border border-border bg-surface p-4">
            <View>
              <Text className="mb-1 text-sm font-semibold text-foreground">
                セット名
              </Text>
              <TextInput
                placeholder="例：令和5年度秋期"
                value={setName}
                onChangeText={setSetName}
                className="rounded border border-border px-3 py-2 text-foreground"
                placeholderTextColor="#999"
              />
            </View>

            <View className="flex-row gap-2">
              <View className="flex-1">
                <Text className="mb-1 text-sm font-semibold text-foreground">年</Text>
                <TextInput
                  placeholder="2024"
                  value={setYear}
                  onChangeText={setSetYear}
                  keyboardType="numeric"
                  className="rounded border border-border px-3 py-2 text-foreground"
                  placeholderTextColor="#999"
                />
              </View>

              <View className="flex-1">
                <Text className="mb-1 text-sm font-semibold text-foreground">時期</Text>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => setSetSeason('spring')}
                    className={`flex-1 rounded py-2 ${
                      setSeason === 'spring' ? 'bg-primary' : 'border border-border bg-surface'
                    }`}
                  >
                    <Text
                      className={`text-center text-sm font-semibold ${
                        setSeason === 'spring' ? 'text-white' : 'text-foreground'
                      }`}
                    >
                      春
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setSetSeason('autumn')}
                    className={`flex-1 rounded py-2 ${
                      setSeason === 'autumn' ? 'bg-primary' : 'border border-border bg-surface'
                    }`}
                  >
                    <Text
                      className={`text-center text-sm font-semibold ${
                        setSeason === 'autumn' ? 'text-white' : 'text-foreground'
                      }`}
                    >
                      秋
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          {/* 保存ボタン */}
          <Pressable
            onPress={handleSaveQuestionSet}
            disabled={isSaving || questions.length === 0}
            className={`rounded-lg px-4 py-3 ${
              isSaving || questions.length === 0 ? 'bg-muted opacity-50' : 'bg-primary'
            }`}
          >
            {isSaving ? (
              <View className="flex-row items-center justify-center gap-2">
                <ActivityIndicator color="white" size="small" />
                <Text className="font-semibold text-white">保存中...</Text>
              </View>
            ) : (
              <Text className="text-center font-semibold text-white">
                ✓ 問題セットを保存
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {/* 編集モーダル */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50">
          <View className="mt-auto rounded-t-2xl bg-background p-4">
            <Text className="mb-4 text-lg font-bold text-foreground">問題を編集</Text>

            <View className="mb-4">
              <Text className="mb-1 text-sm font-semibold text-foreground">問題文</Text>
              <TextInput
                value={editingQuestion?.text || ''}
                onChangeText={text => {
                  if (editingQuestion) {
                    setEditingQuestion({ ...editingQuestion, text });
                  }
                }}
                multiline
                numberOfLines={4}
                className="rounded border border-border px-3 py-2 text-foreground"
                placeholderTextColor="#999"
              />
            </View>

            <View className="mb-4">
              <Text className="mb-1 text-sm font-semibold text-foreground">答え</Text>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => {
                    if (editingQuestion) {
                      setEditingQuestion({ ...editingQuestion, answer: true });
                    }
                  }}
                  className={`flex-1 rounded py-2 ${
                    editingQuestion?.answer ? 'bg-primary' : 'border border-border bg-surface'
                  }`}
                >
                  <Text
                    className={`text-center font-semibold ${
                      editingQuestion?.answer ? 'text-white' : 'text-foreground'
                    }`}
                  >
                    ◯
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    if (editingQuestion) {
                      setEditingQuestion({ ...editingQuestion, answer: false });
                    }
                  }}
                  className={`flex-1 rounded py-2 ${
                    !editingQuestion?.answer ? 'bg-primary' : 'border border-border bg-surface'
                  }`}
                >
                  <Text
                    className={`text-center font-semibold ${
                      !editingQuestion?.answer ? 'text-white' : 'text-foreground'
                    }`}
                  >
                    ×
                  </Text>
                </Pressable>
              </View>
            </View>

            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setShowEditModal(false)}
                className="flex-1 rounded-lg border border-border bg-surface py-3"
              >
                <Text className="text-center font-semibold text-foreground">キャンセル</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveEdit}
                className="flex-1 rounded-lg bg-primary py-3"
              >
                <Text className="text-center font-semibold text-white">保存</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
