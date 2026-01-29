import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  Pressable,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { fileExtraction, FileExtractionResult } from '@/lib/file-extraction';
import { ocrExtraction, ExtractedQuestion } from '@/lib/ocr-extraction';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

interface FileWithPreview {
  file: File;
  preview?: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
}

export default function ExtractFromFileScreen() {
  const colors = useColors();
  const router = useRouter();

  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedQuestions, setExtractedQuestions] = useState<ExtractedQuestion[]>([]);
  const [step, setStep] = useState<'select' | 'preview' | 'review'>('select');

  // ドキュメントを選択
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain', 'text/csv'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      if (!asset.uri) return;

      // File オブジェクトを作成
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const file = new File([blob], asset.name || 'document', {
        type: asset.mimeType || 'application/octet-stream',
      });

      // ファイルを検証
      const validation = fileExtraction.validateFile(file);
      if (!validation.valid) {
        Alert.alert('エラー', validation.errors.join('\n'));
        return;
      }

      setSelectedFiles(prev => [
        ...prev,
        { file, status: 'pending' },
      ]);
    } catch (error) {
      Alert.alert('エラー', `ファイル選択に失敗しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // 画像を選択
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (result.canceled) return;

      for (const asset of result.assets) {
        if (!asset.uri) continue;

        const response = await fetch(asset.uri);
        const blob = await response.blob();
        const fileName = asset.uri.split('/').pop() || 'image.jpg';
        const file = new File([blob], fileName, { type: blob.type });

        // ファイルを検証
        const validation = fileExtraction.validateFile(file, 10, ['image']);
        if (!validation.valid) {
          Alert.alert('エラー', `${fileName}: ${validation.errors.join('\n')}`);
          continue;
        }

        setSelectedFiles(prev => [
          ...prev,
          { file, status: 'pending', preview: asset.uri },
        ]);
      }
    } catch (error) {
      Alert.alert('エラー', `画像選択に失敗しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // ファイルを削除
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // ファイルを処理
  const handleProcessFiles = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert('エラー', 'ファイルを選択してください');
      return;
    }

    setIsProcessing(true);
    setStep('preview');

    try {
      const allQuestions: ExtractedQuestion[] = [];
      const updatedFiles = [...selectedFiles];

      for (let i = 0; i < updatedFiles.length; i++) {
        updatedFiles[i].status = 'processing';
        setSelectedFiles([...updatedFiles]);

        const fileWithPreview = updatedFiles[i];
        const file = fileWithPreview.file;
        const fileType = fileExtraction.getFileType(file.name, file.type);

        try {
          let extractedText = '';

          if (fileType === 'text') {
            const result = await fileExtraction.readTextFile(file);
            extractedText = result.extractedText;
          } else if (fileType === 'image' || fileType === 'pdf') {
            // 画像またはPDFの場合、Base64に変換
            // 実際のOCR処理はサーバー側で行う（LLM使用）
            const base64 = fileType === 'image'
              ? await fileExtraction.imageToBase64(file)
              : await fileExtraction.pdfToBase64(file);

            // ここでは、テキストが含まれていると仮定
            // 実際にはサーバー側でOCR処理が必要
            extractedText = `[${fileType.toUpperCase()} ファイル: ${file.name}]\n`;
            extractedText += '注: このファイルはOCR処理が必要です。\n';
            extractedText += 'テキストが自動抽出されませんでした。\n';
          }

          if (extractedText) {
            const result = ocrExtraction.extractQuestionsFromText(extractedText);
            allQuestions.push(...result.extractedQuestions);
            updatedFiles[i].status = 'success';
          } else {
            updatedFiles[i].status = 'error';
            updatedFiles[i].error = 'テキストを抽出できませんでした';
          }
        } catch (error) {
          updatedFiles[i].status = 'error';
          updatedFiles[i].error = error instanceof Error ? error.message : String(error);
        }

        setSelectedFiles([...updatedFiles]);
      }

      setExtractedQuestions(allQuestions);
      setStep('review');
    } finally {
      setIsProcessing(false);
    }
  };

  // 抽出された問題を確認して保存
  const handleSaveQuestions = () => {
    if (extractedQuestions.length === 0) {
      Alert.alert('エラー', '有効な問題がありません');
      return;
    }

    // 抽出された問題をナビゲーション経由で渡す
    // router.pushの代わりにrouter.navigate()を使用
    router.navigate({
      pathname: '/review-extracted-questions',
      params: {
        questions: JSON.stringify(extractedQuestions),
      },
    } as any);
  };

  const renderSelectStep = () => (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 p-4 gap-4">
        <Text className="text-2xl font-bold text-foreground">
          ファイルから問題を抽出
        </Text>

        <Text className="text-base text-muted">
          PDF、画像、またはテキストファイルから◯×問題を自動抽出します。
        </Text>

        {/* ファイル選択ボタン */}
        <View className="gap-3">
          <Pressable
            onPress={handlePickDocument}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="rounded-lg p-4"
          >
            <Text className="text-center text-white font-semibold">
              📄 ドキュメント（PDF/テキスト）を選択
            </Text>
          </Pressable>

          <Pressable
            onPress={handlePickImage}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="rounded-lg p-4"
          >
            <Text className="text-center text-white font-semibold">
              🖼️ 画像を選択
            </Text>
          </Pressable>
        </View>

        {/* 選択されたファイル一覧 */}
        {selectedFiles.length > 0 && (
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">
              選択されたファイル ({selectedFiles.length})
            </Text>

            <FlatList
              data={selectedFiles}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View className="bg-surface rounded-lg p-3 mb-2 flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-foreground font-medium" numberOfLines={1}>
                      {item.file.name}
                    </Text>
                    <Text className="text-sm text-muted">
                      {(item.file.size / 1024).toFixed(1)} KB
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => handleRemoveFile(index)}
                    className="p-2"
                  >
                    <Text className="text-lg">✕</Text>
                  </Pressable>
                </View>
              )}
            />

            {/* 処理ボタン */}
            <Pressable
              onPress={handleProcessFiles}
              disabled={isProcessing}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  opacity: isProcessing ? 0.6 : pressed ? 0.8 : 1,
                },
              ]}
              className="rounded-lg p-4 mt-4"
            >
              <Text className="text-center text-white font-semibold">
                {isProcessing ? '処理中...' : '問題を抽出'}
              </Text>
            </Pressable>
          </View>
        )}

        {/* 戻るボタン */}
        <Pressable
          onPress={() => router.back()}
          className="border border-border rounded-lg p-3 mt-4"
        >
          <Text className="text-center text-foreground font-medium">
            キャンセル
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );

  const renderPreviewStep = () => (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 p-4 gap-4">
        <Text className="text-2xl font-bold text-foreground">
          ファイル処理中
        </Text>

        {selectedFiles.map((fileItem, index) => (
          <View key={index} className="bg-surface rounded-lg p-4">
            <View className="flex-row items-center gap-3 mb-2">
              {fileItem.status === 'processing' && (
                <ActivityIndicator color={colors.primary} />
              )}
              {fileItem.status === 'success' && (
                <Text className="text-2xl">✓</Text>
              )}
              {fileItem.status === 'error' && (
                <Text className="text-2xl">✕</Text>
              )}

              <View className="flex-1">
                <Text className="text-foreground font-medium" numberOfLines={1}>
                  {fileItem.file.name}
                </Text>
                {fileItem.error && (
                  <Text className="text-sm text-error">{fileItem.error}</Text>
                )}
              </View>
            </View>
          </View>
        ))}

        {isProcessing && (
          <View className="items-center gap-2 mt-4">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="text-muted">処理中...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderReviewStep = () => (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 p-4 gap-4">
        <Text className="text-2xl font-bold text-foreground">
          抽出結果の確認
        </Text>

        <View className="bg-surface rounded-lg p-4">
          <Text className="text-lg font-semibold text-foreground mb-2">
            抽出された問題
          </Text>
          <Text className="text-2xl font-bold text-primary">
            {extractedQuestions.length}問
          </Text>

          {extractedQuestions.length > 0 && (
            <View className="mt-4 gap-2">
              <Text className="text-sm text-muted">
                平均信頼度: {(
                  (extractedQuestions.reduce((sum, q) => sum + q.confidence, 0) /
                    extractedQuestions.length) *
                  100
                ).toFixed(1)}%
              </Text>

              {/* サンプル表示 */}
              <View className="mt-3 gap-2">
                <Text className="text-sm font-semibold text-foreground">
                  サンプル（最初の3問）:
                </Text>
                {extractedQuestions.slice(0, 3).map((q, index) => (
                  <View key={index} className="bg-background rounded p-2">
                    <Text className="text-sm text-foreground" numberOfLines={2}>
                      {index + 1}. {q.text}
                    </Text>
                    <Text className="text-xs text-muted mt-1">
                      答え: {q.answer ? '◯' : '×'} (信頼度: {(q.confidence * 100).toFixed(0)}%)
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* ボタン */}
        <View className="gap-3">
          <Pressable
            onPress={handleSaveQuestions}
            disabled={extractedQuestions.length === 0}
            style={({ pressed }) => [
              {
                backgroundColor: extractedQuestions.length === 0 ? colors.muted : colors.primary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="rounded-lg p-4"
          >
            <Text className="text-center text-white font-semibold">
              確認して保存
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setStep('select');
              setSelectedFiles([]);
              setExtractedQuestions([]);
            }}
            className="border border-border rounded-lg p-3"
          >
            <Text className="text-center text-foreground font-medium">
              別のファイルを選択
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <ScreenContainer className="bg-background">
      {step === 'select' && renderSelectStep()}
      {step === 'preview' && renderPreviewStep()}
      {step === 'review' && renderReviewStep()}
    </ScreenContainer>
  );
}
