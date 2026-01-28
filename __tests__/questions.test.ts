import { describe, it, expect } from "vitest";
import { questions, getRandomQuestions } from "../data/questions";

describe("Questions Data", () => {
  it("should have at least 100 questions", () => {
    expect(questions.length).toBeGreaterThanOrEqual(100);
  });

  it("should have all questions with required fields", () => {
    questions.forEach((question) => {
      expect(question).toHaveProperty("id");
      expect(question).toHaveProperty("text");
      expect(question).toHaveProperty("answer");
      expect(question).toHaveProperty("explanation");
      expect(question).toHaveProperty("category");
      
      expect(typeof question.id).toBe("number");
      expect(typeof question.text).toBe("string");
      expect(typeof question.answer).toBe("boolean");
      expect(typeof question.explanation).toBe("string");
      expect(typeof question.category).toBe("string");
      
      expect(question.text.length).toBeGreaterThan(0);
      expect(question.explanation.length).toBeGreaterThan(0);
      expect(question.category.length).toBeGreaterThan(0);
    });
  });

  it("should have unique question IDs", () => {
    const ids = questions.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(questions.length);
  });

  it("should have both true and false answers", () => {
    const trueAnswers = questions.filter((q) => q.answer === true);
    const falseAnswers = questions.filter((q) => q.answer === false);
    
    expect(trueAnswers.length).toBeGreaterThan(0);
    expect(falseAnswers.length).toBeGreaterThan(0);
  });

  it("should return 30 random questions when requested", () => {
    const randomQuestions = getRandomQuestions(30);
    expect(randomQuestions.length).toBe(30);
  });

  it("should return requested number of questions", () => {
    const randomQuestions = getRandomQuestions(10);
    expect(randomQuestions.length).toBe(10);
  });

  it("should return different questions on multiple calls", () => {
    const firstSet = getRandomQuestions(30);
    const secondSet = getRandomQuestions(30);
    
    // Check if at least some questions are different
    const firstIds = firstSet.map((q) => q.id).join(",");
    const secondIds = secondSet.map((q) => q.id).join(",");
    
    // It's extremely unlikely (but possible) that two random selections are identical
    // We'll check if they're different in most cases
    const isDifferent = firstIds !== secondIds;
    expect(isDifferent).toBe(true);
  });

  it("should have multiple categories", () => {
    const categories = new Set(questions.map((q) => q.category));
    expect(categories.size).toBeGreaterThan(5);
  });
});
