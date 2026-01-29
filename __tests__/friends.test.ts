import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  calculateComparison,
  getComparisonSummary,
  getComparisonMessage,
  formatFollowDate,
  type Friend,
} from "../lib/friends";
import type { UserRankingData } from "../lib/ranking";

describe("Friends Utilities", () => {
  const mockCurrentUser: UserRankingData = {
    userId: "user_current",
    userName: "テストユーザー",
    level: 5,
    totalTests: 100,
    averageScore: 85,
    highestScore: 100,
    totalCorrectAnswers: 2550,
    totalQuestions: 3000,
    experience: 500,
    badges: 8,
    lastTestDate: new Date().toISOString(),
  };

  const mockFriend: Friend = {
    userId: "user_friend",
    userName: "フレンド",
    level: 3,
    totalTests: 50,
    averageScore: 70,
    highestScore: 95,
    totalCorrectAnswers: 1050,
    totalQuestions: 1500,
    experience: 250,
    badges: 5,
    lastTestDate: new Date().toISOString(),
    followedAt: new Date().toISOString(),
  };

  describe("calculateComparison", () => {
    it("should calculate comparison correctly", () => {
      const comparison = calculateComparison(mockCurrentUser, mockFriend);

      expect(comparison.scoreComparison.yourScore).toBe(85);
      expect(comparison.scoreComparison.friendScore).toBe(70);
      expect(comparison.scoreComparison.youAhead).toBe(true);
      expect(comparison.levelComparison.youAhead).toBe(true);
    });

    it("should handle equal scores", () => {
      const equalFriend = { ...mockFriend, averageScore: 85 };
      const comparison = calculateComparison(mockCurrentUser, equalFriend);

      expect(comparison.scoreComparison.difference).toBe(0);
      expect(comparison.scoreComparison.youAhead).toBe(false);
    });
  });

  describe("getComparisonSummary", () => {
    it("should count ahead/behind correctly", () => {
      const comparison = calculateComparison(mockCurrentUser, mockFriend);
      const summary = getComparisonSummary(comparison);

      expect(summary.youAheadCount).toBeGreaterThan(0);
      expect(summary.youAheadCount + summary.friendAheadCount + summary.tiedCount).toBe(4);
    });
  });

  describe("getComparisonMessage", () => {
    it("should return correct message for user ahead", () => {
      const message = getComparisonMessage(3, 1);
      expect(message).toBe("あなたが優勢です！");
    });

    it("should return correct message for friend ahead", () => {
      const message = getComparisonMessage(1, 3);
      expect(message).toBe("相手が優勢です");
    });

    it("should return correct message for tie", () => {
      const message = getComparisonMessage(2, 2);
      expect(message).toBe("互角です！");
    });
  });

  describe("formatFollowDate", () => {
    it("should format recent dates", () => {
      const now = new Date();
      const formatted = formatFollowDate(now.toISOString());
      expect(formatted).toBe("今日");
    });

    it("should format yesterday", () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const formatted = formatFollowDate(yesterday.toISOString());
      expect(formatted).toBe("昨日");
    });

    it("should format days ago", () => {
      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      const formatted = formatFollowDate(fiveDaysAgo.toISOString());
      expect(formatted).toContain("日前");
    });
  });
});
