import { describe, it, expect } from "vitest";
import {
  getAllCategories,
  getCategoryByName,
  getQuestionsByCategory,
  getCategoryColor,
  getQuestionsByCategories,
  type Category,
} from "../lib/categories";

describe("Categories Management", () => {
  it("should get all categories", () => {
    const categories = getAllCategories();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should have category properties", () => {
    const categories = getAllCategories();
    const category = categories[0];

    expect(category).toHaveProperty("name");
    expect(category).toHaveProperty("displayName");
    expect(category).toHaveProperty("color");
    expect(category).toHaveProperty("description");
    expect(category).toHaveProperty("count");
  });

  it("should get category by name", () => {
    const category = getCategoryByName("測定機器");

    expect(category).toBeDefined();
    expect(category?.name).toBe("測定機器");
    expect(category?.displayName).toBe("測定機器");
    expect(typeof category?.color).toBe("string");
    expect(category?.count).toBeGreaterThan(0);
  });

  it("should return undefined for non-existent category", () => {
    const category = getCategoryByName("存在しないカテゴリ");
    expect(category).toBeUndefined();
  });

  it("should get questions by category", () => {
    const questions = getQuestionsByCategory("測定機器");

    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBeGreaterThan(0);
    expect(questions.every((q) => q.category === "測定機器")).toBe(true);
  });

  it("should get category color", () => {
    const color = getCategoryColor("測定機器");

    expect(typeof color).toBe("string");
    expect(color).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it("should return default color for non-existent category", () => {
    const color = getCategoryColor("存在しないカテゴリ");

    expect(typeof color).toBe("string");
    expect(color).toBe("#6B7280");
  });

  it("should get questions by multiple categories", () => {
    const questions = getQuestionsByCategories(["測定機器", "硬さ試験"]);

    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBeGreaterThan(0);
    expect(
      questions.every(
        (q) => q.category === "測定機器" || q.category === "硬さ試験"
      )
    ).toBe(true);
  });

  it("should have all required categories", () => {
    const categories = getAllCategories();
    const categoryNames = categories.map((c) => c.name);

    const requiredCategories = [
      "測定機器",
      "硬さ試験",
      "寸法測定",
      "幾何公差",
      "表面性状",
    ];

    requiredCategories.forEach((required) => {
      expect(categoryNames).toContain(required);
    });
  });

  it("should sort categories by count descending", () => {
    const categories = getAllCategories();

    for (let i = 0; i < categories.length - 1; i++) {
      expect(categories[i].count).toBeGreaterThanOrEqual(categories[i + 1].count);
    }
  });
});
