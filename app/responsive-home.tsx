import { ScrollView, Text, View, Pressable, useWindowDimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useRouter } from 'expo-router';
import { ResponsiveConfig, getResponsiveService } from '@/lib/responsive-service';
import { isTouchDevice } from '@/lib/touch-utils';
import { cn } from '@/lib/utils';

/**
 * レスポンシブホーム画面
 * スマートフォン、タブレット、デスクトップで最適化されたレイアウト
 */
export default function ResponsiveHomeScreen() {
  const router = useRouter();
  const dimensions = useWindowDimensions();
  const [responsiveConfig, setResponsiveConfig] = useState<ResponsiveConfig | null>(null);
  const [isTouchEnabled, setIsTouchEnabled] = useState(false);

  useEffect(() => {
    const responsiveService = getResponsiveService();
    setResponsiveConfig(responsiveService.getConfig());
    setIsTouchEnabled(isTouchDevice());

    const unsubscribe = responsiveService.subscribe((config) => {
      setResponsiveConfig(config);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!responsiveConfig) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <Text className="text-foreground">読み込み中...</Text>
        </View>
      </ScreenContainer>
    );
  }

  const isMobile = responsiveConfig.isMobile;
  const isTablet = responsiveConfig.isTablet;
  const isDesktop = responsiveConfig.isDesktop;

  return (
    <ScreenContainer className={cn(
      isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8'
    )}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className={cn(
          'gap-6',
          isMobile && 'gap-4'
        )}>
          {/* ヘッダーセクション */}
          <View className={cn(
            'items-center gap-2',
            isMobile && 'gap-1'
          )}>
            <Text className={cn(
              'font-bold text-foreground',
              isMobile ? 'text-3xl' : isTablet ? 'text-4xl' : 'text-5xl'
            )}>
              機械検査3級 ◯×問題
            </Text>
            <Text className={cn(
              'text-muted text-center',
              isMobile ? 'text-sm' : 'text-base'
            )}>
              {isMobile && 'スマートフォンで学習'}
              {isTablet && 'タブレットで学習'}
              {isDesktop && 'Chromebookで学習'}
            </Text>
          </View>

          {/* 統計情報セクション */}
          <View className={cn(
            'gap-3',
            isMobile ? 'gap-2' : 'gap-4'
          )}>
            <Text className={cn(
              'font-semibold text-foreground',
              isMobile ? 'text-lg' : 'text-xl'
            )}>
              学習進捗
            </Text>

            {/* 統計カード */}
            <View className={cn(
              'flex-row gap-3',
              isMobile && 'gap-2'
            )}>
              <View className={cn(
                'flex-1 bg-surface rounded-lg p-4 items-center',
                isMobile && 'p-3'
              )}>
                <Text className="text-muted text-sm">回答数</Text>
                <Text className={cn(
                  'font-bold text-primary',
                  isMobile ? 'text-2xl' : 'text-3xl'
                )}>
                  0
                </Text>
              </View>

              <View className={cn(
                'flex-1 bg-surface rounded-lg p-4 items-center',
                isMobile && 'p-3'
              )}>
                <Text className="text-muted text-sm">正答率</Text>
                <Text className={cn(
                  'font-bold text-success',
                  isMobile ? 'text-2xl' : 'text-3xl'
                )}>
                  0%
                </Text>
              </View>

              <View className={cn(
                'flex-1 bg-surface rounded-lg p-4 items-center',
                isMobile && 'p-3'
              )}>
                <Text className="text-muted text-sm">連続</Text>
                <Text className={cn(
                  'font-bold text-warning',
                  isMobile ? 'text-2xl' : 'text-3xl'
                )}>
                  0
                </Text>
              </View>
            </View>
          </View>

          {/* クイックアクションセクション */}
          <View className={cn(
            'gap-3',
            isMobile ? 'gap-2' : 'gap-4'
          )}>
            <Text className={cn(
              'font-semibold text-foreground',
              isMobile ? 'text-lg' : 'text-xl'
            )}>
              クイックアクション
            </Text>

            {/* アクションボタン */}
            <View className={cn(
              'gap-2',
              isDesktop && 'flex-row flex-wrap'
            )}>
              <Pressable
                onPress={() => router.push('/past-questions-manager')}
                className={cn(
                  'bg-primary rounded-lg items-center justify-center',
                  isMobile ? 'py-3' : 'py-4',
                  isDesktop && 'flex-1 min-w-[200px]'
                )}
                style={({ pressed }) => [
                  pressed && { opacity: 0.8 }
                ]}
              >
                <Text className={cn(
                  'font-semibold text-background',
                  isMobile ? 'text-base' : 'text-lg'
                )}>
                  📚 過去問題を解く
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.push('/extract-from-file')}
                className={cn(
                  'bg-secondary rounded-lg items-center justify-center',
                  isMobile ? 'py-3' : 'py-4',
                  isDesktop && 'flex-1 min-w-[200px]'
                )}
                style={({ pressed }) => [
                  pressed && { opacity: 0.8 }
                ]}
              >
                <Text className={cn(
                  'font-semibold text-background',
                  isMobile ? 'text-base' : 'text-lg'
                )}>
                  📤 問題をインポート
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.push('/(tabs)')}
                className={cn(
                  'bg-tertiary rounded-lg items-center justify-center',
                  isMobile ? 'py-3' : 'py-4',
                  isDesktop && 'flex-1 min-w-[200px]'
                )}
                style={({ pressed }) => [
                  pressed && { opacity: 0.8 }
                ]}
              >
                <Text className={cn(
                  'font-semibold text-background',
                  isMobile ? 'text-base' : 'text-lg'
                )}>
                  ⚙️ 設定
                </Text>
              </Pressable>
            </View>
          </View>

          {/* デバイス情報セクション */}
          <View className={cn(
            'bg-surface rounded-lg p-4 gap-2',
            isMobile && 'p-3'
          )}>
            <Text className={cn(
              'font-semibold text-foreground',
              isMobile ? 'text-sm' : 'text-base'
            )}>
              📱 デバイス情報
            </Text>
            <Text className={cn(
              'text-muted',
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              {responsiveConfig.deviceType === 'mobile' && '📱 スマートフォン'}
              {responsiveConfig.deviceType === 'tablet' && '📱 タブレット'}
              {responsiveConfig.deviceType === 'desktop' && '🖥️ Chromebook/パソコン'}
            </Text>
            <Text className={cn(
              'text-muted',
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              画面: {responsiveConfig.screenWidth}×{responsiveConfig.screenHeight}
            </Text>
            <Text className={cn(
              'text-muted',
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              {responsiveConfig.isPortrait ? '📐 ポートレイト' : '📐 ランドスケープ'}
            </Text>
            {isTouchEnabled && (
              <Text className={cn(
                'text-muted',
                isMobile ? 'text-xs' : 'text-sm'
              )}>
                ✋ タッチ対応
              </Text>
            )}
          </View>

          {/* 使用方法セクション */}
          <View className={cn(
            'bg-surface rounded-lg p-4 gap-2',
            isMobile && 'p-3'
          )}>
            <Text className={cn(
              'font-semibold text-foreground',
              isMobile ? 'text-sm' : 'text-base'
            )}>
              💡 使用方法
            </Text>
            <Text className={cn(
              'text-muted leading-relaxed',
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              {isMobile && '1. 「過去問題を解く」で問題に挑戦\n2. 「問題をインポート」で新しい問題を追加\n3. 「設定」で学習進捗を確認'}
              {isTablet && '1. 左側で問題を選択、右側で詳細を表示\n2. ドラッグ&ドロップで問題をインポート\n3. キーボードショートカットで効率化'}
              {isDesktop && '1. 複数ウィンドウで問題一覧と詳細を同時表示\n2. Ctrl+Nで新規ウィンドウ、Ctrl+Dで削除\n3. 矢印キーでナビゲーション'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
