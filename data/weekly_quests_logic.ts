import type { QuestState } from "@/data/weekly_quests_items";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";

const LOGIN_7DAYS_KEY = "@weeklyLoginStreak";
const TRANSACTION_QUEST_KEY = "weekly_transaction_quest_count";

export const recordLogin = async () => {
  const today = new Date().toDateString();
  let logins: string[] = [];

  const stored = await AsyncStorage.getItem(LOGIN_7DAYS_KEY);
  if (stored) logins = JSON.parse(stored);

  if (!logins.includes(today)) {
    logins.push(today);
    await AsyncStorage.setItem(LOGIN_7DAYS_KEY, JSON.stringify(logins));
  }

  return logins;
};

export const getLoginProgress = async () => {
  const stored = await AsyncStorage.getItem(LOGIN_7DAYS_KEY);
  const logins = stored ? JSON.parse(stored) : [];
  return logins.length;
};

// export async function incrementTransactionQuestProgress() {
//   const raw = await AsyncStorage.getItem("@weeklyTransactionCount");
//   const currentCount = Number(raw) || 0;

//   const newCount = currentCount + 1;
//   const completed = newCount >= 50;

//   await AsyncStorage.setItem("@weeklyTransactionCount", newCount.toString());

//   return { count: newCount, completed };
// }

export async function incrementTransactionQuestProgress(isLateRecord = false) {
  if (isLateRecord) {
    // 🚫 Skip incrementing for late records
    const raw = await AsyncStorage.getItem("@weeklyTransactionCount");
    const currentCount = Number(raw) || 0;
    const completed = currentCount >= 50;
    return { count: currentCount, completed };
  }

  // ✅ Normal transaction flow
  const raw = await AsyncStorage.getItem("@weeklyTransactionCount");
  const currentCount = Number(raw) || 0;

  const newCount = currentCount + 1;
  const completed = newCount >= 50;

  await AsyncStorage.setItem("@weeklyTransactionCount", newCount.toString());

  return { count: newCount, completed };
}

export async function resetWeeklyProgressIfNeeded() {
  const lastReset = await AsyncStorage.getItem("weekly_reset_date");
  const now = new Date();
  const last = lastReset ? new Date(lastReset) : null;

  // reset every Monday
  const isNewWeek =
    !last ||
    now.getFullYear() !== last.getFullYear() ||
    now.getMonth() !== last.getMonth() ||
    Math.floor((now.getDate() - last.getDate()) / 7) >= 1;

  if (isNewWeek) {
    await AsyncStorage.removeItem("@weeklyTransactionCount");
    await AsyncStorage.removeItem("@weeklyTransactionCompleted");
    await AsyncStorage.setItem("weekly_reset_date", now.toISOString());
    console.log("🗓 Weekly quest progress reset");
  }
}

// Fetch current weekly transaction quest progress
export async function getTransactionQuestProgress() {
  try {
    const count =
      Number(await AsyncStorage.getItem("@weeklyTransactionCount")) || 0;
    const completed = count >= 50;
    const progress = Math.min(count / 50, 1); // value between 0 and 1 for ProgressBar
    return { count, completed, progress };
  } catch (err) {
    console.error("Error fetching transaction quest progress:", err);
    return { count: 0, completed: false, progress: 0 };
  }
}

export async function triggerTransactionQuest(
  setQuests?: React.Dispatch<React.SetStateAction<QuestState[]>>
) {
  try {
    // Get current count
    const rawCount =
      Number(await AsyncStorage.getItem("@weeklyTransactionCount")) || 0;

    // Increment first
    const newCount = rawCount + 1;
    const completed = newCount >= 50;

    // Update AsyncStorage
    await AsyncStorage.setItem("@weeklyTransactionCount", newCount.toString());

    // Optionally update state (only if provided)
    if (setQuests) {
      setQuests((prev) =>
        prev.map((q) =>
          q.id === "2"
            ? { ...q, progress: Math.min(newCount, 50), completed }
            : q
        )
      );
    }

    console.log(`📊 Weekly Quest Progress: ${newCount}/50`);
  } catch (err) {
    console.error("Error updating weekly transaction quest:", err);
  }
}

// Auto-complete quest for testing
export async function autoCompleteTransactionQuest(
  setQuests?: React.Dispatch<React.SetStateAction<QuestState[]>>
) {
  try {
    await AsyncStorage.setItem(TRANSACTION_QUEST_KEY, "50");

    if (setQuests) {
      setQuests((prev) =>
        prev.map((q) =>
          q.id === "add_50_transactions"
            ? { ...q, progress: 50, completed: true }
            : q
        )
      );
    }

    console.log("🎯 Weekly Quest auto-completed: Add 50 Transactions!");
  } catch (err) {
    console.error("Error auto-completing transaction quest:", err);
  }
}

// quest no. 3, use  app for 40 minutes
const WEEKLY_USE_APP_KEY = "@weekly_use_app_40min_";
const WEEKLY_USE_APP_TOTAL_KEY = "@weekly_use_app_40min_total";
const WEEKLY_USE_APP_LAST_KEY = "@weekly_use_app_40min_last";

let appStateListener: any = null;
let intervalId: ReturnType<typeof setInterval> | null = null;

/**
 * Start weekly app usage timer
 */
export const startWeeklyAppUsageTimer = async (
  showToast?: (msg: string) => void
) => {
  const now = Date.now();
  await AsyncStorage.setItem(WEEKLY_USE_APP_LAST_KEY, now.toString());
  console.log(
    "⏱️ Started weekly app usage tracking at",
    new Date(now).toLocaleTimeString()
  );

  // Only add listener once
  if (!appStateListener) {
    appStateListener = AppState.addEventListener(
      "change",
      async (nextState) => {
        if (nextState === "background" || nextState === "inactive") {
          await updateWeeklyUsageTime(showToast);
        } else if (nextState === "active") {
          const now = Date.now();
          await AsyncStorage.setItem(WEEKLY_USE_APP_LAST_KEY, now.toString());
        }
      }
    );
  }

  startWeeklyInterval(showToast);
};

/**
 * Interval for weekly usage
 */
const startWeeklyInterval = (showToast?: (msg: string) => void) => {
  if (intervalId) return;

  intervalId = setInterval(async () => {
    await updateWeeklyUsageTime(showToast);
  }, 3000); // every 3s for testing, can be 10s or 30s
};

/**
 * Stop interval (optional)
 */
export const stopWeeklyAppUsageTimer = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

/**
 * Update total usage time
 */
const updateWeeklyUsageTime = async (showToast?: (msg: string) => void) => {
  // --- EARLY RETURN if quest was skipped ---
  const skipFlag = await AsyncStorage.getItem(
    "@weeklyQuest_skip_use_app_40min"
  );
  if (skipFlag === "true") {
    // ensure timer isn't running
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    return;
  }
  // --- end early return ---
  const lastActiveStr = await AsyncStorage.getItem(WEEKLY_USE_APP_LAST_KEY);
  if (!lastActiveStr) return;

  const lastActive = parseInt(lastActiveStr, 10);
  const elapsed = (Date.now() - lastActive) / 1000; // seconds
  if (elapsed < 1) return;

  const totalStr = await AsyncStorage.getItem(WEEKLY_USE_APP_TOTAL_KEY);
  const prevTotal = totalStr ? parseFloat(totalStr) : 0;
  const newTotal = prevTotal + elapsed;

  await AsyncStorage.setItem(WEEKLY_USE_APP_TOTAL_KEY, newTotal.toString());
  await AsyncStorage.setItem(WEEKLY_USE_APP_LAST_KEY, Date.now().toString());

  // console.log(
  //   `📊 +${elapsed.toFixed(1)}s → Weekly Total: ${newTotal.toFixed(1)}s`
  // );`

  // Check if quest done
  const today = getMondayDateString();
  const completedKey = WEEKLY_USE_APP_KEY + today;
  const completed = await AsyncStorage.getItem(completedKey);

  // For testing: 40s, for production: 40*60 = 2400
  if (newTotal >= 2400 && completed !== "true") {
    await AsyncStorage.setItem(completedKey, "true");
    console.log("🎉 'Use app for 40 minutes (weekly)' quest completed!");
    if (showToast)
      showToast("🏆 Weekly Quest Complete: Use the app for 40 minutes!");
  }
};

/**
 * Check if weekly quest is completed
 */
export const checkWeeklyAppUsageCompleted = async (): Promise<boolean> => {
  const today = getMondayDateString();
  const completedKey = WEEKLY_USE_APP_KEY + today;
  const completed = await AsyncStorage.getItem(completedKey);
  return completed === "true";
};

/**
 * Reset weekly quest (every Monday 12AM)
 */
export const resetWeeklyAppUsageQuest = async () => {
  const today = getMondayDateString();
  await AsyncStorage.multiRemove([
    WEEKLY_USE_APP_KEY + today,
    WEEKLY_USE_APP_TOTAL_KEY,
    WEEKLY_USE_APP_LAST_KEY,
  ]);
  console.log("🔄 Reset weekly quest: 'Use app for 40 minutes'");
};

/**
 * Helper: get date string of current week's Monday
 */
export const getMondayDateString = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(now.setDate(diff));
  return monday.toDateString();
};
