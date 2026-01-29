import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  Pressable,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { ExtractedQuestion, ocrExtraction } from '@/lib/ocr-extraction';
import { pastQuestionsManager, PastQuestionSet } from '@/lib/past-questions';
// ID生成関数
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default function ReviewExtractedQuestionsScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [questions, setQuestions] = useState<ExtractedQuestion[]>([]);
  const [setName, setSetName] = useState('');
  const [setYear, setSetYear] = useState(new Date().getFullYear().toString());
  const [setSeason, setSetSeason] = useState<'spring' | 'autumn'>('spring');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<ExtractedQuestion | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

    if (editingQuestion.answer === null) {
      Alert.alert('エラー', '答えを選択してください');
      return;
    }

    const updated = [...questions];
    updated[editingIndex] = editingQuestion;
    setQuestions(updated);
    setShowEditModal(false);
    setEditingIndex(null);
    setEditingQuestion(null);
  };

  // 問題セットを保存
  const handleSaveQuestionSet = async () => {
    if (questions.length === 0) {
      Alert.alert('エラー', '問題がありません');
      return;
    }

    if (!setName || setName.trim().length === 0) {
      Alert.alert('エラー', 'セット名を入力してください');
      return;
    }

    setIsSaving(true);

    try {
      // 抽出された問題をQuestion型に変換
      const convertedQuestions = ocrExtraction.convertToQuestions(
        questions,
        '過去問題',
        setName
      );

      // 問題セットを作成
      const questionSet: PastQuestionSet = {
        id: generateId(),
        name: setName.trim(),
        year: parseInt(setYear, 10),
        season: setSeason,
        questions: convertedQuestions,
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      // 保存
      await pastQuestionsManager.savePastQuestionSet(questionSet);
      await pastQuestionsManager.activatePastQuestionSet(questionSet.id);

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

  // 信頼度でフィルタリング
  const lowConfidenceQuestions = questions.filter(q => q.confidence < 0.80);
  const validQuestions = questions.filter(q => q.answer !== null);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-4 gap-4">
          <Text className="text-2xl font-bold text-foreground">
            抽出結果の確認
          </Text>

          {/* 統計情報 */}
          <View className="bg-surface rounded-lg p-4 gap-2">
            <View className="flex-row justify-between">
              <Text className="text-muted">総問題数:</Text>
              <Text className="font-bold text-foreground">{questions.length}問</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted">有効な問題:</Text>
              <Text className="font-bold text-foreground">{validQuestions.length}問</Text>
            </View>
            {lowConfidenceQuestions.length > 0 && (
              <View className="flex-row justify-between">
                <Text className="text-muted">信頼度が低い:</Text>
                <Text className="font-bold text-warning">{lowConfidenceQuestions.length}問</Text>
              </View>
            )}
            <View className="flex-row justify-between">
              <Text className="text-muted">平均信頼度:</Text>
              <Text className="font-bold text-foreground">
                {(
                  (questions.reduce((sum, q) => sum + q.confidence, 0) / questions.length) *
                  100
                ).toFixed(1)}%
              </Text>
            </View>
          </View>

          {/* セット情報入力 */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              問題セット情報
            </Text>

            <View>
              <Text className="text-sm text-muted mb-1">セット名 *</Text>
              <TextInput
                value={setName}
                onChangeText={setSetName}
                placeholder="例: 令和5年春期"
                placeholderTextColor={colors.muted}
                className="bg-surface border border-border rounded-lg p-3 text-foreground"
              />
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-sm text-muted mb-1">年</Text>
                <TextInput
                  value={setYear}
                  onChangeText={setSetYear}
                  placeholder="2024"
                  placeholderTextColor={colors.muted}
                  keyboardType="number-pad"
                  className="bg-surface border border-border rounded-lg p-3 text-foreground"
                />
              </View>

              <View className="flex-1">
                <Text className="text-sm text-muted mb-1">季節</Text>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => setSetSeason('spring')}
                    style={{
                      backgroundColor: setSeason === 'spring' ? colors.primary : colors.surface,
                      borderWidth: 1,
                      borderColor: setSeason === 'spring' ? colors.primary : colors.border,
                    }}
                    className="flex-1 rounded-lg p-2"
                  >
                    <Text
                      className={`text-center font-medium ${
                        setSeason === 'spring' ? 'text-white' : 'text-foreground'
                      }`}
                    >
                      春
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setSetSeason('autumn')}
                    style={{
                      backgroundColor: setSeason === 'autumn' ? colors.primary : colors.surface,
                      borderWidth: 1,
                      borderColor: setSeason === 'autumn' ? colors.primary : colors.border,
                    }}
                    className="flex-1 rounded-lg p-2"
                  >
                    <Text
                      className={`text-center font-medium ${
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

          {/* 問題一覧 */}
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">
              問題一覧
            </Text>

            {questions.length === 0 ? (
              <Text className="text-center text-muted py-4">
                問題がありません
              </Text>
            ) : (
              <FlatList
                data={questions}
                keyExtractor={(_, index) => index.toString()}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                  <View className="bg-surface rounded-lg p-3 mb-2 border border-border">
                    <View className="flex-row items-start justify-between mb-2">
                      <Text className="text-sm font-semibold text-muted">
                        {index + 1}. {item.answer ? '◯' : '×'}
                      </Text>
                      <Text className="text-xs text-muted">
                        信頼度: {(item.confidence * 100).toFixed(0)}%
                      </Text>
                    </View>

                    <Text className="text-foreground mb-2" numberOfLines={3}>
                      {item.text}
                    </Text>

                    <View className="flex-row gap-2">
                      <Pressable
                        onPress={() => handleEditQuestion(index)}
                        className="flex-1 bg-primary rounded p-2"
                      >
                        <Text className="text-center text-white text-sm font-medium">
                          編集
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => handleDeleteQuestion(index)}
                        className="flex-1 bg-error rounded p-2"
                      >
                        <Text className="text-center text-white text-sm font-medium">
                          削除
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              />
            )}
          </View>

          {/* 保存ボタン */}
          <View className="gap-2 mt-4">
            <Pressable
              onPress={handleSaveQuestionSet}
              disabled={questions.length === 0 || !setName || isSaving}
              style={({ pressed }) => [
                {
                  backgroundColor:
                    questions.length === 0 || !setName ? colors.muted : colors.primary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              className="rounded-lg p-4"
            >
              <Text className="text-center text-white font-semibold">
                {isSaving ? '保存中...' : '問題セットを保存'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              className="border border-border rounded-lg p-3"
            >
              <Text className="text-center text-foreground font-medium">
                戻る
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* 編集モーダル */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-2xl p-4 gap-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xl font-bold text-foreground">
                問題を編集
              </Text>
              <Pressable onPress={() => setShowEditModal(false)}>
                <Text className="text-2xl">✕</Text>
              </Pressable>
            </View>

            {editingQuestion && (
              <ScrollView className="max-h-96">
                <View className="gap-3">
                  {/* 問題文 */}
                  <View>
                    <Text className="text-sm text-muted mb-1">問題文 *</Text>
                    <TextInput
                      value={editingQuestion.text}
                      onChangeText={(text) =>
                        setEditingQuestion({ ...editingQuestion, text })
                      }
                      placeholder="問題文を入力"
                      placeholderTextColor={colors.muted}
                      multiline
                      numberOfLines={4}
                      className="bg-surface border border-border rounded-lg p-3 text-foreground"
                    />
                  </View>

                  {/* 答え */}
                  <View>
                    <Text className="text-sm text-muted mb-2">答え *</Text>
                    <View className="flex-row gap-2">
                      <Pressable
                        onPress={() =>
                          setEditingQuestion({ ...editingQuestion, answer: true })
                        }
                        style={{
                          backgroundColor:
                            editingQuestion.answer === true ? colors.primary : colors.surface,
                          borderWidth: 1,
                          borderColor:
                            editingQuestion.answer === true ? colors.primary : colors.border,
                        }}
                        className="flex-1 rounded-lg p-3"
                      >
                        <Text
                          className={`text-center font-semibold text-lg ${
                            editingQuestion.answer === true ? 'text-white' : 'text-foreground'
                          }`}
                        >
                          ◯
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() =>
                          setEditingQuestion({ ...editingQuestion, answer: false })
                        }
                        style={{
                          backgroundColor:
                            editingQuestion.answer === false ? colors.primary : colors.surface,
                          borderWidth: 1,
                          borderColor:
                            editingQuestion.answer === false ? colors.primary : colors.border,
                        }}
                        className="flex-1 rounded-lg p-3"
                      >
                        <Text
                          className={`text-center font-semibold text-lg ${
                            editingQuestion.answer === false ? 'text-white' : 'text-foreground'
                          }`}
                        >
                          ×
                        </Text>
                      </Pressable>
                    </View>
                  </View>

                  {/* 説明 */}
                  <View>
                    <Text className="text-sm text-muted mb-1">説明（オプション）</Text>
                    <TextInput
                      value={editingQuestion.explanation || ''}
                      onChangeText={(text) =>
                        setEditingQuestion({ ...editingQuestion, explanation: text })
                      }
                      placeholder="説明を入力"
                      placeholderTextColor={colors.muted}
                      multiline
                      numberOfLines={3}
                      className="bg-surface border border-border rounded-lg p-3 text-foreground"
                    />
                  </View>

                  {/* 信頼度 */}
                  <View className="bg-surface rounded-lg p-3">
                    <Text className="text-sm text-muted">
                      信頼度: {(editingQuestion.confidence * 100).toFixed(0)}%
                    </Text>
                  </View>

                  {/* ボタン */}
                  <View className="gap-2 mt-2">
                    <Pressable
                      onPress={handleSaveEdit}
                      style={{ backgroundColor: colors.primary }}
                      className="rounded-lg p-3"
                    >
                      <Text className="text-center text-white font-semibold">
                        保存
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => setShowEditModal(false)}
                      className="border border-border rounded-lg p-3"
                    >
                      <Text className="text-center text-foreground font-medium">
                        キャンセル
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
