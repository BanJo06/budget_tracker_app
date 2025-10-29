import AsyncStorage from "@react-native-async-storage/async-storage";

export type CheckResult = {
  readyIds: string[];
};

let questCheckInProgress = false;

// 🧠 Main Daily Quest Logic
export const checkDailyQuests = async (): Promise<CheckResult> => {
  if (questCheckInProgress) return { readyIds: [] };
  questCheckInProgress = true;

  try {
    console.log("⏳ Running daily quest check...");
    const today = new Date().toDateString();
    const hasUsedApp = await AsyncStorage.getItem("@hasUsedApp");
    const lastUseApp = await AsyncStorage.getItem("useAppQuestDate");

    console.log("🧠 hasUsedApp =", hasUsedApp, "| lastUseApp =", lastUseApp);

    const readyIds: string[] = [];

    // 🆕 First-time login — auto-complete quest
    if (!hasUsedApp && !lastUseApp) {
      console.log("🎯 First-time login detected — completing 'Use App' quest!");
      await AsyncStorage.setItem("@hasUsedApp", "true");
      await AsyncStorage.setItem("useAppQuestDate", today);
      readyIds.push("1");
      await AsyncStorage.setItem("useAppQuestCompleted", "true");
    }
    // 🗓️ If new day
    else if (lastUseApp !== today) {
      console.log("✨ [QuestCheck] New day detected — reset 'Use App'");
      await AsyncStorage.setItem("@hasUsedApp", "true");
      await AsyncStorage.setItem("useAppQuestDate", today);
      readyIds.push("1");
    }
    // ✅ Already done today
    else {
      console.log("✅ [QuestCheck] Use App already completed today");
    }

    console.log("✅ Quest check complete:", readyIds);
    console.log("🧩 [checkDailyQuests] returning readyIds =", readyIds);
    return { readyIds };
  } finally {
    questCheckInProgress = false;
  }
};
