import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";

export type CheckResult = {
  readyIds: string[];
};

let questCheckInProgress = false;

export const checkDailyQuests = async (): Promise<CheckResult> => {
  if (questCheckInProgress) return { readyIds: [] };
  questCheckInProgress = true;

  try {
    console.log("⏳ Running daily quest check...");
    const today = new Date().toDateString();

    const hasUsedApp = await AsyncStorage.getItem("@hasUsedApp");
    const lastUseApp = await AsyncStorage.getItem("useAppQuestDate");

    // 🔹 Use the SAME consistent key for quest #2
    const addTransactionKey = "@quest_2_" + today;
    const addTransactionDone = await AsyncStorage.getItem(addTransactionKey);

    const readyIds: string[] = [];

    // ✅ "Use App" Quest
    if (!hasUsedApp && !lastUseApp) {
      await AsyncStorage.setItem("@hasUsedApp", "true");
      await AsyncStorage.setItem("useAppQuestDate", today);
      readyIds.push("1");
      await AsyncStorage.setItem("useAppQuestCompleted", "true");
      console.log("🎯 First-time login — 'Use App' quest completed!");
    } else if (lastUseApp !== today) {
      await AsyncStorage.setItem("@hasUsedApp", "true");
      await AsyncStorage.setItem("useAppQuestDate", today);
      readyIds.push("1");
      console.log("✨ New day — 'Use App' reset");
    } else {
      console.log("✅ 'Use App' already completed today");
    }

    // ✅ Check if "Add 1 transaction" quest is done
    if (addTransactionDone === "true") {
      readyIds.push("2");
    }

    // ✅ "Use app for 5 minutes" Quest
    const fiveMinCompleted = await checkAppUsageDuration();
    if (fiveMinCompleted) {
      readyIds.push("3");
    } else {
      // Start timer only if not completed
      await startAppUsageTimer();
    }

    console.log("✅ Quest check complete:", readyIds);
    return { readyIds };
  } finally {
    questCheckInProgress = false;
  }
};

// 🔹 Consistent key prefix for quest #2
const ADD_TRANSACTION_KEY = "@quest_2_";

// ✅ Use this ONLY when a user adds a transaction
export const markTransactionQuestCompleted = async (): Promise<boolean> => {
  const today = new Date().toDateString();
  const key = ADD_TRANSACTION_KEY + today;
  const completed = await AsyncStorage.getItem(key);

  if (completed === "true") return false; // already done
  await AsyncStorage.setItem(key, "true");
  console.log(`🎉 'Add 1 transaction' quest completed for ${today}!`);
  return true;
};

// ✅ Use this when checking (e.g., on app start)
export const isTransactionQuestCompletedToday = async (): Promise<boolean> => {
  const today = new Date().toDateString();
  const key = ADD_TRANSACTION_KEY + today;
  const completed = await AsyncStorage.getItem(key);
  return completed === "true";
};

// ✅ Reset helper for testing
export const resetAddTransactionQuest = async (): Promise<void> => {
  const today = new Date().toDateString();
  const key = ADD_TRANSACTION_KEY + today;
  await AsyncStorage.removeItem(key);
  console.log("🔄 Reset quest: 'Add 1 transaction' for today!");
};

// Timer Logic (3rd quest)

const USE_APP_5MIN_KEY = "use_app_5min_completed_";
const USE_APP_5MIN_TOTAL_KEY = "use_app_5min_total";
const USE_APP_5MIN_LAST_KEY = "use_app_5min_last";

let appStateListener: any = null;
let intervalId: ReturnType<typeof setInterval> | null = null;

/**
 * Start tracking app usage time
 */
export const startAppUsageTimer = async (showToast?: (msg: string) => void) => {
  const now = Date.now();
  await AsyncStorage.setItem(USE_APP_5MIN_LAST_KEY, now.toString());
  console.log(
    "⏱️ Started app usage tracking at",
    new Date(now).toLocaleTimeString()
  );

  // Only set up once
  if (!appStateListener) {
    appStateListener = AppState.addEventListener(
      "change",
      async (nextState) => {
        if (nextState === "background" || nextState === "inactive") {
          await updateUsageTime(showToast);
        } else if (nextState === "active") {
          const now = Date.now();
          await AsyncStorage.setItem(USE_APP_5MIN_LAST_KEY, now.toString());
        }
      }
    );
  }

  startInterval(showToast);
};

/**
 * Interval that updates total usage every 30 seconds
 */
const startInterval = (showToast?: (msg: string) => void) => {
  if (intervalId) return; // already running

  intervalId = setInterval(async () => {
    await updateUsageTime(showToast);
  }, 3000); // every 3 seconds
};

/**
 * Stop the interval if needed (optional)
 */
export const stopAppUsageTimer = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

/**
 * Update usage time and check completion
 */
const updateUsageTime = async (showToast?: (msg: string) => void) => {
  const lastActiveStr = await AsyncStorage.getItem(USE_APP_5MIN_LAST_KEY);
  if (!lastActiveStr) return;

  const lastActive = parseInt(lastActiveStr, 10);
  const elapsed = (Date.now() - lastActive) / 1000; // seconds
  if (elapsed < 1) return;

  const totalStr = await AsyncStorage.getItem(USE_APP_5MIN_TOTAL_KEY);
  const prevTotal = totalStr ? parseFloat(totalStr) : 0;
  const newTotal = prevTotal + elapsed;
  await AsyncStorage.setItem(USE_APP_5MIN_TOTAL_KEY, newTotal.toString());
  await AsyncStorage.setItem(USE_APP_5MIN_LAST_KEY, Date.now().toString());

  // console.log(`📊 +${elapsed.toFixed(1)}s → Total: ${newTotal.toFixed(1)}s`);

  // Check if quest is done
  const today = new Date().toDateString();
  const completedKey = USE_APP_5MIN_KEY + today;
  const completed = await AsyncStorage.getItem(completedKey);

  // For testing: 10 seconds (change to 300 for real 5min)
  if (newTotal >= 300 && completed !== "true") {
    await AsyncStorage.setItem(completedKey, "true");
    console.log("🎉 'Use app for 5 minutes' quest completed!");
    if (showToast) showToast("Quest Complete: Use the app for 5 minutes!");
  }
};

/**
 * Check if quest is complete
 */
export const checkAppUsageDuration = async (): Promise<boolean> => {
  const today = new Date().toDateString();
  const key = USE_APP_5MIN_KEY + today;
  const completed = await AsyncStorage.getItem(key);
  return completed === "true";
};

/**
 * Reset the quest (for testing)
 */
export const resetUseApp5MinQuest = async () => {
  const today = new Date().toDateString();
  await AsyncStorage.multiRemove([
    USE_APP_5MIN_KEY + today,
    USE_APP_5MIN_TOTAL_KEY,
    USE_APP_5MIN_LAST_KEY,
  ]);
  console.log("🔄 Reset quest: 'Use the app for 5 minutes'");
};
