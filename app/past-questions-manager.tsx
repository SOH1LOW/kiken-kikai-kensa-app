import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { pastQuestionsManager, PastQuestionSet } from '@/lib/past-questions';
import { Question } from '@/data/questions';

type Season = 'spring' | 'autumn';

interface FormData {
  name: string;
  year: string;
  season: Season;
}

export default function PastQuestionsManager() {
  const router = useRouter();
  const [sets, setSets] = useState<PastQuestionSet[]>([]);
  const [activeSets, setActiveSets] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    year: new Date().getFullYear().toString(),
    season: 'spring',
  });
  const [sampleQuestions, setSampleQuestions] = useState<string>('');

  useEffect(() => {
    loadPastQuestions();
  }, []);

  const loadPastQuestions = async () => {
    try {
      const allSets = await pastQuestionsManager.getPastQuestionSets();
      setSets(allSets);
      
      const state = await pastQuestionsManager.getState();
      setActiveSets(state.activeSets);
    } catch (error) {
      console.error('Failed to load past questions:', error);
    }
  };

  const handleAddQuestionSet = async () => {
    if (!formData.name.trim()) {
      Alert.alert('エラー', 'セット名を入力してください');
      return;
    }

    if (!sampleQuestions.trim()) {
      Alert.alert('エラー', '問題を入力してください');
      return;
    }

    try {
      // サンプル問題のパース（JSON形式を想定）
      let questions: Question[] = [];
      try {
        questions = JSON.parse(sampleQuestions);
      } catch {
        // 簡単な形式でのパース（1行1問）
        const lines = sampleQuestions.split('\n').filter(line => line.trim());
        questions = lines.map((line, index) => ({
          id: Math.random(),
          text: line.trim(),
          answer: true,
          explanation: '過去問題です',
          category: '過去問題',
        }));
      }

      const newSet: PastQuestionSet = {
        id: `past_${Date.now()}`,
        name: formData.name,
        year: parseInt(formData.year),
        season: formData.season,
        questions,
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      await pastQuestionsManager.savePastQuestionSet(newSet);
      await pastQuestionsManager.activatePastQuestionSet(newSet.id);

      Alert.alert('成功', `「${formData.name}」を追加しました`);
      
      setFormData({
        name: '',
        year: new Date().getFullYear().toString(),
        season: 'spring',
      });
      setSampleQuestions('');
      setShowForm(false);
      
      await loadPastQuestions();
    } catch (error) {
      console.error('Failed to add question set:', error);
      Alert.alert('エラー', '問題セットの追加に失敗しました');
    }
  };

  const handleToggleSet = async (id: string) => {
    try {
      if (activeSets.includes(id)) {
        await pastQuestionsManager.deactivatePastQuestionSet(id);
      } else {
        await pastQuestionsManager.activatePastQuestionSet(id);
      }
      await loadPastQuestions();
    } catch (error) {
      console.error('Failed to toggle set:', error);
    }
  };

  const handleDeleteSet = async (id: string) => {
    Alert.alert(
      '削除確認',
      'このセットを削除しますか？',
      [
        { text: 'キャンセル', onPress: () => {} },
        {
          text: '削除',
          onPress: async () => {
            try {
              await pastQuestionsManager.deletePastQuestionSet(id);
              await loadPastQuestions();
              Alert.alert('成功', 'セットを削除しました');
            } catch (error) {
              Alert.alert('エラー', 'セットの削除に失敗しました');
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-4">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">過去問題管理</Text>
            <Text className="text-sm text-muted">
              過去問題セットを追加・管理します
            </Text>
          </View>

          {/* Add Buttons */}
          <View className="gap-2">
            <Pressable
              onPress={() => setShowForm(!showForm)}
              className="px-4 py-3 rounded-lg bg-primary"
            >
              <Text className="text-center font-semibold text-white">
                {showForm ? 'キャンセル' : '+ 新しいセットを追加'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/extract-from-file')}
              className="px-4 py-3 rounded-lg bg-blue-500"
            >
              <Text className="text-center font-semibold text-white">
                📄 ファイルから問題を抽出
              </Text>
            </Pressable>
          </View>

          {/* Form */}
          {showForm && (
            <View className="gap-3 p-4 rounded-lg bg-surface border border-border">
              <View>
                <Text className="text-sm font-semibold text-foreground mb-1">
                  セット名
                </Text>
                <TextInput
                  placeholder="例：令和5年度秋期"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  className="px-3 py-2 rounded border border-border text-foreground"
                  placeholderTextColor="#999"
                />
              </View>

              <View className="flex-row gap-2">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground mb-1">
                    年
                  </Text>
                  <TextInput
                    placeholder="2024"
                    value={formData.year}
                    onChangeText={(text) => setFormData({ ...formData, year: text })}
                    keyboardType="numeric"
                    className="px-3 py-2 rounded border border-border text-foreground"
                    placeholderTextColor="#999"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground mb-1">
                    時期
                  </Text>
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => setFormData({ ...formData, season: 'spring' })}
                      className={`flex-1 py-2 rounded ${
                        formData.season === 'spring'
                          ? 'bg-primary'
                          : 'bg-surface border border-border'
                      }`}
                    >
                      <Text
                        className={`text-center text-sm font-semibold ${
                          formData.season === 'spring'
                            ? 'text-white'
                            : 'text-foreground'
                        }`}
                      >
                        春
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setFormData({ ...formData, season: 'autumn' })}
                      className={`flex-1 py-2 rounded ${
                        formData.season === 'autumn'
                          ? 'bg-primary'
                          : 'bg-surface border border-border'
                      }`}
                    >
                      <Text
                        className={`text-center text-sm font-semibold ${
                          formData.season === 'autumn'
                            ? 'text-white'
                            : 'text-foreground'
                        }`}
                      >
                        秋
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              <View>
                <Text className="text-sm font-semibold text-foreground mb-1">
                  問題（JSON形式またはテキスト）
                </Text>
                <TextInput
                  placeholder={`[{"text":"問題文","answer":true,"explanation":"解説"}]`}
                  value={sampleQuestions}
                  onChangeText={setSampleQuestions}
                  multiline
                  numberOfLines={6}
                  className="px-3 py-2 rounded border border-border text-foreground"
                  placeholderTextColor="#999"
                />
              </View>

              <Pressable
                onPress={handleAddQuestionSet}
                className="px-4 py-3 rounded-lg bg-success"
              >
                <Text className="text-center font-semibold text-white">
                  セットを追加
                </Text>
              </Pressable>
            </View>
          )}

          {/* Question Sets List */}
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">
              登録済みセット ({sets.length})
            </Text>

            {sets.length === 0 ? (
              <View className="p-4 rounded-lg bg-surface border border-border">
                <Text className="text-center text-muted">
                  登録済みのセットはありません
                </Text>
              </View>
            ) : (
              sets.map((set) => (
                <View
                  key={set.id}
                  className="p-3 rounded-lg bg-surface border border-border gap-2"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        {set.name}
                      </Text>
                      <Text className="text-xs text-muted">
                        {set.year}年 {set.season === 'spring' ? '春' : '秋'} • {set.questions.length}問
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => handleToggleSet(set.id)}
                      className={`px-3 py-1 rounded ${
                        activeSets.includes(set.id)
                          ? 'bg-primary'
                          : 'bg-border'
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          activeSets.includes(set.id)
                            ? 'text-white'
                            : 'text-foreground'
                        }`}
                      >
                        {activeSets.includes(set.id) ? '有効' : '無効'}
                      </Text>
                    </Pressable>
                  </View>

                  <Pressable
                    onPress={() => handleDeleteSet(set.id)}
                    className="px-3 py-2 rounded bg-error/10 border border-error"
                  >
                    <Text className="text-center text-xs font-semibold text-error">
                      削除
                    </Text>
                  </Pressable>
                </View>
              ))
            )}
          </View>

          {/* Info */}
          <View className="p-3 rounded-lg bg-primary/10 border border-primary">
            <Text className="text-xs text-foreground leading-relaxed">
              💡 有効なセットの問題はテスト時にランダムに出題されます。複数のセットを有効にすると、全セットの問題が対象になります。
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
