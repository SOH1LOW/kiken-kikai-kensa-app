import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  calculateRankingScore,
  getRankingTier,
  getTierColor,
  calculateImprovement,
  formatLastTestDate,
  type UserRankingData,
} from "../lib/ranking";

describe("Ranking Utilities", () => {
  const mockUser: UserRankingData = {
    userId: "user_001",
    userName: "テストユーザー",
    level: 3,
    totalTests: 50,
    averageScore: 85,
    highestScore: 98,
    totalCorrectAnswers: 1275,
    totalQuestions: 1500,
    experience: 250,
    badges: 5,
    lastTestDate: new Date().toISOString(),
  };

  describe("calculateRankingScore", () => {
    it("should calculate ranking score correctly", () => {
      const score = calculateRankingScore(mockUser);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should return higher score for better performance", () => {
      const goodUser = { ...mockUser, averageScore: 95, totalTests: 100 };
      const poorUser = { ...mockUser, averageScore: 50, totalTests: 10 };

      const goodScore = calculateRankingScore(goodUser);
      const poorScore = calculateRankingScore(poorUser);

      expect(goodScore).toBeGreaterThan(poorScore);
    });
  });

  describe("getRankingTier", () => {
    it("should return correct tier for score", () => {
      expect(getRankingTier(95)).toBe("S");
      expect(getRankingTier(85)).toBe("A");
      expect(getRankingTier(75)).toBe("B");
      expect(getRankingTier(65)).toBe("C");
      expect(getRankingTier(55)).toBe("D");
      expect(getRankingTier(45)).toBe("E");
    });

    it("should handle boundary values", () => {
      expect(getRankingTier(90)).toBe("S");
      expect(getRankingTier(89)).toBe("A");
      expect(getRankingTier(80)).toBe("A");
      expect(getRankingTier(79)).toBe("B");
    });
  });

  describe("getTierColor", () => {
    it("should return correct color for tier", () => {
      expect(getTierColor("S")).toBe("#FF6B6B");
      expect(getTierColor("A")).toBe("#FFA500");
      expect(getTierColor("B")).toBe("#FFD700");
      expect(getTierColor("C")).toBe("#4ECDC4");
      expect(getTierColor("D")).toBe("#95E1D3");
      expect(getTierColor("E")).toBe("#C0C0C0");
    });

    it("should return default color for unknown tier", () => {
      expect(getTierColor("X")).toBe("#CCCCCC");
    });
  });

  describe("calculateImprovement", () => {
    it("should calculate positive improvement", () => {
      const result = calculateImprovement(70, 85);
      expect(result.improved).toBe(true);
      expect(result.percentage).toBeGreaterThan(0);
    });

    it("should calculate negative improvement", () => {
      const result = calculateImprovement(85, 70);
      expect(result.improved).toBe(false);
      expect(result.percentage).toBeGreaterThan(0);
    });

    it("should handle zero improvement", () => {
      const result = calculateImprovement(80, 80);
      expect(result.improved).toBe(false);
      expect(result.percentage).toBe(0);
    });
  });

  describe("formatLastTestDate", () => {
    it("should format recent dates correctly", () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

      const formatted = formatLastTestDate(fiveMinutesAgo.toISOString());
      expect(formatted).toContain("分前");
    });

    it("should format old dates correctly", () => {
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      const formatted = formatLastTestDate(tenDaysAgo.toISOString());
      expect(formatted).not.toContain("分前");
    });

    it("should handle immediate time", () => {
      const now = new Date();
      const formatted = formatLastTestDate(now.toISOString());
      expect(formatted).toBe("今");
    });
  });
});
