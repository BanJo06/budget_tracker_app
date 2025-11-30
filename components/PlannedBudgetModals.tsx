import { ACCOUNTS_SVG_ICONS } from "@/assets/constants/accounts_icons";
import TransactionModal from "@/components/TransactionModal";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

import type {
  Account,
  PlannedBudget,
  PlannedBudgetTransaction,
} from "@/types/types";
import { formatCurrency } from "@/utils/stats";

interface PlannedBudgetModalsProps {
  isBudgetModalVisible: boolean;
  setIsBudgetModalVisible: (v: boolean) => void;
  selectedBudget: any; // ← temporarily allow any shape
  budgetTransactions: any[];
  isTransactionModalVisible: boolean;
  setIsTransactionModalVisible: (v: boolean) => void;
  transactionAmount: string;
  setTransactionAmount: (v: string) => void;
  selectedAccount: any;
  setSelectedAccount: (acc: any) => void;
  accounts: any[];
  handleSaveTransaction: () => void;
  toggleAccountsModal: () => void;
  isAccountsModalVisible: boolean;
  children?: React.ReactNode;
}

export default function PlannedBudgetModals({
  isBudgetModalVisible,
  setIsBudgetModalVisible,
  selectedBudget,
  budgetTransactions,
  isTransactionModalVisible,
  setIsTransactionModalVisible,
  transactionAmount,
  setTransactionAmount,
  selectedAccount,
  setSelectedAccount,
  accounts,
  handleSaveTransaction,
  toggleAccountsModal,
  isAccountsModalVisible,
  children,
}: PlannedBudgetModalsProps) {
  const getPlannedBudgetId = (t: any) =>
    t.planned_budget_id ?? t.budget_id ?? t.plannedBudgetId ?? null;

  const getProgress = (
    budget: PlannedBudget,
    transactions: PlannedBudgetTransaction[]
  ): number => {
    if (!budget) return 0;
    const budgetAmount = Number(budget.amount || 0);
    if (budgetAmount === 0) return 0;

    const spentAmount = transactions
      .filter((t) => t.planned_budget_id === budget.id)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    return spentAmount / budgetAmount > 1 ? 1 : spentAmount / budgetAmount;
  };

  <TransactionModal
    isVisible={isTransactionModalVisible}
    onClose={() => setIsTransactionModalVisible(false)}
    amount={transactionAmount}
    onChangeAmount={setTransactionAmount}
    selectedAccount={selectedAccount}
    onSelectAccount={setSelectedAccount}
    onSave={handleSaveTransaction}
    toggleAccountsModal={toggleAccountsModal} // ✅ add this line
  />;

  console.log("Transaction modal visible?", isTransactionModalVisible);

  // === Accounts Modal ===
  const AccountsModal = ({
    isVisible,
    onClose,
    accounts,
    onSelectAccount,
  }: {
    isVisible: boolean;
    onClose: () => void;
    accounts: Account[];
    onSelectAccount: (acc: Account) => void;
  }) => (
    <Modal
      animationType="fade"
      transparent
      visible={isVisible}
      onRequestClose={onClose} // ✅ enables Android back button
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressOut={onClose} // ✅ tap outside to close (optional UX improvement)
        className="flex-1 justify-center items-center bg-black/50"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}} // prevents modal from closing when inner content pressed
          className="bg-bgModal-light dark:bg-bgModal-dark p-6 rounded-lg w-11/12"
        >
          <Text className="text-xl font-bold mb-4 text-textPrimary-light dark:text-textPrimary-dark">
            Select Account
          </Text>
          {accounts.map((account) => {
            const IconComponent = ACCOUNTS_SVG_ICONS[account.icon_name];
            return (
              <TouchableOpacity
                key={account.id}
                className="w-full h-[50] px-4 flex-row justify-between items-center mb-2 active:bg-[#F8F4FF]"
                onPress={() => onSelectAccount(account)}
              >
                <View className="flex-row gap-2 items-center">
                  <View className="w-[40] h-[40] bg-[#8938E9] rounded-full justify-center items-center">
                    {IconComponent && <IconComponent size={24} color="white" />}
                  </View>
                  <Text className="text-lg text-textPrimary-light dark:text-textPrimary-dark">
                    {account.name}
                  </Text>
                </View>
                <Text className="text-lg text-textHighlight-light dark:text-textHighlight-dark">
                  ₱{account.balance.toFixed(2)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  const BudgetModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isBudgetModalVisible}
      onRequestClose={() => setIsBudgetModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-[360] bg-bgModal-light dark:bg-bgModal-dark rounded-[20] p-[20] shadow-lg">
          {!selectedBudget ? (
            <Text className="text-center text-gray-500">
              No budget selected.
            </Text>
          ) : (
            <>
              {/* === HEADER === */}
              <View className="flex-row gap-4 items-center pb-5">
                <View
                  className="w-[40] h-[40] rounded-full"
                  style={{
                    backgroundColor: selectedBudget?.color_name || "#FCC21B",
                  }}
                />
                <View className="flex-col">
                  <Text className="text-[18px] font-medium text-textPrimary-light dark:text-textPrimary-dark">
                    {selectedBudget?.budget_name || "Unnamed Budget"}
                  </Text>
                  {/* <Text className="text-[14px] text-textPrimary-light dark:text-textPrimary-dark opacity-70">
                    {selectedBudget?.budget_type
                      ? selectedBudget.budget_type + " category"
                      : "No category"}
                  </Text> */}
                </View>
              </View>

              {/* === DETAILS === */}
              <View>
                <Text className="text-[14px] text-textPrimary-light dark:text-textPrimary-dark mb-[4]">
                  Goal Amount: ₱
                  {formatCurrency(selectedBudget?.amount?.toFixed(2)) || "0.00"}
                </Text>
                <Text className="text-[14px] text-textPrimary-light dark:text-textPrimary-dark mb-[4]">
                  Start Date: {selectedBudget?.start_date || "Ongoing"}
                </Text>
                <Text className="text-[14px] text-textPrimary-light dark:text-textPrimary-dark mb-[4]">
                  End Date: {selectedBudget?.end_date || "Ongoing"}
                </Text>
                <Text className="text-[14px] text-textPrimary-light dark:text-textPrimary-dark mb-[4]">
                  Progress:{" "}
                  {(
                    getProgress(selectedBudget, budgetTransactions) * 100
                  ).toFixed(0)}
                  %
                </Text>
              </View>

              <View className="my-4">
                <Text className="text-[16px] font-bold text-textPrimary-light dark:text-textPrimary-dark">
                  Savings Record
                </Text>
              </View>

              <ScrollView style={{ maxHeight: 300 }}>
                {/* Filter transactions specifically for the selected budget (and sort) */}
                {budgetTransactions
                  .filter((t) => getPlannedBudgetId(t) === selectedBudget?.id)
                  .sort(
                    (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                  )
                  .map((t, index, arr) => {
                    const dateObj = new Date(t.date);
                    const formattedDate = dateObj.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                    const formattedTime = dateObj.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    });

                    // Determine previous transaction date
                    const prev = arr[index - 1];
                    const prevDate =
                      prev &&
                      new Date(prev.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                    const isNewDate = formattedDate !== prevDate;

                    return (
                      <View
                        key={t.id}
                        className="mb-3 border-b border-gray-200 pb-2"
                      >
                        {isNewDate && (
                          <>
                            <Text className="text-[12px] text-gray-500">
                              {formattedDate}
                            </Text>
                            <View className="border my-2"></View>
                          </>
                        )}

                        <View className="flex-row justify-between">
                          <View className="flex-row gap-2">
                            <Text className="text-[12px] text-gray-500">
                              {formattedTime}
                            </Text>
                            <Text className="text-[12px] text-gray-500">
                              {t.account_name || "Unknown Account"}
                            </Text>
                          </View>
                          <Text className="text-[14px] text-[#8938E9]">
                            ₱{formatCurrency(parseFloat(t.amount).toFixed(2))}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
              </ScrollView>

              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={() => {
                    // Close Budget Modal, THEN open Transaction Modal after it finishes closing
                    setIsBudgetModalVisible(false);
                    setTimeout(() => {
                      setIsTransactionModalVisible(true);
                    }, 200); // slight delay to avoid modal overlap
                  }}
                  className="flex-1 mt-[16] bg-button-light dark:bg-button-dark px-[16] py-[10] rounded-[12]"
                >
                  <Text className="text-white text-center font-medium">
                    CREATE TRANSACTION
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIsBudgetModalVisible(false)}
                  className="flex-1 mt-[16] border-2 border-borderButton-light dark:border-borderButton-dark px-[16] py-[10] rounded-[12] justify-center"
                >
                  <Text className="text-borderButton-light dark:text-borderButton-dark text-center font-medium">
                    CLOSE
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <BudgetModal />
      <TransactionModal
        isVisible={isTransactionModalVisible}
        onClose={() => setIsTransactionModalVisible(false)}
        amount={transactionAmount}
        onChangeAmount={setTransactionAmount}
        selectedAccount={selectedAccount}
        onSelectAccount={setSelectedAccount}
        onSave={handleSaveTransaction}
        toggleAccountsModal={toggleAccountsModal}
      />

      <AccountsModal
        isVisible={isAccountsModalVisible}
        onClose={toggleAccountsModal}
        accounts={accounts}
        onSelectAccount={(acc) => {
          setSelectedAccount(acc);
          toggleAccountsModal();
        }}
      />
    </>
  );
}
