import DateTimePicker from "@react-native-community/datetimepicker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { db } from "@/utils/database";
// import { useColorScheme } from "nativewind";

import { useColorScheme } from "react-native";

// ✅ TypeScript type for transactions
type TransactionRow = {
  date: string;
  type: string;
  name_icon: string;
  description: string;
  account_name: string;
  amount: number;
};

export default function ExportTransactionsCSV() {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const colorScheme = useColorScheme();

  // Convert JSON array to CSV
  const convertToCSV = (
    data: TransactionRow[],
    columns: (keyof TransactionRow)[]
  ): string => {
    const header = columns.join(",");
    const rows = data.map((row) =>
      columns
        .map((col) => `"${(row[col] ?? "").toString().replace(/"/g, '""')}"`)
        .join(",")
    );
    return [header, ...rows].join("\n");
  };

  // Format date as MM-DD-YYYY
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  const handleExport = async () => {
    try {
      const transactions = db.getAllSync(
        `SELECT 
          t.date, 
          t.type, 
          COALESCE(
            CASE 
              WHEN c.icon_name IS NOT NULL AND c.icon_name != '' AND c.icon_name != c.name 
              THEN c.name || ' (' || c.icon_name || ')' 
              ELSE c.name
            END, ''
          ) AS name_icon,
          COALESCE(t.description, '') AS description,
          COALESCE(a.name, '') AS account_name,
          t.amount
        FROM transactions t
        LEFT JOIN accounts a ON t.account_id = a.id
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE date(t.date) BETWEEN date(?) AND date(?)
        ORDER BY t.date ASC;`,
        [fromDate.toISOString(), toDate.toISOString()]
      ) as TransactionRow[];

      if (!transactions.length) {
        Alert.alert("No transactions found for the selected dates.");
        return;
      }

      // Format the date column
      const formattedTransactions = transactions.map((tx) => ({
        ...tx,
        date: formatDate(tx.date),
      }));

      const columns: (keyof TransactionRow)[] = [
        "date",
        "type",
        "name_icon",
        "description",
        "account_name",
        "amount",
      ];
      const csv = convertToCSV(formattedTransactions, columns);

      const fileUri = `${
        FileSystem.documentDirectory
      }transactions_${Date.now()}.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(fileUri);

      console.log("✅ CSV exported:", fileUri);
    } catch (error: any) {
      console.error("❌ Error exporting CSV:", error);
      Alert.alert("Error exporting CSV:", error.message || "Unknown error");
    }
  };

  return (
    <View
      style={{ padding: 20 }}
      className="flex-1 bg-bgPrimary-light dark:bg-bgPrimary-dark"
    >
      <StatusBar
        // If the colorScheme is 'dark', use 'light-content' (white text/icons)
        // If the colorScheme is 'light' or null/undefined, use 'dark-content' (black text/icons)
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colorScheme === "dark" ? "#000000" : "#FFFFFF"} // Optional: Set background color for Android
      />
      {/* FROM Date Picker */}
      <View className="w-full mb-[32]">
        <Text className="text-textPrimary-light dark:text-textPrimary-dark mb-2">
          From:
        </Text>
        <TouchableOpacity
          className="w-full h-[50] bg-button-light dark:bg-button-dark rounded-[10] items-center justify-center" // w-[150] changed to w-full, h slightly increased
          onPress={() => setShowFromPicker(true)}
        >
          <Text className="text-textButton-light dark:text-textButton-dark font-bold text-lg">
            {fromDate.toDateString()}
          </Text>
        </TouchableOpacity>

        {showFromPicker && (
          <DateTimePicker
            value={fromDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, date) => {
              setShowFromPicker(false);
              if (date) setFromDate(date);
            }}
          />
        )}
      </View>

      {/* TO Date Picker */}
      <View className="w-full">
        <Text className="text-textPrimary-light dark:text-textPrimary-dark mb-2">
          To:
        </Text>
        <TouchableOpacity
          className="w-full h-[50] bg-button-light dark:bg-button-dark rounded-[10] items-center justify-center" // w-[150] changed to w-full, h slightly increased
          onPress={() => setShowToPicker(true)}
        >
          <Text className="text-textButton-light dark:text-textButton-dark font-bold text-lg">
            {toDate.toDateString()}
          </Text>
        </TouchableOpacity>

        {showToPicker && (
          <DateTimePicker
            value={toDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, date) => {
              setShowToPicker(false);
              if (date) setToDate(date);
            }}
          />
        )}
      </View>

      {/* Export Button */}
      <TouchableOpacity
        style={{
          marginTop: 60, // Reduced from 80 for better flow
          padding: 15,
          borderRadius: 8,
        }}
        className="bg-button-light dark:bg-button-dark"
        onPress={handleExport}
      >
        <Text
          style={{ textAlign: "center", fontWeight: "bold" }}
          className="text-textInsidePrimary-light dark:text-textInsidePrimary-dark text-lg" // Added text-lg
        >
          Export to CSV
        </Text>
      </TouchableOpacity>
    </View>
  );
}
