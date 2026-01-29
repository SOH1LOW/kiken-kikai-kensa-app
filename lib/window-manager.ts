/**
 * ウィンドウマネージャー
 * Chromebook上での複数ウィンドウ対応を管理
 */

/**
 * ウィンドウの種類
 */
export type WindowType = 'questions-list' | 'question-detail' | 'dashboard' | 'settings';

/**
 * ウィンドウの状態
 */
export interface WindowState {
  id: string;
  type: WindowType;
  title: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  data: Record<string, any>;
  isActive: boolean;
  isMinimized: boolean;
  zIndex: number;
}

/**
 * ウィンドウマネージャー
 */
export class WindowManager {
  private windows: Map<string, WindowState> = new Map();
  private activeWindowId: string | null = null;
  private nextZIndex = 1000;
  private listeners: Set<() => void> = new Set();

  /**
   * ウィンドウを作成
   */
  createWindow(
    type: WindowType,
    title: string,
    data: Record<string, any> = {},
    position?: Partial<WindowState['position']>
  ): string {
    const id = this.generateWindowId();
    const defaultPosition = this.getDefaultPosition(type);

    const window: WindowState = {
      id,
      type,
      title,
      position: {
        ...defaultPosition,
        ...position,
      },
      data,
      isActive: true,
      isMinimized: false,
      zIndex: this.nextZIndex++,
    };

    this.windows.set(id, window);
    this.activeWindowId = id;
    this.notifyListeners();

    console.log('[Window Manager] Window created:', id, type);
    return id;
  }

  /**
   * ウィンドウを取得
   */
  getWindow(id: string): WindowState | null {
    return this.windows.get(id) || null;
  }

  /**
   * すべてのウィンドウを取得
   */
  getAllWindows(): WindowState[] {
    return Array.from(this.windows.values()).sort((a, b) => a.zIndex - b.zIndex);
  }

  /**
   * ウィンドウを更新
   */
  updateWindow(id: string, updates: Partial<WindowState>): void {
    const window = this.windows.get(id);
    if (!window) {
      return;
    }

    Object.assign(window, updates);
    this.notifyListeners();

    console.log('[Window Manager] Window updated:', id);
  }

  /**
   * ウィンドウを閉じる
   */
  closeWindow(id: string): void {
    this.windows.delete(id);

    if (this.activeWindowId === id) {
      const remaining = this.getAllWindows();
      this.activeWindowId = remaining.length > 0 ? remaining[remaining.length - 1].id : null;
    }

    this.notifyListeners();
    console.log('[Window Manager] Window closed:', id);
  }

  /**
   * ウィンドウをアクティブにする
   */
  activateWindow(id: string): void {
    const window = this.windows.get(id);
    if (!window) {
      return;
    }

    // すべてのウィンドウを非アクティブに
    this.windows.forEach((w) => {
      w.isActive = false;
    });

    // 指定されたウィンドウをアクティブに
    window.isActive = true;
    window.zIndex = this.nextZIndex++;
    this.activeWindowId = id;

    this.notifyListeners();
    console.log('[Window Manager] Window activated:', id);
  }

  /**
   * ウィンドウを最小化
   */
  minimizeWindow(id: string): void {
    const window = this.windows.get(id);
    if (!window) {
      return;
    }

    window.isMinimized = true;
    this.notifyListeners();
  }

  /**
   * ウィンドウを復元
   */
  restoreWindow(id: string): void {
    const window = this.windows.get(id);
    if (!window) {
      return;
    }

    window.isMinimized = false;
    this.activateWindow(id);
  }

  /**
   * ウィンドウの位置とサイズを更新
   */
  updateWindowPosition(
    id: string,
    position: Partial<WindowState['position']>
  ): void {
    const window = this.windows.get(id);
    if (!window) {
      return;
    }

    Object.assign(window.position, position);
    this.notifyListeners();
  }

  /**
   * ウィンドウのデータを更新
   */
  updateWindowData(id: string, data: Record<string, any>): void {
    const window = this.windows.get(id);
    if (!window) {
      return;
    }

    Object.assign(window.data, data);
    this.notifyListeners();
  }

  /**
   * アクティブなウィンドウを取得
   */
  getActiveWindow(): WindowState | null {
    return this.activeWindowId ? this.windows.get(this.activeWindowId) || null : null;
  }

  /**
   * ウィンドウレイアウトを保存
   */
  saveLayout(): string {
    const layout = {
      windows: Array.from(this.windows.values()),
      activeWindowId: this.activeWindowId,
    };
    return JSON.stringify(layout);
  }

  /**
   * ウィンドウレイアウトを復元
   */
  restoreLayout(layoutJson: string): void {
    try {
      const layout = JSON.parse(layoutJson);

      this.windows.clear();
      layout.windows.forEach((windowState: WindowState) => {
        this.windows.set(windowState.id, windowState);
      });

      this.activeWindowId = layout.activeWindowId;
      this.notifyListeners();

      console.log('[Window Manager] Layout restored');
    } catch (error) {
      console.error('[Window Manager] Failed to restore layout:', error);
    }
  }

  /**
   * すべてのウィンドウを閉じる
   */
  closeAllWindows(): void {
    this.windows.clear();
    this.activeWindowId = null;
    this.notifyListeners();
  }

  /**
   * リスナーを登録
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * リスナーに通知
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  /**
   * デフォルトの位置を取得
   */
  private getDefaultPosition(type: WindowType): WindowState['position'] {
    const baseWidth = 800;
    const baseHeight = 600;

    const windowCount = this.windows.size;
    const offsetX = (windowCount % 3) * 50;
    const offsetY = Math.floor(windowCount / 3) * 50;

    return {
      x: 100 + offsetX,
      y: 100 + offsetY,
      width: baseWidth,
      height: baseHeight,
    };
  }

  /**
   * ウィンドウIDを生成
   */
  private generateWindowId(): string {
    return `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * グローバルウィンドウマネージャーインスタンス
 */
let globalWindowManager: WindowManager | null = null;

/**
 * グローバルウィンドウマネージャーを取得
 */
export function getWindowManager(): WindowManager {
  if (!globalWindowManager) {
    globalWindowManager = new WindowManager();
  }
  return globalWindowManager;
}

/**
 * ウィンドウ間通信
 */
export class WindowMessenger {
  private handlers: Map<string, (data: any) => void> = new Map();

  /**
   * メッセージハンドラーを登録
   */
  on(channel: string, handler: (data: any) => void): () => void {
    this.handlers.set(channel, handler);

    return () => {
      this.handlers.delete(channel);
    };
  }

  /**
   * メッセージを送信
   */
  send(channel: string, data: any): void {
    const handler = this.handlers.get(channel);
    if (handler) {
      handler(data);
    }

    // ブラウザのBroadcastChannelAPIを使用（利用可能な場合）
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel(channel);
        bc.postMessage(data);
        bc.close();
      } catch (error) {
        console.warn('[Window Messenger] BroadcastChannel not available:', error);
      }
    }
  }

  /**
   * すべてのハンドラーをクリア
   */
  clear(): void {
    this.handlers.clear();
  }
}

/**
 * グローバルウィンドウメッセンジャーインスタンス
 */
let globalWindowMessenger: WindowMessenger | null = null;

/**
 * グローバルウィンドウメッセンジャーを取得
 */
export function getWindowMessenger(): WindowMessenger {
  if (!globalWindowMessenger) {
    globalWindowMessenger = new WindowMessenger();
  }
  return globalWindowMessenger;
}
