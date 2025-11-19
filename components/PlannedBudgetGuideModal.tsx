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
    <View>
      <Text className="text-base text-textPrimary-light dark:text-textPrimary-dark leading-6 mb-3">
        In Planned Budgets, you will see the progress for every planned budget
        that you create.
      </Text>

      {/* Step-by-step instructions for creation */}
      <Text className="text-base text-textPrimary-light dark:text-textPrimary-dark leading-6 mb-4">
        To create a planned budget, go to:
        {"\n"}
        <Text className="font-bold">
          Reports &gt; Budgets &gt; Planned Budgets &gt;
        </Text>{" "}
        click the <Text className="font-bold">“Add New Budget” button</Text> to
        create your planned budget.
      </Text>

      {/* Important Note Section */}
      <Text className="text-base text-textPrimary-light dark:text-textPrimary-dark leading-6 font-bold mb-2">
        ❗ Important Note:
      </Text>
      <Text className="text-base text-textPrimary-light dark:text-textPrimary-dark leading-6">
        Planned Budgets and General Budget are{" "}
        <Text className="font-bold">different</Text> types of budget. If you
        create a regular transaction for expense, the overview section{" "}
        <Text className="font-bold">WILL</Text> add its value and it{" "}
        <Text className="font-bold">WILL</Text> affect your General Budget.
        {"\n"}In Planned Budgets, you can also create transactions, which{" "}
        <Text className="font-bold">WILL</Text> affect the balance to your
        account, but it <Text className="font-bold">WILL NOT</Text> affect your
        General Budget.
      </Text>
    </View>
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
            Planned Budgets
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
