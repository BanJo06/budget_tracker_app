import { ThemeContext } from "@/assets/constants/theme-provider";
import DonutChart from "@/components/DonutChart";
import { createNotificationChannel } from "@/components/notifications";
import OverviewGuideModal from "@/components/OverviewGuideModal";
import PlannedBudgetGuideModal from "@/components/PlannedBudgetGuideModal";
import { useToast } from "@/components/ToastContext";
import { checkDailyQuests } from "@/data/daily_quests_logic";
import { WeeklyQuest, WEEKLY_QUESTS } from "@/data/weekly_quests_items";
import { resetWeeklyProgressIfNeeded } from "@/data/weekly_quests_logic";
import { seedDefaultCategories } from "@/database/categoryDefaultSelection";
import type {
  Account,
  PlannedBudget,
  PlannedBudgetTransaction,
} from "@/types/types";
import { getAccounts } from "@/utils/accounts";
import {
  deletePlannedBudget,
  getAccountBalance,
  getAllPlannedBudgetTransactions,
  getBudget,
  getDailyBudget,
  getPlannedBudgets,
  initDatabase,
  savePlannedBudgetTransaction,
  updateStreak,
} from "@/utils/database";
import { calculateWeeklySummary, formatCurrency } from "@/utils/stats";
import {
  getAllTransactions,
  savePlannedBudgetAsTransaction,
} from "@/utils/transactions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Modal,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SVG_ICONS } from "../../../assets/constants/icons";
import HelpGuideModal from "../../../components/HelpGuideModal";
import PlannedBudgetModals from "../../../components/PlannedBudgetModals";
import ProgressBar from "../../../components/ProgressBar";
import ReusableRoundedBoxComponent from "../../../components/RoundedBoxComponent";
import WeeklyTransactionsModal from "../../../components/WeeklyTransactionsModal";
import type { TabHomeScreenNavigationProp } from "../../../types";

// =========================================================
// 🟣 Responsive Utilities
// =========================================================
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base width of the design (approx. standard iPhone width)
const BASE_WIDTH = 360;

/**
 * Scales a size based on the screen width relative to the base design.
 */
const scale = (size: number) => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Normalizes font size based on screen density
 */
const normalizeFont = (size: number) => {
  const newSize = scale(size);
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

import { Platform } from "react-native";

// =========================================================
// 🟣 Main Screen
// =========================================================

interface QuestState extends WeeklyQuest {
  readyToComplete?: boolean;
}

export default function Index() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { mode } = useContext(ThemeContext);
  const backgroundColor = mode === "dark" ? "#121212" : "#FFFFFF";

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
  const [streakCount, setStreakCount] = useState(0);
  const isFocused = useIsFocused();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]); // regular income/expense
  const [dbReady, setDbReady] = useState(false);
  const [loading, setLoading] = useState(true);

  const [dailyBudget, setDailyBudget] = useState(0);
  const [amountSpent, setAmountSpent] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);

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

  // Guide Modals
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [isOverviewVisible, setIsOverviewVisible] = useState(false);
  const [isPlannedBudgetGuideVisible, setIsPlannedBudgetGuideVisible] =
    useState(false);

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

  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          Alert.alert("Exit App", "Are you sure you want to exit?", [
            { text: "Cancel", style: "cancel" },
            { text: "YES", onPress: () => BackHandler.exitApp() },
          ]);
          return true; // prevent default behavior
        }
      );

      return () => subscription.remove();
    }, [])
  );

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

  useEffect(() => {
    const initializeApp = async () => {
      createNotificationChannel();

      try {
        const hasSeeded = await AsyncStorage.getItem("categoriesSeeded");

        if (!hasSeeded) {
          console.log("Seeding default categories...");

          await seedDefaultCategories();

          await AsyncStorage.setItem("categoriesSeeded", "true");

          console.log("Categories seeded successfully.");
        } else {
          console.log("Categories already seeded. Skipping...");
        }
      } catch (err) {
        console.error("Error during app initialization:", err);
      }
    };

    initializeApp();
  }, []);

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

  useEffect(() => {
    // 🛑 CRITICAL FIX: Do not run this until the Database is ready!
    if (!dbReady || !isFocused) return;

    const loadDashboardData = async () => {
      try {
        // 1. Get Daily Budget Limit
        // Ensure getDailyBudget() is synchronous OR await it if it's async in your utils
        const dailyBudgetRow = await getBudget("daily_budget");
        const limit = dailyBudgetRow?.balance || 0;

        // 2. Calculate Streak
        const currentStreak = updateStreak(limit);

        // 3. Update State
        const currentStreakValue =
          typeof currentStreak === "number" ? currentStreak : 0;
        setStreakCount(currentStreakValue);
      } catch (e) {
        console.log("Error loading dashboard data", e);
      }
    };

    loadDashboardData();
  }, [isFocused, dbReady]); // 👈 Add dbReady here

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

  // ======================
  // ⚡ INSTANT Budget Calculation
  // ======================
  const currentBudgetLimit = useMemo(() => {
    if (!dailyBudget) return 0;

    const now = new Date();
    if (options[selectedIndex] === "This Week") {
      return dailyBudget * 7;
    }
    if (options[selectedIndex] === "This Month") {
      const daysInMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();
      return dailyBudget * daysInMonth;
    }

    return dailyBudget;
  }, [dailyBudget, selectedIndex]);

  // ======================
  // Progress & Budget Overview
  // ======================
  useEffect(() => {
    if (!dailyBudget) return;

    const now = new Date();
    const getRealExpenses = (txArray: any[]) =>
      txArray.filter(
        (t) => t.type === "expense" && t.source !== "planned_budget"
      );

    const expenseTx = getRealExpenses(regularTransactions);

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

    const periodTx = expenseTx.filter((t) => {
      const txDate = new Date(t.date);
      return txDate >= startDate && txDate <= now;
    });

    const totalSpent = periodTx.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );
    setAmountSpent(totalSpent);

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
      prevStart.setDate(prevEnd.getDate() - 6);
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
  // 🟣 Budget Alert Logic
  // ======================
  const isOverBudget =
    currentBudgetLimit > 0 && amountSpent >= currentBudgetLimit;

  useEffect(() => {
    if (isOverBudget) {
      Alert.alert(
        "⚠️ Budget Exceeded!",
        `You have exceeded your ${options[
          selectedIndex
        ].toLowerCase()} budget of ₱${currentBudgetLimit.toFixed(2)}.`,
        [{ text: "OK" }]
      );
    }
  }, [isOverBudget, selectedIndex, currentBudgetLimit]);

  // ======================
  // Weekly Summary
  // ======================
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const summary = await calculateWeeklySummary(7);
        setWeeklySummary(summary);
      } catch (err) {
        console.error("❌ Weekly summary failed:", err);
        setWeeklySummary({ spent: 0, earned: 0 });
      }
    };
    fetchSummary();
  }, [transactions, regularTransactions]);

  // ======================
  // 🟣 Monthly Savings Calculation
  // ======================
  useEffect(() => {
    const calculateMonthlySavings = () => {
      if (!dailyBudget) {
        setMonthlySavings(0);
        return;
      }

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentDay = now.getDate(); // e.g., 30

      // ✅ RESET ON MONTH CHANGE:
      // This filter only allows transactions from the CURRENT month/year.
      // If the month changes (e.g. Nov -> Dec), this array becomes empty
      // (or starts fresh with new data), effectively resetting the calculation loop below.
      const thisMonthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return (
          t.type === "expense" &&
          t.source !== "planned_budget" &&
          tDate.getMonth() === currentMonth &&
          tDate.getFullYear() === currentYear &&
          tDate.getDate() <= currentDay
        );
      });

      // DETERMINE START DAY:
      // Start from day of first transaction, OR today if no transactions exist.
      let startDay = currentDay;

      if (thisMonthTransactions.length > 0) {
        // Extract day numbers from transactions
        const daysWithTransactions = thisMonthTransactions.map((t) =>
          new Date(t.date).getDate()
        );
        // Find the earliest day (min value)
        startDay = Math.min(...daysWithTransactions);
      }

      let totalAccumulatedSavings = 0;

      // 🛑 CALCULATE UNTIL YESTERDAY:
      // Loop from startDay up to (currentDay - 1).
      // We do NOT include 'currentDay' (today) in the savings calculation.
      // If it's the 1st of the month, the loop condition (1 < 1) fails, result is 0.
      for (let day = startDay; day < currentDay; day++) {
        // Filter transactions strictly for this specific day iteration
        const dayExpenses = thisMonthTransactions.filter((t) => {
          const tDate = new Date(t.date);
          return tDate.getDate() === day;
        });

        // Sum up spending for this specific day
        const spentOnDay = dayExpenses.reduce(
          (sum, t) => sum + Number(t.amount || 0),
          0
        );

        // Add to total: (Daily Budget - Spent on that day)
        totalAccumulatedSavings += dailyBudget - spentOnDay;
      }

      setMonthlySavings(totalAccumulatedSavings);
    };

    calculateMonthlySavings();
  }, [transactions, dailyBudget, isFocused]);

  // ======================
  // Handle Daily Quest
  // ======================
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
    const triggerLogin7DaysQuest = async () => {
      try {
        const today = new Date();
        const todayStr = today.toDateString();

        let streak =
          Number(await AsyncStorage.getItem("@weeklyLoginStreak")) || 0;
        const lastLoginStr = await AsyncStorage.getItem("@weeklyLastLoginDate");

        if (!lastLoginStr) {
          streak = 1;
          await AsyncStorage.setItem("@weeklyLoginStreak", streak.toString());
          await AsyncStorage.setItem("@weeklyLastLoginDate", todayStr);
        } else if (lastLoginStr !== todayStr) {
          const lastLoginDate = new Date(lastLoginStr);
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);

          if (
            lastLoginDate.getFullYear() === yesterday.getFullYear() &&
            lastLoginDate.getMonth() === yesterday.getMonth() &&
            lastLoginDate.getDate() === yesterday.getDate()
          ) {
            streak += 1;
          } else {
            streak = 1;
          }

          await AsyncStorage.setItem("@weeklyLoginStreak", streak.toString());
          await AsyncStorage.setItem("@weeklyLastLoginDate", todayStr);
        } else if (streak === 0) {
          streak = 1;
          await AsyncStorage.setItem("@weeklyLoginStreak", streak.toString());
        }

        setQuests((prev) =>
          prev.map((q) =>
            q.id === "login_7days"
              ? { ...q, progress: streak, completed: streak >= 7 }
              : q
          )
        );

        setLogin7DaysProgress(Math.min(streak / 7, 1));
        setLogin7DaysCompleted(streak >= 7);

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

  useEffect(() => {
    const initWeeklyReset = async () => {
      await resetWeeklyProgressIfNeeded();
    };

    initWeeklyReset();
  }, []);

  // ======================
  // Save Transaction
  // ======================

  const handleSaveTransaction = async () => {
    if (!transactionAmount) {
      return alert("Please enter an amount.");
    }

    if (!selectedBudget) {
      return alert("No budget selected.");
    }

    if (!selectedAccount) {
      return alert("Please select an account before saving.");
    }

    const amount = Number(transactionAmount);
    const accountId = Number(selectedAccount.id);
    const currentBalance = getAccountBalance(accountId);

    if (currentBalance < amount) {
      alert(
        "Insufficient funds: Account balance is lower than the transaction amount."
      );
      return;
    }

    try {
      const amount = Number(transactionAmount);
      const date = new Date().toISOString();
      const accountId = selectedAccount?.id ? Number(selectedAccount.id) : null;

      await savePlannedBudgetTransaction(
        selectedBudget.id,
        amount,
        date,
        accountId
      );

      const totalSpent =
        getTotalSpentForPlannedBudget(selectedBudget.id) + amount;
      if (totalSpent >= selectedBudget.amount) {
        setCompletedBudget(selectedBudget);
        setBudgetCompleteModalVisible(true);
      }

      setTransactionAmount("");
      setSelectedAccount(null);
      setIsTransactionModalVisible(false);

      setTimeout(loadDatabase, 500);
    } catch (err) {
      console.error("❌ Error saving planned budget transaction:", err);
    }
  };

  const handleCloseCompletedModal = async () => {
    if (!completedBudget) return;

    try {
      const accountId = accounts.length > 0 ? Number(accounts[0].id) : null;
      if (accountId === null || isNaN(accountId)) return;

      const amount = Number(completedBudget.amount);
      if (isNaN(amount)) return;

      const plannedBudgetId = Number(completedBudget.id);
      if (isNaN(plannedBudgetId)) return;

      const date = new Date().toISOString();

      await savePlannedBudgetAsTransaction(
        accountId,
        plannedBudgetId,
        amount,
        completedBudget.budget_name,
        date
      );

      await deletePlannedBudget(plannedBudgetId, false);

      setBudgetCompleteModalVisible(false);
      setCompletedBudget(null);
      await loadDatabase();
    } catch (err) {
      console.error("❌ Error handling completed budget:", err);
    }
  };

  const handleLeftPress = () =>
    setSelectedIndex((prev) => (prev === 0 ? options.length - 1 : prev - 1));
  const handleRightPress = () =>
    setSelectedIndex((prev) => (prev === options.length - 1 ? 0 : prev + 1));

  // ======================
  // Layout Dimensions
  // ======================
  const SIDE_MARGIN = 32;
  const mainCardWidth = SCREEN_WIDTH - SIDE_MARGIN * 2;
  const marginSpace = (SCREEN_WIDTH - mainCardWidth) / 2;
  const plannedBudgetCardWidth = SCREEN_WIDTH * 0.7;
  const donutSize = scale(140);
  const headerPadding = SIDE_MARGIN;

  return (
    <View className="flex-1 items-center bg-bgPrimary-light dark:bg-bgPrimary-dark">
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

      <HelpGuideModal
        visible={isHelpVisible}
        onClose={() => setIsHelpVisible(false)}
      />
      <OverviewGuideModal
        visible={isOverviewVisible}
        onClose={() => setIsOverviewVisible(false)}
      />
      <PlannedBudgetGuideModal
        visible={isPlannedBudgetGuideVisible}
        onClose={() => setIsPlannedBudgetGuideVisible(false)}
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
        <View
          className="flex-col pt-[8]"
          style={{ paddingHorizontal: headerPadding }}
        >
          <View className="flex-row items-center gap-[4] pb-[16]">
            <Text className="font-medium text-white">PeraPal</Text>
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
            <TouchableOpacity
              className="w-[30px] h-[30px] rounded-full flex-row absolute right-0 active:bg-[#F0E4FF]"
              onPress={() => setIsHelpVisible(true)}
            >
              <SVG_ICONS.HelpTop width={30} height={30} />
            </TouchableOpacity>
          </View>
        </View>
      </ReusableRoundedBoxComponent>

      {/* === Overview === */}
      <View
        className="p-[20] rounded-[20] bg-card-light dark:bg-card-dark"
        style={{
          elevation: 5,
          width: mainCardWidth,
          height: scale(220),
          marginTop: scale(-46),
        }}
      >
        <View className="pb-[20] flex-row justify-between">
          <View className="flex-row gap-1 items-center justify-center">
            <Text className="text-[12px] font-medium text-textPrimary-light dark:text-textPrimary-dark">
              Overview
            </Text>
            <TouchableOpacity
              className="active:bg-[#F0E4FF]"
              onPress={() => setIsOverviewVisible(true)}
            >
              <SVG_ICONS.Help />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={handleLeftPress}>
              <SVG_ICONS.ArrowLeft width={24} height={24} />
            </TouchableOpacity>

            <View style={{ width: scale(70) }}>
              <Text className="text-[12px] font-medium self-center text-textPrimary-light dark:text-textPrimary-dark">
                {options[selectedIndex]}
              </Text>
            </View>

            <TouchableOpacity onPress={handleRightPress}>
              <SVG_ICONS.ArrowRight width={24} height={24} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row justify-between">
          <View
            className="flex-col justify-center items-center"
            style={{ width: donutSize, height: donutSize }}
          >
            {/* ✅ Updated DonutChart Call using currentBudgetLimit */}
            <DonutChart
              progress={
                currentBudgetLimit > 0 ? amountSpent / currentBudgetLimit : 0
              }
              dailyBudget={currentBudgetLimit}
              spent={amountSpent}
              label={budgetLabel}
              color={isOverBudget ? "#FF3B30" : "#8938E9"}
              size={donutSize}
            />
          </View>
          <View className="flex-col items-end justify-end pr-[10] pb-[6]">
            <View className="flex-row mb-[4] px-[8] py-[4] gap-[4] bg-[#EDE1FB] rounded-[16]">
              <SVG_ICONS.Insight width={16} height={16} />
              <Text className="text-[12px] text-[#8938E9]">Insight</Text>
            </View>
            <Text
              className="opacity-65 text-right text-textHighlight-light dark:text-textHighlight-dark"
              style={{ fontSize: normalizeFont(8) }}
            >
              {insightText || "Please add your budget"}
            </Text>
          </View>
        </View>
      </View>

      {/* === Grid Layout: Row 1 (Expense + Streak) === */}
      <View className="flex-row w-full gap-[12] my-[16] px-[32]">
        {/* === Left: Expense Card === */}
        <View
          className="flex-1 p-[16] rounded-[20] bg-card-light dark:bg-card-dark justify-center"
          style={{
            elevation: 5,
            height: scale(72), // Maintain fixed height for alignment
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <SVG_ICONS.Expense />
              <View className="pl-[12] gap-[4]">
                <Text className="text-[12px] opacity-65 text-textSecondary-light dark:text-textSecondary-dark">
                  Expense:
                </Text>
                <Text className="text-[16px] font-medium text-textPrimary-light dark:text-textPrimary-dark">
                  {formatCurrency(weeklySummary.spent)}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => openWeeklyModal("spent")}>
              <SVG_ICONS.ArrowRight width={24} height={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* === Right: Streak Card === */}
        <View
          className="w-[28%] rounded-[20] bg-card-light dark:bg-card-dark items-center justify-center p-[8]"
          style={{
            elevation: 5,
            height: scale(72),
          }}
        >
          <Text className="text-[10px] opacity-65 text-center text-textSecondary-light dark:text-textSecondary-dark leading-tight">
            No overspend
          </Text>
          <Text className="text-[20px] font-bold text-textPrimary-light dark:text-textPrimary-dark my-[2]">
            {streakCount}
          </Text>
          <Text className="text-[10px] opacity-65 text-textSecondary-light dark:text-textSecondary-dark">
            streak
          </Text>
        </View>
      </View>

      {/* === Grid Layout: Row 2 (Income + Saved Yesterday) === */}
      <View className="flex-row w-full gap-[12] mb-[16] px-[32]">
        {/* === Left: Income Card === */}
        <View
          className="flex-1 p-[16] rounded-[20] bg-card-light dark:bg-card-dark justify-center"
          style={{
            elevation: 5,
            height: scale(72),
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <SVG_ICONS.Income />
              <View className="pl-[12] gap-[4]">
                <Text className="text-[12px] opacity-65 text-textSecondary-light dark:text-textSecondary-dark">
                  Income:
                </Text>
                <Text className="text-[16px] font-medium text-textPrimary-light dark:text-textPrimary-dark">
                  {formatCurrency(weeklySummary.earned)}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => openWeeklyModal("earned")}>
              <SVG_ICONS.ArrowRight width={24} height={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* === Right: Saved Yesterday Card === */}
        <View
          className="w-[28%] rounded-[20] bg-card-light dark:bg-card-dark items-center justify-center p-[8]"
          style={{
            elevation: 5,
            height: scale(72),
          }}
        >
          <Text className="text-[10px] opacity-65 text-center text-textSecondary-light dark:text-textSecondary-dark mb-[4] leading-tight">
            Saved this month
          </Text>
          <Text className="text-[13px] font-bold text-textPrimary-light dark:text-textPrimary-dark text-center">
            {formatCurrency(monthlySavings)}
          </Text>
        </View>
      </View>

      {/* === Planned Budgets Section === */}
      <View
        className="w-full mt-[16] bg-bgPrimary-light dark:bg-bgPrimary-dark"
        style={{
          minHeight: SCREEN_HEIGHT * 0.3,
          paddingLeft: (SCREEN_WIDTH - mainCardWidth) / 2, // Align start with upper cards
        }}
      >
        <View className="flex-row gap-2">
          <Text className="font-medium text-[16px] mb-[20] text-textPrimary-light dark:text-textPrimary-dark">
            Planned Budgets
          </Text>
          <TouchableOpacity
            className="active:bg-[#F0E4FF]"
            onPress={() => setIsPlannedBudgetGuideVisible(true)}
          >
            <SVG_ICONS.Help />
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text className={"dark:text-gray-300 text-gray-500"}>
            Loading planned budgets...
          </Text>
        ) : plannedBudgets.length === 0 ? (
          <Text className={"dark:text-gray-300 text-gray-500"}>
            No planned budgets yet.
          </Text>
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
                  setSelectedBudget(budget);
                  setIsModalVisible(true);
                }}
                className="rounded-[20] dark:bg-card-dark bg-card-light"
                style={{
                  width: plannedBudgetCardWidth,
                  height: scale(110),
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
                  {/* Overlay */}
                  <View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      backgroundColor: budget.color_name || "#8938E9",
                      opacity: 0.4,
                    }}
                  />

                  {/* Foreground content */}
                  <View
                    className="flex-row gap-[12] items-center h-full px-[16]"
                    style={{ zIndex: 1 }}
                  >
                    <View
                      className="w-[16] h-[16] rounded-[4]"
                      style={{
                        backgroundColor: budget.color_name
                          ? budget.color_name
                          : "rgba(137, 56, 233, 0.4)",
                        zIndex: 2,
                      }}
                    />
                    <Text
                      className="text-[14px] text-textPrimary-light dark:text-textPrimary-dark"
                      style={{ zIndex: 2 }}
                    >
                      {budget.budget_name || "Unnamed Budget"}
                    </Text>
                  </View>
                </View>

                {/* === Progress & Info === */}
                <View className="py-[16] px-[20]">
                  <ProgressBar
                    progress={getProgress(budget, plannedBudgetTransactions)}
                  />
                  <View className="mt-[8]">
                    <Text className="text-[14px] text-textPrimary-light dark:text-textPrimary-dark">
                      Spent ₱
                      {(
                        Number(budget.amount) *
                        Number(getProgress(budget, plannedBudgetTransactions))
                      ).toFixed(0)}{" "}
                      from{" "}
                      <Text className="text-[14px] text-textHighlight-light dark:text-textHighlight-dark">
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
