/**
 * PWA ユーティリティ
 * Service Workerの登録とPWA機能を管理
 */

/**
 * Service Workerを登録
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service Worker is not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });

    console.log('[PWA] Service Worker registered successfully');

    // 更新をチェック
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;

      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] New Service Worker available');
            notifyUpdate();
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('[PWA] Failed to register Service Worker:', error);
    return null;
  }
}

/**
 * Service Workerの更新をチェック
 */
export async function checkForUpdates(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();

    if (registration) {
      await registration.update();
      return true;
    }

    return false;
  } catch (error) {
    console.error('[PWA] Failed to check for updates:', error);
    return false;
  }
}

/**
 * インストール可能かどうかを確認
 */
export function isInstallable(): boolean {
  return 'beforeinstallprompt' in window;
}

/**
 * インストール可能イベントを監視
 */
export function onInstallPrompt(callback: (event: any) => void): () => void {
  const handler = (event: Event) => {
    event.preventDefault();
    callback(event as any);
  };

  window.addEventListener('beforeinstallprompt', handler);

  return () => {
    window.removeEventListener('beforeinstallprompt', handler);
  };
}

/**
 * アプリをインストール
 */
export async function installApp(event: any): Promise<boolean> {
  try {
    event.prompt();
    const result = await event.userChoice;

    if (result.outcome === 'accepted') {
      console.log('[PWA] App installed');
      return true;
    }

    return false;
  } catch (error) {
    console.error('[PWA] Failed to install app:', error);
    return false;
  }
}

/**
 * アプリがインストール済みかどうかを確認
 */
export function isAppInstalled(): boolean {
  // ホーム画面に追加されているかを確認
  if ('navigator' in window && 'standalone' in (navigator as any)) {
    return (navigator as any).standalone === true;
  }

  // PWA表示モードで実行されているかを確認
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  return false;
}

/**
 * 更新通知を表示
 */
function notifyUpdate(): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('アップデートが利用可能です', {
      body: 'アプリを再読み込みして最新版を使用してください',
      icon: '/icon-192.png',
      badge: '/icon-96.png',
      tag: 'update-notification',
    });
  }
}

/**
 * 通知の許可をリクエスト
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.log('[PWA] Notifications are not supported');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

/**
 * オフライン状態を監視
 */
export function onOnlineStatusChange(callback: (isOnline: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * 現在のオンライン状態を取得
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * バックグラウンド同期をリクエスト
 */
export async function requestBackgroundSync(tag: string): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
    console.log('[PWA] Background Sync is not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await (registration as any).sync.register(tag);
    console.log('[PWA] Background sync registered:', tag);
    return true;
  } catch (error) {
    console.error('[PWA] Failed to register background sync:', error);
    return false;
  }
}

/**
 * ファイル共有を監視
 */
export function onFileShare(callback: (files: File[]) => void): () => void {
  const handleMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === 'FILE_SHARE') {
      callback(event.data.files);
    }
  };

  navigator.serviceWorker.addEventListener('message', handleMessage);

  return () => {
    navigator.serviceWorker.removeEventListener('message', handleMessage);
  };
}

/**
 * PWA情報を取得
 */
export function getPWAInfo(): {
  isInstalled: boolean;
  isOnline: boolean;
  serviceWorkerReady: boolean;
  notificationsEnabled: boolean;
} {
  return {
    isInstalled: isAppInstalled(),
    isOnline: isOnline(),
    serviceWorkerReady: 'serviceWorker' in navigator,
    notificationsEnabled: 'Notification' in window && Notification.permission === 'granted',
  };
}

/**
 * PWAの初期化
 */
export async function initPWA(): Promise<void> {
  console.log('[PWA] Initializing...');

  // Service Workerを登録
  await registerServiceWorker();

  // オンライン状態を監視
  onOnlineStatusChange((isOnline) => {
    console.log('[PWA] Online status changed:', isOnline);
    // UI更新などの処理をここに追加
  });

  console.log('[PWA] Initialized');
}
