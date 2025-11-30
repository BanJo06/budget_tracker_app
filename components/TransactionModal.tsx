import { SVG_ICONS } from "@/assets/constants/icons";
import React from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

interface TransactionModalProps {
  isVisible: boolean;
  onClose: () => void;
  amount: string;
  onChangeAmount: (v: string) => void;
  selectedAccount: any;
  onSelectAccount: (acc: any) => void;
  onSave: () => void;
  toggleAccountsModal: () => void;
}

const TransactionModal = ({
  isVisible,
  onClose,
  amount,
  onChangeAmount,
  selectedAccount,
  onSelectAccount,
  onSave,
  toggleAccountsModal,
}: TransactionModalProps) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={isVisible}
    onRequestClose={onClose}
  >
    <View className="flex-1 justify-center items-center bg-black/50">
      <View className="w-[360] bg-bgModal-light dark:bg-bgModal-dark rounded-[20] p-[20] shadow-lg">
        <Text className="text-[18px] font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-[16]">
          Create Budget Transaction
        </Text>

        <TextInput
          placeholder="Amount (₱)"
          keyboardType="numeric"
          value={amount}
          onChangeText={onChangeAmount}
          className="w-full border border-gray-300 rounded-[12] p-[10] mb-4 text-textTextbox-light dark:text-textTextbox-dark"
        />

        <View className="mb-4">
          <Text className="mb-2 text-textPrimary-light dark:text-textPrimary-dark">
            Account:
          </Text>
          <TouchableOpacity
            onPress={toggleAccountsModal}
            className="w-full h-12 flex-row gap-4 justify-center items-center bg-button-light dark:bg-button-dark rounded-lg"
          >
            <SVG_ICONS.Account size={16} color="white" />
            <Text className="text-white text-base">
              {selectedAccount ? selectedAccount.name : "SELECT ACCOUNT"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-4 mt-[20]">
          <TouchableOpacity
            onPress={onSave}
            className="flex-1 bg-button-light dark:bg-button-dark px-[16] py-[10] rounded-[12]"
          >
            <Text className="text-white text-center font-medium">SAVE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="flex-1 border-2 border-borderButton-light dark:border-borderButton-dark px-[16] py-[10] rounded-[12]"
          >
            <Text className="text-borderButton-light dark:text-borderButton-dark text-center font-medium">
              CANCEL
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default TransactionModal;
