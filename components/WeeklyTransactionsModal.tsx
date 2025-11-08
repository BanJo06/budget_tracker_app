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
          className="bg-white w-[90%] rounded-2xl p-4"
          style={{ height: 450 }} // ✅ Fixed height for modal
        >
          <Text className="text-xl font-bold mb-4 text-center">
            {type === "spent" ? "Spent" : "Earned"} - Last 7 Days
          </Text>

          {transactions.length === 0 ? (
            <Text className="text-center text-gray-500 py-4">
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
                  className="flex-row justify-between items-center py-2 border-b border-gray-200"
                >
                  <View className="flex-col">
                    <Text className="text-base text-gray-800 font-medium">
                      {t.category_name || "(no category)"}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {formatDate(t.date)}
                    </Text>
                  </View>
                  <Text className="text-base font-semibold text-gray-900">
                    ₱{t.amount.toFixed(2)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}

          {transactions.length > 0 && (
            <View className="flex-row justify-between border-t border-gray-300 pt-2">
              <Text className="text-base font-medium text-gray-800">Total</Text>
              <Text className="text-base font-semibold text-gray-900">
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
