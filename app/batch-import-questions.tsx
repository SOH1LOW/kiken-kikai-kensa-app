import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  Pressable,
  FlatList,
  Modal,
  ActivityIndicator,
  Dimensions,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import {
  BatchProcessor,
  BatchFile,
  BatchProgress,
  BatchProcessingResult,
  BatchStatistics,
} from '@/lib/batch-file-processor';
import { parseAnswerKey } from '@/lib/answer-key-parser';

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default function BatchImportQuestionsScreen() {
  const colors = useColors();
  const router = useRouter();

  const [files, setFiles] = useState<BatchFile[]>([]);
  const [processor] = useState(() => new BatchProcessor());
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProgress, setCurrentProgress] = useState<Map<string, BatchProgress>>(new Map());
  const [results, setResults] = useState<BatchProcessingResult[]>([]);
  const [statistics, setStatistics] = useState<BatchStatistics | null>(null);
  const [answerKeys, setAnswerKeys] = useState<Map<string, string>>(new Map());
  const [showAnswerKeyModal, setShowAnswerKeyModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [currentAnswerKeyInput, setCurrentAnswerKeyInput] = useState('');

  // ファイルを選択
  const handleSelectFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'text/*'],
        multiple: true,
      });

      if (result.assets && result.assets.length > 0) {
        const newFiles: BatchFile[] = result.assets.map((asset) => ({
          id: generateId(),
          name: asset.name || 'Unknown',
          uri: asset.uri,
          type: asset.mimeType?.includes('pdf')
            ? 'pdf'
            : asset.mimeType?.includes('image')
              ? 'image'
              : 'text',
          size: asset.size || 0,
          status: 'pending' as const,
          progress: 0,
        }));

        setFiles((prev) => [...prev, ...newFiles]);
        processor.addFiles(newFiles);

        // 各ファイルの進捗コールバックを登録
        newFiles.forEach((file) => {
          processor.onProgress(file.id, (progress) => {
            setCurrentProgress((prev) => new Map(prev).set(file.id, progress));
          });
        });
      }
    } catch (error) {
      Alert.alert('エラー', 'ファイル選択に失敗しました');
    }
  };

  // ファイルを削除
  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    processor.clear();
  };

  // 答えキーを入力
  const handleSetAnswerKey = (fileId: string) => {
    setSelectedFileId(fileId);
    setShowAnswerKeyModal(true);
  };

  // 答えキーを保存
  const handleSaveAnswerKey = (answerKey: string) => {
    if (selectedFileId) {
      setAnswerKeys((prev) => new Map(prev).set(selectedFileId, answerKey));
    }
    setShowAnswerKeyModal(false);
    setSelectedFileId(null);
  };

  // 全ファイルを処理
  const handleProcessAll = async () => {
    if (files.length === 0) {
      Alert.alert('エラー', 'ファイルを選択してください');
      return;
    }

    setIsProcessing(true);

    try {
      const { results: processResults, statistics: stats } = await processor.processAll(answerKeys);

      setResults(processResults);
      setStatistics(stats);
      setShowResults(true);

      Alert.alert(
        '処理完了',
        `${stats.totalFiles}個のファイルを処理しました\n合計${stats.totalQuestions}問を抽出しました`
      );
    } catch (error) {
      Alert.alert('エラー', `処理中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderFileItem = ({ item }: { item: BatchFile }) => {
    const progress = currentProgress.get(item.id);
    const answerKey = answerKeys.get(item.id);

    return (
      <View className="mb-3 rounded-lg border border-border bg-surface p-4">
        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="font-semibold text-foreground">{item.name}</Text>
            <Text className="text-xs text-muted">
              {(item.size / 1024).toFixed(1)} KB • {item.type.toUpperCase()}
            </Text>
          </View>
          <Pressable
            onPress={() => handleRemoveFile(item.id)}
            className="rounded bg-error px-2 py-1"
          >
            <Text className="text-xs font-semibold text-white">削除</Text>
          </Pressable>
        </View>

        {progress && (
          <View className="mb-2">
            <Text className="mb-1 text-xs text-muted">
              {progress.currentStep === 'extracting' && '抽出中...'}
              {progress.currentStep === 'classifying' && 'カテゴリ分類中...'}
              {progress.currentStep === 'applying-answers' && '答え適用中...'}
              {progress.currentStep === 'completed' && '完了'}
            </Text>
            <View className="h-2 overflow-hidden rounded-full bg-border">
              <View
                className="h-full bg-primary"
                style={{ width: `${progress.progress}%` }}
              />
            </View>
            <Text className="mt-1 text-xs text-muted">
              {progress.extractedCount}問抽出
              {progress.classifiedCount > 0 && ` • ${progress.classifiedCount}問分類済み`}
              {progress.answeredCount > 0 && ` • ${progress.answeredCount}問回答済み`}
            </Text>
          </View>
        )}

        <View className="flex-row gap-2">
          <Pressable
            onPress={() => handleSetAnswerKey(item.id)}
            className={`flex-1 rounded py-2 ${
              answerKey ? 'bg-green-600' : 'border border-border bg-surface'
            }`}
          >
            <Text
              className={`text-center text-xs font-semibold ${
                answerKey ? 'text-white' : 'text-foreground'
              }`}
            >
              {answerKey ? '✓ 答えキー設定済み' : '答えキーを設定'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderResultItem = ({ item }: { item: BatchProcessingResult }) => (
    <View className="mb-3 rounded-lg border border-border bg-surface p-4">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="flex-1 font-semibold text-foreground">{item.fileName}</Text>
        {item.success ? (
          <View className="rounded-full bg-green-100 px-2 py-1">
            <Text className="text-xs font-semibold text-green-800">成功</Text>
          </View>
        ) : (
          <View className="rounded-full bg-red-100 px-2 py-1">
            <Text className="text-xs font-semibold text-red-800">失敗</Text>
          </View>
        )}
      </View>

      {item.success ? (
        <View className="gap-1">
          <Text className="text-sm text-foreground">
            📝 {item.questions.length}問抽出
          </Text>
          {item.categorized && <Text className="text-sm text-foreground">✓ カテゴリ分類済み</Text>}
          {item.answersApplied && <Text className="text-sm text-foreground">✓ 答え適用済み</Text>}
        </View>
      ) : (
        <Text className="text-sm text-error">{item.error}</Text>
      )}
    </View>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-4">
          {/* ヘッダー */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">複数ファイルをインポート</Text>
            <Text className="text-sm text-muted">
              複数のPDF・画像ファイルを一度に処理できます
            </Text>
          </View>

          {/* ファイル選択ボタン */}
          <Pressable
            onPress={handleSelectFiles}
            disabled={isProcessing}
            className={`rounded-lg px-4 py-3 ${
              isProcessing ? 'bg-muted opacity-50' : 'bg-blue-600'
            }`}
          >
            <Text className="text-center font-semibold text-white">
              + ファイルを選択（複数可）
            </Text>
          </Pressable>

          {/* ファイル一覧 */}
          {files.length > 0 && (
            <View>
              <Text className="mb-2 text-lg font-bold text-foreground">
                選択済みファイル（{files.length}個）
              </Text>
              <FlatList
                data={files}
                renderItem={renderFileItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* 統計情報 */}
          {statistics && (
            <View className="rounded-lg bg-blue-50 p-4">
              <Text className="mb-2 font-bold text-blue-900">処理結果</Text>
              <View className="gap-1">
                <Text className="text-sm text-blue-800">
                  処理済み: {statistics.processedFiles}/{statistics.totalFiles}ファイル
                </Text>
                <Text className="text-sm text-blue-800">
                  合計問題数: {statistics.totalQuestions}問
                </Text>
                <Text className="text-sm text-blue-800">
                  平均: {statistics.averageQuestionsPerFile.toFixed(1)}問/ファイル
                </Text>
                <Text className="text-sm text-blue-800">
                  処理時間: {(statistics.duration / 1000).toFixed(1)}秒
                </Text>
              </View>
            </View>
          )}

          {/* 処理ボタン */}
          {files.length > 0 && !showResults && (
            <Pressable
              onPress={handleProcessAll}
              disabled={isProcessing}
              className={`rounded-lg px-4 py-3 ${
                isProcessing ? 'bg-muted opacity-50' : 'bg-green-600'
              }`}
            >
              {isProcessing ? (
                <View className="flex-row items-center justify-center gap-2">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="font-semibold text-white">処理中...</Text>
                </View>
              ) : (
                <Text className="text-center font-semibold text-white">
                  🚀 全ファイルを処理
                </Text>
              )}
            </Pressable>
          )}

          {/* 結果一覧 */}
          {showResults && results.length > 0 && (
            <View>
              <Text className="mb-2 text-lg font-bold text-foreground">処理結果詳細</Text>
              <FlatList
                data={results}
                renderItem={renderResultItem}
                keyExtractor={(item) => item.fileId}
                scrollEnabled={false}
              />

              <Pressable
                onPress={() => {
                  setFiles([]);
                  setResults([]);
                  setStatistics(null);
                  setShowResults(false);
                  setAnswerKeys(new Map());
                  processor.clear();
                }}
                className="mt-4 rounded-lg bg-primary px-4 py-3"
              >
                <Text className="text-center font-semibold text-white">新しいバッチを開始</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 答えキー入力モーダル */}
      <Modal visible={showAnswerKeyModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50">
          <View className="mt-auto rounded-t-2xl bg-background p-4">
            <Text className="mb-4 text-lg font-bold text-foreground">答えキーを入力</Text>

            <View className="mb-4 rounded-lg bg-surface p-3">
              <Text className="mb-2 text-xs font-semibold text-muted">
                サポートされる形式:
              </Text>
              <Text className="text-xs text-muted">
                • ◯×◯×... (円記号)\n• 正誤正誤... (日本語)\n• TFTF... (英字)\n•
                スペースや改行は自動削除
              </Text>
            </View>

            <View className="mb-4">
              <Text className="mb-1 text-sm font-semibold text-foreground">答えキー</Text>
              <TextInput
                multiline
                numberOfLines={3}
                value={currentAnswerKeyInput}
                onChangeText={setCurrentAnswerKeyInput}
                className="rounded border border-border px-3 py-2 text-foreground"
                placeholder="例: ◯◯×◯×◯..."
                placeholderTextColor="#999"
              />
            </View>

            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setShowAnswerKeyModal(false)}
                className="flex-1 rounded-lg border border-border bg-surface py-3"
              >
                <Text className="text-center font-semibold text-foreground">キャンセル</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (selectedFileId) {
                    handleSaveAnswerKey('◯◯×◯×');
                  }
                }}
                className="flex-1 rounded-lg bg-green-600 py-3"
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
