import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, useWindowDimensions, Platform } from 'react-native';
import { useColors } from '@/hooks/use-colors';

/**
 * Chromebook対応レイアウト
 * 大画面デバイスに最適化されたレスポンシブレイアウト
 */

interface ChromebookLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  sidebarContent?: React.ReactNode;
}

export function ChromebookLayout({
  children,
  showSidebar = false,
  sidebarContent,
}: ChromebookLayoutProps) {
  const { width, height } = useWindowDimensions();
  const colors = useColors();
  const [isLandscape, setIsLandscape] = useState(width > height);
  const [isSidebarOpen, setIsSidebarOpen] = useState(showSidebar && width > 1024);

  // 画面向きの変更を監視
  useEffect(() => {
    setIsLandscape(width > height);
    setIsSidebarOpen(showSidebar && width > 1024);
  }, [width, height, showSidebar]);

  // Chromebookの大画面レイアウト
  if (width > 1024 && isLandscape) {
    return (
      <View className="flex-1 flex-row bg-background">
        {/* メインコンテンツ */}
        <View className="flex-1">{children}</View>

        {/* サイドバー */}
        {isSidebarOpen && sidebarContent && (
          <View
            className="border-l border-border bg-surface"
            style={{ width: Math.min(width * 0.3, 400) }}
          >
            {sidebarContent}
          </View>
        )}
      </View>
    );
  }

  // タブレット・中サイズ画面
  if (width > 768) {
    return (
      <View className="flex-1 bg-background">
        <View className="flex-1 px-6 py-4">{children}</View>
      </View>
    );
  }

  // スマートフォン・小さい画面
  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 px-4 py-3">{children}</View>
    </View>
  );
}

/**
 * Chromebook対応のツールバー
 */
interface ChromebookToolbarProps {
  title: string;
  subtitle?: string;
  actions?: Array<{
    label: string;
    icon?: string;
    onPress: () => void;
  }>;
}

export function ChromebookToolbar({ title, subtitle, actions }: ChromebookToolbarProps) {
  const colors = useColors();
  const { width } = useWindowDimensions();

  return (
    <View
      className="border-b border-border bg-surface px-6 py-4"
      style={{ minHeight: 64 }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-foreground">{title}</Text>
          {subtitle && <Text className="mt-1 text-sm text-muted">{subtitle}</Text>}
        </View>

        {actions && actions.length > 0 && (
          <View className="flex-row gap-2">
            {actions.map((action, index) => (
              <Pressable
                key={index}
                onPress={action.onPress}
                className="rounded-lg bg-primary px-4 py-2"
              >
                <Text className="font-semibold text-white">{action.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * Chromebook対応のグリッドレイアウト
 */
interface ChromebookGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
}

export function ChromebookGrid({ children, columns = 2, gap = 16 }: ChromebookGridProps) {
  const { width } = useWindowDimensions();

  // 画面幅に応じてカラム数を調整
  let computedColumns = columns;
  if (width < 768) {
    computedColumns = 1;
  } else if (width < 1024) {
    computedColumns = 2;
  } else {
    computedColumns = Math.min(columns, 4);
  }

  return (
    <View
      className="flex-wrap flex-row"
      style={{
        gap,
      }}
    >
      {React.Children.map(children, (child) => (
        <View style={{ width: `${100 / computedColumns}%`, paddingHorizontal: gap / 2 }}>
          {child}
        </View>
      ))}
    </View>
  );
}

/**
 * Chromebook対応のカード
 */
interface ChromebookCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onPress?: () => void;
  highlighted?: boolean;
}

export function ChromebookCard({
  title,
  subtitle,
  children,
  onPress,
  highlighted = false,
}: ChromebookCardProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-lg border p-4 ${
        highlighted ? 'border-primary bg-primary/10' : 'border-border bg-surface'
      }`}
    >
      <View className="mb-3">
        <Text className="text-lg font-bold text-foreground">{title}</Text>
        {subtitle && <Text className="mt-1 text-sm text-muted">{subtitle}</Text>}
      </View>
      {children}
    </Pressable>
  );
}

/**
 * Chromebook対応のサイドバー
 */
interface ChromebookSidebarProps {
  items: Array<{
    id: string;
    label: string;
    icon?: string;
    onPress: () => void;
    active?: boolean;
  }>;
}

export function ChromebookSidebar({ items }: ChromebookSidebarProps) {
  const colors = useColors();

  return (
    <View className="gap-2 p-4">
      {items.map((item) => (
        <Pressable
          key={item.id}
          onPress={item.onPress}
          className={`rounded-lg px-4 py-3 ${
            item.active ? 'bg-primary' : 'bg-surface'
          }`}
        >
          <Text className={`font-semibold ${item.active ? 'text-white' : 'text-foreground'}`}>
            {item.icon && <Text className="mr-2">{item.icon}</Text>}
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

/**
 * Chromebook対応のモーダル
 */
interface ChromebookModalProps {
  visible: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  actions?: Array<{
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}

export function ChromebookModal({
  visible,
  title,
  children,
  onClose,
  actions,
}: ChromebookModalProps) {
  if (!visible) {
    return null;
  }

  return (
    <View className="absolute inset-0 flex items-center justify-center bg-black/50">
      <View className="w-11/12 max-w-2xl rounded-lg bg-background p-6">
        <Text className="mb-4 text-2xl font-bold text-foreground">{title}</Text>

        <View className="mb-6">{children}</View>

        {actions && actions.length > 0 && (
          <View className="flex-row gap-3">
            {actions.map((action, index) => (
              <Pressable
                key={index}
                onPress={action.onPress}
                className={`flex-1 rounded-lg px-4 py-3 ${
                  action.variant === 'primary'
                    ? 'bg-primary'
                    : action.variant === 'danger'
                      ? 'bg-error'
                      : 'border border-border bg-surface'
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    action.variant === 'secondary' ? 'text-foreground' : 'text-white'
                  }`}
                >
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        <Pressable onPress={onClose} className="mt-4 rounded-lg border border-border p-3">
          <Text className="text-center font-semibold text-foreground">閉じる</Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * レスポンシブ判定ユーティリティ
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return {
    isSmallPhone: width < 375,
    isPhone: width < 768,
    isTablet: width >= 768 && width < 1024,
    isLargeTablet: width >= 1024 && width < 1280,
    isChromebook: width >= 1280,
    isLandscape: width > height,
    isPortrait: height > width,
    width,
    height,
  };
}
