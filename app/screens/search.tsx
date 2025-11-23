import { CATEGORIES_EXPENSES_SVG_ICONS } from "@/assets/constants/categories_expenses_icons";
import { CATEGORIES_INCOME_SVG_ICONS } from "@/assets/constants/categories_income_icons";
import { SVG_ICONS } from "@/assets/constants/icons";
import { seedDefaultCategories } from "@/database/categoryDefaultSelection";
import { initDatabase } from "@/utils/database";
import { getAllTransactions } from "@/utils/transactions";
import { useNavigation } from "@react-navigation/native";
import { useColorScheme } from "nativewind";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Modal,
  Pressable,
  SectionList,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SearchTransactions() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  // Changing header name
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Search Transactions",
      // background color of the header
      headerStyle: {
        backgroundColor: colorScheme === "dark" ? "#121212" : "#ffffff",
      },
      // color of the title text and back arrow
      headerTintColor: colorScheme === "dark" ? "#ffffff" : "#000000",
    });
  }, [navigation, colorScheme]);

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

  // Filter transactions by search query
  const filteredTransactions = transactions.filter((transaction) => {
    const query = searchQuery.toLowerCase();
    return (
      transaction.description?.toLowerCase().includes(query) ||
      transaction.category_name?.toLowerCase().includes(query) ||
      transaction.account_name?.toLowerCase().includes(query) ||
      (transaction.to_account_name?.toLowerCase().includes(query) ?? false)
    );
  });

  const groupTransactionsByDate = (transactionsList) => {
    const groupedData = {};
    transactionsList.forEach((transaction) => {
      const date = new Date(transaction.date);
      const day = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      if (!groupedData[day]) groupedData[day] = [];
      groupedData[day].push(transaction);
    });
    return Object.keys(groupedData).map((date) => ({
      title: date,
      data: groupedData[date],
    }));
  };

  const sections = groupTransactionsByDate(filteredTransactions);

  const renderModalContent = () => {
    if (!selectedTransaction) return null;

    const {
      type,
      amount,
      date,
      description,
      category_icon_name,
      category_name,
      account_name,
      to_account_name,
    } = selectedTransaction;

    const isIncome = type === "income";
    const isExpense = type === "expense";
    const isTransfer = type === "transfer";
    const amountPrefix = isIncome ? "+" : "-";

    const amountColorClass = "text-[#8938E9]";
    // const amountColorClass = isIncome ? "text-[#8938E9]" : "text-black";
    const iconBgColorClass = isIncome
      ? "bg-[#8938E9]"
      : isExpense
      ? "bg-black"
      : "bg-gray-500";
    const amountCurrency = "₱";

    const displayAmount = isTransfer
      ? amount.toFixed(2)
      : `${amountPrefix}${amountCurrency}${amount.toFixed(2)}`;

    let IconComponent;
    let mainText;
    let subText;

    if (isIncome) {
      IconComponent =
        CATEGORIES_INCOME_SVG_ICONS?.[category_icon_name] || SVG_ICONS.Category;
      mainText = category_name;
      subText = "Income";
    } else if (isExpense) {
      IconComponent =
        CATEGORIES_EXPENSES_SVG_ICONS?.[category_icon_name] ||
        SVG_ICONS.Category;
      mainText = category_name;
      subText = "Expense";
    } else if (isTransfer) {
      IconComponent = SVG_ICONS.Transfer;
      mainText = `Transfer`;
      subText = `From ${account_name} to ${to_account_name}`;
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
      <View className="m-5 rounded-xl p-9 items-center shadow-lg w-[90%] bg-bgPrimary-light dark:bg-bgPrimary-dark">
        <Pressable
          className="self-end p-2.5"
          onPress={() => setSelectedTransaction(null)}
        >
          <Text className="text-textPrimary-light dark:text-textPrimary-dark text-lg">
            Close
          </Text>
        </Pressable>
        <View className="items-center mb-5">
          <View
            className={`w-15 h-15 rounded-full justify-center items-center mb-2.5 ${iconBgColorClass}`}
          >
            {IconComponent && <IconComponent size={40} color="white" />}
          </View>
          <Text className={`text-2xl font-bold mb-1.5 ${amountColorClass}`}>
            {displayAmount}
          </Text>
          <Text className="text-xl font-medium text-center text-textPrimary-light dark:text-textPrimary-dark">
            {mainText}
          </Text>
          <Text className="text-base text-textPrimary-light dark:text-textPrimary-dark text-center">
            {subText}
          </Text>
        </View>
        <View className="flex-row justify-between w-full py-2.5 border-b border-gray-100">
          <Text className="text-base text-textPrimary-light dark:text-textPrimary-dark">
            Account
          </Text>
          <Text className="text-base font-medium text-right flex-shrink text-textPrimary-light dark:text-textPrimary-dark">
            {account_name}
          </Text>
        </View>
        <View className="flex-row justify-between w-full py-2.5 border-b border-gray-100">
          <Text className="text-base text-textPrimary-light dark:text-textPrimary-dark">
            Date & Time
          </Text>
          <Text className="text-base font-medium text-right flex-shrink text-textPrimary-light dark:text-textPrimary-dark">
            {formattedDate} at {formattedTime}
          </Text>
        </View>
        {description && (
          <View className="flex-row justify-between w-full py-2.5 border-b border-gray-100">
            <Text className="text-base text-textPrimary-light dark:text-textPrimary-dark">
              Notes
            </Text>
            <Text className="text-base font-medium text-right flex-shrink text-textPrimary-light dark:text-textPrimary-dark">
              {description}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 px-6 pt-4 bg-bgPrimary-light dark:bg-bgPrimary-dark">
      {/* Search Box */}
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search transactions..."
        className="h-[40] px-4 mb-4 border rounded-full border-search-light dark:border-search-dark text-search-light dark:text-search-dark"
        placeholderTextColor="#888"
      />

      {/* SectionList */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={({ section: { title } }) => (
          <View className="flex-col my-2">
            <Text className="font-medium text-textPrimary-light dark:text-textPrimary-dark">
              {title}
            </Text>
            <View className="h-[1px] rounded-full bg-textPrimary-light dark:bg-textPrimary-dark" />
          </View>
        )}
        renderItem={({ item }) => {
          let IconComponent;
          let iconBgColorClass;
          let mainText;
          let amountText;
          let amountColorClass;

          if (item.type === "income") {
            const categoryIconName = item.category_icon_name || "OtherIncome";
            const categoryName = item.category_name || "Other Income";
            IconComponent =
              CATEGORIES_INCOME_SVG_ICONS[categoryIconName] ||
              SVG_ICONS.Category;
            iconBgColorClass = "bg-[#8938E9]";
            amountColorClass = "text-[#8938E9]";
            mainText = categoryName;
            amountText = `+₱${item.amount.toFixed(2)}`;
          } else if (item.type === "expense") {
            const categoryIconName = item.category_icon_name || "OtherExpenses";
            const categoryName = item.category_name || "Other Expenses";
            IconComponent =
              CATEGORIES_EXPENSES_SVG_ICONS[categoryIconName] ||
              SVG_ICONS.Category;
            iconBgColorClass = "bg-black";
            amountColorClass = "text-black";
            mainText = categoryName;
            amountText = `-₱${item.amount.toFixed(2)}`;
          } else if (item.type === "transfer") {
            IconComponent = SVG_ICONS.Transfer;
            iconBgColorClass = "bg-gray-500";
            amountColorClass = "text-gray-500";
            mainText = `Transfer from ${item.account_name} to ${item.to_account_name}`;
            amountText = `${item.amount.toFixed(2)}`;
          }

          return (
            <Pressable
              onPress={() => setSelectedTransaction(item)}
              className="flex-row items-center mb-4 gap-4"
            >
              <View
                className={`w-[50px] h-[50px] rounded-full justify-center items-center ${iconBgColorClass}`}
              >
                {IconComponent && <IconComponent size={24} color="white" />}
              </View>
              <View className="flex-1 flex-col justify-center gap-1">
                <View className="flex-row justify-between items-center">
                  <Text className="text-base font-medium text-textPrimary-light dark:text-textPrimary-dark">
                    {mainText}
                  </Text>
                  <Text
                    className={`text-base font-bold ${amountColorClass} dark:text-textPrimary-dark`}
                  >
                    {amountText}
                  </Text>
                </View>
                <Text className="text-sm text-textSecondary-light dark:text-textSecondary-dark">
                  {item.description}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedTransaction}
        onRequestClose={() => setSelectedTransaction(null)}
      >
        <View className="flex-1 justify-center items-center mt-[22px] bg-black/50">
          {renderModalContent()}
        </View>
      </Modal>
    </View>
  );
}
