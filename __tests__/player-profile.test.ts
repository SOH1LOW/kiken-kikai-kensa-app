import { describe, it, expect } from "vitest";
import {
  validatePlayerName,
} from "../lib/player-profile";

describe("Player Profile Utilities", () => {
  describe("validatePlayerName", () => {
    it("should validate correct player name", () => {
      const result = validatePlayerName("テストプレイヤー");
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should reject empty player name", () => {
      const result = validatePlayerName("");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("プレイヤー名を入力してください");
    });

    it("should reject whitespace-only player name", () => {
      const result = validatePlayerName("   ");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("プレイヤー名を入力してください");
    });

    it("should reject player name longer than 20 characters", () => {
      const result = validatePlayerName("あいうえおかきくけこさしすせそたちつてとあ");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("プレイヤー名は20文字以内で入力してください");
    });

    it("should accept exactly 20 character player name", () => {
      const result = validatePlayerName("あいうえおかきくけこさしすせそたちつてと");
      expect(result.valid).toBe(true);
    });

    it("should trim whitespace from player name", () => {
      const result = validatePlayerName("  テスト  ");
      expect(result.valid).toBe(true);
    });
  });
});
