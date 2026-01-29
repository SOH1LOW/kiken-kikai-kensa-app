import { describe, it, expect } from 'vitest';
import { ocrExtraction, ExtractedQuestion } from '../lib/ocr-extraction';

describe('OCR Extraction', () => {
  describe('extractQuestionsFromText', () => {
    it('should extract questions with circle answer', () => {
      const text = 'マイクロメータは高精度である ◯';
      const result = ocrExtraction.extractQuestionsFromText(text);
      
      expect(result.extractedQuestions.length).toBe(1);
      expect(result.extractedQuestions[0].text).toBe('マイクロメータは高精度である');
      expect(result.extractedQuestions[0].answer).toBe(true);
      expect(result.extractedQuestions[0].confidence).toBeGreaterThan(0.9);
    });

    it('should extract questions with cross answer', () => {
      const text = 'ノギスの精度はマイクロメータより高い ×';
      const result = ocrExtraction.extractQuestionsFromText(text);
      
      expect(result.extractedQuestions.length).toBe(1);
      expect(result.extractedQuestions[0].answer).toBe(false);
    });

    it('should extract multiple questions', () => {
      const text = `マイクロメータは高精度である ◯
ノギスは低精度である ×
ダイヤルゲージは相対測定に使用される ◯`;
      const result = ocrExtraction.extractQuestionsFromText(text);
      
      expect(result.extractedQuestions.length).toBe(3);
      expect(result.extractedQuestions[0].answer).toBe(true);
      expect(result.extractedQuestions[1].answer).toBe(false);
      expect(result.extractedQuestions[2].answer).toBe(true);
    });

    it('should handle questions with 正/誤 format', () => {
      const text = `問題文1 正
問題文2 誤`;
      const result = ocrExtraction.extractQuestionsFromText(text);
      
      expect(result.extractedQuestions.length).toBe(2);
      expect(result.extractedQuestions[0].answer).toBe(true);
      expect(result.extractedQuestions[1].answer).toBe(false);
    });

    it('should handle empty text', () => {
      const result = ocrExtraction.extractQuestionsFromText('');
      
      expect(result.extractedQuestions.length).toBe(0);
      expect(result.confidence).toBe(0);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should calculate average confidence', () => {
      const text = `問題1 ◯
問題2 ×
問題3 正`;
      const result = ocrExtraction.extractQuestionsFromText(text);
      
      expect(result.confidence).toBeGreaterThan(0.85);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('parseQuestionLine', () => {
    it('should parse circle format', () => {
      const result = ocrExtraction.parseQuestionLine('テスト問題 ◯');
      
      expect(result).not.toBeNull();
      expect(result?.questionText).toBe('テスト問題');
      expect(result?.answer).toBe(true);
    });

    it('should parse cross format', () => {
      const result = ocrExtraction.parseQuestionLine('テスト問題 ×');
      
      expect(result).not.toBeNull();
      expect(result?.answer).toBe(false);
    });

    it('should parse tab-separated format', () => {
      const result = ocrExtraction.parseQuestionLine('テスト問題\t◯');
      
      expect(result).not.toBeNull();
      expect(result?.answer).toBe(true);
    });

    it('should return null for invalid format', () => {
      const result = ocrExtraction.parseQuestionLine('テスト問題');
      
      expect(result).toBeNull();
    });
  });

  describe('convertToQuestions', () => {
    it('should convert extracted questions to Question type', () => {
      const extracted: ExtractedQuestion[] = [
        {
          text: '問題1',
          answer: true,
          confidence: 0.95,
        },
        {
          text: '問題2',
          answer: false,
          confidence: 0.90,
        },
      ];

      const questions = ocrExtraction.convertToQuestions(extracted, 'テストカテゴリ');

      expect(questions.length).toBe(2);
      expect(questions[0].text).toBe('問題1');
      expect(questions[0].answer).toBe(true);
      expect(questions[0].category).toBe('テストカテゴリ');
      expect(questions[1].answer).toBe(false);
    });

    it('should filter out questions with null answer', () => {
      const extracted: ExtractedQuestion[] = [
        {
          text: '問題1',
          answer: true,
          confidence: 0.95,
        },
        {
          text: '問題2',
          answer: null,
          confidence: 0.50,
        },
      ];

      const questions = ocrExtraction.convertToQuestions(extracted);

      expect(questions.length).toBe(1);
    });
  });

  describe('validateQuestion', () => {
    it('should validate valid question', () => {
      const question: ExtractedQuestion = {
        text: 'これは有効な問題です',
        answer: true,
        confidence: 0.95,
      };

      const result = ocrExtraction.validateQuestion(question);

      expect(result.valid).toBe(true);
      expect(result.issues.length).toBe(0);
    });

    it('should detect empty question text', () => {
      const question: ExtractedQuestion = {
        text: '',
        answer: true,
        confidence: 0.95,
      };

      const result = ocrExtraction.validateQuestion(question);

      expect(result.valid).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it('should detect low confidence', () => {
      const question: ExtractedQuestion = {
        text: '問題',
        answer: true,
        confidence: 0.60,
      };

      const result = ocrExtraction.validateQuestion(question);

      expect(result.valid).toBe(false);
    });

    it('should detect null answer', () => {
      const question: ExtractedQuestion = {
        text: '問題',
        answer: null,
        confidence: 0.95,
      };

      const result = ocrExtraction.validateQuestion(question);

      expect(result.valid).toBe(false);
    });
  });

  describe('detectDuplicates', () => {
    it('should detect duplicate questions', () => {
      const questions = [
        {
          id: 1,
          text: 'マイクロメータは高精度である',
          answer: true,
          explanation: '説明',
          category: 'テスト',
        },
        {
          id: 2,
          text: 'マイクロメータは高精度である',
          answer: true,
          explanation: '説明',
          category: 'テスト',
        },
      ];

      const result = ocrExtraction.detectDuplicates(questions);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should not detect non-duplicate questions', () => {
      const questions = [
        {
          id: 1,
          text: '問題1',
          answer: true,
          explanation: '説明',
          category: 'テスト',
        },
        {
          id: 2,
          text: '問題2',
          answer: true,
          explanation: '説明',
          category: 'テスト',
        },
      ];

      const result = ocrExtraction.detectDuplicates(questions);

      expect(result.length).toBe(0);
    });
  });

  describe('generateSummary', () => {
    it('should generate summary', () => {
      const result = ocrExtraction.extractQuestionsFromText(`問題1 ◯
問題2 ×`);

      const summary = ocrExtraction.generateSummary(result);

      expect(summary).toContain('抽出結果');
      expect(summary).toContain('2問');
      expect(summary).toContain('信頼度');
    });
  });
});
