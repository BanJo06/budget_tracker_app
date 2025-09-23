// import ProgressRing from '@/components/ProgressRing';
// import React, { useState } from 'react';
// import { Text, View } from 'react-native';

// export default function expense() {
//     const [currentProgress, setCurrentProgress] = useState(0.25); // State to manage progress
//     return (
//         <View className="items-center">
//             {/* Graph Overview */}
//             <View className='w-[330] h-[220] p-[20] mt-[18] mb-[16] bg-white rounded-[20]'
//                 style={[
//                     { elevation: 5 },
//                 ]}>
//                 <View className='pb-[20] flex-row justify-between'>
//                     <Text>Expense</Text>
//                 </View>

//                 {/* Graph Menu Pie Chart */}
//                 <View className='flex-row justify-between'>
//                     <ProgressRing
//                         progress={currentProgress}
//                         radius={70}
//                         strokeWidth={15}
//                         progressColor="#8938E9"
//                         backgroundColor="#EDE1FB"
//                         duration={500}
//                         showPercentage={true}
//                     />

//                     {/* Graph Menu Category and Percent */}
//                     <View className='flex-1 flex-col items-start justify-start pl-[32] pr-[10] pb-[6] gap-[8]'>
//                         {/* Food */}
//                         <View className='flex-row gap-[8] w-full items-center'>
//                             <View className='w-[15] h-[15] bg-[#8938E9] rounded-full'></View>
//                             <View className='flex-row flex-1 justify-between items-center'>
//                                 <Text className='text-[10px] font-medium'>Food</Text>
//                                 <Text className='text-[10px]'>60%</Text>
//                             </View>
//                         </View>

//                         {/* Shopping */}
//                         <View className='flex-row gap-[8] w-full items-center'>
//                             <View className='w-[15] h-[15] bg-yellow-400 rounded-full'></View>
//                             <View className='flex-row flex-1 justify-between items-center'>
//                                 <Text className='text-[10px] font-medium'>Shopping</Text>
//                                 <Text className='text-[10px]'>32%</Text>
//                             </View>
//                         </View>

//                         {/* Gifts */}
//                         <View className='flex-row gap-[8] w-full items-center'>
//                             <View className='w-[15] h-[15] bg-green-500 rounded-full'></View>
//                             <View className='flex-row flex-1 justify-between items-center'>
//                                 <Text className='text-[10px] font-medium'>Gifts</Text>
//                                 <Text className='text-[10px]'>8%</Text>
//                             </View>
//                         </View>
//                     </View>
//                 </View>
//             </View>

//             {/* Day, Week, Month */}
//             <View className='flex-row gap-[8]'>
//                 <View className='w-[104] h-[86] px-[12] py-[20] bg-white rounded-[20]'
//                     style={[
//                         { elevation: 5 },
//                     ]}>
//                     <View className='flex-col justify-center items-center gap-[8]'>
//                         <Text className='text-[16px] text-[#392F46] opacity-65'>Day</Text>
//                         <Text className='text-[16px] font-bold text-[#8938E9]'>₱500.00</Text>
//                     </View>
//                 </View>

//                 <View className='w-[104] h-[86] px-[12] py-[20] bg-white rounded-[20]'
//                     style={[
//                         { elevation: 5 },
//                     ]}>
//                     <View className='flex-col justify-center items-center gap-[8]'>
//                         <Text className='text-[16px] text-[#392F46] opacity-65'>Week</Text>
//                         <Text className='text-[16px] font-bold text-[#8938E9]'>₱800.00</Text>
//                     </View>
//                 </View>

//                 <View className='w-[104] h-[86] px-[12] py-[20] bg-white rounded-[20]'
//                     style={[
//                         { elevation: 5 },
//                     ]}>
//                     <View className='flex-col justify-center items-center gap-[8]'>
//                         <Text className='text-[16px] text-[#392F46] opacity-65'>Month</Text>
//                         <Text className='text-[16px] font-bold text-[#8938E9]'>₱2500.00</Text>
//                     </View>
//                 </View>
//             </View>

//             {/* Total Balance based on category */}
//             <View className='flex-col mt-[32] gap-[16]'>
//                 <View className='flex-row gap-[16] w-full items-center'>
//                     <View className='w-[50] h-[50] bg-[#8938E9] rounded-full'></View>
//                     <View className='justify-center gap-[4]'>
//                         <Text className='text-[16px] font-medium'>Shopping</Text>
//                         <Text className='text-[12px] text-[#392F46] opacity-65'>Cash</Text>
//                     </View>
//                     <View className='flex-1 flex-col justify-end items-end gap-[4]'>
//                         <Text className='text-[16px] font-medium'>₱800.00</Text>
//                         <Text className='text-[12px] text-[#392F46] opacity-65'>32%</Text>
//                     </View>
//                 </View>

//                 <View className='flex-row gap-[16] w-full items-center'>
//                     <View className='w-[50] h-[50] bg-[#8938E9] rounded-full'></View>
//                     <View className='justify-center gap-[4]'>
//                         <Text className='text-[16px] font-medium'>Food</Text>
//                         <Text className='text-[12px] text-[#392F46] opacity-65'>Cash</Text>
//                     </View>
//                     <View className='flex-1 flex-col justify-end items-end gap-[4]'>
//                         <Text className='text-[16px] font-medium'>₱1500.00</Text>
//                         <Text className='text-[12px] text-[#392F46] opacity-65'>60%</Text>
//                     </View>
//                 </View>

//                 <View className='flex-row gap-[16] w-full items-center'>
//                     <View className='w-[50] h-[50] bg-[#8938E9] rounded-full'></View>
//                     <View className='justify-center gap-[4]'>
//                         <Text className='text-[16px] font-medium'>Gifts</Text>
//                         <Text className='text-[12px] text-[#392F46] opacity-65'>Cash</Text>
//                     </View>
//                     <View className='flex-1 flex-col justify-end items-end gap-[4]'>
//                         <Text className='text-[16px] font-medium'>₱200.00</Text>
//                         <Text className='text-[12px] text-[#392F46] opacity-65'>8%</Text>
//                     </View>
//                 </View>
//             </View>
//         </View>
//     )
// }

// expense.tsx
import { getDb } from "@/utils/database";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";

// Define the type for the transaction data from your query
interface ExpenseTransaction {
  amount: number;
  type: string;
  date: string;
  category_name: string;
  category_icon_name: string;
}

// Helper function to get transactions from the database with explicit typing
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

// Simple color mapping for categories
const categoryColors: { [key: string]: string } = {
  Food: "#8938E9",
  Shopping: "#FACC15",
  Gifts: "#4ADE80",
  Bills: "#EF4444",
  Clothing: "#3B82F6",
  Tuition: "#A855F7",
  Uncategorized: "#CCCCCC", // Fallback color
};

// Helper function to get color with a safe fallback
const getCategoryColor = (categoryName: string): string => {
  return categoryColors[categoryName] || categoryColors["Uncategorized"];
};

// Helper function to generate month and year arrays for the Picker
const getMonths = () => {
  const months = [];
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
  for (let i = 0; i < 12; i++) {
    months.push({ label: monthNames[i], value: i + 1 });
  }
  return months;
};

const getYears = () => {
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push({ label: String(i), value: i });
  }
  return years;
};

export default function ExpenseScreen() {
  const [period, setPeriod] = useState("month");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expensesData, setExpensesData] = useState<{
    totalDay: number;
    totalWeek: number;
    totalMonth: number;
    filteredCategories: {
      name: string;
      amount: number;
      icon_name: string;
      percentage: number;
    }[];
    totalFiltered: number;
  }>({
    totalDay: 0,
    totalWeek: 0,
    totalMonth: 0,
    filteredCategories: [],
    totalFiltered: 0,
  });

  // New state to track if the chart container's layout is ready
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 0,
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

      const startOfSelectedMonth = new Date(
        selectedYear,
        selectedMonth - 1,
        1
      ).toISOString();
      const endOfSelectedMonth = new Date(
        selectedYear,
        selectedMonth,
        0
      ).toISOString();

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
        // 'month'
        filteredExpenses = allExpenses.filter(
          (t) => t.date >= startOfSelectedMonth && t.date <= endOfSelectedMonth
        );
        totalFiltered = totalMonth;
      }
      const categoryMap: {
        [key: string]: {
          name: string;
          amount: number;
          icon_name: string | null;
        };
      } = {};

      filteredExpenses.forEach((exp) => {
        const categoryName = exp.category_name || "Uncategorized";
        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = {
            name: categoryName,
            amount: 0,
            icon_name: exp.category_icon_name,
          };
        }
        categoryMap[categoryName].amount += exp.amount;
      });

      const processedCategories = Object.values(categoryMap).map((cat) => ({
        ...cat,
        percentage: totalFiltered > 0 ? (cat.amount / totalFiltered) * 100 : 0,
      }));
      processedCategories.sort((a, b) => b.percentage - a.percentage);

      setExpensesData({
        totalDay,
        totalWeek,
        totalMonth,
        filteredCategories: processedCategories,
        totalFiltered,
      });
    };
    processExpenses();
  }, [period, selectedMonth, selectedYear]);

  // Data for the Pie Chart with explicit type conversions
  const pieData = expensesData.filteredCategories
    .filter(
      (category) => typeof category.amount === "number" && category.amount > 0
    )
    .map((category) => ({
      value: category.amount,
      color: getCategoryColor(category.name),
    }));

  const getCurrencyFormatted = (amount: number) => `₱${amount.toFixed(2)}`;

  console.log("Total filtered expenses:", expensesData.totalFiltered);

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
      {/* Graph Overview */}
      <View
        className="w-[330] h-[220] p-[20] mt-[18] mb-[16] bg-white rounded-[20]"
        style={[{ elevation: 5 }]}
      >
        <View className="pb-[20] flex-row justify-between">
          <Text>Expense</Text>
          <Pressable onPress={() => setIsModalVisible(true)}>
            <Text className="text-[12px] font-medium text-[#7E8085]">
              {currentMonthName}, {selectedYear}
            </Text>
          </Pressable>
        </View>
        {/* Pie Chart and Details Container */}
        <View className="flex-row justify-between items-center">
          {/* Pie Chart from gifted-charts */}
          <View
            style={{ width: 160, height: 160 }}
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              setChartDimensions({ width, height });
            }}
          >
            {chartDimensions.width > 0 &&
            chartDimensions.height > 0 &&
            expensesData.totalFiltered > 0 &&
            pieData.length > 0 ? (
              <PieChart
                donut
                data={pieData}
                radius={80} // Must be a valid number, like 80
                innerRadius={50}
                initialAngle={-180}
                strokeWidth={0}
                paddingHorizontal={0}
              />
            ) : (
              <View
                style={{
                  width: 160,
                  height: 160,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onLayout={() => setIsLayoutReady(true)}
              >
                <Text>No data for this period</Text>
              </View>
            )}
          </View>
          {/* Manual legend/details on the right */}
          <View className="flex-1 flex-col items-start justify-start pl-[32] pr-[10] pb-[6] gap-[8]">
            {expensesData.filteredCategories
              .slice(0, 3)
              .map((category, index) => (
                <View
                  key={index}
                  className="flex-row gap-[8] w-full items-center"
                >
                  <View
                    className="w-[15] h-[15] rounded-full"
                    style={{ backgroundColor: getCategoryColor(category.name) }}
                  ></View>
                  <View className="flex-row flex-1 justify-between items-center">
                    <Text className="text-[10px] font-medium">
                      {category.name}
                    </Text>
                    <Text className="text-[10px]">
                      {category.percentage.toFixed(0)}%
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        </View>
      </View>
      <View className="flex-row gap-[8]">
        <View
          className={"w-[104] h-[86] px-[12] py-[20] bg-white rounded-[20]"}
          style={[{ elevation: 5 }]}
        >
          <View className="flex-col justify-center items-center gap-[8]">
            <Text className="text-[16px] text-[#392F46] opacity-65">Day</Text>
            <Text className="text-[16px] font-bold text-[#8938E9]">
              {getCurrencyFormatted(expensesData.totalDay)}
            </Text>
          </View>
        </View>
        <View
          className={"w-[104] h-[86] px-[12] py-[20] bg-white rounded-[20]"}
          style={[{ elevation: 5 }]}
        >
          <View className="flex-col justify-center items-center gap-[8]">
            <Text className="text-[16px] text-[#392F46] opacity-65">Week</Text>
            <Text className="text-[16px] font-bold text-[#8938E9]">
              {getCurrencyFormatted(expensesData.totalWeek)}
            </Text>
          </View>
        </View>
        <View
          className={"w-[104] h-[86] px-[12] py-[20] bg-white rounded-[20]"}
          style={[{ elevation: 5 }]}
        >
          <View className="flex-col justify-center items-center gap-[8]">
            <Text className="text-[16px] text-[#392F46] opacity-65">Month</Text>
            <Text className="text-[16px] font-bold text-[#8938E9]">
              {getCurrencyFormatted(expensesData.totalMonth)}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex-col mt-[32] gap-[16]">
        {expensesData.filteredCategories.map((category, index) => (
          <View key={index} className="flex-row gap-[16] w-[330] items-center">
            <View
              className="w-[50] h-[50] rounded-full"
              style={{ backgroundColor: getCategoryColor(category.name) }}
            ></View>
            <View className="justify-center gap-[4]">
              <Text className="text-[16px] font-medium">{category.name}</Text>
              <Text className="text-[12px] text-[#392F46] opacity-65">
                Cash
              </Text>
            </View>
            <View className="flex-1 flex-col justify-end items-end gap-[4]">
              <Text className="text-[16px] font-medium">
                {getCurrencyFormatted(category.amount)}
              </Text>
              <Text className="text-[12px] text-[#392F46] opacity-65">
                {category.percentage.toFixed(0)}%
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* The Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select Month and Year</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                style={styles.picker}
              >
                {months.map((m) => (
                  <Picker.Item key={m.value} label={m.label} value={m.value} />
                ))}
              </Picker>
              <Picker
                selectedValue={selectedYear}
                onValueChange={(itemValue) => setSelectedYear(itemValue)}
                style={styles.picker}
              >
                {years.map((y) => (
                  <Picker.Item key={y.value} label={y.label} value={y.value} />
                ))}
              </Picker>
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setIsModalVisible(!isModalVisible)}
            >
              <Text style={styles.textStyle}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  picker: {
    width: 150,
  },
});
