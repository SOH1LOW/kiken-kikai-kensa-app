/**
 * タッチ操作最適化ユーティリティ
 * スマートフォンやタッチデバイスでの操作を最適化
 */

export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  duration: number;
}

export interface TapGesture {
  x: number;
  y: number;
  timestamp: number;
  duration: number;
}

export interface LongTapGesture {
  x: number;
  y: number;
  timestamp: number;
  duration: number;
}

const SWIPE_THRESHOLD = 50; // スワイプと判定する最小距離（ピクセル）
const SWIPE_VELOCITY_THRESHOLD = 0.5; // スワイプと判定する最小速度（ピクセル/ms）
const LONG_TAP_DURATION = 500; // ロングタップと判定する時間（ミリ秒）
const TAP_THRESHOLD = 10; // タップと判定する最大移動距離（ピクセル）

/**
 * タッチジェスチャーハンドラー
 */
export class TouchGestureHandler {
  private touchStartPoint: TouchPoint | null = null;
  private touchStartTime: number = 0;
  private longTapTimer: ReturnType<typeof setTimeout> | null = null;

  private onSwipe: ((gesture: SwipeGesture) => void) | null = null;
  private onTap: ((gesture: TapGesture) => void) | null = null;
  private onLongTap: ((gesture: LongTapGesture) => void) | null = null;

  /**
   * タッチ開始イベントを処理
   */
  handleTouchStart(event: TouchEvent): void {
    if (event.touches.length === 0) return;

    const touch = event.touches[0];
    this.touchStartPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };
    this.touchStartTime = Date.now();

    // ロングタップタイマーをセット
    this.longTapTimer = setTimeout(() => {
      if (this.touchStartPoint && this.onLongTap) {
        this.onLongTap({
          x: this.touchStartPoint.x,
          y: this.touchStartPoint.y,
          timestamp: this.touchStartPoint.timestamp,
          duration: Date.now() - this.touchStartTime,
        });
      }
    }, LONG_TAP_DURATION);
  }

  /**
   * タッチ移動イベントを処理
   */
  handleTouchMove(event: TouchEvent): void {
    if (!this.touchStartPoint || event.touches.length === 0) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - this.touchStartPoint.x;
    const deltaY = touch.clientY - this.touchStartPoint.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // 移動距離がタップ閾値を超えたらロングタップをキャンセル
    if (distance > TAP_THRESHOLD && this.longTapTimer) {
      clearTimeout(this.longTapTimer);
      this.longTapTimer = null;
    }
  }

  /**
   * タッチ終了イベントを処理
   */
  handleTouchEnd(event: TouchEvent): void {
    if (!this.touchStartPoint) return;

    // ロングタップタイマーをクリア
    if (this.longTapTimer) {
      clearTimeout(this.longTapTimer);
      this.longTapTimer = null;
    }

    const touch = event.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - this.touchStartPoint.x;
    const deltaY = touch.clientY - this.touchStartPoint.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = Date.now() - this.touchStartTime;
    const velocity = distance / duration;

    // スワイプジェスチャーの判定
    if (distance > SWIPE_THRESHOLD && velocity > SWIPE_VELOCITY_THRESHOLD) {
      const direction = this.getSwipeDirection(deltaX, deltaY);
      if (this.onSwipe) {
        this.onSwipe({
          direction,
          distance,
          velocity,
          duration,
        });
      }
    }
    // タップジェスチャーの判定
    else if (distance <= TAP_THRESHOLD) {
      if (this.onTap) {
        this.onTap({
          x: this.touchStartPoint.x,
          y: this.touchStartPoint.y,
          timestamp: this.touchStartPoint.timestamp,
          duration,
        });
      }
    }

    this.touchStartPoint = null;
  }

  /**
   * スワイプ方向を判定
   */
  private getSwipeDirection(
    deltaX: number,
    deltaY: number
  ): 'left' | 'right' | 'up' | 'down' {
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > absDeltaY) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }

  /**
   * スワイプハンドラーを登録
   */
  onSwipeGesture(handler: (gesture: SwipeGesture) => void): void {
    this.onSwipe = handler;
  }

  /**
   * タップハンドラーを登録
   */
  onTapGesture(handler: (gesture: TapGesture) => void): void {
    this.onTap = handler;
  }

  /**
   * ロングタップハンドラーを登録
   */
  onLongTapGesture(handler: (gesture: LongTapGesture) => void): void {
    this.onLongTap = handler;
  }

  /**
   * クリーンアップ
   */
  destroy(): void {
    if (this.longTapTimer) {
      clearTimeout(this.longTapTimer);
      this.longTapTimer = null;
    }
  }
}

/**
 * タッチ対応ボタンのスタイル
 */
export const TOUCH_BUTTON_STYLES = {
  minHeight: 44, // iOS推奨最小タッチターゲットサイズ
  minWidth: 44,
  padding: 12,
  borderRadius: 8,
};

/**
 * タッチ対応フォーム入力のスタイル
 */
export const TOUCH_INPUT_STYLES = {
  minHeight: 44,
  padding: 12,
  fontSize: 16, // iOSでズーム防止
  borderRadius: 4,
};

/**
 * タッチ対応リスト項目のスタイル
 */
export const TOUCH_LIST_ITEM_STYLES = {
  minHeight: 48,
  padding: 12,
};

/**
 * デバイスがタッチ対応かどうかを判定
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    ((navigator as any).msMaxTouchPoints > 0)
  );
}

/**
 * ホバー対応かどうかを判定
 */
export function isHoverCapable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(hover: hover)').matches;
}

/**
 * ポインターファインな入力かどうかを判定
 */
export function isPointerFine(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(pointer: fine)').matches;
}

/**
 * ポインターコースな入力かどうかを判定
 */
export function isPointerCoarse(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(pointer: coarse)').matches;
}
