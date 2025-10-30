import AsyncStorage from "@react-native-async-storage/async-storage";

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
