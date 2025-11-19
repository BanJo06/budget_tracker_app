import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface OverviewGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

const OverviewGuideModal: React.FC<OverviewGuideModalProps> = ({
  visible,
  onClose,
}) => {
  // 💡 The text guide content is now defined directly inside the component
  const renderGuideContent = () => (
    <Text className="text-base text-textPrimary-light dark:text-textPrimary-dark leading-6">
      {/* Outer Text applies general font and color styles */}
      In <Text className="font-bold">Overview section</Text>, you will see the{" "}
      <Text className="font-bold">progress ring</Text> for{" "}
      <Text className="font-bold">daily, weekly</Text> and{" "}
      <Text className="font-bold">monthly</Text> spending based on your{" "}
      <Text className="font-bold">daily budget</Text> input. To input your daily
      budget, go to <Text className="font-bold">Reports</Text> {">"}{" "}
      <Text className="font-bold">Budgets</Text> {">"}{" "}
      <Text className="font-bold">General Budgets</Text> {">"} click the{" "}
      <Text className="font-bold">"Change"</Text> button to input your preferred
      daily budget.
    </Text>
  );

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View
          className="bg-bgModal-light dark:bg-bgModal-dark w-[90%] rounded-2xl p-4"
          style={{ height: 450 }} // Consistent height
        >
          {/* Title */}
          <Text className="text-xl font-bold mb-4 text-center text-textPrimary-light dark:text-textPrimary-dark">
            Overview
          </Text>

          {/* Scrollable Content Area */}
          <ScrollView
            className="mb-4"
            style={{ maxHeight: 350 }}
            showsVerticalScrollIndicator={true}
          >
            {/* The hardcoded text is placed here */}
            <Text className="text-base text-textPrimary-light dark:text-textPrimary-dark leading-6">
              {renderGuideContent()}
            </Text>
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            className="bg-[#8938E9] rounded-xl mt-auto py-3"
          >
            <Text className="text-white text-center font-semibold text-base">
              Close Guide
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default OverviewGuideModal;
