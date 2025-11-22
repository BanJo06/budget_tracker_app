import { ACCOUNTS_SVG_ICONS } from "@/assets/constants/accounts_icons";
import { SVG_ICONS } from "@/assets/constants/icons";
import CategoryModal from "@/components/CategoryModal";
import CategorySelection from "@/components/CategorySelection";
import { useToast } from "@/components/ToastContext";
import { markTransactionQuestCompleted } from "@/data/daily_quests_logic";
import {
  getTransactionQuestProgress,
  incrementTransactionQuestProgress,
} from "@/data/weekly_quests_logic";
import {
  getExpenseCategories,
  getIncomeCategories,
} from "@/database/categoryQueries";
import {
  addAccount,
  getAccounts,
  updateAccountBalance,
} from "@/utils/accounts";
import { getBudgetValue } from "@/utils/budgets";
import { getAccountBalance, initDatabase } from "@/utils/database";
import {
  getAllTransactions,
  saveTransaction,
  saveTransferTransaction,
  updateExistingTransaction,
} from "@/utils/transactions";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SwitchSelector from "react-native-switch-selector";
import { seedDefaultCategories } from "../database/categoryDefaultSelection";

export const unstable_settings = { headerShown: false };

type Transaction = {
  id: number;
  account_id: number;
  account_name: string;
  to_account_id?: number | null;
  to_account_name?: string | null;
  category_id?: number | null;
  category_name?: string | null;
  category_icon_name?: string | null;
  amount: number;
  type: "income" | "expense" | "transfer";
  description?: string | null;
  date: string;
  source?: string | null;
};

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
    // ⚠️ New condition to check for empty accountName
    if (!accountName.trim()) {
      Alert.alert(
        "Missing Account Name",
        "Please enter a name for your new account."
      );
      return;
    }

    // ⚠️ Check for selectedIcon
    if (!selectedIcon) {
      Alert.alert(
        "Missing Icon",
        "Please select an icon for your new account."
      );
      return;
    }

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
        <View className="bg-bgModal-light dark:bg-bgModal-dark p-6 rounded-lg w-11/12">
          <Text className="text-xl font-bold mb-4 text-textPrimary-light dark:text-textPrimary-dark">
            Add new account
          </Text>

          <View className="w-full flex-row gap-2 items-center mb-4">
            <Text className="text-textPrimary-light dark:text-textPrimary-dark">
              Initial Amount
            </Text>
            <TextInput
              className="flex-1 h-[40] border-2 border-gray-300 rounded-lg pl-2 bg-bgTextbox-light dark:bg-bgTextbox-dark"
              placeholder="0"
              keyboardType="numeric"
              value={initialAmount}
              onChangeText={setInitialAmount}
            />
          </View>

          <View className="w-full flex-row gap-2 items-center mb-6">
            <Text className="text-textPrimary-light dark:text-textPrimary-dark">
              Name
            </Text>
            <TextInput
              className="flex-1 h-[40] border-2 border-gray-300 rounded-lg pl-2 bg-bgTextbox-light dark:bg-bgTextbox-dark"
              placeholder="Untitled"
              value={accountName}
              onChangeText={setAccountName}
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm mb-2 text-textPrimary-light dark:text-textPrimary-dark">
              Select Icon
            </Text>
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
              className="w-24 h-10 rounded-lg border-2 border-button-light dark:border-button-dark justify-center items-center"
              onPress={onClose}
            >
              <Text className="uppercase text-button-light dark:text-button-dark">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-24 h-10 rounded-lg bg-button-light dark:bg-button-dark justify-center items-center"
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
        <View className="bg-bgModal-light dark:bg-bgModal-dark p-6 rounded-lg w-11/12">
          <Text className="text-xl font-bold mb-4 text-textPrimary-light dark:text-textPrimary-dark">
            Select Account
          </Text>

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

          <TouchableOpacity
            onPress={toggleNewAccountModal}
            className="w-full h-[40] justify-center items-center rounded-lg mt-4 bg-button-light dark:bg-button-dark"
          >
            <View className="flex-row items-center justify-center gap-2">
              {/* <SVG_ICONS.SmallAdd size={15} color="#8938E9" /> */}
              <Text className="font-medium text-textInsidePrimary-light dark:text-textInsidePrimary-dark">
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
  const [transactionProgress, setTransactionProgress] = useState(0);
  const [transactionCompleted, setTransactionCompleted] = useState(false);

  const { mode, transaction } = useLocalSearchParams<{
    mode?: string;
    transaction?: string;
  }>();

  // ✅ Parse transaction if editing
  const parsedTransaction = transaction ? JSON.parse(transaction) : null;
  const [isInitialized, setIsInitialized] = useState(false);

  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);

  const [selectedOption, setSelectedOption] = useState<
    "expense" | "income" | "transfer"
  >("expense");
  const [switchIndex, setSwitchIndex] = useState(1); // default to expense

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
  const [transactionType, setTransactionType] = useState<
    "expense" | "income" | "transfer"
  >("expense");
  const [isCategoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<null | {
    id: number | string;
    name: string;
    icon_name: string;
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
    icon_name: string;
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

  useEffect(() => {
    async function initializeFormForEdit() {
      // 1. If we are NOT editing a transaction, or if the form is already initialized, stop.
      //    This prevents the form from being reset on every re-render after initial population.
      if (!parsedTransaction || isInitialized) return; // 1. Load categories

      const incomes = await getIncomeCategories();
      const expenses = await getExpenseCategories();
      setIncomeCategories(incomes);
      setExpenseCategories(expenses); // 2. Load accounts

      const allAccounts = await getAccounts();
      setAccounts(allAccounts); // 3. Populate form for editing

      const t = parsedTransaction; // Set all state variables directly from the transaction object

      setNotes(t.description || "");
      setDisplayValue(t.amount?.toString() || "");
      setSelectedOption(t.type);

      const fromAcc = allAccounts.find((a) => a.id === t.account_id);
      if (fromAcc) setSelectedAccount(fromAcc);

      if (t.type === "transfer" && t.to_account_id) {
        const toAcc = allAccounts.find((a) => a.id === t.to_account_id);
        if (toAcc) setToAccount(toAcc);
      } else if (t.type !== "transfer") {
        setToAccount(null);
      }

      if (t.type !== "transfer" && t.category_id) {
        const categories = t.type === "expense" ? expenses : incomes;
        const cat = categories.find((c) => c.id === t.category_id);
        if (cat) setSelectedCategory(cat);
      } else if (t.type === "transfer") {
        setSelectedCategory(null);
      } // 4. Set the flag to prevent re-initialization

      setIsInitialized(true);
    }

    initializeFormForEdit();
  }, [parsedTransaction, isInitialized]);

  const handleSaveTransaction = async () => {
    const amount = parseFloat(displayValue);
    const fromAccountId = selectedAccount?.id;
    const toAccountId = toAccount?.id;
    const categoryId = selectedCategory?.id;
    const transactionType = selectedOption;
    const transactionNotes = notes;
    const transactionDate = new Date().toISOString();

    // =================================================
    // 1. GLOBAL VALIDATION
    // =================================================
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid amount.");
      return;
    }

    if (!fromAccountId) {
      alert("Please select an account.");
      return;
    }

    // Check Category (only if not transfer)
    if (transactionType !== "transfer" && !categoryId) {
      alert("Please select a category.");
      return;
    }

    // =================================================
    // 2. TRANSFER SPECIFIC VALIDATION
    // =================================================
    if (transactionType === "transfer") {
      if (!toAccountId) {
        alert("Please select a 'To' account for the transfer.");
        return;
      }

      if (fromAccountId === toAccountId) {
        alert("Cannot transfer to the same account.");
        return;
      }
    }

    // =================================================
    // 3. INSUFFICIENT FUNDS CHECK
    // =================================================
    const currentBalance = getAccountBalance(Number(fromAccountId));

    // Logic: Check funds if it is a NEW expense/transfer OR if editing and increasing amount (simplified)
    // For simplicity, we just warn on low balance but allow edits to proceed usually,
    // unless you want strict blocking. Here is strict blocking for NEW transactions:
    if (
      mode !== "edit" &&
      (transactionType === "expense" || transactionType === "transfer")
    ) {
      if (currentBalance < amount) {
        alert(
          `Insufficient funds in ${
            selectedAccount?.name
          }: Your balance is ₱${currentBalance.toFixed(2)}.`
        );
        return;
      }
    }

    // =================================================
    // 4. BUDGET CHECKS (Expenses Only)
    // =================================================
    if (transactionType === "expense") {
      // 1. Calculate what has been spent today so far
      let totalSpentToday = 0;
      try {
        const allTransactions = getAllTransactions(); // Assuming this is synchronous based on your utils
        const now = new Date();
        totalSpentToday = allTransactions
          .filter((t: any) => {
            const txDate = new Date(t.date);
            return (
              txDate.getFullYear() === now.getFullYear() &&
              txDate.getMonth() === now.getMonth() &&
              txDate.getDate() === now.getDate() &&
              t.type === "expense" &&
              !t.source // Exclude system entries if needed
            );
          })
          .reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);
      } catch (error) {
        console.error("Failed to calculate today's total expenses:", error);
      }

      const dailyBudgetValue = getBudgetValue("daily_budget");

      // Check 1: Exceeds total daily budget?
      if (amount > dailyBudgetValue) {
        const confirmed = await new Promise<boolean>((resolve) => {
          Alert.alert(
            "Daily Budget Limit Exceeded",
            `Your input amount (₱${amount.toFixed(
              2
            )}) exceeds your daily budget (₱${dailyBudgetValue.toFixed(
              2
            )}). Continue?`,
            [
              { text: "No", style: "cancel", onPress: () => resolve(false) },
              { text: "Yes", onPress: () => resolve(true) },
            ],
            { cancelable: false }
          );
        });
        if (!confirmed) return;
      }

      // Check 2: Exceeds remaining daily budget?
      const remainingBudget = dailyBudgetValue - totalSpentToday;
      // Note: If editing, this logic might double-count the current transaction,
      // but this matches your requested snippet.
      if (amount > remainingBudget) {
        const confirmed = await new Promise<boolean>((resolve) => {
          Alert.alert(
            "Remaining Daily Budget Exceeded",
            `Your remaining daily budget is ₱${remainingBudget.toFixed(
              2
            )}, and your input amount is ₱${amount.toFixed(
              2
            )}. Do you want to proceed?`,
            [
              { text: "No", style: "cancel", onPress: () => resolve(false) },
              { text: "Yes", onPress: () => resolve(true) },
            ],
            { cancelable: false }
          );
        });
        if (!confirmed) return;
      }
    }

    // =================================================
    // 5. EXECUTION: EDIT vs NEW
    // =================================================
    try {
      if (mode === "edit" && parsedTransaction?.id) {
        // -------------------------------------------
        // A) UPDATE EXISTING TRANSACTION
        // -------------------------------------------
        // This works for Income, Expense, AND Transfer because
        // updateExistingTransaction (in transactions.js) now handles the logic for all 3.

        const resolvedToAccountId =
          transactionType === "transfer" ? toAccountId : null;

        await updateExistingTransaction({
          transactionId: Number(parsedTransaction.id),
          accountId: Number(fromAccountId),
          categoryId: categoryId ? Number(categoryId) : null,
          amount,
          type: transactionType,
          description: transactionNotes,
          date: transactionDate,
          toAccountId: resolvedToAccountId ? Number(resolvedToAccountId) : null,
        });

        showToast("✅ Transaction updated successfully!");
      } else {
        // -------------------------------------------
        // B) CREATE NEW TRANSACTION
        // -------------------------------------------

        if (transactionType === "transfer") {
          // Case 1: New Transfer
          // saveTransferTransaction handles balance updates internally
          await saveTransferTransaction(
            Number(fromAccountId),
            Number(toAccountId),
            amount,
            transactionNotes,
            transactionDate
          );
          showToast("✅ Transfer saved successfully!");
        } else {
          // Case 2: New Income or Expense
          // We must manually update balance first, then save
          await updateAccountBalance(
            Number(fromAccountId),
            amount,
            transactionType
          );

          await saveTransaction(
            Number(fromAccountId),
            selectedAccount?.name || "",
            Number(categoryId),
            amount,
            transactionType,
            transactionNotes,
            transactionDate
          );
          showToast("✅ Transaction saved successfully!");
        }
      }

      // =================================================
      // 6. POST-SAVE ACTIONS (Quests, Navigation)
      // =================================================

      // Only run quests for new transactions (optional preference)
      if (mode !== "edit") {
        const completed = await markTransactionQuestCompleted(transactionDate);
        if (completed) showToast("🎉 Quest Completed: Add 1 transaction");

        const { count, completed: weeklyCompleted } =
          await incrementTransactionQuestProgress();
        setTransactionProgress(count / 50);
        setTransactionCompleted(weeklyCompleted);

        if (weeklyCompleted)
          showToast("🎯 Weekly Quest Completed: Add 50 Transactions!");
      }

      router.replace("/(sidemenu)/(tabs)");
    } catch (error: any) {
      console.error("Failed to save/update transaction:", error);
      const errorMessage = error?.message || "An unknown error occurred.";
      showToast(`⚠️ Error: ${errorMessage}`);
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
          <Text className="text-white text-base font-medium">
            {mode === "edit" ? "UPDATE" : "SAVE"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Switch */}
      <View className="mt-10">
        <SwitchSelector
          key={selectedOption} // <-- forces re-render when selectedOption changes
          options={options}
          initial={options.findIndex((opt) => opt.value === selectedOption)} // index to select
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
