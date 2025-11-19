import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Transaction {
  id: number;
  amount: number;
  type: "income" | "expense" | "transfer";
  date: string;
  category_name?: string;
}

interface WeeklyTransactionsModalProps {
  visible: boolean;
  onClose: () => void;
  type: "spent" | "earned" | null;
  transactions: Transaction[];
}

const WeeklyTransactionsModal: React.FC<WeeklyTransactionsModalProps> = ({
  visible,
  onClose,
  type,
  transactions,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View
          className="bg-bgModal-light dark:bg-bgModal-dark w-[90%] rounded-2xl p-4"
          style={{ height: 450 }} // ✅ Fixed height for modal
        >
          <Text className="text-xl font-bold mb-4 text-center text-textPrimary-light dark:text-textPrimary-dark">
            {type === "spent" ? "Spent" : "Earned"} - Last 7 Days
          </Text>

          {transactions.length === 0 ? (
            <Text className="text-center text-gray-500 py-4 text-textPrimary-light dark:text-textPrimary-dark">
              No transactions found.
            </Text>
          ) : (
            <ScrollView
              className="mb-4"
              style={{ maxHeight: 300 }} // ✅ Scrollable content area
              showsVerticalScrollIndicator={true}
            >
              {transactions.map((t) => (
                <View
                  key={t.id}
                  className="flex-row justify-between items-center py-2 border-b border-textPrimary-light dark:border-textPrimary-dark"
                >
                  <View className="flex-col">
                    <Text className="text-base text-textPrimary-light dark:text-textPrimary-dark font-medium">
                      {t.category_name || "(no category)"}
                    </Text>
                    <Text className="text-sm text-textPrimary-light dark:text-textPrimary-dark">
                      {formatDate(t.date)}
                    </Text>
                  </View>
                  <Text className="text-base font-semibold text-textPrimary-light dark:text-textPrimary-dark">
                    ₱{t.amount.toFixed(2)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}

          {transactions.length > 0 && (
            <View className="flex-row justify-between border-t border-textPrimary-light dark:border-textPrimary-dark pt-2">
              <Text className="text-base font-medium text-textPrimary-light dark:text-textPrimary-dark">
                Total
              </Text>
              <Text className="text-base font-semibold text-textPrimary-light dark:text-textPrimary-dark">
                ₱{totalAmount.toFixed(2)}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={onClose}
            className="bg-[#8938E9] rounded-xl mt-4 py-3"
          >
            <Text className="text-white text-center font-semibold text-base">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default WeeklyTransactionsModal;
