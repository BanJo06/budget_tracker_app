import { CATEGORIES_EXPENSES_SVG_ICONS } from "@/assets/constants/categories_expenses_icons";
import { CATEGORIES_INCOME_SVG_ICONS } from "@/assets/constants/categories_income_icons";
import { SVG_ICONS } from "@/assets/constants/icons";
import { seedDefaultCategories } from "@/database/categoryDefaultSelection";
import { initDatabase } from "@/utils/database";
import { getAllTransactions } from "@/utils/transactions";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Records() {
  const { colorScheme, setColorScheme } = useColorScheme();
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
        year: "numeric", // include the year
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
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">No transactions recorded yet.</Text>
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
      account_name,
      to_account_name,
    } = selectedTransaction;
    const isIncome = type === "income";
    const isExpense = type === "expense";
    const isTransfer = type === "transfer";
    const amountPrefix = isIncome ? "+" : "-";

    // Use Tailwind classes for colors and prefix/amount logic
    const amountColorClass = isIncome ? "text-[#8938E9]" : "text-black";
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
      const displayAmount = `₱${amount.toFixed(2)}`;
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
      <View className="m-5 rounded-xl w-[90%] bg-white dark:bg-bgPrimary-dark shadow-lg overflow-hidden">
        {/* ========= HEADER (DEPENDS ON TRANSACTION TYPE) ========= */}
        {type === "income" ? (
          // ---------- INCOME HEADER ----------
          <View className="bg-[#8B2BE2] p-5 pt-8 rounded-t-xl">
            <View className="flex-row justify-between items-center w-full mb-4">
              <Pressable
                className="w-10 h-10 rounded-full border border-white justify-center items-center"
                onPress={() => setSelectedTransaction(null)}
              >
                <Text className="text-white text-2xl">×</Text>
              </Pressable>

              <View className="flex-row items-center gap-5">
                <TouchableOpacity onPress={() => console.log("Edit")}>
                  <SVG_ICONS.Edit />
                </TouchableOpacity>
              </View>
            </View>

            <Text className="text-white text-lg font-semibold mb-1">
              INCOME
            </Text>
            <Text className="text-white text-4xl font-bold mb-1">
              ₱{amount.toFixed(2)}
            </Text>
            <Text className="text-white text-right opacity-90">
              {formattedDate} {formattedTime}
            </Text>
          </View>
        ) : type === "expense" ? (
          // ---------- EXPENSE HEADER ----------
          <View className="bg-white dark:bg-bgPrimary-dark p-5 pt-8 rounded-t-xl border-b border-gray-300">
            <View className="flex-row justify-between items-center w-full mb-4">
              <Pressable
                className="w-10 h-10 rounded-full border border-black justify-center items-center"
                onPress={() => setSelectedTransaction(null)}
              >
                <Text className="text-black text-2xl">×</Text>
              </Pressable>

              <View className="flex-row items-center gap-5">
                <TouchableOpacity onPress={() => console.log("Edit")}>
                  <SVG_ICONS.Edit />
                </TouchableOpacity>
              </View>
            </View>

            <Text className="text-black text-lg font-semibold mb-1">
              EXPENSE
            </Text>
            <Text className="text-black text-4xl font-bold mb-1">
              -₱{amount.toFixed(2)}
            </Text>
            <Text className="text-black text-right opacity-70">
              {formattedDate} {formattedTime}
            </Text>
          </View>
        ) : (
          // ---------- TRANSFER HEADER ----------
          <View className="bg-[#6B46C1] p-5 pt-8 rounded-t-xl">
            <View className="flex-row justify-between items-center w-full mb-4">
              <Pressable
                className="w-10 h-10 rounded-full border border-white justify-center items-center"
                onPress={() => setSelectedTransaction(null)}
              >
                <Text className="text-white text-2xl">×</Text>
              </Pressable>

              <View className="flex-row items-center gap-5">
                <TouchableOpacity onPress={() => console.log("Edit")}>
                  <SVG_ICONS.Edit />
                </TouchableOpacity>
              </View>
            </View>

            <Text className="text-white text-lg font-semibold mb-1">
              TRANSFER
            </Text>
            <Text className="text-white text-4xl font-bold mb-1">
              {displayAmount}
            </Text>
            <Text className="text-white text-right opacity-90">
              {formattedDate} {formattedTime}
            </Text>
          </View>
        )}

        {/* ============= BODY (DIFFERENT FOR TRANSFER) ============= */}
        <View className="p-5">
          {type === "transfer" ? (
            <>
              {/* Account From */}
              <View className="flex-row justify-between items-center w-full py-3">
                <Text className="text-base text-gray-600">Account From</Text>
                <View className="flex-row items-center border border-purple-400 rounded-full px-4 py-1.5">
                  <SVG_ICONS.Account size={20} color="#8B2BE2" />
                  <Text className="ml-2 text-base text-gray-700">
                    {account_name}
                  </Text>
                </View>
              </View>

              {/* Account To */}
              <View className="flex-row justify-between items-center w-full py-3">
                <Text className="text-base text-gray-600">Account To</Text>
                <View className="flex-row items-center border border-purple-400 rounded-full px-4 py-1.5">
                  <SVG_ICONS.Account size={20} color="#8B2BE2" />
                  <Text className="ml-2 text-base text-gray-700">
                    {to_account_name}
                  </Text>
                </View>
              </View>

              {/* Notes */}
              <View className="pt-6 items-center">
                <Text className="text-gray-400">
                  {description || "No notes"}
                </Text>
              </View>
            </>
          ) : (
            <>
              {/* Account */}
              <View className="flex-row justify-between items-center w-full py-3">
                <Text className="text-base text-gray-600">Account</Text>
                <View className="flex-row items-center border border-purple-400 rounded-full px-4 py-1.5">
                  <SVG_ICONS.Account size={20} color="#8B2BE2" />
                  <Text className="ml-2 text-base text-gray-700">
                    {account_name}
                  </Text>
                </View>
              </View>

              {/* Category */}
              <View className="flex-row justify-between items-center w-full py-3">
                <Text className="text-base text-gray-600">Category</Text>
                <View className="flex-row items-center border border-purple-400 rounded-full px-4 py-1.5">
                  <SVG_ICONS.Account size={20} color="#8B2BE2" />
                  <Text className="ml-2 text-base text-gray-700">
                    {category_name}
                  </Text>
                </View>
              </View>

              {/* Notes */}
              <View className="pt-6 items-center">
                <Text className="text-gray-400">
                  {description || "No notes"}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 px-8 bg-bgPrimary-light dark:bg-bgPrimary-dark">
      <View className="flex-row justify-end pt-4 pb-2">
        <TouchableOpacity
          onPress={() => router.push("/screens/search")}
          className="w-[30px] h-[30px] rounded-full flex-row active:bg-[#F0E4FF]"
        >
          <SVG_ICONS.Search size={30} />
        </TouchableOpacity>
      </View>

      {/* Use the styled SectionList */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={({ section: { title } }) => (
          <View className="flex-col my-4">
            <Text className="font-medium text-textPrimary-light dark:text-textPrimary-dark">
              {title}
            </Text>
            <View className="h-[2px] bg-textPrimary-light dark:bg-textPrimary-dark rounded-full" />
          </View>
        )}
        renderItem={({ item }) => {
          let IconComponent;
          let iconBgColorClass;
          let mainText;
          let amountText;
          let amountColorClass;

          // 1. Check the transaction type first.
          if (item.type === "income") {
            const categoryIconName = item.category_icon_name || "OtherIncome";
            const categoryName = item.category_name || "Other Income";

            let foundIcon = CATEGORIES_INCOME_SVG_ICONS[categoryIconName];
            IconComponent = foundIcon || SVG_ICONS.Category;

            iconBgColorClass = "bg-[#8938E9]";
            amountColorClass = "text-[#8938E9]";
            mainText = categoryName;
            amountText = `+₱${item.amount.toFixed(2)}`;
          } else if (item.type === "expense") {
            const categoryIconName = item.category_icon_name || "OtherExpenses";
            const categoryName = item.category_name || "Other Expenses";

            let foundIcon = CATEGORIES_EXPENSES_SVG_ICONS[categoryIconName];
            IconComponent = foundIcon || SVG_ICONS.Category;

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
                <Text className="text-sm text-textPrimary-light dark:text-textPrimary-dark">
                  {item.description}
                </Text>
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
        {/* modalStyles.centeredView -> flex-1 justify-center items-center mt-5.5 bg-black/50 */}
        <View className="flex-1 justify-center items-center mt-[22px] bg-black/50">
          {renderModalContent()}
        </View>
      </Modal>
    </View>
  );
}
