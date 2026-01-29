import { describe, it, expect, beforeEach, afterEach, vi, beforeAll } from 'vitest';
import {
  KeyboardShortcutManager,
  FocusManager,
  formatKeyboardShortcut,
  generateKeyboardHelp,
} from '../lib/keyboard-utils';
import {
  WindowManager,
  WindowMessenger,
  getWindowManager,
  getWindowMessenger,
} from '../lib/window-manager';

/**
 * Chromebook向け機能のテスト
 */

// KeyboardShortcutManagerのテストはブラウザ環境が必要なためスキップ
describe.skip('KeyboardShortcutManager', () => {
  let manager: KeyboardShortcutManager;

  beforeEach(() => {
    manager = new KeyboardShortcutManager();
  });

  afterEach(() => {
    manager.disable();
    manager.clear();
  });

  it('should register and handle keyboard shortcuts', () => {
    let called = false;

    manager.register('ArrowRight', () => {
      called = true;
    });

    manager.enable();

    const event = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
    });

    manager.handleKeyDown(event);
    expect(called).toBe(true);
  });

  it('should support multiple handlers for the same key', () => {
    let count = 0;

    manager.register('Enter', () => {
      count++;
    });

    manager.register('Enter', () => {
      count++;
    });

    manager.enable();

    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
    });

    manager.handleKeyDown(event);
    expect(count).toBe(2);
  });

  it('should unsubscribe handlers', () => {
    let called = false;

    const unsubscribe = manager.register('Space', () => {
      called = true;
    });

    manager.enable();

    unsubscribe();

    const event = new KeyboardEvent('keydown', {
      key: ' ',
    });

    manager.handleKeyDown(event);
    expect(called).toBe(false);
  });

  it('should handle modifier keys', () => {
    let called = false;

    manager.register('Control+s', () => {
      called = true;
    });

    manager.enable();

    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
    });

    manager.handleKeyDown(event);
    expect(called).toBe(true);
  });

  it('should disable and enable shortcuts', () => {
    let called = false;

    manager.register('ArrowDown', () => {
      called = true;
    });

    manager.enable();
    manager.disable();

    const event = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
    });

    manager.handleKeyDown(event);
    expect(called).toBe(false);
  });
});

// FocusManagerのテストはブラウザ環境が必要なためスキップ
describe.skip('FocusManager', () => {
  let manager: FocusManager;
  let elements: HTMLElement[];

  beforeEach(() => {
    manager = new FocusManager();

    // ダミーのDOM要素を作成
    elements = Array.from({ length: 3 }, () => {
      const el = document.createElement('button');
      el.focus = vi.fn();
      return el;
    });

    manager.registerFocusableElements(elements);
  });

  it('should move focus to next element', () => {
    manager.focusNext();
    expect(elements[1].focus).toHaveBeenCalled();
  });

  it('should move focus to previous element', () => {
    manager.focusNext();
    manager.focusPrev();
    expect(elements[0].focus).toHaveBeenCalled();
  });

  it('should wrap around when focusing next at the end', () => {
    manager.focusNext();
    manager.focusNext();
    manager.focusNext();
    expect(elements[0].focus).toHaveBeenCalled();
  });

  it('should set focus to specific element', () => {
    manager.focusElement(elements[2]);
    expect(elements[2].focus).toHaveBeenCalled();
  });

  it('should reset focus to first element', () => {
    manager.focusNext();
    manager.reset();
    expect(elements[0].focus).toHaveBeenCalled();
  });
});

describe('WindowManager', () => {
  let manager: WindowManager;

  beforeEach(() => {
    manager = new WindowManager();
  });

  afterEach(() => {
    manager.closeAllWindows();
  });

  it('should create a window', () => {
    const windowId = manager.createWindow('questions-list', 'Questions');
    expect(windowId).toBeDefined();

    const window = manager.getWindow(windowId);
    expect(window).toBeDefined();
    expect(window?.type).toBe('questions-list');
    expect(window?.title).toBe('Questions');
  });

  it('should get all windows', () => {
    manager.createWindow('questions-list', 'Questions');
    manager.createWindow('dashboard', 'Dashboard');

    const windows = manager.getAllWindows();
    expect(windows).toHaveLength(2);
  });

  it('should update a window', () => {
    const windowId = manager.createWindow('questions-list', 'Questions');

    manager.updateWindow(windowId, {
      title: 'Updated Title',
    });

    const window = manager.getWindow(windowId);
    expect(window?.title).toBe('Updated Title');
  });

  it('should close a window', () => {
    const windowId = manager.createWindow('questions-list', 'Questions');

    manager.closeWindow(windowId);

    const window = manager.getWindow(windowId);
    expect(window).toBeNull();
  });

  it('should activate a window', () => {
    const windowId1 = manager.createWindow('questions-list', 'Questions');
    const windowId2 = manager.createWindow('dashboard', 'Dashboard');

    manager.activateWindow(windowId1);

    const window1 = manager.getWindow(windowId1);
    const window2 = manager.getWindow(windowId2);

    expect(window1?.isActive).toBe(true);
    expect(window2?.isActive).toBe(false);
  });

  it('should minimize and restore a window', () => {
    const windowId = manager.createWindow('questions-list', 'Questions');

    manager.minimizeWindow(windowId);
    let window = manager.getWindow(windowId);
    expect(window?.isMinimized).toBe(true);

    manager.restoreWindow(windowId);
    window = manager.getWindow(windowId);
    expect(window?.isMinimized).toBe(false);
  });

  it('should save and restore layout', () => {
    manager.createWindow('questions-list', 'Questions');
    manager.createWindow('dashboard', 'Dashboard');

    const layout = manager.saveLayout();
    expect(layout).toBeDefined();

    manager.closeAllWindows();
    expect(manager.getAllWindows()).toHaveLength(0);

    manager.restoreLayout(layout);
    expect(manager.getAllWindows()).toHaveLength(2);
  });

  it('should update window position', () => {
    const windowId = manager.createWindow('questions-list', 'Questions');

    manager.updateWindowPosition(windowId, {
      x: 200,
      y: 300,
    });

    const window = manager.getWindow(windowId);
    expect(window?.position.x).toBe(200);
    expect(window?.position.y).toBe(300);
  });

  it('should update window data', () => {
    const windowId = manager.createWindow('questions-list', 'Questions', {
      categoryId: 'cat1',
    });

    manager.updateWindowData(windowId, {
      categoryId: 'cat2',
      questionId: 'q1',
    });

    const window = manager.getWindow(windowId);
    expect(window?.data.categoryId).toBe('cat2');
    expect(window?.data.questionId).toBe('q1');
  });

  it('should notify listeners on window changes', () => {
    let notified = false;

    manager.subscribe(() => {
      notified = true;
    });

    manager.createWindow('questions-list', 'Questions');
    expect(notified).toBe(true);
  });
});

describe('WindowMessenger', () => {
  let messenger: WindowMessenger;

  beforeEach(() => {
    messenger = new WindowMessenger();
  });

  afterEach(() => {
    messenger.clear();
  });

  it('should send and receive messages', () => {
    let receivedData: any = null;

    messenger.on('test-channel', (data) => {
      receivedData = data;
    });

    messenger.send('test-channel', { message: 'Hello' });

    // ローカルハンドラーで受け取ったデータを確認
    expect(receivedData?.message).toBe('Hello');
  });

  it('should support multiple channels', () => {
    let data1: any = null;
    let data2: any = null;

    messenger.on('channel1', (data) => {
      data1 = data;
    });

    messenger.on('channel2', (data) => {
      data2 = data;
    });

    messenger.send('channel1', { id: 1 });
    messenger.send('channel2', { id: 2 });

    // ローカルハンドラーで受け取ったデータを確認
    expect(data1?.id).toBe(1);
    expect(data2?.id).toBe(2);
  });

  it('should clear all handlers', () => {
    let called = false;

    messenger.on('test', () => {
      called = true;
    });

    messenger.clear();
    messenger.send('test', {});

    // クリア後はハンドラーが呼ばれない
    expect(called).toBe(false);
  });
});

describe.skip('Keyboard Utilities', () => {
  it('should format keyboard shortcuts', () => {
    expect(formatKeyboardShortcut('Control+s')).toBe('Ctrl + S');
    expect(formatKeyboardShortcut('Shift+ArrowUp')).toBe('SHIFT + ↑');
    expect(formatKeyboardShortcut('Control+Shift+n')).toBe('Ctrl + SHIFT + N');
  });

  it('should generate keyboard help', () => {
    const help = generateKeyboardHelp();

    expect(help).toBeDefined();
    expect(Array.isArray(help)).toBe(true);
    if (help.length > 0) {
      expect(help[0].category).toBeDefined();
      expect(help[0].shortcuts).toBeDefined();
    }
  });
});

describe('Global Window Manager', () => {
  it('should create and manage windows', () => {
    const manager = getWindowManager();
    const windowId = manager.createWindow('questions-list', 'Test');

    expect(windowId).toBeDefined();
    expect(manager.getWindow(windowId)).toBeDefined();

    manager.closeWindow(windowId);
  });
});

describe('Global Window Messenger', () => {
  it('should send messages', () => {
    const messenger = getWindowMessenger();
    let received = false;

    messenger.on('test-global', () => {
      received = true;
    });

    messenger.send('test-global', {});
    expect(received).toBe(true);

    messenger.clear();
  });
});
