import { Text, View, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useEffect, useState } from "react";
import { getAllCategories, type Category } from "@/lib/categories";
import * as Haptics from "expo-haptics";

export default function CategorySelectScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const cats = getAllCategories();
    setCategories(cats);
  }, []);

  const handleSelectCategory = (categoryName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/category-quiz",
      params: { category: categoryName },
    });
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <ScreenContainer className="p-6">
      <View className="flex-1">
        {/* ヘッダー */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-3xl font-bold text-foreground">
              カテゴリ選択
            </Text>
            <TouchableOpacity onPress={handleBack}>
              <Text className="text-lg text-primary">✕</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-base text-muted">
            学習したい分野を選択してください
          </Text>
        </View>

        {/* カテゴリリスト */}
        <FlatList
          data={categories}
          keyExtractor={(item) => item.name}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectCategory(item.name)}
              className="mb-3 active:opacity-70"
              activeOpacity={0.7}
            >
              <View
                className="rounded-2xl p-5 border border-border"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text
                      className="text-xl font-bold"
                      style={{ color: item.color }}
                    >
                      {item.displayName}
                    </Text>
                    <Text className="text-sm text-muted mt-1">
                      {item.description}
                    </Text>
                  </View>
                  <View
                    className="rounded-full px-3 py-1"
                    style={{ backgroundColor: item.color }}
                  >
                    <Text className="text-white text-sm font-bold">
                      {item.count}問
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScreenContainer>
  );
}
