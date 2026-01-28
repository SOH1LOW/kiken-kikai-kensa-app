import { describe, it, expect } from "vitest";
import {
  getCorrectRateColor,
  getDifficultyLabel,
  type CategoryAnalytics,
} from "../lib/analytics";

describe("Analytics Utilities", () => {
  it("getCorrectRateColor should return correct color for different rates", () => {
    expect(getCorrectRateColor(85)).toBe("#22C55E"); // success (green)
    expect(getCorrectRateColor(70)).toBe("#F59E0B"); // warning (orange)
    expect(getCorrectRateColor(50)).toBe("#EF4444"); // error (red)
  });

  it("getDifficultyLabel should return correct label", () => {
    expect(getDifficultyLabel("easy")).toBe("得意");
    expect(getDifficultyLabel("medium")).toBe("普通");
    expect(getDifficultyLabel("hard")).toBe("苦手");
  });

  it("CategoryAnalytics should have correct structure", () => {
    const category: CategoryAnalytics = {
      categoryName: "測定機器",
      totalQuestions: 10,
      correctAnswers: 8,
      correctRate: 80,
      difficulty: "easy",
    };

    expect(category.categoryName).toBe("測定機器");
    expect(category.correctRate).toBe(80);
    expect(category.difficulty).toBe("easy");
  });

  it("getCorrectRateColor should handle boundary values", () => {
    expect(getCorrectRateColor(80)).toBe("#22C55E"); // exactly 80
    expect(getCorrectRateColor(60)).toBe("#F59E0B"); // exactly 60
    expect(getCorrectRateColor(0)).toBe("#EF4444"); // minimum
    expect(getCorrectRateColor(100)).toBe("#22C55E"); // maximum
  });
});
