import { CATEGORIES_EXPENSES_SVG_ICONS } from "@/assets/constants/categories_expenses_icons";
import { CATEGORIES_INCOME_SVG_ICONS } from "@/assets/constants/categories_income_icons";
import { SVG_ICONS } from "@/assets/constants/icons";
import {
  getExpenseCategories,
  getIncomeCategories,
} from "@/database/categoryQueries";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Define a type/interface for a category object for better type safety
interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
  icon_name: string;
}

// Helper component to render a single category item
interface CategoryItemProps {
  category: Category;
  IconMap: { [key: string]: React.FC<any> };
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, IconMap }) => {
  const IconComponent = IconMap[category.icon_name];
  return (
    <View className="pt-4 flex-row items-center justify-between">
      <View className="flex-row gap-4 items-center">
        {/* Category Icon Container */}
        <View className="w-[50] h-[50] rounded-full bg-[#8938E9] justify-center items-center">
          {IconComponent ? (
            <IconComponent width={30} height={30} color="#FFFFFF" />
          ) : (
            <Text style={{ color: "#FFFFFF" }}>?</Text>
          )}
        </View>
        <Text className="text-base">{category.name}</Text>
      </View>

      {/* Ellipsis/Menu Icon */}
      <View className="justify-center">
        <SVG_ICONS.Ellipsis width={24} height={24} />
      </View>
    </View>
  );
};

export default function Categories() {
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = () => {
      try {
        setLoading(true);
        const income = getIncomeCategories();
        setIncomeCategories(income as Category[]);

        const expense = getExpenseCategories();
        setExpenseCategories(expense as Category[]);

        setError(null);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError("Failed to load categories. Check console for details.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <View style={styles.fullscreenCenter}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2">Loading Categories...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.fullscreenCenter}>
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  const handlePress = () => {
    console.log("Pressed button");
  };

  // Main content wrapped in ScrollView
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Income Categories Section */}
      <View className="p-8">
        <Text className="text-xl font-bold mb-1">Income categories</Text>
        <View className="border-t-2 border-black mt-1"></View>

        {incomeCategories.length === 0 ? (
          <Text className="pt-4 text-gray-500">
            No income categories found.
          </Text>
        ) : (
          incomeCategories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              IconMap={CATEGORIES_INCOME_SVG_ICONS}
            />
          ))
        )}
      </View>
      <View className="border-b border-gray-200"></View>
      {/* Expense Categories Section */}
      <View className="py-4 px-8">
        <Text className="text-xl font-bold mb-1">Expense categories</Text>
        <View className="border-t-2 border-black mt-1"></View>

        {expenseCategories.length === 0 ? (
          <Text className="pt-4 text-gray-500">
            No expense categories found.
          </Text>
        ) : (
          expenseCategories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              IconMap={CATEGORIES_EXPENSES_SVG_ICONS}
            />
          ))
        )}
      </View>

      <View className="px-8 pb-8">
        <TouchableOpacity
          onPress={handlePress}
          className="w-full h-[40] justify-center items-center border-2 border-purple-500 rounded-lg mt-4"
        >
          <View className="flex-row items-center justify-center gap-2">
            <SVG_ICONS.SmallAdd size={15} color="#8938E9" />
            <Text className="font-medium text-purple-600">
              ADD NEW CATEGORY
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  fullscreenCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});
