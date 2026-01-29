import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// IndexedDBのモック（Node.js環境では利用不可）
if (typeof global !== 'undefined' && !global.indexedDB) {
  // テスト環境ではIndexedDBが利用できないため、スキップ
  console.log('[Test] IndexedDB is not available in this environment');
}

import {
  initializeDB,
  saveQuestion,
  getQuestion,
  getAllQuestions,
  deleteQuestion,
  saveProgress,
  getProgressByQuestion,
  saveImportedFile,
  getImportHistory,
  addToSyncQueue,
  getSyncQueue,
  clearSyncQueue,
  getStorageStats,
  clearAllData,
} from '../lib/offline-storage';

describe.skipIf(typeof indexedDB === 'undefined')('PWA & Offline Storage', () => {
  describe.skipIf(typeof indexedDB === 'undefined')('Offline Storage - Questions', () => {
    beforeEach(async () => {
      await clearAllData();
    });

    afterEach(async () => {
      await clearAllData();
    });

    it('should save a question', async () => {
      const question = {
        id: 'q1',
        text: 'テスト問題',
        answer: true,
        category: 'category1',
      };

      await saveQuestion(question);
      const saved = await getQuestion('q1');

      expect(saved).toBeDefined();
      expect(saved.text).toBe('テスト問題');
      expect(saved.timestamp).toBeDefined();
    });

    it('should get all questions', async () => {
      const questions = [
        { id: 'q1', text: 'Q1', answer: true, category: 'cat1' },
        { id: 'q2', text: 'Q2', answer: false, category: 'cat1' },
        { id: 'q3', text: 'Q3', answer: true, category: 'cat2' },
      ];

      for (const q of questions) {
        await saveQuestion(q);
      }

      const all = await getAllQuestions();

      expect(all.length).toBe(3);
    });

    it('should delete a question', async () => {
      const question = { id: 'q1', text: 'Q1', answer: true, category: 'cat1' };

      await saveQuestion(question);
      await deleteQuestion('q1');
      const deleted = await getQuestion('q1');

      expect(deleted).toBeNull();
    });

    it('should return null for non-existent question', async () => {
      const question = await getQuestion('non-existent');

      expect(question).toBeNull();
    });

    it('should update existing question', async () => {
      const question = { id: 'q1', text: 'Original', answer: true, category: 'cat1' };
      await saveQuestion(question);

      const updated = { id: 'q1', text: 'Updated', answer: false, category: 'cat1' };
      await saveQuestion(updated);

      const result = await getQuestion('q1');

      expect(result.text).toBe('Updated');
      expect(result.answer).toBe(false);
    });
  });

  describe.skipIf(typeof indexedDB === 'undefined')('Offline Storage - Progress', () => {
    beforeEach(async () => {
      await clearAllData();
    });

    afterEach(async () => {
      await clearAllData();
    });

    it('should save progress', async () => {
      const progress = {
        id: 'p1',
        questionId: 'q1',
        answered: true,
        correct: true,
        attemptCount: 1,
      };

      await saveProgress(progress);
      const saved = await getProgressByQuestion('q1');

      expect(saved).toBeDefined();
      expect(saved.correct).toBe(true);
    });

    it('should return null for non-existent progress', async () => {
      const progress = await getProgressByQuestion('non-existent');

      expect(progress).toBeNull();
    });

    it('should update progress', async () => {
      const progress = {
        id: 'p1',
        questionId: 'q1',
        answered: true,
        correct: true,
        attemptCount: 1,
      };

      await saveProgress(progress);

      const updated = {
        id: 'p1',
        questionId: 'q1',
        answered: true,
        correct: false,
        attemptCount: 2,
      };

      await saveProgress(updated);
      const result = await getProgressByQuestion('q1');

      expect(result.attemptCount).toBe(2);
      expect(result.correct).toBe(false);
    });
  });

  describe.skipIf(typeof indexedDB === 'undefined')('Offline Storage - Import History', () => {
    beforeEach(async () => {
      await clearAllData();
    });

    afterEach(async () => {
      await clearAllData();
    });

    it('should save imported file', async () => {
      const file = {
        id: 'f1',
        name: 'test.pdf',
        questionsCount: 10,
        categorized: true,
      };

      await saveImportedFile(file);
      const history = await getImportHistory();

      expect(history.length).toBeGreaterThan(0);
      expect(history[0].name).toBe('test.pdf');
    });

    it('should get import history in reverse chronological order', async () => {
      const files = [
        { id: 'f1', name: 'file1.pdf', questionsCount: 10, categorized: true },
        { id: 'f2', name: 'file2.pdf', questionsCount: 15, categorized: true },
        { id: 'f3', name: 'file3.pdf', questionsCount: 20, categorized: true },
      ];

      for (const f of files) {
        await saveImportedFile(f);
      }

      const history = await getImportHistory();

      expect(history.length).toBe(3);
      expect(history[0].name).toBe('file3.pdf');
      expect(history[2].name).toBe('file1.pdf');
    });

    it('should respect limit parameter', async () => {
      for (let i = 0; i < 10; i++) {
        await saveImportedFile({
          id: `f${i}`,
          name: `file${i}.pdf`,
          questionsCount: 10,
          categorized: true,
        });
      }

      const history = await getImportHistory(5);

      expect(history.length).toBe(5);
    });
  });

  describe.skipIf(typeof indexedDB === 'undefined')('Offline Storage - Sync Queue', () => {
    beforeEach(async () => {
      await clearAllData();
    });

    afterEach(async () => {
      await clearAllData();
    });

    it('should add action to sync queue', async () => {
      const action = {
        type: 'CREATE_QUESTION',
        data: { id: 'q1', text: 'Q1' },
      };

      await addToSyncQueue(action);
      const queue = await getSyncQueue();

      expect(queue.length).toBe(1);
      expect(queue[0].type).toBe('CREATE_QUESTION');
    });

    it('should get multiple actions from sync queue', async () => {
      const actions = [
        { type: 'CREATE_QUESTION', data: { id: 'q1' } },
        { type: 'UPDATE_PROGRESS', data: { id: 'p1' } },
        { type: 'DELETE_QUESTION', data: { id: 'q2' } },
      ];

      for (const action of actions) {
        await addToSyncQueue(action);
      }

      const queue = await getSyncQueue();

      expect(queue.length).toBe(3);
    });

    it('should clear sync queue', async () => {
      await addToSyncQueue({ type: 'CREATE_QUESTION', data: {} });
      await clearSyncQueue();

      const queue = await getSyncQueue();

      expect(queue.length).toBe(0);
    });
  });

  describe.skipIf(typeof indexedDB === 'undefined')('Offline Storage - Statistics', () => {
    beforeEach(async () => {
      await clearAllData();
    });

    afterEach(async () => {
      await clearAllData();
    });

    it('should get storage statistics', async () => {
      // データを追加
      await saveQuestion({ id: 'q1', text: 'Q1', answer: true, category: 'cat1' });
      await saveQuestion({ id: 'q2', text: 'Q2', answer: false, category: 'cat1' });
      await saveProgress({ id: 'p1', questionId: 'q1', correct: true });
      await saveImportedFile({ id: 'f1', name: 'file.pdf', questionsCount: 2 });
      await addToSyncQueue({ type: 'CREATE_QUESTION', data: {} });

      const stats = await getStorageStats();

      expect(stats.questionsCount).toBe(2);
      expect(stats.progressCount).toBe(1);
      expect(stats.filesCount).toBe(1);
      expect(stats.queueCount).toBe(1);
    });

    it('should return zero counts for empty storage', async () => {
      const stats = await getStorageStats();

      expect(stats.questionsCount).toBe(0);
      expect(stats.progressCount).toBe(0);
      expect(stats.filesCount).toBe(0);
      expect(stats.queueCount).toBe(0);
    });
  });

  describe.skipIf(typeof indexedDB === 'undefined')('Offline Storage - Clear All Data', () => {
    beforeEach(async () => {
      await clearAllData();
    });

    it('should clear all data', async () => {
      // データを追加
      await saveQuestion({ id: 'q1', text: 'Q1', answer: true, category: 'cat1' });
      await saveProgress({ id: 'p1', questionId: 'q1', correct: true });
      await saveImportedFile({ id: 'f1', name: 'file.pdf', questionsCount: 1 });
      await addToSyncQueue({ type: 'CREATE_QUESTION', data: {} });

      // すべてクリア
      await clearAllData();

      const stats = await getStorageStats();

      expect(stats.questionsCount).toBe(0);
      expect(stats.progressCount).toBe(0);
      expect(stats.filesCount).toBe(0);
      expect(stats.queueCount).toBe(0);
    });
  });
});
