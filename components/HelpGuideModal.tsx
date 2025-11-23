import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface HelpGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

const HelpGuideModal: React.FC<HelpGuideModalProps> = ({
  visible,
  onClose,
}) => {
  // 💡 The text guide content is now defined directly inside the component
  const renderGuideContent = () => (
    <>
      <Text className="text-base text-textPrimary-light dark:text-textPrimary-dark leading-6">
        <Text className="font-bold">👋 Welcome to the app!</Text>
        {"\n\n"}
        {/* --- Create an Account Highlight --- */}
        <Text className="font-medium">
          Before creating your first transaction, you must create an account.
        </Text>{" "}
        To create an account, go to{" "}
        <Text className="font-bold text-highlight-light dark:text-highlight-dark">
          Reports &gt; Accounts &gt; Add New Account.
        </Text>
        {"\n"}
        <Text className="italic">
          Note: In creating an account, you can input your Initial Amount to 0
          if you don’t have any money.
        </Text>
        {"\n\n"}
        {/* --- Adding a Transaction Highlight --- */}
        <Text className="font-medium underline">Adding a transaction:</Text> To
        create your first transaction, go to{" "}
        <Text className="font-bold">Add button with plus sign</Text>, then
        select your type of cash flow:{" "}
        <Text className="font-bold text-highlight-light dark:text-highlight-dark">
          Income, Expense or Transfer
        </Text>{" "}
        (transferring funds from one account to another account). After that,
        press the <Text className="font-bold">“Account” button</Text> and select
        an account. Then, press the
        <Text className="font-bold">“Category” button</Text> to select the
        source of your income or expense. Then, enter an amount. If you’re
        satisfied, press{" "}
        <Text className="font-bold text-highlight-light dark:text-highlight-dark">
          “Save” button
        </Text>{" "}
        to save your transaction.
        {"\n"}
        <Text className="italic">
          Optional: You can input notes or description of your transaction.
        </Text>
        {"\n\n"}
        <Text className="font-medium underline">Quests:</Text> Check out the
        quests by pressing the <Text className="font-bold">Quest Menu</Text>. Do
        the quests as much as you can in order to get more coins. Also, go to
        the shop by pressing{" "}
        <Text className="font-bold">
          Shop Icon on the top right corner in Quests Menu
        </Text>
        and buy your prefered items.
        {"\n\n"}
        {/* --- Categories Highlight --- */}
        <Text className="font-medium underline">Categories:</Text> To create
        your custom category for income and expense, go to{" "}
        <Text className="font-bold">
          Menu button (top left corner of the screen)
        </Text>
        , select{" "}
        <Text className="font-bold text-highlight-light dark:text-highlight-dark">
          “Categories” and press the “Add New Category” button.
        </Text>
        {"\n\n"}
        {/* --- Late Transaction Highlight --- */}
        <Text className="font-medium underline">Late Transaction:</Text> If you
        are not consistent of tracking of your budget, you can create a late
        transaction. To create a late transaction, go to{" "}
        <Text className="font-bold">
          Menu button (top left corner of the screen)
        </Text>{" "}
        and select{" "}
        <Text className="font-bold text-highlight-light dark:text-highlight-dark">
          “Add Late Records”.
        </Text>
        {"\n"}
        <Text className="italic">
          Note: Late transactions can’t count as transaction for completing
          daily and weekly quests.
        </Text>
        {"\n\n"}
        {/* --- Export Records Highlight --- */}
        <Text className="font-medium underline">Export Records:</Text> If you
        want to create a soft copy of your transactions, go to{" "}
        <Text className="font-bold">
          Menu button (top left corner of the screen)
        </Text>{" "}
        and select{" "}
        <Text className="font-bold text-highlight-light dark:text-highlight-dark">
          “Export Records”
        </Text>
        . From there, you must pick the date range. After you decide to select
        range of dates of your transaction, press{" "}
        <Text className="font-bold text-highlight-light dark:text-highlight-dark">
          “Export to CSV”
        </Text>{" "}
        button.
        {"\n\n"}
        <Text className="font-medium underline">Backup/Restore:</Text> If you're
        worried about losing your data, backup is for you! Click the{" "}
        <Text className="font-bold text-highlight-light dark:text-highlight-dark">
          "Backup Database"
        </Text>{" "}
        to create a backup and if you want to restore your data, click the{" "}
        <Text className="font-bold text-highlight-light dark:text-highlight-dark">
          "Restore Database" button
        </Text>
        .{"\n\n"}
        <Text className="font-bold">Please enjoy the app!</Text>
      </Text>
    </>
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
            General Help Guide
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

export default HelpGuideModal;
