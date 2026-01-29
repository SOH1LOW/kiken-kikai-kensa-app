/**
 * キーボード操作ユーティリティ
 * Chromebook向けのキーボード操作を最適化
 */

/**
 * キーボードショートカットの定義
 */
export const KEYBOARD_SHORTCUTS = {
  // ナビゲーション
  NEXT_QUESTION: 'ArrowRight',
  PREV_QUESTION: 'ArrowLeft',
  NEXT_CATEGORY: 'ArrowDown',
  PREV_CATEGORY: 'ArrowUp',

  // 操作
  SUBMIT_ANSWER: 'Enter',
  TOGGLE_ANSWER: ' ', // スペースキー
  SAVE: 'Control+s',
  OPEN_SEARCH: 'Control+f',
  OPEN_MENU: 'Escape',

  // 学習
  MARK_CORRECT: 'Control+y',
  MARK_INCORRECT: 'Control+n',
  BOOKMARK: 'Control+b',
  SHOW_ANSWER: 'Control+a',
};

/**
 * キーボードイベントハンドラーの型
 */
export type KeyboardHandler = (event: KeyboardEvent) => void;

/**
 * キーボードショートカットマネージャー
 */
export class KeyboardShortcutManager {
  private shortcuts: Map<string, KeyboardHandler[]> = new Map();
  private isEnabled = true;

  /**
   * ショートカットを登録
   */
  register(key: string, handler: KeyboardHandler): () => void {
    if (!this.shortcuts.has(key)) {
      this.shortcuts.set(key, []);
    }

    this.shortcuts.get(key)!.push(handler);

    // アンサブスクライブ関数を返す
    return () => {
      const handlers = this.shortcuts.get(key);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  /**
   * キーボードイベントを処理
   */
  handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.isEnabled) {
      return;
    }

    const key = this.getKeyString(event);
    const handlers = this.shortcuts.get(key);

    if (handlers && handlers.length > 0) {
      event.preventDefault();
      handlers.forEach((handler) => handler(event));
    }
  };

  /**
   * キーボードイベントを有効化
   */
  enable(): void {
    this.isEnabled = true;
    window.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * キーボードイベントを無効化
   */
  disable(): void {
    this.isEnabled = false;
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * すべてのショートカットをクリア
   */
  clear(): void {
    this.shortcuts.clear();
  }

  /**
   * キーの文字列表現を取得
   */
  private getKeyString(event: KeyboardEvent): string {
    const parts: string[] = [];

    if (event.ctrlKey || event.metaKey) {
      parts.push('Control');
    }
    if (event.shiftKey) {
      parts.push('Shift');
    }
    if (event.altKey) {
      parts.push('Alt');
    }

    parts.push(event.key);

    return parts.join('+');
  }
}

/**
 * フォーカス管理
 */
export class FocusManager {
  private focusableElements: HTMLElement[] = [];
  private currentFocusIndex = 0;

  /**
   * フォーカス可能な要素を登録
   */
  registerFocusableElements(elements: HTMLElement[]): void {
    this.focusableElements = elements.filter((el) => el !== null && el !== undefined);
    this.currentFocusIndex = 0;
  }

  /**
   * 次の要素にフォーカスを移動
   */
  focusNext(): void {
    if (this.focusableElements.length === 0) {
      return;
    }

    this.currentFocusIndex = (this.currentFocusIndex + 1) % this.focusableElements.length;
    this.focusableElements[this.currentFocusIndex]?.focus();
  }

  /**
   * 前の要素にフォーカスを移動
   */
  focusPrev(): void {
    if (this.focusableElements.length === 0) {
      return;
    }

    this.currentFocusIndex =
      (this.currentFocusIndex - 1 + this.focusableElements.length) %
      this.focusableElements.length;
    this.focusableElements[this.currentFocusIndex]?.focus();
  }

  /**
   * 特定の要素にフォーカスを設定
   */
  focusElement(element: HTMLElement): void {
    const index = this.focusableElements.indexOf(element);
    if (index > -1) {
      this.currentFocusIndex = index;
      element.focus();
    }
  }

  /**
   * 現在のフォーカス要素を取得
   */
  getCurrentFocusedElement(): HTMLElement | null {
    return this.focusableElements[this.currentFocusIndex] || null;
  }

  /**
   * フォーカスをリセット
   */
  reset(): void {
    this.currentFocusIndex = 0;
    if (this.focusableElements.length > 0) {
      this.focusableElements[0]?.focus();
    }
  }
}

/**
 * キーボードナビゲーションフック用ユーティリティ
 */
export function useKeyboardNavigation(
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void
) {
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        onNavigate('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        onNavigate('down');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        onNavigate('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        onNavigate('right');
        break;
    }
  };

  return { handleKeyDown };
}

/**
 * キーボード入力をフィルタリング
 */
export function isNavigationKey(event: KeyboardEvent): boolean {
  return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key);
}

/**
 * キーボード入力が英数字かどうかを判定
 */
export function isAlphanumericKey(event: KeyboardEvent): boolean {
  return /^[a-zA-Z0-9]$/.test(event.key);
}

/**
 * キーボード入力が特殊キーかどうかを判定
 */
export function isSpecialKey(event: KeyboardEvent): boolean {
  return ['Enter', 'Escape', 'Backspace', 'Delete', ' '].includes(event.key);
}

/**
 * キーボードショートカットを表示用にフォーマット
 */
export function formatKeyboardShortcut(shortcut: string): string {
  const parts = shortcut.split('+');
  return parts
    .map((part) => {
      switch (part) {
        case 'Control':
          return 'Ctrl';
        case 'ArrowUp':
          return '↑';
        case 'ArrowDown':
          return '↓';
        case 'ArrowLeft':
          return '←';
        case 'ArrowRight':
          return '→';
        case ' ':
          return 'Space';
        case 'Enter':
          return '⏎';
        case 'Escape':
          return 'Esc';
        default:
          return part.toUpperCase();
      }
    })
    .join(' + ');
}

/**
 * キーボードショートカットのヘルプを生成
 */
export function generateKeyboardHelp(): Array<{
  category: string;
  shortcuts: Array<{
    key: string;
    description: string;
  }>;
}> {
  return [
    {
      category: 'ナビゲーション',
      shortcuts: [
        { key: KEYBOARD_SHORTCUTS.NEXT_QUESTION, description: '次の問題' },
        { key: KEYBOARD_SHORTCUTS.PREV_QUESTION, description: '前の問題' },
        { key: KEYBOARD_SHORTCUTS.NEXT_CATEGORY, description: '次のカテゴリ' },
        { key: KEYBOARD_SHORTCUTS.PREV_CATEGORY, description: '前のカテゴリ' },
      ],
    },
    {
      category: '操作',
      shortcuts: [
        { key: KEYBOARD_SHORTCUTS.SUBMIT_ANSWER, description: '答えを送信' },
        { key: KEYBOARD_SHORTCUTS.TOGGLE_ANSWER, description: '答えを切り替え' },
        { key: KEYBOARD_SHORTCUTS.SAVE, description: '保存' },
        { key: KEYBOARD_SHORTCUTS.OPEN_SEARCH, description: '検索を開く' },
      ],
    },
    {
      category: '学習',
      shortcuts: [
        { key: KEYBOARD_SHORTCUTS.MARK_CORRECT, description: '正解とマーク' },
        { key: KEYBOARD_SHORTCUTS.MARK_INCORRECT, description: '不正解とマーク' },
        { key: KEYBOARD_SHORTCUTS.BOOKMARK, description: 'ブックマーク' },
        { key: KEYBOARD_SHORTCUTS.SHOW_ANSWER, description: '答えを表示' },
      ],
    },
  ];
}
