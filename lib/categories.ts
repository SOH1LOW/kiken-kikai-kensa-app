import { questions } from "../data/questions";

export interface Category {
  name: string;
  displayName: string;
  color: string;
  description: string;
  count: number;
}

// 利用可能なカテゴリの定義
const categoryDefinitions: Record<string, Omit<Category, "count">> = {
  "測定機器": {
    name: "測定機器",
    displayName: "測定機器",
    color: "#3B82F6",
    description: "マイクロメータ、ノギス、ダイヤルゲージなど",
  },
  "硬さ試験": {
    name: "硬さ試験",
    displayName: "硬さ試験",
    color: "#8B5CF6",
    description: "ブリネル、ロックウェル、ビッカース硬さ試験",
  },
  "寸法測定": {
    name: "寸法測定",
    displayName: "寸法測定",
    color: "#EC4899",
    description: "寸法の測定方法と精度管理",
  },
  "幾何公差": {
    name: "幾何公差",
    displayName: "幾何公差",
    color: "#F59E0B",
    description: "真直度、平面度、円筒度などの公差",
  },
  "表面性状": {
    name: "表面性状",
    displayName: "表面性状",
    color: "#10B981",
    description: "表面粗さと表面性状の測定",
  },
  "ねじ測定": {
    name: "ねじ測定",
    displayName: "ねじ測定",
    color: "#06B6D4",
    description: "ねじの寸法と有効径の測定",
  },
  "歯車測定": {
    name: "歯車測定",
    displayName: "歯車測定",
    color: "#6366F1",
    description: "歯車の寸法と精度測定",
  },
  "角度測定": {
    name: "角度測定",
    displayName: "角度測定",
    color: "#14B8A6",
    description: "角度ゲージと角度測定",
  },
  "光学測定": {
    name: "光学測定",
    displayName: "光学測定",
    color: "#F97316",
    description: "光学機器による測定",
  },
  "材料試験": {
    name: "材料試験",
    displayName: "材料試験",
    color: "#EF4444",
    description: "引張試験、圧縮試験など",
  },
  "非破壊検査": {
    name: "非破壊検査",
    displayName: "非破壊検査",
    color: "#8B5CF6",
    description: "超音波、磁粉探傷検査",
  },
  "品質管理": {
    name: "品質管理",
    displayName: "品質管理",
    color: "#06B6D4",
    description: "品質管理と統計的手法",
  },
  "機械要素": {
    name: "機械要素",
    displayName: "機械要素",
    color: "#10B981",
    description: "ベアリング、ばね、軸など",
  },
  "加工方法": {
    name: "加工方法",
    displayName: "加工方法",
    color: "#F59E0B",
    description: "旋盤加工、フライス加工など",
  },
  "材料": {
    name: "材料",
    displayName: "材料",
    color: "#EC4899",
    description: "鋼、アルミニウム、その他材料",
  },
  "図面": {
    name: "図面",
    displayName: "図面",
    color: "#3B82F6",
    description: "図面の読み方と記号",
  },
  "安全管理": {
    name: "安全管理",
    displayName: "安全管理",
    color: "#EF4444",
    description: "測定機器の安全管理",
  },
};

/**
 * 全カテゴリを取得
 */
export function getAllCategories(): Category[] {
  return Object.entries(categoryDefinitions)
    .map(([key, def]) => ({
      ...def,
      count: questions.filter((q) => q.category === key).length,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * 特定のカテゴリを取得
 */
export function getCategoryByName(name: string): Category | undefined {
  const def = categoryDefinitions[name];
  if (!def) return undefined;

  return {
    ...def,
    count: questions.filter((q) => q.category === name).length,
  };
}

/**
 * カテゴリ内の問題を取得
 */
export function getQuestionsByCategory(categoryName: string) {
  return questions.filter((q) => q.category === categoryName);
}

/**
 * カテゴリの色を取得
 */
export function getCategoryColor(categoryName: string): string {
  return categoryDefinitions[categoryName]?.color || "#6B7280";
}

/**
 * 複数カテゴリの問題を取得
 */
export function getQuestionsByCategories(categoryNames: string[]) {
  return questions.filter((q) => categoryNames.includes(q.category));
}
