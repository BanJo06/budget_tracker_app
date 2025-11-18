import { ACCOUNTS_SVG_ICONS } from "@/assets/constants/accounts_icons";
import { SVG_ICONS } from "@/assets/constants/icons";
import CategoryModal from "@/components/CategoryModal";
import CategorySelection from "@/components/CategorySelection";
import {
  getTransactionQuestProgress,
  incrementTransactionQuestProgress,
} from "@/data/weekly_quests_logic";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SwitchSelector from "react-native-switch-selector";

import { useToast } from "@/components/ToastContext";
import { markTransactionQuestCompleted } from "@/data/daily_quests_logic";
import {
  addAccount,
  getAccounts,
  updateAccountBalance,
} from "@/utils/accounts";
import { getAccountBalance, initDatabase } from "@/utils/database";
import { saveTransaction, saveTransferTransaction } from "@/utils/transactions";
import { seedDefaultCategories } from "../database/categoryDefaultSelection";

export const unstable_settings = { headerShown: false };

// ==============================
// 🔹 Reusable Components
// ==============================

const CalculatorButton = ({
  label,
  onPress,
  isLarge = false,
}: {
  label: string;
  onPress: () => void;
  isLarge?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`h-[60] border-2 border-search-light dark:border-search-dark rounded-lg justify-center items-center active:bg-search-light dark:active:bg-search-dark ${
        isLarge ? "w-[49%]" : "w-[24%]"
      }`}
      style={isLarge ? { width: "49%" } : { width: "24%" }}
    >
      {label === "←" ? (
        <SVG_ICONS.Backspace size={36} />
      ) : (
        <Text className="text-3xl font-bold text-textPrimary-light dark:text-textPrimary-dark">
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// ==============================
// 🔹 New Account Modal
// ==============================

const NewAccountModal = ({
  isVisible,
  onClose,
  onSave,
}: {
  isVisible: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    balance: number;
    icon_name: string | null;
  }) => void;
}) => {
  const [initialAmount, setInitialAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const handleSave = useCallback(() => {
    const newAccountData = {
      name: accountName,
      balance: parseFloat(initialAmount) || 0,
      icon_name: selectedIcon,
    };
    onSave?.(newAccountData);
    onClose();
    setInitialAmount("");
    setAccountName("");
    setSelectedIcon(null);
  }, [accountName, initialAmount, selectedIcon, onSave, onClose]);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-11/12">
          <Text className="text-xl font-bold mb-4">Add new account</Text>

          <View className="w-full flex-row gap-2 items-center mb-4">
            <Text>Initial Amount</Text>
            <TextInput
              className="flex-1 h-[40] border-2 border-gray-300 rounded-lg pl-2 bg-purple-100"
              placeholder="0"
              keyboardType="numeric"
              value={initialAmount}
              onChangeText={setInitialAmount}
            />
          </View>

          <View className="w-full flex-row gap-2 items-center mb-6">
            <Text>Name</Text>
            <TextInput
              className="flex-1 h-[40] border-2 border-gray-300 rounded-lg pl-2 bg-purple-100"
              placeholder="Untitled"
              value={accountName}
              onChangeText={setAccountName}
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm mb-2">Select Icon</Text>
            <View className="flex-row flex-wrap justify-start gap-4">
              {Object.entries(ACCOUNTS_SVG_ICONS).map(
                ([key, IconComponent]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setSelectedIcon(key)}
                    className={`p-2 rounded-full border-2 ${
                      selectedIcon === key
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

// ==============================
// 🔹 Accounts Modal
// ==============================

const AccountsModal = ({
  isVisible,
  onClose,
  accounts,
  onAddNewAccount,
  onSelectAccount,
}: {
  isVisible: boolean;
  onClose: () => void;
  accounts: Array<{
    id: number | string;
    name: string;
    balance: number;
    icon_name: string;
  }>;
  onAddNewAccount: (data: {
    name: string;
    balance: number;
    icon_name: string | null;
  }) => void;
  onSelectAccount: (account: {
    id: number | string;
    name: string;
    balance: number;
    icon_name: string;
  }) => void;
}) => {
  const [isNewAccountModalVisible, setNewAccountModalVisible] = useState(false);
  const toggleNewAccountModal = useCallback(() => {
    setNewAccountModalVisible((p) => !p);
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-11/12">
          <Text className="text-xl font-bold mb-4">Select Account</Text>

          {accounts.map((account) => {
            const IconComponent = ACCOUNTS_SVG_ICONS[account.icon_name];
            return (
              <TouchableOpacity
                key={account.id}
                className="w-full h-[50] px-4 flex-row justify-between items-center mb-2"
                onPress={() => {
                  onSelectAccount(account);
                  onClose();
                }}
              >
                <View className="flex-row gap-2 items-center">
                  <View className="w-[40] h-[40] bg-[#8938E9] rounded-full justify-center items-center">
                    {IconComponent && <IconComponent size={24} color="white" />}
                  </View>
                  <Text className="text-lg">{account.name}</Text>
                </View>
                <Text className="text-[#8938E9] text-lg">
                  ₱{account.balance.toFixed(2)}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={toggleNewAccountModal}
            className="w-full h-[40] justify-center items-center border-2 border-purple-500 rounded-lg mt-4"
          >
            <View className="flex-row items-center justify-center gap-2">
              <SVG_ICONS.SmallAdd size={15} color="#8938E9" />
              <Text className="font-medium text-purple-600">
                ADD NEW ACCOUNT
              </Text>
            </View>
          </TouchableOpacity>

          <NewAccountModal
            isVisible={isNewAccountModalVisible}
            onClose={toggleNewAccountModal}
            onSave={onAddNewAccount}
          />
        </View>
      </View>
    </Modal>
  );
};

// ==============================
// 🔹 Small Helper Components
// ==============================

const AccountSelector = ({
  label,
  icon,
  value,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onPress: () => void;
}) => {
  return (
    <View className="items-center flex-1 mx-1">
      <Text className="text-sm mb-2">{label}</Text>
      <TouchableOpacity
        onPress={onPress}
        className="w-full h-12 flex-row gap-4 justify-center items-center bg-[#8938E9] rounded-lg"
      >
        {icon}
        <Text className="text-white text-base">{value}</Text>
      </TouchableOpacity>
    </View>
  );
};

const CalculatorGrid = ({
  onNumber,
  onOperator,
  onDelete,
  onClear,
  onEqual,
}: {
  onNumber: (n: string) => void;
  onOperator: (op: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onEqual: () => void;
}) => {
  return (
    <View className="mt-4">
      <View className="flex-row mb-2 justify-between">
        <CalculatorButton label="←" onPress={onDelete} isLarge />
        <CalculatorButton label="C" onPress={onClear} />
        <CalculatorButton label="÷" onPress={() => onOperator("/")} />
      </View>

      <View className="flex-row mb-2 justify-between">
        <CalculatorButton label="7" onPress={() => onNumber("7")} />
        <CalculatorButton label="8" onPress={() => onNumber("8")} />
        <CalculatorButton label="9" onPress={() => onNumber("9")} />
        <CalculatorButton label="x" onPress={() => onOperator("*")} />
      </View>

      <View className="flex-row mb-2 justify-between">
        <CalculatorButton label="4" onPress={() => onNumber("4")} />
        <CalculatorButton label="5" onPress={() => onNumber("5")} />
        <CalculatorButton label="6" onPress={() => onNumber("6")} />
        <CalculatorButton label="-" onPress={() => onOperator("-")} />
      </View>

      <View className="flex-row mb-2 justify-between">
        <CalculatorButton label="1" onPress={() => onNumber("1")} />
        <CalculatorButton label="2" onPress={() => onNumber("2")} />
        <CalculatorButton label="3" onPress={() => onNumber("3")} />
        <CalculatorButton label="+" onPress={() => onOperator("+")} />
      </View>

      <View className="flex-row justify-between">
        <CalculatorButton label="0" onPress={() => onNumber("0")} />
        <CalculatorButton label="00" onPress={() => onNumber("00")} />
        <CalculatorButton label="." onPress={() => onNumber(".")} />
        <CalculatorButton label="=" onPress={onEqual} />
      </View>
    </View>
  );
};

// ==============================
// 🔹 Main Add Screen
// ==============================

export default function Add() {
  const { showToast } = useToast();

  const [firstValue, setFirstValue] = useState("");
  const [displayValue, setDisplayValue] = useState("0");
  const [operator, setOperator] = useState("");
  const [notes, setNotes] = useState("");

  // Weekly quests
  const [transactionProgress, setTransactionProgress] = useState(0); // 0-1
  const [transactionCompleted, setTransactionCompleted] = useState(false);

  const [selectedOption, setSelectedOption] = useState<
    "expense" | "income" | "transfer"
  >("expense");

  const [isAccountsModalVisible, setAccountsModalVisible] = useState(false);
  const [isToAccountsModalVisible, setToAccountsModalVisible] = useState(false);
  const [accounts, setAccounts] = useState<
    Array<{
      id: number | string;
      name: string;
      balance: number;
      icon_name: string;
    }>
  >([]);
  const [selectedAccount, setSelectedAccount] = useState<null | {
    id: number | string;
    name: string;
    balance: number;
    icon_name: string;
  }>(null);
  const [toAccount, setToAccount] = useState<null | {
    id: number | string;
    name: string;
    balance: number;
    icon_name: string;
  }>(null);
  const [isCategoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<null | {
    id: number | string;
    name: string;
  }>(null);
  const [dbReady, setDbReady] = useState(false);

  // DB init + load accounts
  useEffect(() => {
    async function setupDatabaseAndLoadAccounts() {
      try {
        await initDatabase();
        seedDefaultCategories();
        const initialAccounts = await getAccounts();
        setAccounts(initialAccounts);
        setDbReady(true);
      } catch (error) {
        console.error(
          "Error initializing database or loading accounts:",
          error
        );
      }
    }
    setupDatabaseAndLoadAccounts();
  }, []);

  // Handlers
  const toggleCategoriesModal = () => setCategoriesModalVisible((p) => !p);
  const toggleAccountsModal = () => setAccountsModalVisible((p) => !p);
  const toggleToAccountsModal = () => setToAccountsModalVisible((p) => !p);

  const handleSelectCategory = (category: {
    id: number | string;
    name: string;
  }) => {
    setSelectedCategory(category);
    toggleCategoriesModal();
  };

  const handleSelectAccount = (
    account: {
      id: number | string;
      name: string;
      balance: number;
      icon_name: string;
    },
    type: "from" | "to"
  ) => {
    if (type === "from") setSelectedAccount(account);
    else setToAccount(account);
  };

  const handleAddNewAccount = async (newAccountData: {
    name: string;
    balance: number;
    icon_name: string | null;
  }) => {
    try {
      await addAccount(
        newAccountData.name,
        "Default Type",
        newAccountData.balance,
        newAccountData.icon_name
      );
      const updatedAccounts = await getAccounts();
      setAccounts(updatedAccounts);
      console.log("New account added and accounts state updated.");
    } catch (error) {
      console.error("Error saving new account:", error);
    }
  };

  const handleSwitchChange = (value: "expense" | "income" | "transfer") => {
    setSelectedOption(value);
    setSelectedCategory(null);
    setSelectedAccount(null);
    setToAccount(null);
  };

  const handleNumberInput = (num: string) => {
    setDisplayValue((prev) => (prev === "0" ? num : prev + num));
  };

  const handleOperatorInput = (op: string) => {
    setOperator(op);
    setFirstValue(displayValue);
    setDisplayValue("0");
  };

  const handleCalculation = () => {
    const num1 = parseFloat(firstValue);
    const num2 = parseFloat(displayValue);
    if (isNaN(num1) || isNaN(num2)) {
      return;
    }
    let result: number;
    switch (operator) {
      case "+":
        result = num1 + num2;
        break;
      case "-":
        result = num1 - num2;
        break;
      case "*":
        result = num1 * num2;
        break;
      case "/":
        result = num1 / num2;
        break;
      default:
        return;
    }
    setDisplayValue(result.toString());
    setOperator("");
    setFirstValue("");
  };

  const handleClear = () => {
    setDisplayValue("0");
    setOperator("");
    setFirstValue("");
  };

  const handleDelete = () => {
    setDisplayValue((prev) => (prev.length === 1 ? "0" : prev.slice(0, -1)));
  };

  const handleCancel = () => {
    router.replace("/(sidemenu)/(tabs)");
  };

  const handleSaveTransaction = async () => {
    const amount = parseFloat(displayValue);
    const fromAccountId = selectedAccount?.id;
    const toAccountId = toAccount?.id;
    const categoryId = selectedCategory?.id;
    const transactionType = selectedOption;
    const transactionNotes = notes;
    const transactionDate = new Date().toISOString(); // Define date once

    if (isNaN(amount) || amount <= 0) {
      console.error("Invalid amount.");
      return;
    }

    try {
      if (transactionType === "transfer") {
        // --- Transfer Validation ---
        if (!fromAccountId || !toAccountId) {
          throw new Error("Please select both 'From' and 'To' accounts.");
        }
        if (fromAccountId === toAccountId) {
          throw new Error("Cannot transfer to the same account.");
        }

        await saveTransferTransaction(
          Number(fromAccountId),
          Number(toAccountId),
          amount,
          transactionNotes,
          transactionDate
        );

        console.log("Transfer saved successfully!");
      } else {
        // --- Expense/Income Validation ---
        if (!fromAccountId) {
          throw new Error("Please select an account.");
        }
        if (!categoryId) {
          throw new Error("Please select a category.");
        }

        if (transactionType === "expense") {
          // Synchronously fetch the current balance
          const currentBalance = getAccountBalance(Number(fromAccountId));

          if (currentBalance < amount) {
            // Throw an error that the catch block will handle
            throw new Error(
              "Insufficient funds: Account balance is lower than the transaction amount."
            );
          }
        }

        // ✅ updateAccountBalance will throw "Insufficient funds" if it's an expense
        // and the balance check fails.
        await updateAccountBalance(
          Number(fromAccountId),
          amount,
          transactionType
        );

        await saveTransaction(
          Number(fromAccountId),
          selectedAccount.name,
          Number(categoryId),
          amount,
          transactionType,
          transactionNotes,
          transactionDate
        );

        console.log("Transaction saved successfully!");

        // --- Quest Logic (Unchanged) ---
        const completed = await markTransactionQuestCompleted(transactionDate);
        if (completed) {
          showToast("🎉 Quest Completed: Add 1 transaction");
        }

        const { count, completed: weeklyCompleted } =
          await incrementTransactionQuestProgress();
        setTransactionProgress(count / 50);
        setTransactionCompleted(weeklyCompleted);

        if (weeklyCompleted) {
          showToast("🎯 Weekly Quest Completed: Add 50 Transactions!");
        } else {
          showToast(`📈 Added ${count}/50 transactions this week`);
        }
      }

      router.replace("/(sidemenu)/(tabs)");
    } catch (error: any) {
      // This single catch block handles ALL errors (validation, DB errors, Insufficient funds)
      const errorMessage = error?.message || "An unknown error occurred.";

      // Special handling for user-facing errors (like Insufficient Funds)
      if (errorMessage.includes("Insufficient funds")) {
        showToast(`⚠️ Error: ${errorMessage}`);
      }

      console.error("Failed to save transaction:", errorMessage);
      // You might want to show a general error toast if it's not a known validation/fund error
    }
  };

  useEffect(() => {
    async function loadTransactionQuest() {
      const { count, completed, progress } =
        await getTransactionQuestProgress();
      setTransactionProgress(progress);
      setTransactionCompleted(completed);
    }

    loadTransactionQuest();
  }, []);

  const options = [
    { label: "Income", value: "income" },
    { label: "Expense", value: "expense" },
    { label: "Transfer", value: "transfer" },
  ];

  return (
    <View className="p-8 flex-1 bg-bgPrimary-light dark:bg-bgPrimary-dark">
      <StatusBar barStyle={"dark-content"} />

      {/* Modals */}
      <AccountsModal
        isVisible={isAccountsModalVisible}
        onClose={toggleAccountsModal}
        accounts={accounts}
        onAddNewAccount={handleAddNewAccount}
        onSelectAccount={(account) => handleSelectAccount(account, "from")}
      />

      <AccountsModal
        isVisible={isToAccountsModalVisible}
        onClose={toggleToAccountsModal}
        accounts={accounts}
        onAddNewAccount={handleAddNewAccount}
        onSelectAccount={(account) => handleSelectAccount(account, "to")}
      />

      <CategoryModal
        isVisible={isCategoriesModalVisible}
        onClose={toggleCategoriesModal}
      >
        <CategorySelection
          onSelectCategory={handleSelectCategory}
          isVisible={isCategoriesModalVisible}
          type={selectedOption === "expense" ? "expense" : "income"}
        />
      </CategoryModal>

      {/* Header Buttons */}
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity
          onPress={handleCancel}
          className="w-32 h-10 justify-center items-center rounded-lg bg-button-light dark:bg-button-dark"
        >
          <Text className="text-white text-base font-medium">CANCEL</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSaveTransaction}
          className={`w-32 h-10 justify-center items-center bg-button-light dark:bg-button-dark rounded-lg ${
            !dbReady ? "opacity-50" : ""
          }`}
          disabled={!dbReady}
        >
          <Text className="text-white text-base font-medium">SAVE</Text>
        </TouchableOpacity>
      </View>

      {/* Switch */}
      <View className="mt-10">
        <SwitchSelector
          options={options}
          initial={1}
          onPress={(val) =>
            handleSwitchChange(val as "expense" | "income" | "transfer")
          }
          backgroundColor={"#F0E4FF"}
          textColor={"#000000"}
          selectedColor={"#ffffff"}
          buttonColor={"#7a44cf"}
          hasPadding={true}
          borderRadius={30}
          borderColor={"#F0E4FF"}
          height={40}
          textStyle={{ fontSize: 12, fontWeight: "500" }}
          selectedTextStyle={{ fontSize: 12, fontWeight: "500" }}
        />
      </View>

      {/* Account / Category selectors */}
      <View className="flex-row justify-between mt-8">
        <View className="items-center flex-1 mr-2">
          <Text className="text-sm mb-2 text-textPrimary-light dark:text-textPrimary-dark">
            {selectedOption === "transfer" ? "From" : "Account"}
          </Text>
          <TouchableOpacity
            onPress={toggleAccountsModal}
            className="w-full h-12 flex-row gap-4 justify-center items-center bg-button-light dark:bg-button-dark  rounded-lg"
          >
            <SVG_ICONS.Account size={16} color="white" />
            <Text className="text-white text-base">
              {selectedAccount ? selectedAccount.name : "Account"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="items-center flex-1 ml-2">
          <Text className="text-sm mb-2 text-textPrimary-light dark:text-textPrimary-dark ">
            {selectedOption === "transfer" ? "To" : "Category"}
          </Text>
          <TouchableOpacity
            onPress={
              selectedOption === "transfer"
                ? toggleToAccountsModal
                : toggleCategoriesModal
            }
            className="w-full h-12 flex-row gap-4 justify-center items-center bg-button-light dark:bg-button-dark  rounded-lg"
          >
            {selectedOption === "transfer" ? (
              <SVG_ICONS.Account size={16} color="white" />
            ) : (
              <SVG_ICONS.Category size={16} color="white" />
            )}
            <Text className="text-white text-base">
              {selectedOption === "transfer"
                ? toAccount
                  ? toAccount.name
                  : "Account"
                : selectedCategory
                ? selectedCategory.name
                : "Category"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notes */}
      <View className="mt-6">
        <TextInput
          className="w-full h-24 border-2 border-search-light dark:border-search-dark rounded-lg p-4 text-base"
          placeholder="Notes"
          multiline={true}
          numberOfLines={3}
          maxLength={100}
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
        />
      </View>

      {/* Display */}
      <View className="mt-4">
        <View className="w-full h-[80] border-2 border-search-light dark:border-search-dark rounded-lg p-2 flex items-end justify-center">
          <Text
            className="text-7xl text-right text-textPrimary-light dark:text-textPrimary-dark"
            style={{ lineHeight: 65, includeFontPadding: false }}
          >
            {displayValue}
          </Text>
        </View>
      </View>

      {/* Calculator */}
      <View className="mt-4">
        <CalculatorGrid
          onNumber={handleNumberInput}
          onOperator={handleOperatorInput}
          onDelete={handleDelete}
          onClear={handleClear}
          onEqual={handleCalculation}
        />
      </View>
    </View>
  );
}
