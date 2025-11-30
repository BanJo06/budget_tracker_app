// import { getDb } from "@/utils/database";
// import { useColorScheme } from "nativewind";
// import React, { useEffect, useState } from "react";
// import { Dimensions, ScrollView, Text, View } from "react-native";
// import { PieChart } from "react-native-chart-kit";

// const screenWidth = Dimensions.get("window").width;

// interface ExpenseContentProps {
//   month: number;
//   year: number;
// }

// interface ExpenseTransaction {
//   amount: number;
//   type: string;
//   date: string;
//   category_name: string;
// }

// // Helper to fetch only necessary data
// // We fetch ALL expenses for now and filter in JS for precise day/week logic
// const fetchTransactions = async (): Promise<ExpenseTransaction[]> => {
//   try {
//     const db = getDb();
//     const query = `
//       SELECT
//         T.amount,
//         T.type,
//         T.date,
//         C.name AS category_name
//       FROM transactions AS T
//       LEFT JOIN categories AS C ON T.category_id = C.id
//       WHERE T.type = 'expense'
//       ORDER BY T.date DESC;
//     `;
//     return db.getAllSync(query) as ExpenseTransaction[];
//   } catch (error) {
//     console.error("Error fetching expense transactions:", error);
//     return [];
//   }
// };

// const categoryColors: { [key: string]: string } = {
//   Foods: "#8938E9",
//   Shopping: "#FACC15",
//   Gifts: "#4ADE80",
//   Entertainment: "#EF4444",
//   Clothing: "#3B82F6",
//   Transportation: "#A855F7",
//   OtherExpenses: "#5B1C8C",
//   Uncategorized: "#CCCCCC",
// };

// const getCategoryColor = (categoryName: string) =>
//   categoryColors[categoryName] || categoryColors["Uncategorized"];

// export default function ExpenseContent({ month, year }: ExpenseContentProps) {
//   const { colorScheme } = useColorScheme();

//   const [expensesData, setExpensesData] = useState({
//     totalDay: 0,
//     totalWeek: 0,
//     totalMonth: 0,
//     filteredCategories: [] as {
//       name: string;
//       amount: number;
//       percentage: number;
//     }[],
//   });

//   useEffect(() => {
//     const processExpenses = async () => {
//       const allExpenses = await fetchTransactions();

//       // 1. Define Time Boundaries based on Selected Month/Year
//       const startOfSelectedMonth = new Date(year, month - 1, 1).toISOString(); // month is 1-based index
//       const endOfSelectedMonth = new Date(
//         year,
//         month,
//         0,
//         23,
//         59,
//         59
//       ).toISOString();

//       // 2. Define Time Boundaries for Day/Week Cards (Relative to "Now")
//       const now = new Date();
//       const startOfToday = new Date(
//         now.getFullYear(),
//         now.getMonth(),
//         now.getDate()
//       ).toISOString();

//       const todayObj = new Date(
//         now.getFullYear(),
//         now.getMonth(),
//         now.getDate()
//       );
//       const dayOfWeek = todayObj.getDay(); // 0 (Sun) to 6 (Sat)
//       const startOfCurrentWeek = new Date(todayObj);
//       startOfCurrentWeek.setDate(todayObj.getDate() - dayOfWeek); // Go back to Sunday
//       const startOfCurrentWeekISO = startOfCurrentWeek.toISOString();

//       // 3. Filter Expenses Logic
//       // Month Total: Strictly what falls in the selected month
//       const monthExpenses = allExpenses.filter(
//         (t) => t.date >= startOfSelectedMonth && t.date <= endOfSelectedMonth
//       );

//       // Day Total: Must be Today AND Today must be within the selected month view
//       // If you view last month, "Day" (Today) should be 0 because today is not in last month.
//       const dayExpenses = monthExpenses.filter((t) => t.date >= startOfToday);

//       // Week Total: Must be This Week AND This Week must be within the selected month view
//       const weekExpenses = monthExpenses.filter(
//         (t) => t.date >= startOfCurrentWeekISO
//       );

//       const totalMonth = monthExpenses.reduce((sum, t) => sum + t.amount, 0);
//       const totalDay = dayExpenses.reduce((sum, t) => sum + t.amount, 0);
//       const totalWeek = weekExpenses.reduce((sum, t) => sum + t.amount, 0);

//       // 4. Calculate Categories (Only for the Monthly View)
//       const categoryMap: { [key: string]: { name: string; amount: number } } =
//         {};

//       monthExpenses.forEach((exp) => {
//         const categoryName = exp.category_name || "Uncategorized";
//         if (!categoryMap[categoryName]) {
//           categoryMap[categoryName] = { name: categoryName, amount: 0 };
//         }
//         categoryMap[categoryName].amount += exp.amount;
//       });

//       const processedCategories = Object.values(categoryMap)
//         .map((cat) => ({
//           ...cat,
//           percentage: totalMonth > 0 ? (cat.amount / totalMonth) * 100 : 0,
//         }))
//         .sort((a, b) => b.percentage - a.percentage);

//       setExpensesData({
//         totalDay,
//         totalWeek,
//         totalMonth,
//         filteredCategories: processedCategories,
//       });
//     };

//     processExpenses();
//   }, [month, year]); // Only re-run if month/year changes

//   // Prepare Pie Chart Data
//   const pieData = expensesData.filteredCategories
//     .filter((c) => c.amount > 0)
//     .map((c) => ({
//       name: c.name,
//       population: c.amount,
//       color: getCategoryColor(c.name),
//       legendFontColor: "#7F7F7F",
//       legendFontSize: 12,
//     }));

//   const getCurrencyFormatted = (amount: number) => {
//     // Return placeholder if 0 and user wants to see "no value" effectively
//     if (amount === 0) return "₱0.00";
//     return `₱${amount.toFixed(2)}`;
//   };

//   const chartConfig = {
//     color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
//   };

//   return (
//     <ScrollView
//       contentContainerStyle={{
//         alignItems: "center",
//         paddingHorizontal: 32,
//         paddingBottom: 50,
//       }}
//       className="bg-bgPrimary-light dark:bg-bgPrimary-dark"
//     >
//       {/* Graph Overview */}
//       <View
//         className="w-full h-[220px] p-5 mt-4 mb-4 rounded-2xl bg-card-light dark:bg-card-dark"
//         style={{ elevation: 5 }}
//       >
//         <View className="flex-row justify-between">
//           <Text className="font-medium text-textPrimary-light dark:text-textPrimary-dark">
//             Expense
//           </Text>
//         </View>

//         <View className="flex-row justify-between items-center mt-4">
//           {pieData.length > 0 ? (
//             <PieChart
//               data={pieData}
//               width={screenWidth * 0.5}
//               height={150}
//               chartConfig={chartConfig}
//               accessor="population"
//               backgroundColor="transparent"
//               paddingLeft="16"
//               hasLegend={false}
//             />
//           ) : (
//             <View className="w-[50%] h-[150px] justify-center items-center">
//               <Text className="text-gray-400 text-xs">No Data</Text>
//             </View>
//           )}

//           <View className="flex-1">
//             {expensesData.filteredCategories
//               .slice(0, 5)
//               .map((category, index) => (
//                 <View key={index} className="flex-row items-center mb-1">
//                   <View
//                     className="w-3 h-3 rounded-full mr-1"
//                     style={{ backgroundColor: getCategoryColor(category.name) }}
//                   />
//                   <Text
//                     numberOfLines={1}
//                     className="text-xs text-textPrimary-light dark:text-textPrimary-dark flex-1"
//                   >
//                     {category.name} ({category.percentage.toFixed(0)}%)
//                   </Text>
//                 </View>
//               ))}
//             {expensesData.filteredCategories.length === 0 && (
//               <Text className="text-gray-400 text-xs italic">
//                 No transactions
//               </Text>
//             )}
//           </View>
//         </View>
//       </View>

//       {/* Summary Cards */}
//       <View className="flex-row justify-between w-full gap-3">
//         {["Day", "Week", "Month"].map((label, idx) => {
//           const value = [
//             expensesData.totalDay,
//             expensesData.totalWeek,
//             expensesData.totalMonth,
//           ][idx];
//           return (
//             <View
//               key={label}
//               className="flex-1 h-22 p-5 rounded-2xl items-center justify-center bg-card-light dark:bg-card-dark"
//               style={{ elevation: 5 }}
//             >
//               <Text className="opacity-60 text-base text-textPrimary-light dark:text-textPrimary-dark mb-1">
//                 {label}
//               </Text>
//               <Text className="font-bold text-base text-accent-light dark:text-textPrimary-dark">
//                 {/* Logic: if value is 0, we can show P0.00 or a dash depending on preference.
//                      Since user asked for "no value", strict 0 check can render -- */}
//                 {value === 0 ? "₱0.00" : getCurrencyFormatted(value)}
//               </Text>
//             </View>
//           );
//         })}
//       </View>

//       {/* Category List */}
//       <View className="flex-col mt-8 gap-4 w-full">
//         {expensesData.filteredCategories.map((category, index) => (
//           <View key={index} className="flex-row gap-4 items-center w-full">
//             <View
//               className="w-12 h-12 rounded-full"
//               style={{ backgroundColor: getCategoryColor(category.name) }}
//             />
//             <View className="justify-center gap-1 flex-1">
//               <Text className="text-base font-medium text-textPrimary-light dark:text-textPrimary-dark">
//                 {category.name}
//               </Text>
//               <Text className="opacity-60 text-xs text-textSecondary-light dark:text-textSecondary-dark">
//                 Total (%)
//               </Text>
//             </View>
//             <View className="flex-col justify-end items-end gap-1">
//               <Text className="text-base font-medium text-textPrimary-light dark:text-textPrimary-dark">
//                 {getCurrencyFormatted(category.amount)}
//               </Text>
//               <Text className="opacity-60 text-xs text-textSecondary-light dark:text-textSecondary-dark">
//                 {category.percentage.toFixed(0)}%
//               </Text>
//             </View>
//           </View>
//         ))}
//         {expensesData.filteredCategories.length === 0 && (
//           <Text className="text-center text-gray-400 mt-5">
//             No transactions found for this month.
//           </Text>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// expense.tsx
import { getDb } from "@/utils/database";
import { formatCurrency } from "@/utils/stats";
import { useColorScheme } from "nativewind";
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
  category_name: string | null;
  source: string | null; // Added source to interface
}

// 1. Update Query to fetch 'source'
const fetchTransactions = async (): Promise<ExpenseTransaction[]> => {
  try {
    const db = getDb();
    const query = `
      SELECT 
        T.amount, 
        T.type, 
        T.date, 
        T.source, 
        C.name AS category_name
      FROM transactions AS T
      LEFT JOIN categories AS C ON T.category_id = C.id
      WHERE T.type = 'expense'
      ORDER BY T.date DESC;
    `;
    return db.getAllSync(query) as ExpenseTransaction[];
  } catch (error) {
    console.error("Error fetching expense transactions:", error);
    return [];
  }
};

// 2. Update Colors to include Planned Budget and fix Other Expenses key
const categoryColors: { [key: string]: string } = {
  Foods: "#8938E9",
  Shopping: "#FACC15",
  Gifts: "#4ADE80",
  Entertainment: "#EF4444",
  Clothing: "#3B82F6",
  Transportation: "#A855F7",
  "Other Expenses": "#5B1C8C", // Ensure string key matches DB Name exactly (usually has space)
  "Planned Budget": "#FF6347", // New distinct color (Tomato) for budgets
  Uncategorized: "#CCCCCC",
};

const getCategoryColor = (categoryName: string) =>
  categoryColors[categoryName] || categoryColors["Uncategorized"];

export default function ExpenseContent({ month, year }: ExpenseContentProps) {
  const { colorScheme } = useColorScheme();

  const [expensesData, setExpensesData] = useState({
    totalDay: 0,
    totalWeek: 0,
    totalMonth: 0,
    filteredCategories: [] as {
      name: string;
      amount: number;
      percentage: number;
    }[],
  });

  useEffect(() => {
    const processExpenses = async () => {
      const allExpenses = await fetchTransactions();

      // Define Time Boundaries
      const startOfSelectedMonth = new Date(year, month - 1, 1).toISOString();
      const endOfSelectedMonth = new Date(
        year,
        month,
        0,
        23,
        59,
        59
      ).toISOString();

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
      const dayOfWeek = todayObj.getDay();
      const startOfCurrentWeek = new Date(todayObj);
      startOfCurrentWeek.setDate(todayObj.getDate() - dayOfWeek);
      const startOfCurrentWeekISO = startOfCurrentWeek.toISOString();

      // Filter Expenses
      const monthExpenses = allExpenses.filter(
        (t) => t.date >= startOfSelectedMonth && t.date <= endOfSelectedMonth
      );

      const dayExpenses = monthExpenses.filter((t) => t.date >= startOfToday);
      const weekExpenses = monthExpenses.filter(
        (t) => t.date >= startOfCurrentWeekISO
      );

      const totalMonth = monthExpenses.reduce((sum, t) => sum + t.amount, 0);
      const totalDay = dayExpenses.reduce((sum, t) => sum + t.amount, 0);
      const totalWeek = weekExpenses.reduce((sum, t) => sum + t.amount, 0);

      // 3. Calculate Categories Logic
      const categoryMap: { [key: string]: { name: string; amount: number } } =
        {};

      monthExpenses.forEach((exp) => {
        // Logic: Identify Category Name
        let categoryName = exp.category_name;

        if (!categoryName) {
          // If no category linked, check if it's a planned budget
          if (exp.source === "planned_budget") {
            categoryName = "Planned Budget";
          } else {
            categoryName = "Uncategorized";
          }
        }

        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = { name: categoryName, amount: 0 };
        }
        categoryMap[categoryName].amount += exp.amount;
      });

      const processedCategories = Object.values(categoryMap)
        .map((cat) => ({
          ...cat,
          percentage: totalMonth > 0 ? (cat.amount / totalMonth) * 100 : 0,
        }))
        .sort((a, b) => b.percentage - a.percentage);

      setExpensesData({
        totalDay,
        totalWeek,
        totalMonth,
        filteredCategories: processedCategories,
      });
    };

    processExpenses();
  }, [month, year]);

  const pieData = expensesData.filteredCategories
    .filter((c) => c.amount > 0)
    .map((c) => ({
      name: c.name,
      population: c.amount,
      color: getCategoryColor(c.name),
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    }));

  const chartConfig = {
    color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
  };

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        paddingHorizontal: 32,
        paddingBottom: 50,
      }}
      className="bg-bgPrimary-light dark:bg-bgPrimary-dark"
    >
      {/* Graph Overview */}
      {/* 1. CHANGED: Removed fixed h-[220px] and added min-h so it grows with the list */}
      <View
        className="w-full min-h-[220px] p-5 mt-4 mb-4 rounded-2xl bg-card-light dark:bg-card-dark"
        style={{ elevation: 5 }}
      >
        <View className="flex-row justify-between">
          <Text className="font-medium text-textPrimary-light dark:text-textPrimary-dark">
            Expense
          </Text>
        </View>

        {/* 2. CHANGED: items-start instead of items-center so the chart stays at the top if the list is long */}
        <View className="flex-row justify-between items-start mt-4">
          {pieData.length > 0 ? (
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
          ) : (
            <View className="w-[50%] h-[150px] justify-center items-center">
              <Text className="text-gray-400 text-xs">No Data</Text>
            </View>
          )}

          <View className="flex-1 pt-2">
            {/* 3. CHANGED: Removed .slice(0, 5) to show ALL categories */}
            {expensesData.filteredCategories.map((category, index) => (
              <View key={index} className="flex-row items-center mb-1">
                <View
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: getCategoryColor(category.name) }}
                />
                {/* 4. CHANGED: Removed numberOfLines={1} so long names wrap instead of cutting off with '...' */}
                <Text className="text-xs text-textPrimary-light dark:text-textPrimary-dark flex-1">
                  {category.name} ({category.percentage.toFixed(0)}%)
                </Text>
              </View>
            ))}
            {expensesData.filteredCategories.length === 0 && (
              <Text className="text-gray-400 text-xs italic">
                No transactions
              </Text>
            )}
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
              className="flex-1 h-22 p-5 rounded-2xl items-center justify-center bg-card-light dark:bg-card-dark"
              style={{ elevation: 5 }}
            >
              <Text className="opacity-60 text-base text-textPrimary-light dark:text-textPrimary-dark mb-1">
                {label}
              </Text>
              <Text className="font-bold text-base text-accent-light dark:text-textPrimary-dark">
                {value === 0 ? "₱0.00" : `₱${formatCurrency(value)}`}
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
                ₱{formatCurrency(category.amount)}
              </Text>
              <Text className="opacity-60 text-xs text-textSecondary-light dark:text-textSecondary-dark">
                {category.percentage.toFixed(0)}%
              </Text>
            </View>
          </View>
        ))}
        {expensesData.filteredCategories.length === 0 && (
          <Text className="text-center text-gray-400 mt-5">
            No transactions found for this month.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
