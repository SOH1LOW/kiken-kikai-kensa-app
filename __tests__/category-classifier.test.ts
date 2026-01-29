import { describe, it, expect } from 'vitest';
import {
  AVAILABLE_CATEGORIES,
  classifyQuestionWithLLM,
  convertToQuestionsWithCategory,
  filterByConfidence,
  detectLowConfidenceResults,
  generateClassificationSummary,
  type ClassificationResult,
} from '../lib/category-classifier';

describe('Category Classifier', () => {
  describe('AVAILABLE_CATEGORIES', () => {
    it('should have 17 categories', () => {
      expect(AVAILABLE_CATEGORIES.length).toBe(17);
    });

    it('should contain expected categories', () => {
      expect(AVAILABLE_CATEGORIES).toContain('測定機器');
      expect(AVAILABLE_CATEGORIES).toContain('寸法測定');
      expect(AVAILABLE_CATEGORIES).toContain('角度測定');
      expect(AVAILABLE_CATEGORIES).toContain('非破壊検査');
    });
  });

  describe('classifyQuestionWithLLM', () => {
    it('should parse valid LLM response', async () => {
      const questionText = 'マイクロメータは高精度である';
      const llmResponse = JSON.stringify({
        category: '測定機器',
        confidence: 0.95,
        reasoning: 'マイクロメータは測定機器の一種です',
      });

      const result = await classifyQuestionWithLLM(questionText, llmResponse);

      expect(result.questionText).toBe(questionText);
      expect(result.suggestedCategory).toBe('測定機器');
      expect(result.confidence).toBe(0.95);
      expect(result.reasoning).toBe('マイクロメータは測定機器の一種です');
    });

    it('should clamp confidence between 0 and 1', async () => {
      const questionText = 'テスト';
      const llmResponse = JSON.stringify({
        category: '測定機器',
        confidence: 1.5, // 範囲外
        reasoning: 'テスト',
      });

      const result = await classifyQuestionWithLLM(questionText, llmResponse);

      expect(result.confidence).toBe(1);
    });

    it('should throw on invalid category', async () => {
      const questionText = 'テスト';
      const llmResponse = JSON.stringify({
        category: '存在しないカテゴリ',
        confidence: 0.9,
        reasoning: 'テスト',
      });

      await expect(classifyQuestionWithLLM(questionText, llmResponse)).rejects.toThrow();
    });

    it('should throw on invalid JSON', async () => {
      const questionText = 'テスト';
      const llmResponse = 'invalid json';

      await expect(classifyQuestionWithLLM(questionText, llmResponse)).rejects.toThrow();
    });
  });

  describe('convertToQuestionsWithCategory', () => {
    it('should convert classification results to Question type', () => {
      const results: ClassificationResult[] = [
        {
          questionText: '問題1',
          suggestedCategory: '測定機器',
          confidence: 0.95,
          reasoning: '理由1',
        },
        {
          questionText: '問題2',
          suggestedCategory: '寸法測定',
          confidence: 0.85,
          reasoning: '理由2',
        },
      ];

      const questions = convertToQuestionsWithCategory(results);

      expect(questions.length).toBe(2);
      expect(questions[0].text).toBe('問題1');
      expect(questions[0].category).toBe('測定機器');
      expect(questions[1].text).toBe('問題2');
      expect(questions[1].category).toBe('寸法測定');
    });

    it('should include confidence in explanation', () => {
      const results: ClassificationResult[] = [
        {
          questionText: 'テスト',
          suggestedCategory: '測定機器',
          confidence: 0.92,
          reasoning: 'テスト理由',
        },
      ];

      const questions = convertToQuestionsWithCategory(results);

      expect(questions[0].explanation).toContain('92.0%');
      expect(questions[0].explanation).toContain('テスト理由');
    });
  });

  describe('filterByConfidence', () => {
    it('should filter results by confidence threshold', () => {
      const results: ClassificationResult[] = [
        {
          questionText: '問題1',
          suggestedCategory: '測定機器',
          confidence: 0.95,
          reasoning: '理由1',
        },
        {
          questionText: '問題2',
          suggestedCategory: '寸法測定',
          confidence: 0.65,
          reasoning: '理由2',
        },
        {
          questionText: '問題3',
          suggestedCategory: '角度測定',
          confidence: 0.75,
          reasoning: '理由3',
        },
      ];

      const filtered = filterByConfidence(results, 0.7);

      expect(filtered.length).toBe(2);
      expect(filtered[0].questionText).toBe('問題1');
      expect(filtered[1].questionText).toBe('問題3');
    });

    it('should use default threshold of 0.7', () => {
      const results: ClassificationResult[] = [
        {
          questionText: '問題1',
          suggestedCategory: '測定機器',
          confidence: 0.7,
          reasoning: '理由1',
        },
        {
          questionText: '問題2',
          suggestedCategory: '寸法測定',
          confidence: 0.69,
          reasoning: '理由2',
        },
      ];

      const filtered = filterByConfidence(results);

      expect(filtered.length).toBe(1);
      expect(filtered[0].questionText).toBe('問題1');
    });
  });

  describe('detectLowConfidenceResults', () => {
    it('should detect low confidence results', () => {
      const results: ClassificationResult[] = [
        {
          questionText: '問題1',
          suggestedCategory: '測定機器',
          confidence: 0.95,
          reasoning: '理由1',
        },
        {
          questionText: '問題2',
          suggestedCategory: '寸法測定',
          confidence: 0.55,
          reasoning: '理由2',
        },
        {
          questionText: '問題3',
          suggestedCategory: '角度測定',
          confidence: 0.65,
          reasoning: '理由3',
        },
      ];

      const lowConfidence = detectLowConfidenceResults(results, 0.7);

      expect(lowConfidence.length).toBe(2);
      expect(lowConfidence[0].questionText).toBe('問題2');
      expect(lowConfidence[1].questionText).toBe('問題3');
    });

    it('should use default threshold of 0.6', () => {
      const results: ClassificationResult[] = [
        {
          questionText: '問題1',
          suggestedCategory: '測定機器',
          confidence: 0.6,
          reasoning: '理由1',
        },
        {
          questionText: '問題2',
          suggestedCategory: '寸法測定',
          confidence: 0.59,
          reasoning: '理由2',
        },
      ];

      const lowConfidence = detectLowConfidenceResults(results);

      expect(lowConfidence.length).toBe(1);
      expect(lowConfidence[0].questionText).toBe('問題2');
    });
  });

  describe('generateClassificationSummary', () => {
    it('should generate summary with statistics', () => {
      const result = {
        results: [
          {
            questionText: '問題1',
            suggestedCategory: '測定機器' as const,
            confidence: 0.95,
            reasoning: '理由1',
          },
          {
            questionText: '問題2',
            suggestedCategory: '測定機器' as const,
            confidence: 0.85,
            reasoning: '理由2',
          },
          {
            questionText: '問題3',
            suggestedCategory: '寸法測定' as const,
            confidence: 0.75,
            reasoning: '理由3',
          },
        ],
        totalProcessed: 3,
        successCount: 3,
        failureCount: 0,
        averageConfidence: 0.85,
      };

      const summary = generateClassificationSummary(result);

      expect(summary).toContain('処理済み: 3問');
      expect(summary).toContain('成功: 3問');
      expect(summary).toContain('失敗: 0問');
      expect(summary).toContain('85.0%');
      expect(summary).toContain('測定機器: 2問');
      expect(summary).toContain('寸法測定: 1問');
    });

    it('should handle empty results', () => {
      const result = {
        results: [],
        totalProcessed: 0,
        successCount: 0,
        failureCount: 0,
        averageConfidence: 0,
      };

      const summary = generateClassificationSummary(result);

      expect(summary).toContain('処理済み: 0問');
      expect(summary).toContain('0.0%');
    });
  });
});
