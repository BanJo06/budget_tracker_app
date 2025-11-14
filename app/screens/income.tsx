import { getDb } from "@/utils/database";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
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

// Example income category colors
const categoryColors: { [key: string]: string } = {
  Allowance: "#4ADE80",
  Lottery: "#FACC15",
  Refunds: "#3B82F6",
  Salary: "#8938E9",
  Sideline: "#EF4444",
  Uncategorized: "#CCCCCC",
};

const getCategoryColor = (categoryName: string) =>
  categoryColors[categoryName] || categoryColors["Uncategorized"];

const getMonths = () => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames.map((name, i) => ({ label: name, value: i + 1 }));
};

const getYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, i) => ({
    label: String(currentYear - i),
    value: currentYear - i,
  }));
};

export default function IncomeContent({ month, year }: IncomeContentProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [period, setPeriod] = useState("month");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [incomeData, setIncomeData] = useState({
    totalDay: 0,
    totalWeek: 0,
    totalMonth: 0,
    filteredCategories: [] as {
      name: string;
      amount: number;
      percentage: number;
    }[],
    totalFiltered: 0,
  });

  const months = getMonths();
  const years = getYears();
  const currentMonthName = months.find((m) => m.value === selectedMonth)?.label;

  useEffect(() => {
    const processIncome = async () => {
      const allIncome = await fetchTransactions();
      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ).toISOString();
      const startOfWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay()
      ).toISOString();
      const startOfSelectedMonth = new Date(year, month - 1, 1).toISOString();
      const endOfSelectedMonth = new Date(year, month, 0).toISOString();

      const totalDay = allIncome
        .filter((t) => t.date >= startOfDay)
        .reduce((sum, t) => sum + t.amount, 0);
      const totalWeek = allIncome
        .filter((t) => t.date >= startOfWeek)
        .reduce((sum, t) => sum + t.amount, 0);
      const totalMonth = allIncome
        .filter(
          (t) => t.date >= startOfSelectedMonth && t.date <= endOfSelectedMonth
        )
        .reduce((sum, t) => sum + t.amount, 0);

      let filteredIncome: IncomeTransaction[] = [];
      let totalFiltered = 0;

      if (period === "day") {
        filteredIncome = allIncome.filter((t) => t.date >= startOfDay);
        totalFiltered = totalDay;
      } else if (period === "week") {
        filteredIncome = allIncome.filter((t) => t.date >= startOfWeek);
        totalFiltered = totalWeek;
      } else {
        filteredIncome = allIncome.filter(
          (t) => t.date >= startOfSelectedMonth && t.date <= endOfSelectedMonth
        );
        totalFiltered = totalMonth;
      }

      const categoryMap: { [key: string]: { name: string; amount: number } } =
        {};
      filteredIncome.forEach((inc) => {
        const categoryName = inc.category_name || "Uncategorized";
        if (!categoryMap[categoryName])
          categoryMap[categoryName] = { name: categoryName, amount: 0 };
        categoryMap[categoryName].amount += inc.amount;
      });

      const processedCategories = Object.values(categoryMap)
        .map((cat) => ({
          ...cat,
          percentage:
            totalFiltered > 0 ? (cat.amount / totalFiltered) * 100 : 0,
        }))
        .sort((a, b) => b.percentage - a.percentage);

      setIncomeData({
        totalDay,
        totalWeek,
        totalMonth,
        filteredCategories: processedCategories,
        totalFiltered,
      });
    };
    processIncome();
  }, [month, year]);

  const pieData = incomeData.filteredCategories
    .filter((c) => typeof c.amount === "number" && c.amount > 0)
    .map((c) => ({
      name: c.name,
      population: c.amount,
      color: getCategoryColor(c.name),
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    }));

  const getCurrencyFormatted = (amount: number) => `₱${amount.toFixed(2)}`;

  const chartConfig = {
    color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    propsForLabels: { fontSize: 12 },
  };

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: "center", paddingHorizontal: 32 }}
      className="bg-bgPrimary-light dark:bg-bgPrimary-dark"
    >
      {/* Graph Overview */}
      <View className="w-full h-[220px] p-5 mt-4 mb-4 rounded-2xl shadow-md bg-card-light dark:bg-card-dark">
        <View className="flex-row justify-between">
          <Text className="font-medium text-textPrimary-light dark:text-textPrimary-dark">
            Income
          </Text>
        </View>

        <View className="flex-row justify-between items-center mt-4">
          <PieChart
            data={pieData}
            width={screenWidth * 0.5} // Chart size remains
            height={150}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="16"
            hasLegend={false}
          />
          <View>
            {incomeData.filteredCategories.map((category, index) => (
              <View key={index} className="flex-row items-center mb-1">
                <View
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: getCategoryColor(category.name) }}
                />
                <Text className="text-xs text-textPrimary-light dark:text-textPrimary-dark">
                  {category.name} ({category.percentage.toFixed(0)}%)
                </Text>
              </View>
            ))}
          </View>
        </View>
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
              className="flex-1 h-22 p-5 rounded-2xl shadow-md items-center bg-card-light dark:bg-card-dark"
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
      <View className="flex-col mt-8 gap-4 w-full">
        {incomeData.filteredCategories.map((category, index) => (
          <View key={index} className="flex-row gap-4 items-center w-full">
            <View
              className="w-12 h-12 rounded-full"
              style={{ backgroundColor: getCategoryColor(category.name) }}
            />
            <View className="justify-center gap-1">
              <Text className="text-base font-medium text-textPrimary-light dark:text-textPrimary-dark">
                {category.name}
              </Text>
              <Text className="opacity-60 text-xs text-textSecondary-light dark:text-textSecondary-dark">
                Cash
              </Text>
            </View>
            <View className="flex-1 flex-col justify-end items-end gap-1">
              <Text className="text-base font-medium text-textPrimary-light dark:text-textPrimary-dark">
                {getCurrencyFormatted(category.amount)}
              </Text>
              <Text className="opacity-60 text-xs text-textSecondary-light dark:text-textSecondary-dark">
                {category.percentage.toFixed(0)}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
