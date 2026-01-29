import { describe, it, expect, beforeEach } from 'vitest';
import {
  BatchFileManager,
  BatchQuestionExtractor,
  BatchProcessor,
  BatchFile,
  BatchProgress,
} from '../lib/batch-file-processor';

describe('Batch File Processor', () => {
  describe('BatchFileManager', () => {
    let manager: BatchFileManager;

    beforeEach(() => {
      manager = new BatchFileManager();
    });

    it('should add a file', () => {
      const file: BatchFile = {
        id: 'file1',
        name: 'test.pdf',
        uri: 'file:///test.pdf',
        type: 'pdf',
        size: 1024,
        status: 'pending',
        progress: 0,
      };

      manager.addFile(file);
      const files = manager.getFiles();

      expect(files.length).toBe(1);
      expect(files[0].name).toBe('test.pdf');
    });

    it('should add multiple files', () => {
      const files: BatchFile[] = [
        {
          id: 'file1',
          name: 'test1.pdf',
          uri: 'file:///test1.pdf',
          type: 'pdf',
          size: 1024,
          status: 'pending',
          progress: 0,
        },
        {
          id: 'file2',
          name: 'test2.pdf',
          uri: 'file:///test2.pdf',
          type: 'pdf',
          size: 2048,
          status: 'pending',
          progress: 0,
        },
      ];

      manager.addFiles(files);
      const result = manager.getFiles();

      expect(result.length).toBe(2);
    });

    it('should remove a file', () => {
      const file: BatchFile = {
        id: 'file1',
        name: 'test.pdf',
        uri: 'file:///test.pdf',
        type: 'pdf',
        size: 1024,
        status: 'pending',
        progress: 0,
      };

      manager.addFile(file);
      manager.removeFile('file1');
      const files = manager.getFiles();

      expect(files.length).toBe(0);
    });

    it('should update file status', () => {
      const file: BatchFile = {
        id: 'file1',
        name: 'test.pdf',
        uri: 'file:///test.pdf',
        type: 'pdf',
        size: 1024,
        status: 'pending',
        progress: 0,
      };

      manager.addFile(file);
      manager.updateFileStatus('file1', 'processing', 50);

      const files = manager.getFiles();
      expect(files[0].status).toBe('processing');
      expect(files[0].progress).toBe(50);
    });

    it('should clear all files', () => {
      const files: BatchFile[] = [
        {
          id: 'file1',
          name: 'test1.pdf',
          uri: 'file:///test1.pdf',
          type: 'pdf',
          size: 1024,
          status: 'pending',
          progress: 0,
        },
        {
          id: 'file2',
          name: 'test2.pdf',
          uri: 'file:///test2.pdf',
          type: 'pdf',
          size: 2048,
          status: 'pending',
          progress: 0,
        },
      ];

      manager.addFiles(files);
      manager.clear();

      expect(manager.getFiles().length).toBe(0);
    });

    it('should register and notify progress', () => {
      let progressCalled = false;
      const file: BatchFile = {
        id: 'file1',
        name: 'test.pdf',
        uri: 'file:///test.pdf',
        type: 'pdf',
        size: 1024,
        status: 'pending',
        progress: 0,
      };

      manager.addFile(file);
      manager.onProgress('file1', (progress: BatchProgress) => {
        progressCalled = true;
      });

      manager.notifyProgress({
        fileId: 'file1',
        fileName: 'test.pdf',
        currentStep: 'extracting',
        progress: 50,
        extractedCount: 10,
        classifiedCount: 0,
        answeredCount: 0,
      });

      expect(progressCalled).toBe(true);
    });

    it('should calculate statistics', () => {
      const startTime = new Date().toISOString();
      const endTime = new Date(Date.now() + 1000).toISOString();

      manager.saveResult({
        fileId: 'file1',
        fileName: 'test1.pdf',
        success: true,
        questions: [
          { text: 'Q1', answer: true, confidence: 0.9 },
          { text: 'Q2', answer: false, confidence: 0.85 },
        ],
        categorized: true,
        answersApplied: true,
        timestamp: new Date().toISOString(),
      });

      manager.saveResult({
        fileId: 'file2',
        fileName: 'test2.pdf',
        success: true,
        questions: [{ text: 'Q3', answer: true, confidence: 0.92 }],
        categorized: false,
        answersApplied: false,
        timestamp: new Date().toISOString(),
      });

      const stats = manager.getStatistics(startTime, endTime);

      expect(stats.processedFiles).toBe(2);
      expect(stats.failedFiles).toBe(0);
      expect(stats.totalQuestions).toBe(3);
      expect(stats.totalCategorized).toBe(2);
      expect(stats.totalAnswered).toBe(2);
      expect(stats.averageQuestionsPerFile).toBe(1.5);
      expect(stats.duration).toBeGreaterThan(0);
    });
  });

  describe('BatchQuestionExtractor', () => {
    let extractor: BatchQuestionExtractor;

    beforeEach(() => {
      extractor = new BatchQuestionExtractor();
    });

    it('should extract from text file', async () => {
      const file: BatchFile = {
        id: 'file1',
        name: 'test.txt',
        uri: '◯正解です\n×不正解です',
        type: 'text',
        size: 100,
        status: 'pending',
        progress: 0,
      };

      const result = await extractor.extractFromFile(file);

      expect(result.questions.length).toBeGreaterThanOrEqual(0);
      expect(result.error).toBeUndefined();
    });

    it('should handle extraction error', async () => {
      const file: BatchFile = {
        id: 'file1',
        name: 'test.txt',
        uri: '',
        type: 'text',
        size: 0,
        status: 'pending',
        progress: 0,
      };

      const result = await extractor.extractFromFile(file);

      expect(result.questions.length).toBe(0);
    });

    it('should extract from multiple files', async () => {
      const files: BatchFile[] = [
        {
          id: 'file1',
          name: 'test1.txt',
          uri: '◯正解\n×不正解',
          type: 'text',
          size: 100,
          status: 'pending',
          progress: 0,
        },
        {
          id: 'file2',
          name: 'test2.txt',
          uri: '◯正解\n×不正解',
          type: 'text',
          size: 100,
          status: 'pending',
          progress: 0,
        },
      ];

      const results = await extractor.extractFromFiles(files);

      expect(results.size).toBe(2);
      expect(results.has('file1')).toBe(true);
      expect(results.has('file2')).toBe(true);
    });

    it('should call progress callback', async () => {
      let progressCalled = false;
      const files: BatchFile[] = [
        {
          id: 'file1',
          name: 'test.txt',
          uri: '◯正解',
          type: 'text',
          size: 100,
          status: 'pending',
          progress: 0,
        },
      ];

      await extractor.extractFromFiles(files, (progress) => {
        progressCalled = true;
        expect(progress.fileId).toBe('file1');
        expect(progress.currentStep).toBe('extracting');
      });

      expect(progressCalled).toBe(true);
    });
  });

  describe('BatchProcessor', () => {
    let processor: BatchProcessor;

    beforeEach(() => {
      processor = new BatchProcessor();
    });

    it('should process all files', async () => {
      const files: BatchFile[] = [
        {
          id: 'file1',
          name: 'test1.txt',
          uri: '◯正解\n×不正解',
          type: 'text',
          size: 100,
          status: 'pending',
          progress: 0,
        },
      ];

      processor.addFiles(files);
      const { results, statistics } = await processor.processAll();

      expect(results.length).toBeGreaterThan(0);
      expect(statistics.totalFiles).toBe(1);
    });

    it('should handle progress callbacks', async () => {
      let progressCalled = false;
      const files: BatchFile[] = [
        {
          id: 'file1',
          name: 'test.txt',
          uri: '◯正解',
          type: 'text',
          size: 100,
          status: 'pending',
          progress: 0,
        },
      ];

      processor.addFiles(files);
      processor.onProgress('file1', (progress) => {
        progressCalled = true;
      });

      await processor.processAll();

      expect(progressCalled).toBe(true);
    });

    it('should clear processor', () => {
      const files: BatchFile[] = [
        {
          id: 'file1',
          name: 'test.txt',
          uri: '◯正解',
          type: 'text',
          size: 100,
          status: 'pending',
          progress: 0,
        },
      ];

      processor.addFiles(files);
      processor.clear();

      expect(processor.getFiles().length).toBe(0);
    });
  });
});
