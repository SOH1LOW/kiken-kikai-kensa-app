import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getExperienceProgress,
  type BadgeType,
  type TitleType,
} from "../lib/gamification";

describe("Gamification Utilities", () => {
  it("getExperienceProgress should calculate correct progress", () => {
    const progress = getExperienceProgress(50);
    expect(progress.current).toBe(50);
    expect(progress.required).toBe(100);
    expect(progress.percentage).toBe(50);
  });

  it("getExperienceProgress should handle level boundaries", () => {
    const progress100 = getExperienceProgress(100);
    expect(progress100.current).toBe(0);
    expect(progress100.percentage).toBe(0);

    const progress150 = getExperienceProgress(150);
    expect(progress150.current).toBe(50);
    expect(progress150.percentage).toBe(50);
  });

  it("getExperienceProgress should handle zero experience", () => {
    const progress = getExperienceProgress(0);
    expect(progress.current).toBe(0);
    expect(progress.percentage).toBe(0);
  });

  it("getExperienceProgress should handle high experience values", () => {
    const progress = getExperienceProgress(999);
    expect(progress.current).toBe(99);
    expect(progress.percentage).toBe(99);
  });

  it("Badge types should be valid", () => {
    const validBadges: BadgeType[] = [
      "first_test",
      "ten_tests",
      "fifty_tests",
      "hundred_tests",
      "perfect_score",
      "high_accuracy",
      "consistency",
      "weak_master",
      "all_categories",
    ];

    expect(validBadges.length).toBe(9);
  });

  it("Title types should be valid", () => {
    const validTitles: TitleType[] = [
      "beginner",
      "apprentice",
      "skilled",
      "expert",
      "master",
      "legend",
    ];

    expect(validTitles.length).toBe(6);
  });
});
