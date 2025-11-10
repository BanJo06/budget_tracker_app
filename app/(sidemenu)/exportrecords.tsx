import DateTimePicker from "@react-native-community/datetimepicker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";

import { db } from "@/utils/database";

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
    <View style={{ padding: 20 }}>
      <Text>From:</Text>
      <TouchableOpacity onPress={() => setShowFromPicker(true)}>
        <Text>{fromDate.toDateString()}</Text>
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

      <Text>To:</Text>
      <TouchableOpacity onPress={() => setShowToPicker(true)}>
        <Text>{toDate.toDateString()}</Text>
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

      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: "#4CAF50",
          padding: 15,
          borderRadius: 8,
        }}
        onPress={handleExport}
      >
        <Text
          style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
        >
          Export to CSV
        </Text>
      </TouchableOpacity>
    </View>
  );
}
