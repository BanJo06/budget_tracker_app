import {
  getMondayDateString,
  stopWeeklyAppUsageTimer,
} from "@/data/weekly_quests_logic";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SKIP_FLAG_PREFIX = "@weeklyQuest_skip_";

export async function skipQuestById(id: string) {
  // persist skip flag
  await AsyncStorage.setItem(`${SKIP_FLAG_PREFIX}${id}`, "true");

  if (id === "login_7days") {
    // Also mark login streak as complete so login logic won't unskip it
    await AsyncStorage.setItem("@weeklyLoginStreak", "7"); // treat as completed
    // optional single quest key:
    await AsyncStorage.setItem(`@weeklyQuest_${id}`, "completed");
  }

  if (id === "use_app_40min") {
    // mark Monday completed + set total to 40min
    const monday = getMondayDateString();
    await AsyncStorage.setItem("@weekly_use_app_40min_total", "2400");
    await AsyncStorage.setItem("@weekly_use_app_40min_" + monday, "true");
    // also set a direct completed key (if you rely on it)
    await AsyncStorage.setItem(`@weeklyQuest_${id}`, "completed");

    // stop timers so they won't continue to update storage
    stopWeeklyAppUsageTimer();
  }

  if (id === "add_50_transactions") {
    // mark transactions as completed
    await AsyncStorage.setItem("@weeklyTransactionCount", "50");
    await AsyncStorage.setItem(`@weeklyQuest_${id}`, "completed");
  }
}
