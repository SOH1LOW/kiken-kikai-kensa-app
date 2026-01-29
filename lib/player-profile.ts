import AsyncStorage from "@react-native-async-storage/async-storage";

const PLAYER_NAME_KEY = "playerName";
const DEFAULT_PLAYER_NAME = "プレイヤー";

/**
 * プレイヤー名を取得
 */
export async function getPlayerName(): Promise<string> {
  try {
    const name = await AsyncStorage.getItem(PLAYER_NAME_KEY);
    return name || DEFAULT_PLAYER_NAME;
  } catch (error) {
    console.error("Failed to get player name:", error);
    return DEFAULT_PLAYER_NAME;
  }
}

/**
 * プレイヤー名を設定
 */
export async function setPlayerName(name: string): Promise<boolean> {
  try {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error("Player name cannot be empty");
    }
    if (trimmedName.length > 20) {
      throw new Error("Player name must be 20 characters or less");
    }
    await AsyncStorage.setItem(PLAYER_NAME_KEY, trimmedName);
    return true;
  } catch (error) {
    console.error("Failed to set player name:", error);
    return false;
  }
}

/**
 * プレイヤー名をリセット
 */
export async function resetPlayerName(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PLAYER_NAME_KEY);
  } catch (error) {
    console.error("Failed to reset player name:", error);
  }
}

/**
 * プレイヤー名を検証
 */
export function validatePlayerName(name: string): {
  valid: boolean;
  error?: string;
} {
  if (!name || !name.trim()) {
    return { valid: false, error: "プレイヤー名を入力してください" };
  }
  if (name.trim().length > 20) {
    return { valid: false, error: "プレイヤー名は20文字以内で入力してください" };
  }
  return { valid: true };
}
