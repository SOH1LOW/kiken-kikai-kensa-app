/**
 * レスポンシブデザインサービス
 * デバイスの画面サイズに応じてレイアウトを最適化
 */

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface BreakpointConfig {
  mobile: { min: number; max: number };
  tablet: { min: number; max: number };
  desktop: { min: number; max: number };
}

export interface ResponsiveConfig {
  breakpoints: BreakpointConfig;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
  screenWidth: number;
  screenHeight: number;
  isPortrait: boolean;
  isLandscape: boolean;
}

const DEFAULT_BREAKPOINTS: BreakpointConfig = {
  mobile: { min: 0, max: 767 },
  tablet: { min: 768, max: 1024 },
  desktop: { min: 1025, max: Infinity },
};

/**
 * レスポンシブサービス
 */
export class ResponsiveService {
  private breakpoints: BreakpointConfig;
  private listeners: Set<(config: ResponsiveConfig) => void> = new Set();
  private resizeObserver: ResizeObserver | null = null;
  private currentConfig: ResponsiveConfig | null = null;

  constructor(breakpoints: BreakpointConfig = DEFAULT_BREAKPOINTS) {
    this.breakpoints = breakpoints;
    this.updateConfig();
    this.setupListeners();
  }

  /**
   * 現在のレスポンシブ設定を取得
   */
  getConfig(): ResponsiveConfig {
    if (!this.currentConfig) {
      this.updateConfig();
    }
    return this.currentConfig!;
  }

  /**
   * デバイスタイプを取得
   */
  getDeviceType(): DeviceType {
    return this.getConfig().deviceType;
  }

  /**
   * 画面幅を取得
   */
  getScreenWidth(): number {
    return this.getConfig().screenWidth;
  }

  /**
   * 画面高さを取得
   */
  getScreenHeight(): number {
    return this.getConfig().screenHeight;
  }

  /**
   * モバイルデバイスかどうか
   */
  isMobile(): boolean {
    return this.getConfig().isMobile;
  }

  /**
   * タブレットデバイスかどうか
   */
  isTablet(): boolean {
    return this.getConfig().isTablet;
  }

  /**
   * デスクトップデバイスかどうか
   */
  isDesktop(): boolean {
    return this.getConfig().isDesktop;
  }

  /**
   * ポートレイト方向かどうか
   */
  isPortrait(): boolean {
    return this.getConfig().isPortrait;
  }

  /**
   * ランドスケープ方向かどうか
   */
  isLandscape(): boolean {
    return this.getConfig().isLandscape;
  }

  /**
   * リスナーを登録
   */
  subscribe(listener: (config: ResponsiveConfig) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * 設定を更新
   */
  private updateConfig(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    let deviceType: DeviceType = 'desktop';
    if (width <= this.breakpoints.mobile.max) {
      deviceType = 'mobile';
    } else if (width <= this.breakpoints.tablet.max) {
      deviceType = 'tablet';
    }

    const isPortrait = height > width;

    this.currentConfig = {
      breakpoints: this.breakpoints,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop',
      deviceType,
      screenWidth: width,
      screenHeight: height,
      isPortrait,
      isLandscape: !isPortrait,
    };

    this.notifyListeners();
  }

  /**
   * リスナーに通知
   */
  private notifyListeners(): void {
    if (!this.currentConfig) return;

    this.listeners.forEach((listener) => {
      listener(this.currentConfig!);
    });
  }

  /**
   * リスナーをセットアップ
   */
  private setupListeners(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // リサイズイベント
    const handleResize = () => {
      this.updateConfig();
    };

    window.addEventListener('resize', handleResize);

    // オリエンテーション変更イベント
    window.addEventListener('orientationchange', handleResize);

    // ResizeObserverをサポートしている場合
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateConfig();
      });

      if (document.documentElement) {
        this.resizeObserver.observe(document.documentElement);
      }
    }
  }

  /**
   * クリーンアップ
   */
  destroy(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.removeEventListener('resize', this.updateConfig.bind(this));
    window.removeEventListener('orientationchange', this.updateConfig.bind(this));

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    this.listeners.clear();
  }
}

// グローバルインスタンス
let globalResponsiveService: ResponsiveService | null = null;

/**
 * グローバルレスポンシブサービスを取得
 */
export function getResponsiveService(): ResponsiveService {
  if (!globalResponsiveService) {
    globalResponsiveService = new ResponsiveService();
  }
  return globalResponsiveService;
}

/**
 * レスポンシブサービスをリセット
 */
export function resetResponsiveService(): void {
  if (globalResponsiveService) {
    globalResponsiveService.destroy();
    globalResponsiveService = null;
  }
}
