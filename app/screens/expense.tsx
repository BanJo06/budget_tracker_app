import { getDb } from "@/utils/database";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

interface ExpenseContentProps {
  month: number;
  year: number;
}

interface ExpenseTransaction {
  amount: number;
  type: string;
  date: string;
  category_name: string;
}

const fetchTransactions = async (): Promise<ExpenseTransaction[]> => {
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
      WHERE T.type = 'expense'
      ORDER BY T.date DESC;
    `;
    const transactions = db.getAllSync(query) as ExpenseTransaction[];
    return transactions;
  } catch (error) {
    console.error("Error fetching expense transactions:", error);
    return [];
  }
};

const categoryColors: { [key: string]: string } = {
  Food: "#8938E9",
  Shopping: "#FACC15",
  Gifts: "#4ADE80",
  Bills: "#EF4444",
  Clothing: "#3B82F6",
  Tuition: "#A855F7",
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

export default function ExpenseContent({ month, year }: ExpenseContentProps) {
  const [period, setPeriod] = useState("month");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expensesData, setExpensesData] = useState({
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
    const processExpenses = async () => {
      const allExpenses = await fetchTransactions();
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

      const totalDay = allExpenses
        .filter((t) => t.date >= startOfDay)
        .reduce((sum, t) => sum + t.amount, 0);
      const totalWeek = allExpenses
        .filter((t) => t.date >= startOfWeek)
        .reduce((sum, t) => sum + t.amount, 0);
      const totalMonth = allExpenses
        .filter(
          (t) => t.date >= startOfSelectedMonth && t.date <= endOfSelectedMonth
        )
        .reduce((sum, t) => sum + t.amount, 0);

      let filteredExpenses: ExpenseTransaction[] = [];
      let totalFiltered = 0;

      if (period === "day") {
        filteredExpenses = allExpenses.filter((t) => t.date >= startOfDay);
        totalFiltered = totalDay;
      } else if (period === "week") {
        filteredExpenses = allExpenses.filter((t) => t.date >= startOfWeek);
        totalFiltered = totalWeek;
      } else {
        filteredExpenses = allExpenses.filter(
          (t) => t.date >= startOfSelectedMonth && t.date <= endOfSelectedMonth
        );
        totalFiltered = totalMonth;
      }

      const categoryMap: { [key: string]: { name: string; amount: number } } =
        {};
      filteredExpenses.forEach((exp) => {
        const categoryName = exp.category_name || "Uncategorized";
        if (!categoryMap[categoryName])
          categoryMap[categoryName] = { name: categoryName, amount: 0 };
        categoryMap[categoryName].amount += exp.amount;
      });

      const processedCategories = Object.values(categoryMap)
        .map((cat) => ({
          ...cat,
          percentage:
            totalFiltered > 0 ? (cat.amount / totalFiltered) * 100 : 0,
        }))
        .sort((a, b) => b.percentage - a.percentage);

      setExpensesData({
        totalDay,
        totalWeek,
        totalMonth,
        filteredCategories: processedCategories,
        totalFiltered,
      });
    };
    processExpenses();
  }, [month, year]);

  const pieData = expensesData.filteredCategories
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
    >
      {/* Graph Overview */}
      <View className="w-full h-[220px] p-5 mt-4 mb-4 bg-white rounded-2xl shadow-md">
        <View className="flex-row justify-between">
          <Text className="text-black font-medium">Expense</Text>
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
            {expensesData.filteredCategories.map((category, index) => (
              <View key={index} className="flex-row items-center mb-1">
                <View
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: getCategoryColor(category.name) }}
                />
                <Text className="text-xs">
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
            expensesData.totalDay,
            expensesData.totalWeek,
            expensesData.totalMonth,
          ][idx];
          return (
            <View
              key={label}
              className="flex-1 h-22 p-5 bg-white rounded-2xl shadow-md items-center"
            >
              <Text className="text-[#392F46] opacity-60 text-base">
                {label}
              </Text>
              <Text className="text-[#8938E9] font-bold text-base">
                {getCurrencyFormatted(value)}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Category List */}
      <View className="flex-col mt-8 gap-4 w-full">
        {expensesData.filteredCategories.map((category, index) => (
          <View key={index} className="flex-row gap-4 items-center w-full">
            <View
              className="w-12 h-12 rounded-full"
              style={{ backgroundColor: getCategoryColor(category.name) }}
            />
            <View className="justify-center gap-1">
              <Text className="text-base font-medium">{category.name}</Text>
              <Text className="text-[#392F46] opacity-60 text-xs">Cash</Text>
            </View>
            <View className="flex-1 flex-col justify-end items-end gap-1">
              <Text className="text-base font-medium">
                {getCurrencyFormatted(category.amount)}
              </Text>
              <Text className="text-[#392F46] opacity-60 text-xs">
                {category.percentage.toFixed(0)}%
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Modal
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center mt-5 bg-black/50">
          <View className="m-5 bg-white rounded-2xl p-8 items-center shadow-md">
            <Text className="text-lg font-bold mb-4">
              Select Month and Year
            </Text>
            <View className="flex-row items-center">
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(v) => setSelectedMonth(v)}
                className="w-36"
              >
                {months.map((m) => (
                  <Picker.Item key={m.value} label={m.label} value={m.value} />
                ))}
              </Picker>
              <Picker
                selectedValue={selectedYear}
                onValueChange={(v) => setSelectedYear(v)}
                className="w-36"
              >
                {years.map((y) => (
                  <Picker.Item key={y.value} label={y.label} value={y.value} />
                ))}
              </Picker>
            </View>
            <Pressable
              onPress={() => setIsModalVisible(false)}
              className="mt-4 bg-blue-500 px-5 py-2 rounded-xl"
            >
              <Text className="text-white font-bold text-center">Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal> */}
    </ScrollView>
  );
}
