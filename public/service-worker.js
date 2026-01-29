/**
 * Service Worker for PWA
 * オフライン対応とキャッシング戦略を実装
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `kiken-kikai-kensa-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

// キャッシュする静的アセット
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
];

/**
 * Service Workerのインストール
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((error) => {
        console.warn('[Service Worker] Failed to cache some assets:', error);
        // 一部のアセットがキャッシュできなくても続行
        return Promise.resolve();
      });
    })
  );

  // 新しいService Workerをすぐにアクティベート
  self.skipWaiting();
});

/**
 * Service Workerのアクティベーション
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 古いキャッシュを削除
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE && cacheName !== IMAGE_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // すべてのクライアントに対して制御を取得
  self.clients.claim();
});

/**
 * ネットワークリクエストの処理
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 同一オリジンのリクエストのみ処理
  if (url.origin !== location.origin) {
    return;
  }

  // GETリクエストのみ処理
  if (request.method !== 'GET') {
    return;
  }

  // 画像のキャッシング戦略
  if (request.destination === 'image') {
    event.respondWith(cacheImage(request));
    return;
  }

  // HTMLのキャッシング戦略
  if (request.destination === 'document') {
    event.respondWith(cacheHtml(request));
    return;
  }

  // その他のアセット（JS、CSS等）
  event.respondWith(cacheAssets(request));
});

/**
 * 画像のキャッシング戦略（キャッシュファースト）
 */
async function cacheImage(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.warn('[Service Worker] Failed to fetch image:', request.url, error);
    // フォールバック画像を返す（オプション）
    return new Response('Image not available', { status: 404 });
  }
}

/**
 * HTMLのキャッシング戦略（ネットワークファースト）
 */
async function cacheHtml(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.warn('[Service Worker] Network request failed:', request.url);

    // キャッシュからフォールバック
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    // オフラインページを返す
    return caches.match('/index.html');
  }
}

/**
 * アセットのキャッシング戦略（キャッシュファースト）
 */
async function cacheAssets(request) {
  const cached = await caches.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.warn('[Service Worker] Failed to fetch asset:', request.url, error);
    return new Response('Resource not available', { status: 404 });
  }
}

/**
 * バックグラウンド同期（オプション）
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-questions') {
    event.waitUntil(syncQuestions());
  }
});

/**
 * 問題データの同期
 */
async function syncQuestions() {
  try {
    console.log('[Service Worker] Syncing questions...');
    // サーバーと同期するロジックをここに実装
    // 例: 新しい問題をアップロード、更新をダウンロード
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
  }
}

/**
 * プッシュ通知（オプション）
 */
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const options = {
    body: event.data.text(),
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    tag: 'notification',
  };

  event.waitUntil(self.registration.showNotification('機械検査3級アプリ', options));
});

/**
 * 通知クリック処理
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // 既に開いているウィンドウがあればそこにフォーカス
      for (let i = 0; i < clientList.length; i++) {
        if (clientList[i].url === '/' && 'focus' in clientList[i]) {
          return clientList[i].focus();
        }
      }

      // 新しいウィンドウを開く
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

console.log('[Service Worker] Loaded');
