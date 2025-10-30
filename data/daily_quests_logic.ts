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

    const addTransactionDone = await AsyncStorage.getItem(
      "@addTransactionCompleted"
    );
    const lastTransactionReset = await AsyncStorage.getItem(
      "@addTransactionResetDate"
    );

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

    // ✅ Reset "Add 1 transaction" quest at midnight
    if (lastTransactionReset !== today) {
      await AsyncStorage.removeItem("@addTransactionCompleted");
      await AsyncStorage.setItem("@addTransactionResetDate", today);
      console.log("✨ 'Add 1 transaction' quest reset for today");
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

// use a consistent key
const ADD_TRANSACTION_KEY = "@addTransactionCompleted";

// mark "Add 1 transaction" as completed
export const completeAddTransactionQuest = async () => {
  const today = new Date().toDateString();
  await AsyncStorage.setItem(ADD_TRANSACTION_KEY, "true");
  await AsyncStorage.setItem("@addTransactionResetDate", today);
  console.log("🎉 'Add 1 transaction' quest completed!");
};

// check if completed
export const markTransactionQuestCompleted = async () => {
  const today = new Date().toDateString();
  const completed = await AsyncStorage.getItem(ADD_TRANSACTION_KEY);

  if (completed === "true") return false; // already done
  await completeAddTransactionQuest();
  return true; // newly completed
};
