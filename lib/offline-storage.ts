/**
 * オフラインストレージ
 * IndexedDBを使用してオフラインでもデータを永続化
 */

const DB_NAME = 'kiken-kikai-kensa-db';
const DB_VERSION = 1;

// ストアの定義
const STORES = {
  QUESTIONS: 'questions',
  CATEGORIES: 'categories',
  USER_PROGRESS: 'user_progress',
  IMPORTED_FILES: 'imported_files',
  SYNC_QUEUE: 'sync_queue',
};

/**
 * IndexedDBの初期化
 */
export async function initializeDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      const db = request.result;
      console.log('[Offline Storage] Database initialized');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 問題ストア
      if (!db.objectStoreNames.contains(STORES.QUESTIONS)) {
        const questionsStore = db.createObjectStore(STORES.QUESTIONS, { keyPath: 'id' });
        questionsStore.createIndex('category', 'category', { unique: false });
        questionsStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // カテゴリストア
      if (!db.objectStoreNames.contains(STORES.CATEGORIES)) {
        db.createObjectStore(STORES.CATEGORIES, { keyPath: 'id' });
      }

      // ユーザー進捗ストア
      if (!db.objectStoreNames.contains(STORES.USER_PROGRESS)) {
        const progressStore = db.createObjectStore(STORES.USER_PROGRESS, { keyPath: 'id' });
        progressStore.createIndex('questionId', 'questionId', { unique: false });
      }

      // インポートファイルストア
      if (!db.objectStoreNames.contains(STORES.IMPORTED_FILES)) {
        const filesStore = db.createObjectStore(STORES.IMPORTED_FILES, { keyPath: 'id' });
        filesStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // 同期キューストア
      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
      }

      console.log('[Offline Storage] Database schema created');
    };
  });
}

/**
 * 問題をストレージに保存
 */
export async function saveQuestion(question: any): Promise<void> {
  const db = await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.QUESTIONS], 'readwrite');
    const store = transaction.objectStore(STORES.QUESTIONS);

    const data = {
      ...question,
      timestamp: Date.now(),
    };

    const request = store.put(data);

    request.onerror = () => {
      reject(new Error('Failed to save question'));
    };

    request.onsuccess = () => {
      console.log('[Offline Storage] Question saved:', question.id);
      resolve();
    };
  });
}

/**
 * 複数の問題をストレージに保存
 */
export async function saveQuestions(questions: any[]): Promise<void> {
  const db = await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.QUESTIONS], 'readwrite');
    const store = transaction.objectStore(STORES.QUESTIONS);

    questions.forEach((question) => {
      const data = {
        ...question,
        timestamp: Date.now(),
      };
      store.put(data);
    });

    transaction.onerror = () => {
      reject(new Error('Failed to save questions'));
    };

    transaction.oncomplete = () => {
      console.log('[Offline Storage] Questions saved:', questions.length);
      resolve();
    };
  });
}

/**
 * 問題をストレージから取得
 */
export async function getQuestion(id: string): Promise<any | null> {
  const db = await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.QUESTIONS], 'readonly');
    const store = transaction.objectStore(STORES.QUESTIONS);
    const request = store.get(id);

    request.onerror = () => {
      reject(new Error('Failed to get question'));
    };

    request.onsuccess = () => {
      resolve(request.result || null);
    };
  });
}

/**
 * カテゴリの問題を取得
 */
export async function getQuestionsByCategory(category: string): Promise<any[]> {
  const db = await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.QUESTIONS], 'readonly');
    const store = transaction.objectStore(STORES.QUESTIONS);
    const index = store.index('category');
    const request = index.getAll(category);

    request.onerror = () => {
      reject(new Error('Failed to get questions by category'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

/**
 * すべての問題を取得
 */
export async function getAllQuestions(): Promise<any[]> {
  const db = await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.QUESTIONS], 'readonly');
    const store = transaction.objectStore(STORES.QUESTIONS);
    const request = store.getAll();

    request.onerror = () => {
      reject(new Error('Failed to get all questions'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

/**
 * 問題を削除
 */
export async function deleteQuestion(id: string): Promise<void> {
  const db = await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.QUESTIONS], 'readwrite');
    const store = transaction.objectStore(STORES.QUESTIONS);
    const request = store.delete(id);

    request.onerror = () => {
      reject(new Error('Failed to delete question'));
    };

    request.onsuccess = () => {
      console.log('[Offline Storage] Question deleted:', id);
      resolve();
    };
  });
}

/**
 * ユーザー進捗を保存
 */
export async function saveProgress(progress: any): Promise<void> {
  const db = await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.USER_PROGRESS], 'readwrite');
    const store = transaction.objectStore(STORES.USER_PROGRESS);

    const data = {
      ...progress,
      timestamp: Date.now(),
    };

    const request = store.put(data);

    request.onerror = () => {
      reject(new Error('Failed to save progress'));
    };

    request.onsuccess = () => {
      console.log('[Offline Storage] Progress saved');
      resolve();
    };
  });
}

/**
 * 問題の進捗を取得
 */
export async function getProgressByQuestion(questionId: string): Promise<any | null> {
  const db = await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.USER_PROGRESS], 'readonly');
    const store = transaction.objectStore(STORES.USER_PROGRESS);
    const index = store.index('questionId');
    const request = index.get(questionId);

    request.onerror = () => {
      reject(new Error('Failed to get progress'));
    };

    request.onsuccess = () => {
      resolve(request.result || null);
    };
  });
}

/**
 * インポートファイルを保存
 */
export async function saveImportedFile(file: any): Promise<void> {
  const db = await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.IMPORTED_FILES], 'readwrite');
    const store = transaction.objectStore(STORES.IMPORTED_FILES);

    const data = {
      ...file,
      timestamp: Date.now(),
    };

    const request = store.put(data);

    request.onerror = () => {
      reject(new Error('Failed to save imported file'));
    };

    request.onsuccess = () => {
      console.log('[Offline Storage] Imported file saved');
      resolve();
    };
  });
}

/**
 * インポート履歴を取得
 */
export async function getImportHistory(limit: number = 50): Promise<any[]> {
  const db = await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.IMPORTED_FILES], 'readonly');
    const store = transaction.objectStore(STORES.IMPORTED_FILES);
    const index = store.index('timestamp');
    const request = index.openCursor(null, 'prev');

    const results: any[] = [];

    request.onerror = () => {
      reject(new Error('Failed to get import history'));
    };

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;

      if (cursor && results.length < limit) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        resolve(results);
      }
    };
  });
}

/**
 * 同期キューに追加
 */
export async function addToSyncQueue(action: any): Promise<void> {
  const db = await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.SYNC_QUEUE], 'readwrite');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);

    const data = {
      ...action,
      timestamp: Date.now(),
      synced: false,
    };

    const request = store.add(data);

    request.onerror = () => {
      reject(new Error('Failed to add to sync queue'));
    };

    request.onsuccess = () => {
      console.log('[Offline Storage] Action added to sync queue');
      resolve();
    };
  });
}

/**
 * 同期キューを取得
 */
export async function getSyncQueue(): Promise<any[]> {
  const db = await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.SYNC_QUEUE], 'readonly');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);
    const request = store.getAll();

    request.onerror = () => {
      reject(new Error('Failed to get sync queue'));
    };

    request.onsuccess = () => {
      resolve(request.result.filter((item) => !item.synced));
    };
  });
}

/**
 * 同期キューをクリア
 */
export async function clearSyncQueue(): Promise<void> {
  const db = await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.SYNC_QUEUE], 'readwrite');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);
    const request = store.clear();

    request.onerror = () => {
      reject(new Error('Failed to clear sync queue'));
    };

    request.onsuccess = () => {
      console.log('[Offline Storage] Sync queue cleared');
      resolve();
    };
  });
}

/**
 * ストレージの統計情報を取得
 */
export async function getStorageStats(): Promise<{
  questionsCount: number;
  progressCount: number;
  filesCount: number;
  queueCount: number;
}> {
  const db = await initializeDB();

  const questionsCount = await new Promise<number>((resolve) => {
    const transaction = db.transaction([STORES.QUESTIONS], 'readonly');
    const store = transaction.objectStore(STORES.QUESTIONS);
    const request = store.count();
    request.onsuccess = () => resolve(request.result);
  });

  const progressCount = await new Promise<number>((resolve) => {
    const transaction = db.transaction([STORES.USER_PROGRESS], 'readonly');
    const store = transaction.objectStore(STORES.USER_PROGRESS);
    const request = store.count();
    request.onsuccess = () => resolve(request.result);
  });

  const filesCount = await new Promise<number>((resolve) => {
    const transaction = db.transaction([STORES.IMPORTED_FILES], 'readonly');
    const store = transaction.objectStore(STORES.IMPORTED_FILES);
    const request = store.count();
    request.onsuccess = () => resolve(request.result);
  });

  const queueCount = await new Promise<number>((resolve) => {
    const transaction = db.transaction([STORES.SYNC_QUEUE], 'readonly');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);
    const request = store.count();
    request.onsuccess = () => resolve(request.result);
  });

  return {
    questionsCount,
    progressCount,
    filesCount,
    queueCount,
  };
}

/**
 * すべてのデータをクリア
 */
export async function clearAllData(): Promise<void> {
  const db = await initializeDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [
        STORES.QUESTIONS,
        STORES.CATEGORIES,
        STORES.USER_PROGRESS,
        STORES.IMPORTED_FILES,
        STORES.SYNC_QUEUE,
      ],
      'readwrite'
    );

    Object.values(STORES).forEach((storeName) => {
      const store = transaction.objectStore(storeName);
      store.clear();
    });

    transaction.onerror = () => {
      reject(new Error('Failed to clear all data'));
    };

    transaction.oncomplete = () => {
      console.log('[Offline Storage] All data cleared');
      resolve();
    };
  });
}
