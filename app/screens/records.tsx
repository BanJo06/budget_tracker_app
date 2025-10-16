import { CATEGORIES_EXPENSES_SVG_ICONS } from "@/assets/constants/categories_expenses_icons";
import { CATEGORIES_INCOME_SVG_ICONS } from "@/assets/constants/categories_income_icons";
import { SVG_ICONS } from "@/assets/constants/icons";
import { seedDefaultCategories } from "@/database/categoryDefaultSelection";
import { initDatabase } from "@/utils/database";
import { getAllTransactions } from "@/utils/transactions";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, SectionList, Text, View } from "react-native";

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
    // styles.emptyContainer -> flex-1 justify-center items-center
    // styles.emptyText -> text-gray
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
      // modalStyles.modalView -> m-5 bg-white rounded-xl p-9 items-center shadow-lg w-[90%]
      // (The shadow/elevation styles are complex to fully replicate, using shadow-lg as a close approximation)
      <View className="m-5 bg-white rounded-xl p-9 items-center shadow-lg w-[90%]">
        {/* Header with buttons */}
        {/* modalStyles.headerContainer -> flex-row justify-between w-full mb-5 */}
        <View className="flex-row justify-between w-full mb-5">
          {/* modalStyles.button -> p-2.5 */}
          <Pressable
            className="p-2.5"
            onPress={() => setSelectedTransaction(null)}
          >
            <SVG_ICONS.Category size={24} color="#000" />
          </Pressable>
          {/* modalStyles.buttonGroup -> flex-row gap-2.5 */}
          <View className="flex-row gap-2.5">
            <Pressable className="p-2.5"></Pressable>
            <Pressable className="p-2.5"></Pressable>
          </View>
        </View>

        {/* Transaction details */}
        {/* modalStyles.detailContainer -> items-center mb-5 */}
        <View className="items-center mb-5">
          {/* modalStyles.iconBg -> w-15 h-15 rounded-full justify-center items-center mb-2.5 */}
          <View
            className={`w-15 h-15 rounded-full justify-center items-center mb-2.5 ${iconBgColorClass}`}
          >
            {IconComponent && <IconComponent size={40} color="white" />}
          </View>
          {/* modalStyles.amountText -> text-2xl font-bold mb-1.5 */}
          <Text className={`text-2xl font-bold mb-1.5 ${amountColorClass}`}>
            {displayAmount}
          </Text>
          {/* modalStyles.mainText -> text-xl font-medium text-center */}
          <Text className="text-xl font-medium text-center">{mainText}</Text>
          {/* modalStyles.subText -> text-base text-gray-500 text-center */}
          <Text className="text-base text-gray-500 text-center">{subText}</Text>
        </View>

        {/* modalStyles.infoRow -> flex-row justify-between w-full py-2.5 border-b border-gray-100 */}
        <View className="flex-row justify-between w-full py-2.5 border-b border-gray-100">
          {/* modalStyles.infoLabel -> text-base text-gray-500 */}
          <Text className="text-base text-gray-500">Account</Text>
          {/* modalStyles.infoValue -> text-base font-medium text-right flex-shrink */}
          <Text className="text-base font-medium text-right flex-shrink">
            {account_name}
          </Text>
        </View>
        <View className="flex-row justify-between w-full py-2.5 border-b border-gray-100">
          <Text className="text-base text-gray-500">Date & Time</Text>
          <Text className="text-base font-medium text-right flex-shrink">
            {formattedDate} at {formattedTime}
          </Text>
        </View>
        {description && (
          <View className="flex-row justify-between w-full py-2.5 border-b border-gray-100">
            <Text className="text-base text-gray-500">Notes</Text>
            <Text className="text-base font-medium text-right flex-shrink">
              {description}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    // styles.container -> flex-1 bg-white px-8
    <View className="flex-1 bg-white px-8">
      {/* styles.header -> flex-row justify-end pt-4 pb-2 */}
      <View className="flex-row justify-end pt-4 pb-2">
        <SVG_ICONS.Search size={30} />
      </View>

      {/* Use the styled SectionList */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={({ section: { title } }) => (
          // styles.sectionHeader -> flex-col my-4
          <View className="flex-col my-4">
            {/* styles.sectionTitle -> font-medium */}
            <Text className="font-medium">{title}</Text>
            {/* styles.separator -> h-[2px] bg-black rounded-full */}
            <View className="h-[2px] bg-black rounded-full" />
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
            // styles.transactionItem -> flex-row items-center mb-4 gap-4
            <Pressable
              onPress={() => setSelectedTransaction(item)}
              className="flex-row items-center mb-4 gap-4"
            >
              {/* styles.iconContainer -> w-12.5 h-12.5 rounded-full justify-center items-center */}
              <View
                className={`w-[50px] h-[50px] rounded-full justify-center items-center ${iconBgColorClass}`}
              >
                {IconComponent && <IconComponent size={24} color="white" />}
              </View>
              {/* styles.transactionDetails -> flex-1 flex-col justify-center gap-1 */}
              <View className="flex-1 flex-col justify-center gap-1">
                {/* styles.detailRow -> flex-row justify-between items-center */}
                <View className="flex-row justify-between items-center">
                  {/* styles.categoryName -> text-base font-medium */}
                  <Text className="text-base font-medium">{mainText}</Text>
                  {/* styles.amount -> text-base font-bold */}
                  <Text className={`text-base font-bold ${amountColorClass}`}>
                    {amountText}
                  </Text>
                </View>
                {/* styles.subText -> text-sm text-gray-500 */}
                <Text className="text-sm text-gray-500">
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
