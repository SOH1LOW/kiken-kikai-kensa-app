import { describe, it, expect, beforeEach } from 'vitest';
import {
  DragDropHandler,
  DragDropStateManager,
  DragDropState,
} from '../lib/drag-drop-handler';

describe('Drag & Drop Handler', () => {
  describe('DragDropHandler', () => {
    it('should validate PDF file', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const result = DragDropHandler.validateFile(file);

      expect(result.isValid).toBe(true);
    });

    it('should validate image file', () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const result = DragDropHandler.validateFile(file);

      expect(result.isValid).toBe(true);
    });

    it('should validate text file', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const result = DragDropHandler.validateFile(file);

      expect(result.isValid).toBe(true);
    });

    it('should reject unsupported file type', () => {
      const file = new File(['content'], 'test.exe', { type: 'application/x-msdownload' });
      const result = DragDropHandler.validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject file exceeding size limit', () => {
      const largeContent = new Uint8Array(51 * 1024 * 1024); // 51MB
      const file = new File([largeContent], 'large.pdf', { type: 'application/pdf' });
      const result = DragDropHandler.validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('サイズ');
    });

    it('should convert file to BatchFile', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const result = DragDropHandler.fileToBatchFile(file);

      expect(result.isValid).toBe(true);
      expect(result.file).toBeDefined();
      expect(result.file?.type).toBe('pdf');
      expect(result.file?.name).toBe('test.pdf');
    });

    it('should detect PDF type correctly', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const result = DragDropHandler.fileToBatchFile(file);

      expect(result.file?.type).toBe('pdf');
    });

    it('should detect image type correctly', () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const result = DragDropHandler.fileToBatchFile(file);

      expect(result.file?.type).toBe('image');
    });

    it('should detect text type correctly', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const result = DragDropHandler.fileToBatchFile(file);

      expect(result.file?.type).toBe('text');
    });

    it('should process multiple files', () => {
      const files = [
        new File(['content'], 'test1.pdf', { type: 'application/pdf' }),
        new File(['content'], 'test2.jpg', { type: 'image/jpeg' }),
        new File(['content'], 'test3.txt', { type: 'text/plain' }),
      ];

      const result = DragDropHandler.processFiles(files);

      expect(result.validFiles.length).toBe(3);
      expect(result.invalidFiles.length).toBe(0);
    });

    it('should separate valid and invalid files', () => {
      const files = [
        new File(['content'], 'test1.pdf', { type: 'application/pdf' }),
        new File(['content'], 'test2.exe', { type: 'application/x-msdownload' }),
        new File(['content'], 'test3.txt', { type: 'text/plain' }),
      ];

      const result = DragDropHandler.processFiles(files);

      expect(result.validFiles.length).toBe(2);
      expect(result.invalidFiles.length).toBe(1);
    });

    it('should format file size correctly', () => {
      expect(DragDropHandler.formatFileSize(0)).toBe('0 Bytes');
      expect(DragDropHandler.formatFileSize(1024)).toContain('KB');
      expect(DragDropHandler.formatFileSize(1024 * 1024)).toContain('MB');
    });

    it('should get validation error message', () => {
      const invalidFiles = [
        { name: 'test.exe', reason: 'サポートされていないファイル形式です' },
      ];

      const message = DragDropHandler.getValidationErrorMessage(invalidFiles);

      expect(message).toContain('test.exe');
      expect(message).toContain('サポートされていない');
    });

    it('should return empty message for valid files', () => {
      const message = DragDropHandler.getValidationErrorMessage([]);

      expect(message).toBe('');
    });

    it('should get supported formats description', () => {
      const description = DragDropHandler.getSupportedFormatsDescription();

      expect(description).toContain('PDF');
      expect(description).toContain('画像');
      expect(description).toContain('テキスト');
    });
  });

  describe('DragDropStateManager', () => {
    let manager: DragDropStateManager;

    beforeEach(() => {
      manager = new DragDropStateManager();
    });

    it('should initialize with default state', () => {
      const state = manager.getState();

      expect(state.isDragging).toBe(false);
      expect(state.draggedFileCount).toBe(0);
      expect(state.validFiles.length).toBe(0);
      expect(state.invalidFiles.length).toBe(0);
    });

    it('should reset state', () => {
      manager.startDrag(3);
      manager.reset();

      const state = manager.getState();

      expect(state.isDragging).toBe(false);
      expect(state.draggedFileCount).toBe(0);
    });

    it('should start drag', () => {
      manager.startDrag(3);

      const state = manager.getState();

      expect(state.isDragging).toBe(true);
      expect(state.draggedFileCount).toBe(3);
    });

    it('should end drag', () => {
      manager.startDrag(3);
      manager.endDrag();

      const state = manager.getState();

      expect(state.isDragging).toBe(false);
      expect(state.draggedFileCount).toBe(0);
    });

    it('should set files', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const batchFile = DragDropHandler.fileToBatchFile(file).file!;

      manager.setFiles([batchFile], []);

      const state = manager.getState();

      expect(state.validFiles.length).toBe(1);
      expect(state.invalidFiles.length).toBe(0);
    });

    it('should add files', () => {
      const file1 = new File(['content'], 'test1.pdf', { type: 'application/pdf' });
      const file2 = new File(['content'], 'test2.pdf', { type: 'application/pdf' });
      const batchFile1 = DragDropHandler.fileToBatchFile(file1).file!;
      const batchFile2 = DragDropHandler.fileToBatchFile(file2).file!;

      manager.addFiles([batchFile1], []);
      manager.addFiles([batchFile2], []);

      const state = manager.getState();

      expect(state.validFiles.length).toBe(2);
    });

    it('should remove file', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const batchFile = DragDropHandler.fileToBatchFile(file).file!;

      manager.setFiles([batchFile], []);
      manager.removeFile(batchFile.id);

      const state = manager.getState();

      expect(state.validFiles.length).toBe(0);
    });

    it('should notify subscribers', () => {
      let notificationCount = 0;

      manager.subscribe(() => {
        notificationCount++;
      });

      manager.startDrag(1);

      expect(notificationCount).toBeGreaterThan(0);
    });

    it('should unsubscribe listener', () => {
      let notificationCount = 0;

      const unsubscribe = manager.subscribe(() => {
        notificationCount++;
      });

      manager.startDrag(1);
      const countAfterFirstNotification = notificationCount;

      unsubscribe();
      manager.endDrag();

      expect(notificationCount).toBe(countAfterFirstNotification);
    });
  });
});
