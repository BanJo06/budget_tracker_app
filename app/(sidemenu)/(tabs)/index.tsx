import DonutChart from "@/components/DonutChart";
import { useToast } from "@/components/ToastContext";
import { checkDailyQuests } from "@/data/daily_quests_logic";
import { WeeklyQuest, WEEKLY_QUESTS } from "@/data/weekly_quests_items";
import { resetWeeklyProgressIfNeeded } from "@/data/weekly_quests_logic";
import type {
  Account,
  PlannedBudget,
  PlannedBudgetTransaction,
} from "@/types/types";
import { getAccounts } from "@/utils/accounts";
import {
  deletePlannedBudget,
  getAllPlannedBudgetTransactions,
  getBudget,
  getDailyBudget,
  getPlannedBudgets,
  initDatabase,
  savePlannedBudgetTransaction,
} from "@/utils/database";
import { calculateWeeklySummary, formatCurrency } from "@/utils/stats";
import {
  getAllTransactions,
  savePlannedBudgetAsTransaction,
} from "@/utils/transactions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SVG_ICONS } from "../../../assets/constants/icons";
import PlannedBudgetModals from "../../../components/PlannedBudgetModals";
import ProgressBar from "../../../components/ProgressBar";
import ReusableRoundedBoxComponent from "../../../components/RoundedBoxComponent";
import WeeklyTransactionsModal from "../../../components/WeeklyTransactionsModal";
import type { TabHomeScreenNavigationProp } from "../../../types";

// =========================================================
// 🟣 Main Screen (logic fixes applied)
// =========================================================

interface QuestState extends WeeklyQuest {
  readyToComplete?: boolean;
}

export default function Index() {
  const navigation = useNavigation<TabHomeScreenNavigationProp>();
  const router = useRouter();
  const { showToast } = useToast();

  // ======================
  // State
  // ======================
  const [plannedBudgets, setPlannedBudgets] = useState<PlannedBudget[]>([]);
  const [regularTransactions, setRegularTransactions] = useState<any>([]);
  const [plannedBudgetTransactions, setPlannedBudgetTransactions] = useState<
    PlannedBudgetTransaction[]
  >([]);
  const [budgetCompleteModalVisible, setBudgetCompleteModalVisible] =
    useState(false);
  const [completedBudget, setCompletedBudget] = useState<PlannedBudget | null>(
    null
  );

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]); // regular income/expense
  const [dbReady, setDbReady] = useState(false);
  const [loading, setLoading] = useState(true);

  const [dailyBudget, setDailyBudget] = useState(0);
  const [scaledBudget, setScaledBudget] = useState(0);
  const [amountSpent, setAmountSpent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);

  const [selectedBudget, setSelectedBudget] = useState<PlannedBudget | null>(
    null
  );
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [transactionAmount, setTransactionAmount] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTransactionModalVisible, setIsTransactionModalVisible] =
    useState(false);
  const [isAccountsModalVisible, setAccountsModalVisible] = useState(false);

  const [weeklyModalVisible, setWeeklyModalVisible] = useState(false);
  const [weeklyModalType, setWeeklyModalType] = useState<
    "spent" | "earned" | null
  >(null);
  const [filteredWeeklyTransactions, setFilteredWeeklyTransactions] = useState<
    any[]
  >([]);
  const [weeklySummary, setWeeklySummary] = useState({ spent: 0, earned: 0 });

  const [useAppCompleted, setUseAppCompleted] = useState(false);
  const [useAppProgress, setUseAppProgress] = useState(0);

  const options = ["Today", "This Week", "This Month"];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [insightText, setInsightText] = useState("");

  //Weekly Quests States
  const [login7DaysProgress, setLogin7DaysProgress] = useState(0); // 0 to 7
  const [login7DaysCompleted, setLogin7DaysCompleted] = useState(false);
  const [quests, setQuests] = useState<WeeklyQuest[]>(() =>
    WEEKLY_QUESTS.map((q) => ({ ...q }))
  );

  const budgetLabel =
    selectedIndex === 0
      ? "Daily Budget"
      : selectedIndex === 1
      ? "Weekly Budget"
      : "Monthly Budget";

  // ======================
  // Database load
  // ======================

  const loadDatabase = async () => {
    try {
      await initDatabase();
      const [allAccounts, allBudgets, plannedtransactions, allTx, daily] =
        await Promise.all([
          getAccounts(),
          getPlannedBudgets(),
          getAllPlannedBudgetTransactions(),
          getAllTransactions(),
          getDailyBudget(),
        ]);

      // Fetch the daily budget (assuming the name is "Daily Budget")
      const dailyBudgetRow = await getBudget("daily_budget");
      const dailyBudgetValue = dailyBudgetRow?.balance || 0;

      setAccounts(allAccounts);
      setPlannedBudgets(allBudgets);
      setPlannedBudgetTransactions(plannedtransactions);
      setRegularTransactions(allTx);
      setDailyBudget(dailyBudgetValue);
      setDbReady(true);
    } catch (err) {
      console.error("❌ Database initialization failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRegularTransactions = async () => {
    try {
      const allTx = await getAllTransactions();
      setTransactions(allTx);
    } catch (err) {
      console.error("❌ Failed to load regular transactions:", err);
    }
  };

  useEffect(() => {
    loadDatabase();
    loadRegularTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDatabase();
      loadRegularTransactions();
    }, [])
  );

  // ======================
  // Helpers
  // ======================

  const getTotalSpentForPlannedBudget = (plannedBudgetId: number) => {
    const budgetTx = plannedBudgetTransactions.filter(
      (t) => t.planned_budget_id === plannedBudgetId
    );
    return budgetTx.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  };

  const getPlannedBudgetId = (t: any) =>
    t.planned_budget_id ?? t.budget_id ?? t.plannedBudgetId ?? null;

  const getProgress = (
    budget: PlannedBudget,
    transactions: PlannedBudgetTransaction[]
  ) => {
    if (!budget) return 0;
    const budgetAmount = Number(budget.amount || 0);
    if (budgetAmount === 0) return 0;

    const spentAmount = transactions
      .filter((t) => getPlannedBudgetId(t) === budget.id)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    return Math.min(spentAmount / budgetAmount, 1);
  };

  const checkBudgetCompletion = async (plannedBudget) => {
    if (!plannedBudget) return;

    const totalSpent = getTotalSpentForPlannedBudget(plannedBudget.id);
    const completionPercent = (totalSpent / plannedBudget.amount) * 100;

    if (completionPercent >= 100 && !plannedBudget.completed) {
      setCompletedBudget(plannedBudget);
      setBudgetCompleteModalVisible(true);

      // Mark in-memory to avoid multiple triggers
      plannedBudget.completed = true;
    }
  };

  const getTransactionsLast7Days = (type: "spent" | "earned") => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    return transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        date >= sevenDaysAgo &&
        date <= now &&
        ((type === "spent" && t.type === "expense") ||
          (type === "earned" && t.type === "income"))
      );
    });
  };

  const openWeeklyModal = (type: "spent" | "earned") => {
    setFilteredWeeklyTransactions(getTransactionsLast7Days(type));
    setWeeklyModalType(type);
    setWeeklyModalVisible(true);
  };

  const closeWeeklyModal = () => {
    setFilteredWeeklyTransactions([]);
    setWeeklyModalType(null);
    setWeeklyModalVisible(false);
  };

  const toggleAccountsModal = () => setAccountsModalVisible((p) => !p);

  // Today Overview
  const isToday = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  useEffect(() => {
    if (!dailyBudget) return;

    const now = new Date();

    const filteredTx = regularTransactions.filter((t) => {
      const txDate = new Date(t.date);
      return (
        txDate.getFullYear() === now.getFullYear() &&
        txDate.getMonth() === now.getMonth() &&
        txDate.getDate() === now.getDate()
      );
    });

    const totalSpentToday = filteredTx.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );

    setAmountSpent(totalSpentToday);
    setScaledBudget(dailyBudget); // ✅ use the dailyBudget directly
  }, [dailyBudget, regularTransactions]);

  //Weekly Quest Helpers
  //Log-in for 7 days
  // const handleLogin7DaysQuest = async () => {
  //   const today = new Date().toDateString();

  //   // Get last login info from AsyncStorage
  //   const lastLoginDate = await AsyncStorage.getItem("@weeklyLoginLastDate");
  //   const streak = Number(
  //     (await AsyncStorage.getItem("@weeklyLoginStreak")) || "0"
  //   );

  //   let newStreak = streak;

  //   if (lastLoginDate !== today) {
  //     const yesterday = new Date();
  //     yesterday.setDate(yesterday.getDate() - 1);

  //     if (lastLoginDate === yesterday.toDateString()) {
  //       newStreak = streak + 1; // consecutive day
  //     } else {
  //       newStreak = 1; // reset streak
  //     }

  //     // Save new values
  //     await AsyncStorage.setItem("@weeklyLoginStreak", newStreak.toString());
  //     await AsyncStorage.setItem("@weeklyLoginLastDate", today);
  //   }

  //   // Update internal progress (0–1)
  //   setLogin7DaysProgress(Math.min(newStreak / 7, 1));

  //   // Quest completed
  //   if (newStreak >= 7 && !login7DaysCompleted) {
  //     setLogin7DaysCompleted(true);
  //     showToast("🎉 Weekly Quest Completed: Login for 7 days!");
  //     setCurrentProgress((prev) =>
  //       Math.min(prev + 1 / WEEKLY_QUESTS.length, 1)
  //     );
  //   }
  // };
  const [completedWeeklyQuestIds, setCompletedWeeklyQuestIds] = useState<
    string[]
  >([]);
  const handleLogin7DaysQuest = async () => {
    const DEBUG_LOGIN_STREAK = true; // enable debug mode

    if (DEBUG_LOGIN_STREAK) {
      // Simulate consecutive logins
      let simulatedStreak = 6; // e.g., 6 days already logged
      console.log("🛠 Simulated streak:", simulatedStreak);

      // Increment one day (simulate login today)
      simulatedStreak += 1;

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        "@weeklyLoginStreak",
        simulatedStreak.toString()
      );
      await AsyncStorage.setItem(
        "@weeklyLoginLastDate",
        new Date().toDateString()
      );

      console.log("✅ Debug: New simulated streak:", simulatedStreak);

      if (simulatedStreak >= 7) {
        showToast("🎉 Weekly Quest Completed: Login for 7 days!");

        // ✅ Update completed quests and main progress
        setCompletedWeeklyQuestIds((prev) => [...prev, "login_7days"]);
        setCurrentProgress((prev) =>
          Math.min(prev + 1 / WEEKLY_QUESTS.length, 1)
        );
      }

      return; // Skip the real login logic
    }

    // ...rest of normal logic
  };

  // useEffect(() => {
  //   const initLoginQuest = async () => {
  //     await handleLogin7DaysQuest();
  //   };
  //   initLoginQuest();
  // }, []);

  useEffect(() => {
    const triggerLogin7DaysQuest = async () => {
      try {
        const today = new Date();
        const todayStr = today.toDateString();

        let streak =
          Number(await AsyncStorage.getItem("@weeklyLoginStreak")) || 0;
        const lastLoginStr = await AsyncStorage.getItem("@weeklyLastLoginDate");

        console.log("📅 Today:", todayStr);
        console.log("📌 Last Login:", lastLoginStr);
        console.log("🔢 Current Streak (before check):", streak);

        if (!lastLoginStr) {
          // First login ever
          streak = 1;
          await AsyncStorage.setItem("@weeklyLoginStreak", streak.toString());
          await AsyncStorage.setItem("@weeklyLastLoginDate", todayStr);
          console.log("🌟 First login ever. Streak set to 1.");
        } else if (lastLoginStr !== todayStr) {
          // Not logged in today
          const lastLoginDate = new Date(lastLoginStr);
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);

          if (
            lastLoginDate.getFullYear() === yesterday.getFullYear() &&
            lastLoginDate.getMonth() === yesterday.getMonth() &&
            lastLoginDate.getDate() === yesterday.getDate()
          ) {
            streak += 1;
            console.log("✅ Consecutive login. Streak incremented.");
          } else {
            streak = 1;
            console.log("🔄 Missed a day. Streak reset.");
          }

          await AsyncStorage.setItem("@weeklyLoginStreak", streak.toString());
          await AsyncStorage.setItem("@weeklyLastLoginDate", todayStr);
        } else if (streak === 0) {
          // Already logged in today but streak = 0 → fix it
          streak = 1;
          await AsyncStorage.setItem("@weeklyLoginStreak", streak.toString());
          console.log(
            "⚡ Fix: Streak was 0 but user logged in today. Streak set to 1."
          );
        } else {
          // Already logged in today, streak > 0 → do nothing
          console.log("ℹ️ Already logged in today. Streak unchanged.");
        }

        // Update quests state
        setQuests((prev) =>
          prev.map((q) =>
            q.id === "login_7days"
              ? { ...q, progress: streak, completed: streak >= 7 }
              : q
          )
        );

        setLogin7DaysProgress(Math.min(streak / 7, 1));
        setLogin7DaysCompleted(streak >= 7);

        console.log(
          `📊 Progress updated: ${streak}/7, Completed: ${streak >= 7}`
        );

        // Show toast only once
        if (streak >= 7) {
          const toastShown = await AsyncStorage.getItem(
            "@login7DaysToastShown"
          );
          if (!toastShown) {
            showToast("🎉 Congrats! You've completed the 7-Day Login Quest!");
            await AsyncStorage.setItem("@login7DaysToastShown", "true");
          }
        }
      } catch (err) {
        console.error("❌ Error updating 7-day login quest:", err);
      }
    };

    triggerLogin7DaysQuest();
  }, []);
  // run only once when component mounts

  // Weekly Quest 2 Reset
  useEffect(() => {
    const initWeeklyReset = async () => {
      await resetWeeklyProgressIfNeeded();
    };

    initWeeklyReset();
  }, []);

  // ======================
  // Progress & Budget Overview
  // ======================
  useEffect(() => {
    if (!dailyBudget) return;

    // Only include expense transactions (excluding planned budgets)
    const expenseTx = regularTransactions.filter(
      (t) => t.type === "expense" && t.source !== "planned_budget"
    );

    const now = new Date();

    let startDate: Date;
    switch (options[selectedIndex]) {
      case "Today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "This Week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case "This Month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    const filteredTx = expenseTx.filter((t) => {
      const txDate = new Date(t.date);
      return txDate >= startDate && txDate <= now;
    });

    const totalSpent = filteredTx.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );
    setAmountSpent(totalSpent);

    let newScaledBudget = dailyBudget;
    if (options[selectedIndex] === "This Week")
      newScaledBudget = dailyBudget * 7;
    if (options[selectedIndex] === "This Month") {
      const daysInMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();
      newScaledBudget = dailyBudget * daysInMonth;
    }
    setScaledBudget(newScaledBudget);

    // 🟣 Comparison logic (only expenseTx)
    let prevStart: Date, prevEnd: Date;
    if (options[selectedIndex] === "Today") {
      prevStart = new Date(now);
      prevStart.setDate(now.getDate() - 1);
      prevStart.setHours(0, 0, 0, 0);
      prevEnd = new Date(now);
      prevEnd.setDate(now.getDate() - 1);
      prevEnd.setHours(23, 59, 59, 999);
    } else if (options[selectedIndex] === "This Week") {
      prevEnd = new Date(startDate);
      prevEnd.setDate(prevEnd.getDate() - 1);
      prevStart = new Date(prevEnd);
      prevStart.setDate(prevStart.getDate() - 6);
    } else {
      prevEnd = new Date(startDate);
      prevEnd.setDate(0);
      prevStart = new Date(prevEnd.getFullYear(), prevEnd.getMonth(), 1);
    }

    const previousTx = expenseTx.filter((t) => {
      const txDate = new Date(t.date);
      return txDate >= prevStart && txDate <= prevEnd;
    });

    const previousSpent = previousTx.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );

    const label =
      options[selectedIndex] === "Today"
        ? "yesterday"
        : options[selectedIndex] === "This Week"
        ? "last week"
        : "last month";

    setInsightText(calculateComparison(totalSpent, previousSpent, label));
  }, [dailyBudget, regularTransactions, selectedIndex]);

  // Calculate Comparison
  const calculateComparison = (
    currentAmount: number,
    previousAmount: number,
    periodLabel: string
  ) => {
    if (previousAmount === 0) return "No data for comparison.";

    const difference = currentAmount - previousAmount;
    const percentage = Math.abs((difference / previousAmount) * 100).toFixed(1);

    if (difference > 0) {
      return `You spent ${percentage}% more than ${periodLabel}`;
    } else if (difference < 0) {
      return `You spent ${percentage}% less than ${periodLabel}`;
    } else {
      return `You spent the same as ${periodLabel}`;
    }
  };

  // ======================
  // Weekly Summary
  // ======================
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setWeeklySummary(calculateWeeklySummary(7));
      } catch (err) {
        console.error("❌ Weekly summary failed:", err);
        setWeeklySummary({ spent: 0, earned: 0 });
      }
    };
    fetchSummary();
  }, []);

  // ======================
  // Handle Daily Quest
  // ======================

  // // 🧩 Handle Use App Quest
  useEffect(() => {
    async function handleDailyQuestCheck() {
      const { readyIds } = await checkDailyQuests();

      if (readyIds.includes("1")) {
        console.log("🎉 Quest Completed: Use App");
        showToast("🎉 Quest Completed: Use App");
        setUseAppCompleted(true);
        setUseAppProgress(1); // 100%
      } else {
        const hasUsedApp = await AsyncStorage.getItem("@hasUsedApp");
        const lastUseApp = await AsyncStorage.getItem("useAppQuestDate");
        const today = new Date().toDateString();

        // If already done today → show as complete
        if (hasUsedApp === "true" && lastUseApp === today) {
          setUseAppCompleted(true);
          setUseAppProgress(1);
        } else {
          setUseAppCompleted(false);
          setUseAppProgress(0);
        }
      }
    }

    handleDailyQuestCheck();
  }, []);

  // Automatic Reset when midnight (12:00am)
  useEffect(() => {
    const resetQuestIfNewDay = async () => {
      const today = new Date().toDateString();
      const lastUseApp = await AsyncStorage.getItem("useAppQuestDate");
      if (lastUseApp !== today) {
        await AsyncStorage.multiRemove(["@hasUsedApp", "useAppQuestDate"]);
        setUseAppCompleted(false);
        setUseAppProgress(0);
        console.log("🔄 New day detected — quest reset");
      }
    };
    resetQuestIfNewDay();
  }, []);
  useEffect(() => {
    const handleDailyQuestCheck = async () => {
      const { readyIds } = await checkDailyQuests();
      const today = new Date().toDateString();
      const hasUsedApp = await AsyncStorage.getItem("@hasUsedApp");
      const lastUseApp = await AsyncStorage.getItem("useAppQuestDate");

      if (
        readyIds.includes("1") ||
        (hasUsedApp === "true" && lastUseApp === today)
      ) {
        setUseAppCompleted(true);
        setUseAppProgress(1);
      } else {
        setUseAppCompleted(false);
        setUseAppProgress(0);
      }
    };
    handleDailyQuestCheck();
  }, []);

  useEffect(() => {
    const resetQuestIfNewDay = async () => {
      const today = new Date().toDateString();
      const lastUseApp = await AsyncStorage.getItem("useAppQuestDate");
      if (lastUseApp !== today) {
        await AsyncStorage.multiRemove(["@hasUsedApp", "useAppQuestDate"]);
        setUseAppCompleted(false);
        setUseAppProgress(0);
      }
    };
    resetQuestIfNewDay();
  }, []);

  //Troubleshoot for DailyQuests
  // Reset code
  // useEffect(() => {
  //   const debugReset = async () => {
  //     await AsyncStorage.multiRemove([
  //       "@hasUsedApp",
  //       "useAppQuestDate",
  //       "useAppQuestTriggered",
  //     ]);
  //     console.log("🧹 Cleared AsyncStorage for testing first login");
  //   };

  //   debugReset();
  // }, []);

  // ======================
  // Save Transaction
  // ======================

  const handleSaveTransaction = async () => {
    if (!transactionAmount || !selectedBudget)
      return alert("Please enter amount and select a budget.");

    try {
      const amount = Number(transactionAmount);
      const date = new Date().toISOString();
      const accountId = selectedAccount?.id ? Number(selectedAccount.id) : null;

      // ✅ Save to planned_budget_transactions only
      await savePlannedBudgetTransaction(
        selectedBudget.id,
        amount,
        date,
        accountId
      );

      // ✅ Check completion before reloading
      const totalSpent =
        getTotalSpentForPlannedBudget(selectedBudget.id) + amount;
      if (totalSpent >= selectedBudget.amount) {
        setCompletedBudget(selectedBudget);
        setBudgetCompleteModalVisible(true);
      }

      // Reset input & close modal
      setTransactionAmount("");
      setSelectedAccount(null);
      setIsTransactionModalVisible(false);

      // ✅ Slight delay before reloading
      setTimeout(loadDatabase, 500);
    } catch (err) {
      console.error("❌ Error saving planned budget transaction:", err);
    }
  };

  // -----------------------------
  // Handle Close Button in Budget Completed Modal
  // -----------------------------
  const handleCloseCompletedModal = async () => {
    if (!completedBudget) return;

    try {
      // ✅ Ensure the account ID is a number
      const accountId = accounts.length > 0 ? Number(accounts[0].id) : null;
      if (accountId === null || isNaN(accountId)) return;

      // ✅ Ensure amount is a number
      const amount = Number(completedBudget.amount);
      if (isNaN(amount)) return;

      // ✅ Ensure planned budget ID is a number
      const plannedBudgetId = Number(completedBudget.id);
      if (isNaN(plannedBudgetId)) return;

      const date = new Date().toISOString();

      // ✅ Save the completed planned budget as a transaction
      await savePlannedBudgetAsTransaction(
        accountId, // 1️⃣ account ID (number)
        plannedBudgetId, // 2️⃣ planned budget ID (number)
        amount, // 3️⃣ amount
        completedBudget.budget_name, // 4️⃣ description
        date // 5️⃣ date
      );

      // ✅ Delete the planned budget after saving
      await deletePlannedBudget(plannedBudgetId);

      // ✅ Close modal and refresh
      setBudgetCompleteModalVisible(false);
      setCompletedBudget(null);
      await loadDatabase();
    } catch (err) {
      console.error("❌ Error handling completed budget:", err);
    }
  };

  // ======================
  // Navigation Handlers
  // ======================
  const handleLeftPress = () =>
    setSelectedIndex((prev) => (prev === 0 ? options.length - 1 : prev - 1));
  const handleRightPress = () =>
    setSelectedIndex((prev) => (prev === options.length - 1 ? 0 : prev + 1));

  // ---------- UI ----------
  return (
    <View className="items-center">
      <PlannedBudgetModals
        isBudgetModalVisible={isModalVisible}
        setIsBudgetModalVisible={setIsModalVisible}
        selectedBudget={selectedBudget}
        budgetTransactions={plannedBudgetTransactions}
        isTransactionModalVisible={isTransactionModalVisible}
        setIsTransactionModalVisible={setIsTransactionModalVisible}
        transactionAmount={transactionAmount}
        setTransactionAmount={setTransactionAmount}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        accounts={accounts}
        handleSaveTransaction={handleSaveTransaction}
        toggleAccountsModal={toggleAccountsModal}
        isAccountsModalVisible={isAccountsModalVisible}
      />
      <WeeklyTransactionsModal
        visible={weeklyModalVisible}
        onClose={closeWeeklyModal}
        type={weeklyModalType}
        transactions={filteredWeeklyTransactions}
      />

      {/* ✅ Budget Completed Modal */}
      {budgetCompleteModalVisible && completedBudget && (
        <Modal
          animationType="slide"
          transparent
          visible={budgetCompleteModalVisible}
          onRequestClose={() => setBudgetCompleteModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="p-6 bg-white rounded-lg w-11/12 items-center">
              <Text className="text-lg font-bold">🎉 Goal Completed!</Text>
              <Text className="mt-2 text-center">
                You have completed the planned budget:{" "}
                <Text className="font-semibold">
                  {completedBudget.budget_name}
                </Text>
              </Text>

              <TouchableOpacity
                className="mt-4 px-4 py-2 bg-purple-500 rounded"
                onPress={handleCloseCompletedModal}
              >
                <Text className="text-white font-medium">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* === Header === */}
      <ReusableRoundedBoxComponent>
        <View className="flex-col px-[32] pt-[8]">
          <View className="flex-row items-center gap-[4] pb-[16]">
            <View className="w-[25] h-[25] bg-white" />
            <Text className="font-medium text-white">Budget Tracker</Text>
          </View>

          <View className="flex-row items-center justify-center">
            <TouchableOpacity
              className="w-[30px] h-[30px] rounded-full flex-row absolute left-0 active:bg-[#F0E4FF]"
              onPress={() => navigation.openDrawer()}
            >
              <SVG_ICONS.SideMenu width={30} height={30} />
            </TouchableOpacity>
            <Text className="text-[16px] font-medium text-white">
              Dashboard
            </Text>
          </View>
        </View>
      </ReusableRoundedBoxComponent>

      {/* === Overview === */}
      <View
        className="w-[330] h-[220] -mt-[46] p-[20] bg-white rounded-[20]"
        style={{ elevation: 5 }}
      >
        <View className="pb-[20] flex-row justify-between">
          <Text className="text-[12px] font-medium self-center">Overview</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity onPress={handleLeftPress}>
              <SVG_ICONS.ArrowLeft width={24} height={24} />
            </TouchableOpacity>

            <View className="self-center" style={{ width: 70 }}>
              <Text className="text-[12px] font-medium self-center">
                {options[selectedIndex]}
              </Text>
            </View>

            <TouchableOpacity onPress={handleRightPress}>
              <SVG_ICONS.ArrowRight width={24} height={24} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row justify-between">
          <View className="w-[140] h-[140] flex-col justify-center items-center">
            {/* <ProgressRing
              progress={currentProgress}
              radius={70}
              strokeWidth={15}
              progressColor="#8938E9"
              backgroundColor="#EDE1FB"
              duration={500}
              showPercentage={true}
              textColor="#8938E9"
            /> */}
            {/* <DonutChart
              progress={scaledBudget > 0 ? amountSpent / scaledBudget : 0}
              dailyBudget={scaledBudget}
              spent={amountSpent}
            /> */}
            <DonutChart
              progress={scaledBudget > 0 ? amountSpent / scaledBudget : 0}
              dailyBudget={scaledBudget}
              spent={amountSpent}
              label={budgetLabel}
            />
          </View>
          <View className="flex-col items-end justify-end pr-[10] pb-[6]">
            <View className="flex-row mb-[4] px-[8] py-[4] gap-[4] bg-[#EDE1FB] rounded-[16]">
              <SVG_ICONS.Insight width={16} height={16} />
              <Text className="text-[12px] text-[#8938E9]">Insight</Text>
            </View>
            {/* <Text className="text-[8px] text-[#392F46] opacity-65">
              You spent 5% more
            </Text>
            <Text className="text-[8px] text-[#392F46] opacity-65">
              than last week
            </Text> */}
            <Text className="text-[8px] text-[#392F46] opacity-65 text-right">
              {insightText}
            </Text>
          </View>
        </View>
      </View>

      {/* === Expense & Income Banners === */}
      {/* === Expense === */}
      <View
        className="w-[330] h-[80] my-[16] p-[16] bg-white rounded-[20]"
        style={{ elevation: 5 }}
      >
        <View className="flex-row">
          <View className="w-[48] h-[48] bg-[#8938E9] rounded-[16]" />
          <View className="pl-[20] gap-[6] self-center">
            <Text className="text-[12px] text-[#392F46] opacity-65">
              Spent this week:
            </Text>
            {/* Dynamically set the spent amount */}
            <Text className="text-[16px] font-medium">
              {formatCurrency(weeklySummary.spent)}
            </Text>
          </View>
          <View className="flex-1 self-center items-end">
            <TouchableOpacity onPress={() => openWeeklyModal("spent")}>
              <SVG_ICONS.ArrowRight width={24} height={24} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* === Income === */}
      <View
        className="w-[330] h-[80] p-[16] bg-white rounded-[20]"
        style={{ elevation: 5 }}
      >
        <View className="flex-row">
          <View className="w-[48] h-[48] bg-[#8938E9] rounded-[16]" />
          <View className="pl-[20] gap-[6] self-center">
            <Text className="text-[12px] text-[#392F46] opacity-65">
              Earned this week:
            </Text>
            {/* Dynamically set the earned amount */}
            <Text className="text-[16px] font-medium">
              {formatCurrency(weeklySummary.earned)}
            </Text>
          </View>
          <View className="flex-1 self-center items-end">
            <TouchableOpacity onPress={() => openWeeklyModal("earned")}>
              <SVG_ICONS.ArrowRight width={24} height={24} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* === Planned Budgets Section === */}
      <View
        className="w-full mt-[32] mb-[16] pl-[32]"
        style={{ overflow: "visible" }}
      >
        <Text className="font-medium text-[16px] mb-[8]">Planned Budgets</Text>

        {loading ? (
          <Text className="text-gray-500">Loading planned budgets...</Text>
        ) : plannedBudgets.length === 0 ? (
          <Text className="text-gray-500">No planned budgets yet.</Text>
        ) : (
          <FlatList
            horizontal
            data={plannedBudgets}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              paddingRight: 32,
              gap: 16,
              paddingBottom: 16,
            }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: budget }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  console.log("📋 [DEBUG] Selected budget:", budget);
                  const filtered = regularTransactions.filter(
                    (t) => getPlannedBudgetId(t) === budget.id
                  );
                  console.log(
                    `🧾 [DEBUG] Found ${filtered.length} transactions for this budget:`,
                    filtered
                  );
                  setSelectedBudget(budget);
                  setIsModalVisible(true);
                }}
                className="w-[280] h-[140] bg-white rounded-[20]"
                style={{
                  elevation: 6,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 6,
                  marginBottom: 8,
                }}
              >
                {/* === Header === */}
                <View className="w-full h-[40] rounded-t-[20] overflow-hidden">
                  <View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      backgroundColor: budget.color_name || "#8938E9",
                      opacity: 0.4,
                    }}
                  />
                  <View className="flex-row gap-[12] items-center h-full px-[16]">
                    <View
                      className="w-[16] h-[16] rounded-[4]"
                      style={{
                        backgroundColor: budget.color_name || "#FCC21B",
                      }}
                    />
                    <Text className="text-[14px] text-[#392F46]">
                      {budget.budget_name || "Unnamed Budget"}
                    </Text>
                  </View>
                </View>

                {/* === Progress & Info === */}
                <View className="py-[16] px-[20]">
                  {/* FIX: Use 'budget' instead of 'selectedBudget' for the current item */}
                  <ProgressBar
                    progress={getProgress(budget, plannedBudgetTransactions)}
                  />
                  <View className="mt-[8]">
                    <Text className="text-[14px]">
                      Spent ₱
                      {(
                        Number(budget.amount) *
                        Number(getProgress(budget, plannedBudgetTransactions))
                      ).toFixed(0)}{" "}
                      from{" "}
                      <Text className="text-[14px] text-[#8938E9]">
                        ₱{Number(budget.amount).toFixed(0)}
                      </Text>
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            style={{ overflow: "visible" }}
          />
        )}
      </View>
    </View>
  );
}
