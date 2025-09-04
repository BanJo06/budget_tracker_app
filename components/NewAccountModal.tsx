import React, { useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ACCOUNTS_SVG_ICONS } from "../assets/constants/accounts_icons";
import { addAccount } from "../utils/accounts";

const NewAccountModal = ({ isVisible, onClose }) => {
  const [initialAmount, setInitialAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);

  const handleSave = () => {
    // The saveAccount function is now synchronous, so no await is needed
    addAccount(
      accountName,
      "Cash",
      parseFloat(initialAmount) || 0,
      selectedIcon
    );

    // Close the modal and reset state
    onClose();
    setInitialAmount("");
    setAccountName("");
    setSelectedIcon(null);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-11/12">
          <Text className="text-xl font-bold mb-4">Add new account</Text>
          {/* Initial Amount Input */}
          <View className="w-full flex-row gap-2 items-center mb-4">
            <Text>Initial Amount</Text>
            <TextInput
              className="flex-1 h-[40] border-2 border-gray-300 rounded-lg pl-2 p-0 bg-purple-100"
              placeholder="0"
              keyboardType="numeric"
              value={initialAmount}
              onChangeText={setInitialAmount}
            />
          </View>
          {/* Account Name Input */}
          <View className="w-full flex-row gap-2 items-center mb-6">
            <Text>Name</Text>
            <TextInput
              className="flex-1 h-[40] border-2 border-gray-300 rounded-lg pl-2 p-0 bg-purple-100"
              placeholder="Untitled"
              value={accountName}
              onChangeText={setAccountName}
            />
          </View>
          {/* Icon Selector */}
          <View className="mb-6">
            <Text className="text-sm mb-2">Select Icon</Text>
            <View className="flex-row flex-wrap justify-start gap-4">
              {Object.entries(ACCOUNTS_SVG_ICONS).map(
                ([key, IconComponent]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setSelectedIcon(key)}
                    className={`p-2 rounded-full border-2 ${selectedIcon === key
                      ? "border-purple-600"
                      : "border-gray-300"
                      }`}
                  >
                    <IconComponent
                      size={24}
                      color={selectedIcon === key ? "#8938E9" : "#000000"}
                    />
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
          {/* Action Buttons */}
          <View className="flex-row justify-end gap-4">
            <TouchableOpacity
              className="w-24 h-10 rounded-lg border-2 border-purple-500 justify-center items-center"
              onPress={onClose}
            >
              <Text className="uppercase text-purple-600">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-24 h-10 rounded-lg bg-purple-600 justify-center items-center"
              onPress={handleSave}
            >
              <Text className="uppercase text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NewAccountModal;
