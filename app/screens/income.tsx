import { getDb } from "@/utils/database";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

interface IncomeContentProps {
  month: number;
  year: number;
}

interface IncomeTransaction {
  amount: number;
  type: string;
  date: string;
  category_name: string;
}

const fetchTransactions = async (): Promise<IncomeTransaction[]> => {
  try {
    const db = getDb();
    const query = `
      SELECT 
        T.amount, 
        T.type, 
        T.date, 
        C.name AS category_name, 
        C.icon_name AS category_icon_name
      FROM transactions AS T
      LEFT JOIN categories AS C ON T.category_id = C.id
      WHERE T.type = 'income'
      ORDER BY T.date DESC;
    `;
    const transactions = db.getAllSync(query) as IncomeTransaction[];
    return transactions;
  } catch (error) {
    console.error("Error fetching income transactions:", error);
    return [];
  }
};

const categoryColors: { [key: string]: string } = {
  Allowance: "#4ADE80",
  Lottery: "#FACC15",
  Refunds: "#3B82F6",
  Salary: "#8938E9",
  Sideline: "#EF4444",
  "Other Income": "#5B1C8C",
  Uncategorized: "#CCCCCC",
};

const getCategoryColor = (categoryName: string) =>
  categoryColors[categoryName] || categoryColors["Uncategorized"];

export default function IncomeContent({ month, year }: IncomeContentProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [incomeData, setIncomeData] = useState({
    totalDay: 0,
    totalWeek: 0,
    totalMonth: 0,
    filteredCategories: [] as {
      name: string;
      amount: number;
      percentage: number;
    }[],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processIncome = async () => {
      setIsLoading(true);

      const allIncome = await fetchTransactions();

      // 1. Define Time Boundaries based on Selected Month/Year
      const startOfSelectedMonth = new Date(year, month - 1, 1).toISOString();
      const endOfSelectedMonth = new Date(
        year,
        month,
        0,
        23,
        59,
        59
      ).toISOString();

      // 2. Define Time Boundaries for Day/Week Cards (Relative to "Now")
      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ).toISOString();

      const todayObj = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const dayOfWeek = todayObj.getDay(); // 0 (Sun) to 6 (Sat)
      const startOfCurrentWeek = new Date(todayObj);
      startOfCurrentWeek.setDate(todayObj.getDate() - dayOfWeek); // Go back to Sunday
      const startOfCurrentWeekISO = startOfCurrentWeek.toISOString();

      // 3. Filter Income Logic
      // Month Total: Strictly what falls in the selected month
      const monthIncome = allIncome.filter(
        (t) => t.date >= startOfSelectedMonth && t.date <= endOfSelectedMonth
      );

      // Day Total: Must be Today AND Today must be within the selected month view
      const dayIncome = monthIncome.filter((t) => t.date >= startOfToday);

      // Week Total: Must be This Week AND This Week must be within the selected month view
      const weekIncome = monthIncome.filter(
        (t) => t.date >= startOfCurrentWeekISO
      );

      const totalMonth = monthIncome.reduce((sum, t) => sum + t.amount, 0);
      const totalDay = dayIncome.reduce((sum, t) => sum + t.amount, 0);
      const totalWeek = weekIncome.reduce((sum, t) => sum + t.amount, 0);

      // 4. Build category breakdown
      const categoryMap: { [key: string]: { name: string; amount: number } } =
        {};

      monthIncome.forEach((inc) => {
        const categoryName = inc.category_name || "Uncategorized";
        if (!categoryMap[categoryName])
          categoryMap[categoryName] = { name: categoryName, amount: 0 };
        categoryMap[categoryName].amount += inc.amount;
      });

      const processedCategories = Object.values(categoryMap)
        .map((cat) => ({
          ...cat,
          percentage: totalMonth > 0 ? (cat.amount / totalMonth) * 100 : 0,
        }))
        .sort((a, b) => b.percentage - a.percentage);

      setIncomeData({
        totalDay,
        totalWeek,
        totalMonth,
        filteredCategories: processedCategories,
      });

      setIsLoading(false);
    };

    processIncome();
  }, [month, year]);

  const pieData = incomeData.filteredCategories
    .filter((c) => typeof c.amount === "number" && c.amount > 0)
    .map((c) => ({
      name: c.name,
      population: c.amount,
      color: getCategoryColor(c.name),
      legendFontColor: isDark ? "#FFFFFF" : "#7F7F7F",
      legendFontSize: 12,
    }));

  const getCurrencyFormatted = (amount: number) => {
    // If no value (0), standard formatting is P0.00, or you can return "--" if preferred
    if (amount === 0) return "₱0.00";
    return `₱${amount.toFixed(2)}`;
  };

  const chartConfig = {
    color: (opacity = 1) =>
      isDark ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`,
    labelColor: (opacity = 1) =>
      isDark ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`,
    propsForLabels: { fontSize: 12 },
  };

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        paddingHorizontal: 32,
        paddingBottom: 20,
      }}
      className="bg-bgPrimary-light dark:bg-bgPrimary-dark"
    >
      {/* Graph Overview */}
      <View
        // 1. FIXED: Use min-h-[220px] instead of fixed h-[220px] so it can grow
        className="w-full min-h-[220px] p-5 mt-4 mb-4 rounded-2xl bg-card-light dark:bg-card-dark"
        style={{ elevation: 5 }}
      >
        <View className="flex-row justify-between">
          <Text className="font-medium text-textPrimary-light dark:text-textPrimary-dark">
            Income
          </Text>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#8938E9" />
          </View>
        ) : pieData.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="opacity-60 text-textPrimary-light dark:text-textPrimary-dark">
              No Data
            </Text>
          </View>
        ) : (
          // 2. FIXED: Use items-start so chart stays at top left
          <View className="flex-row justify-between items-start mt-4">
            <PieChart
              data={pieData}
              width={screenWidth * 0.5}
              height={150}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="16"
              hasLegend={false}
            />
            <View className="flex-1 pt-2">
              {incomeData.filteredCategories.map((category, index) => (
                <View key={index} className="flex-row items-center mb-1">
                  <View
                    className="w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: getCategoryColor(category.name) }}
                  />
                  <Text
                    className="text-xs text-textPrimary-light dark:text-textPrimary-dark flex-1"
                    // 3. FIXED: Removed numberOfLines={1} to show full name
                  >
                    {category.name} ({category.percentage.toFixed(0)}%)
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Summary Cards */}
      <View className="flex-row justify-between w-full gap-3">
        {["Day", "Week", "Month"].map((label, idx) => {
          const value = [
            incomeData.totalDay,
            incomeData.totalWeek,
            incomeData.totalMonth,
          ][idx];
          return (
            <View
              key={label}
              className="flex-1 h-22 p-5 rounded-2xl items-center justify-center bg-card-light dark:bg-card-dark"
              style={{ elevation: 5 }}
            >
              <Text className="opacity-60 text-base text-textPrimary-light dark:text-textPrimary-dark">
                {label}
              </Text>
              <Text className="font-bold text-base text-accent-light dark:text-textPrimary-dark">
                {getCurrencyFormatted(value)}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Category List */}
      <View className="flex-col mt-8 gap-4 w-full mb-8">
        {incomeData.filteredCategories.map((category, index) => (
          <View key={index} className="flex-row gap-4 items-center w-full">
            <View
              className="w-12 h-12 rounded-full"
              style={{ backgroundColor: getCategoryColor(category.name) }}
            />
            <View className="justify-center gap-1 flex-1">
              <Text className="text-base font-medium text-textPrimary-light dark:text-textPrimary-dark">
                {category.name}
              </Text>
              <Text className="opacity-60 text-xs text-textSecondary-light dark:text-textSecondary-dark">
                Total (%)
              </Text>
            </View>
            <View className="flex-col justify-end items-end gap-1">
              <Text className="text-base font-medium text-textPrimary-light dark:text-textPrimary-dark">
                {getCurrencyFormatted(category.amount)}
              </Text>
              <Text className="opacity-60 text-xs text-textSecondary-light dark:text-textSecondary-dark">
                {category.percentage.toFixed(0)}%
              </Text>
            </View>
          </View>
        ))}
        {incomeData.filteredCategories.length === 0 && !isLoading && (
          <Text className="text-center text-gray-400 mt-5">
            No income found for this month.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
