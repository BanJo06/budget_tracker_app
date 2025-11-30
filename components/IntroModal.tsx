import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface IntroModalProps {
  visible: boolean;
  onSave: (name: string) => void; // Changed onClose to onSave
}

const IntroModal: React.FC<IntroModalProps> = ({ visible, onSave }) => {
  const [inputName, setInputName] = useState("");

  const renderGuideContent = () => (
    <>
      <Text className="text-base text-textPrimary-light dark:text-textPrimary-dark leading-6">
        <Text className="font-bold">👋 Welcome to the app!</Text>
        {"\n\n"}
        <Text>What's your name?</Text>
        {"\n"}
      </Text>
      <TextInput
        className="h-12 border-2 border-gray-300 rounded-lg px-3 bg-purple-100 text-black mt-2"
        placeholder="Enter your name"
        value={inputName}
        onChangeText={setInputName}
        placeholderTextColor="#9CA3AF"
      />
    </>
  );

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View
          className="bg-bgModal-light dark:bg-bgModal-dark w-[90%] rounded-2xl p-4"
          style={{ height: 450 }}
        >
          {/* Title */}
          <Text className="text-xl font-bold mb-4 text-center text-textPrimary-light dark:text-textPrimary-dark">
            Welcome
          </Text>

          {/* Scrollable Content Area */}
          <ScrollView
            className="mb-4"
            style={{ maxHeight: 350 }}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
          >
            {renderGuideContent()}
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity
            onPress={() => onSave(inputName)}
            className="bg-[#8938E9] rounded-xl mt-auto py-3"
          >
            <Text className="text-white text-center font-semibold text-base">
              ACCEPT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default IntroModal;
