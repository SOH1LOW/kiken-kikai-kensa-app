import { describe, it, expect } from "vitest";
// @ts-ignore - path alias resolution in test environment
import {
  formatTime,
  calculateScore,
  type MockExamSession,
} from "../lib/mock-exam";

describe("Mock Exam Utilities", () => {
  it("formatTime should convert milliseconds to MM:SS format", () => {
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(60000)).toBe("01:00");
    expect(formatTime(3600000)).toBe("60:00");
    expect(formatTime(3661000)).toBe("61:01");
  });

  it("calculateScore should return correct percentage", () => {
    expect(calculateScore(30, 30)).toBe(100);
    expect(calculateScore(21, 30)).toBe(70);
    expect(calculateScore(15, 30)).toBe(50);
    expect(calculateScore(0, 30)).toBe(0);
  });

  it("calculateScore should round correctly", () => {
    expect(calculateScore(23, 30)).toBe(77); // 76.67 rounded to 77
    expect(calculateScore(22, 30)).toBe(73); // 73.33 rounded to 73
  });

  it("MockExamSession should have correct structure", () => {
    const session: MockExamSession = {
      id: "test_123",
      startTime: 1000,
      endTime: 4000,
      answers: { 1: true, 2: false, 3: true },
      timeSpent: 3000,
      score: 80,
      totalQuestions: 30,
      correctAnswers: 24,
      date: "2024-01-28",
    };

    expect(session.id).toBe("test_123");
    expect(session.score).toBe(80);
    expect(session.correctAnswers).toBe(24);
    expect(session.totalQuestions).toBe(30);
  });
});
