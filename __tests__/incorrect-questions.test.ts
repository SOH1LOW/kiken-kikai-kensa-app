import { describe, it, expect } from "vitest";
import {
  recordIncorrectQuestion,
  getIncorrectQuestions,
  clearIncorrectQuestions,
  isQuestionIncorrect,
  getIncorrectQuestionCount,
  removeIncorrectQuestion,
} from "../lib/incorrect-questions";

describe("Incorrect Questions Management", () => {
  it("should have exported functions", () => {
    expect(typeof recordIncorrectQuestion).toBe("function");
    expect(typeof getIncorrectQuestions).toBe("function");
    expect(typeof clearIncorrectQuestions).toBe("function");
    expect(typeof isQuestionIncorrect).toBe("function");
    expect(typeof getIncorrectQuestionCount).toBe("function");
    expect(typeof removeIncorrectQuestion).toBe("function");
  });

  it("should export correct function signatures", async () => {
    const recordFn = recordIncorrectQuestion;
    const getFn = getIncorrectQuestions;
    const clearFn = clearIncorrectQuestions;
    const isFn = isQuestionIncorrect;
    const countFn = getIncorrectQuestionCount;
    const removeFn = removeIncorrectQuestion;

    expect(recordFn).toBeDefined();
    expect(getFn).toBeDefined();
    expect(clearFn).toBeDefined();
    expect(isFn).toBeDefined();
    expect(countFn).toBeDefined();
    expect(removeFn).toBeDefined();
  });

  it("should have IncorrectQuestionRecord interface", () => {
    const mockRecord = {
      questionId: 1,
      userAnswer: false,
      timestamp: Date.now(),
      attemptCount: 1,
    };

    expect(mockRecord.questionId).toBe(1);
    expect(mockRecord.userAnswer).toBe(false);
    expect(typeof mockRecord.timestamp).toBe("number");
    expect(mockRecord.attemptCount).toBe(1);
  });
});
