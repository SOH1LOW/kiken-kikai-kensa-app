import { describe, it, expect } from 'vitest';
import {
  parseAnswerKey,
  validateAnswerKey,
  formatAnswerKeyForDisplay,
  formatAnswerKeyForPreview,
  getAnswerKeyErrorMessage,
  tryParseAnswerKeyFlexible,
  getAnswerKeyStatistics,
} from '../lib/answer-key-parser';

describe('Answer Key Parser', () => {
  describe('parseAnswerKey', () => {
    it('should parse circle and cross format', () => {
      const result = parseAnswerKey('◯◯×◯×');
      expect(result.answers).toEqual([true, true, false, true, false]);
      expect(result.count).toBe(5);
      expect(result.errors.length).toBe(0);
    });

    it('should parse alternative circle symbol', () => {
      const result = parseAnswerKey('○○×○×');
      expect(result.answers).toEqual([true, true, false, true, false]);
      expect(result.count).toBe(5);
    });

    it('should parse Japanese format', () => {
      const result = parseAnswerKey('正誤正正誤');
      expect(result.answers).toEqual([true, false, true, true, false]);
      expect(result.count).toBe(5);
    });

    it('should parse English format', () => {
      const result = parseAnswerKey('TFTF');
      expect(result.answers).toEqual([true, false, true, false]);
      expect(result.count).toBe(4);
    });

    it('should ignore spaces and newlines', () => {
      const result = parseAnswerKey('◯◯ × ◯ ×\n◯');
      expect(result.answers).toEqual([true, true, false, true, false, true]);
      expect(result.count).toBe(6);
      expect(result.errors.length).toBe(0);
    });

    it('should handle mixed format', () => {
      const result = parseAnswerKey('◯正×誤T');
      expect(result.answers).toEqual([true, true, false, false, true]);
      expect(result.count).toBe(5);
      expect(result.format).toBe('mixed');
    });

    it('should detect invalid characters', () => {
      const result = parseAnswerKey('◯×ABC');
      expect(result.answers).toEqual([true, false]);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle empty input', () => {
      const result = parseAnswerKey('');
      expect(result.answers.length).toBe(0);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle whitespace only input', () => {
      const result = parseAnswerKey('   \n  \n  ');
      expect(result.answers.length).toBe(0);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateAnswerKey', () => {
    it('should validate correct answer key', () => {
      const parsed = parseAnswerKey('◯◯×◯×');
      const validation = validateAnswerKey(parsed, 5);
      expect(validation.isValid).toBe(true);
      expect(validation.mismatch).toBe(false);
    });

    it('should detect mismatch', () => {
      const parsed = parseAnswerKey('◯◯×◯×');
      const validation = validateAnswerKey(parsed, 10);
      expect(validation.isValid).toBe(false);
      expect(validation.mismatch).toBe(true);
      expect(validation.message).toContain('10問');
    });

    it('should include error messages', () => {
      const parsed = parseAnswerKey('◯×ABC');
      const validation = validateAnswerKey(parsed, 5);
      expect(validation.isValid).toBe(false);
    });
  });

  describe('formatAnswerKeyForDisplay', () => {
    it('should format as circle and cross', () => {
      const answers = [true, true, false, true, false];
      const formatted = formatAnswerKeyForDisplay(answers);
      expect(formatted).toBe('◯◯×◯×');
    });

    it('should handle empty array', () => {
      const formatted = formatAnswerKeyForDisplay([]);
      expect(formatted).toBe('');
    });
  });

  describe('formatAnswerKeyForPreview', () => {
    it('should format with line breaks', () => {
      const answers = Array(25).fill(true).map((_, i) => i % 2 === 0);
      const preview = formatAnswerKeyForPreview(answers, 10);
      const lines = preview.split('\n');
      expect(lines.length).toBe(3);
      expect(lines[0].length).toBe(10);
    });

    it('should handle partial last line', () => {
      const answers = [true, false, true];
      const preview = formatAnswerKeyForPreview(answers, 10);
      expect(preview).toBe('◯×◯');
    });
  });

  describe('getAnswerKeyErrorMessage', () => {
    it('should return valid message', () => {
      const result = getAnswerKeyErrorMessage('◯◯×◯×', 5);
      expect(result.isValid).toBe(true);
      expect(result.message).toContain('5問');
    });

    it('should return error message', () => {
      const result = getAnswerKeyErrorMessage('◯◯×◯×', 10);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('10問');
    });
  });

  describe('tryParseAnswerKeyFlexible', () => {
    it('should parse standard format', () => {
      const result = tryParseAnswerKeyFlexible('◯◯×◯×');
      expect(result.answers).toEqual([true, true, false, true, false]);
      expect(result.errors.length).toBe(0);
    });

    it('should handle flexible format with numbers', () => {
      const result = tryParseAnswerKeyFlexible('1101');
      expect(result.answers).toEqual([true, true, false, true]);
      expect(result.errors.length).toBe(0);
    });

    it('should handle Y/N format', () => {
      const result = tryParseAnswerKeyFlexible('YYNY');
      expect(result.answers).toEqual([true, true, false, true]);
      expect(result.errors.length).toBe(0);
    });
  });

  describe('getAnswerKeyStatistics', () => {
    it('should calculate statistics correctly', () => {
      const answers = [true, true, false, true, false];
      const stats = getAnswerKeyStatistics(answers);
      expect(stats.totalCount).toBe(5);
      expect(stats.circleCount).toBe(3);
      expect(stats.crossCount).toBe(2);
      expect(stats.circlePercentage).toBe(60);
      expect(stats.crossPercentage).toBe(40);
    });

    it('should handle empty array', () => {
      const stats = getAnswerKeyStatistics([]);
      expect(stats.totalCount).toBe(0);
      expect(stats.circleCount).toBe(0);
      expect(stats.crossCount).toBe(0);
      expect(stats.circlePercentage).toBe(0);
      expect(stats.crossPercentage).toBe(0);
    });

    it('should handle all true', () => {
      const answers = [true, true, true];
      const stats = getAnswerKeyStatistics(answers);
      expect(stats.circlePercentage).toBe(100);
      expect(stats.crossPercentage).toBe(0);
    });

    it('should handle all false', () => {
      const answers = [false, false, false];
      const stats = getAnswerKeyStatistics(answers);
      expect(stats.circlePercentage).toBe(0);
      expect(stats.crossPercentage).toBe(100);
    });
  });
});
