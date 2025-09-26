import { CATEGORIES_EXPENSES_SVG_ICONS } from "@/assets/constants/categories_expenses_icons";
import { CATEGORIES_INCOME_SVG_ICONS } from "@/assets/constants/categories_income_icons";
import { SVG_ICONS } from "@/assets/constants/icons";
import { seedDefaultCategories } from "@/database/categoryDefaultSelection";
import { initDatabase } from "@/utils/database";
import { getAllTransactions } from "@/utils/transactions";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Records() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    async function loadTransactions() {
      try {
        await initDatabase();
        seedDefaultCategories();
        const allTransactions = await getAllTransactions();
        setTransactions(allTransactions);
      } catch (error) {
        console.error("Failed to load transactions:", error);
      }
    }
    loadTransactions();
  }, []);

  const groupTransactionsByDate = (transactionsList) => {
    const groupedData = {};
    transactionsList.forEach((transaction) => {
      const date = new Date(transaction.date);
      const day = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      if (!groupedData[day]) {
        groupedData[day] = [];
      }
      groupedData[day].push(transaction);
    });

    return Object.keys(groupedData).map((date) => ({
      title: date,
      data: groupedData[date],
    }));
  };

  const sections = groupTransactionsByDate(transactions);

  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No transactions recorded yet.</Text>
      </View>
    );
  }

  const renderModalContent = () => {
    if (!selectedTransaction) {
      return null;
    }

    const {
      type,
      amount,
      date,
      description,
      category_icon_name,
      category_name,
    } = selectedTransaction;
    const isIncome = type === "income";
    const isExpense = type === "expense";
    const isTransfer = type === "transfer";
    const amountPrefix = isIncome ? "+" : "-";
    const amountColor = isIncome ? "#8938E9" : "#000000";
    const displayAmount = isTransfer
      ? amount.toFixed(2)
      : `${amountPrefix}₱${amount.toFixed(2)}`;

    let IconComponent;
    let iconBgColor;
    let mainText;
    let subText;

    if (isIncome) {
      IconComponent =
        CATEGORIES_INCOME_SVG_ICONS?.[category_icon_name] || SVG_ICONS.Category;
      iconBgColor = "#8938E9";
      mainText = category_name;
      subText = "Income";
    } else if (isExpense) {
      IconComponent =
        CATEGORIES_EXPENSES_SVG_ICONS?.[category_icon_name] ||
        SVG_ICONS.Category;
      iconBgColor = "#000000";
      mainText = category_name;
      subText = "Expense";
    } else if (isTransfer) {
      IconComponent = SVG_ICONS.Transfer;
      iconBgColor = "#6b7280";
      mainText = `Transfer`;
      subText = `From ${selectedTransaction.account_name} to ${selectedTransaction.to_account_name}`;
    }

    const transactionDate = new Date(date);
    const formattedDate = transactionDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = transactionDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View style={modalStyles.modalView}>
        {/* Header with buttons */}
        <View style={modalStyles.headerContainer}>
          <Pressable
            style={modalStyles.button}
            onPress={() => setSelectedTransaction(null)}
          >
            <SVG_ICONS.Category size={24} color="#000" />
          </Pressable>
          <View style={modalStyles.buttonGroup}>
            <Pressable style={modalStyles.button}></Pressable>
            <Pressable style={modalStyles.button}></Pressable>
          </View>
        </View>

        {/* Transaction details */}
        <View style={modalStyles.detailContainer}>
          <View style={[modalStyles.iconBg, { backgroundColor: iconBgColor }]}>
            {IconComponent && <IconComponent size={40} color="white" />}
          </View>
          <Text style={[modalStyles.amountText, { color: amountColor }]}>
            {displayAmount}
          </Text>
          <Text style={modalStyles.mainText}>{mainText}</Text>
          <Text style={modalStyles.subText}>{subText}</Text>
        </View>

        <View style={modalStyles.infoRow}>
          <Text style={modalStyles.infoLabel}>Account</Text>
          <Text style={modalStyles.infoValue}>
            {selectedTransaction.account_name}
          </Text>
        </View>
        <View style={modalStyles.infoRow}>
          <Text style={modalStyles.infoLabel}>Date & Time</Text>
          <Text style={modalStyles.infoValue}>
            {formattedDate} at {formattedTime}
          </Text>
        </View>
        {description && (
          <View style={modalStyles.infoRow}>
            <Text style={modalStyles.infoLabel}>Notes</Text>
            <Text style={modalStyles.infoValue}>{description}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SVG_ICONS.Search size={30} />
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.separator} />
          </View>
        )}
        renderItem={({ item }) => {
          console.log("Item:", item);
          console.log("SVG_ICONS:", SVG_ICONS); // Check if this is undefined
          console.log(
            "CATEGORIES_INCOME_SVG_ICONS:",
            CATEGORIES_INCOME_SVG_ICONS
          ); // Check this too
          console.log(
            "Icon to render:",
            CATEGORIES_INCOME_SVG_ICONS?.[item.category_icon_name]
          );
          console.log(
            "CATEGORIES_EXPENSES_SVG_ICONS:",
            CATEGORIES_EXPENSES_SVG_ICONS
          ); // Check this too
          console.log(
            "Icon to render:",
            CATEGORIES_EXPENSES_SVG_ICONS?.[item.category_icon_name]
          );
          let IconComponent;
          let iconBgColor;
          let mainText;
          let amountText;
          let amountColor;

          // 1. Check the transaction type first.
          if (item.type === "income") {
            // Logic for INCOME transactions: Only look in the INCOME map.
            const categoryIconName = item.category_icon_name || "OtherIncome";
            const categoryName = item.category_name || "Other Income";

            // Only look up in the income map.
            let foundIcon = CATEGORIES_INCOME_SVG_ICONS[categoryIconName];

            // Assign the icon, with a safe fallback.
            IconComponent = foundIcon || SVG_ICONS.Category;

            // Console.log the result of the correct lookup only
            console.log("Income Icon to render:", IconComponent);
            // ... rest of income display variables
            iconBgColor = "#8938E9";
            mainText = categoryName;
            amountText = `+₱${item.amount.toFixed(2)}`;
            amountColor = "#8938E9";
          } else if (item.type === "expense") {
            // Logic for EXPENSE transactions: Only look in the EXPENSE map.
            const categoryIconName = item.category_icon_name || "OtherExpenses";
            const categoryName = item.category_name || "Other Expenses";

            // Only look up in the expense map.
            let foundIcon = CATEGORIES_EXPENSES_SVG_ICONS[categoryIconName];

            // Assign the icon, with a safe fallback.
            IconComponent = foundIcon || SVG_ICONS.Category;

            // Console.log the result of the correct lookup only
            console.log("Expense Icon to render:", IconComponent);
            // ... rest of expense display variables
            iconBgColor = "#000000";
            mainText = categoryName;
            amountText = `-₱${item.amount.toFixed(2)}`;
            amountColor = "#000000";
          } else if (item.type === "transfer") {
            // Logic for TRANSFER transactions (no category needed)
            IconComponent = SVG_ICONS.Transfer;
            // ... rest of transfer display variables
            iconBgColor = "#6b7280";
            mainText = `Transfer from ${item.account_name} to ${item.to_account_name}`;
            amountText = `${item.amount.toFixed(2)}`;
            amountColor = "#6b7280";
          }

          return (
            <Pressable
              onPress={() => setSelectedTransaction(item)}
              style={styles.transactionItem}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: iconBgColor }]}
              >
                {IconComponent && <IconComponent size={24} color="white" />}
              </View>
              <View style={styles.transactionDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.categoryName}>{mainText}</Text>
                  <Text style={[styles.amount, { color: amountColor }]}>
                    {amountText}
                  </Text>
                </View>
                <Text style={styles.subText}>{item.description}</Text>
              </View>
            </Pressable>
          );
        }}
      />
      {/* Modal for transaction details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedTransaction}
        onRequestClose={() => {
          setSelectedTransaction(null);
        }}
      >
        <View style={modalStyles.centeredView}>{renderModalContent()}</View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (existing styles remain the same)
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "gray",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: "column",
    marginVertical: 16,
  },
  sectionTitle: {
    fontWeight: "500",
  },
  separator: {
    height: 2,
    backgroundColor: "black",
    borderRadius: 999,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionDetails: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    gap: 4,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 14,
    color: "gray",
  },
});

// New styles for the modal
const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0,0,0,0.5)", // Adds a semi-transparent overlay
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
    width: "90%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    padding: 10,
  },
  detailContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconBg: {
    width: 60,
    height: 60,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  amountText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  mainText: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 16,
    color: "gray",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "right",
    flexShrink: 1, // Allows text to wrap if it's too long
  },
});
