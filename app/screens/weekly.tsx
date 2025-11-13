import { SVG_ICONS } from "@/assets/constants/icons";
import ProgressBar from "@/components/ProgressBar";
import { QuestState, WEEKLY_QUESTS } from "@/data/weekly_quests_items";
import {
  checkWeeklyAppUsageCompleted,
  resetWeeklyAppUsageQuest,
  startWeeklyAppUsageTimer,
  stopWeeklyAppUsageTimer,
} from "@/data/weekly_quests_logic";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

function resetWeeklyLoginQuest(quests: QuestState[]): QuestState[] {
  return quests.map((quest) => {
    if (quest.id === "login_7days") {
      return {
        ...quest,
        completedDates: [],
        streak: 0,
        lastCompleted: undefined,
        progress: 0, // optional if you track progress separately
        completed: false, // mark as incomplete
        readyToComplete: false, // important to satisfy QuestState
      };
    }
    return quest;
  });
}

interface WeeklyContentProps {
  currentProgress: number;
  setCurrentProgress: (value: number) => void;
  showToast: (message: string) => void;
  readyIds?: string[];
}

const WeeklyContent: React.FC<WeeklyContentProps> = ({
  currentProgress,
  setCurrentProgress,
  showToast,
  readyIds = [],
}) => {
  const [quests, setQuests] = useState<QuestState[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [login7DaysProgress, setLogin7DaysProgress] = useState(0);
  const [login7DaysCompleted, setLogin7DaysCompleted] = useState(false);

  const [transactionProgress, setTransactionProgress] = useState(0);
  const [transactionCompleted, setTransactionCompleted] = useState(false);

  const [appUsageProgress, setAppUsageProgress] = useState(0); // 0 to 1
  const [appUsageCompleted, setAppUsageCompleted] = useState(false);

  const lastProgressRef = useRef(0);

  // Initialize quests only once
  useEffect(() => {
    const initialized = WEEKLY_QUESTS.map((q) => ({
      ...q,
      completed: readyIds.includes(q.id),
      readyToComplete: false,
    }));
    console.log("Initialized weekly quests:", initialized);
    setQuests(initialized);
    setIsLoaded(true);
  }, [readyIds]);

  // Update parent progress safely
  useEffect(() => {
    if (!isLoaded) return;

    const total = quests.length;
    const completed = quests.filter((q) => q.completed).length;
    const progress = total > 0 ? completed / total : 0;

    // Only update parent if progress changed
    if (Math.abs(progress - lastProgressRef.current) > 0.0001) {
      lastProgressRef.current = progress;
      setCurrentProgress(progress);
      console.log("Weekly progress updated:", progress);
    }
  }, [quests, isLoaded, setCurrentProgress]);

  useEffect(() => {
    const updateLoginQuest = async () => {
      const streak =
        Number(await AsyncStorage.getItem("@weeklyLoginStreak")) || 0;
      setQuests((prev) =>
        prev.map((q) =>
          q.id === "login_7days"
            ? { ...q, progress: streak, completed: streak >= 7 }
            : q
        )
      );
    };
    updateLoginQuest();
  }, [isLoaded]);

  //Weekly 7 day log in quest logic
  useEffect(() => {
    const loadLoginStreak = async () => {
      const streak = Number(
        (await AsyncStorage.getItem("@weeklyLoginStreak")) || "0"
      );
      setLogin7DaysProgress(Math.min(streak / 7, 1));
      const completed = streak >= 7;
      setLogin7DaysCompleted(completed);

      // ✅ Immediately mark as completed in quests
      setQuests((prev) =>
        prev.map((q) =>
          q.id === "login_7days"
            ? { ...q, completed, readyToComplete: false, progress: streak }
            : q
        )
      );
    };
    loadLoginStreak();
  }, []);

  // Weekly quest for adding 50 transactions
  useEffect(() => {
    const loadTransactionProgress = async () => {
      try {
        const count =
          Number(await AsyncStorage.getItem("@weeklyTransactionCount")) || 0;
        const completed = count >= 50;

        setTransactionProgress(Math.min(count / 50, 1));
        setTransactionCompleted(completed);

        // ✅ Immediately update quest completion
        setQuests((prev) =>
          prev.map((q) =>
            q.id === "add_50_transactions"
              ? { ...q, progress: count, completed, readyToComplete: false }
              : q
          )
        );
      } catch (err) {
        console.error("Error loading transaction quest progress:", err);
      }
    };

    loadTransactionProgress();
  }, []);

  //Weekly quest for using app for 40 minutes
  useEffect(() => {
    const trackWeeklyAppUsage = async () => {
      const completed = await checkWeeklyAppUsageCompleted();
      setAppUsageCompleted(completed);

      // optional: update progress based on seconds
      const totalStr = await AsyncStorage.getItem(
        "@weekly_use_app_40min_total"
      );
      const totalSeconds = totalStr ? parseFloat(totalStr) : 0;
      setAppUsageProgress(Math.min(totalSeconds / 2400, 1)); // 40*60s
    };

    trackWeeklyAppUsage();
    startWeeklyAppUsageTimer(showToast);

    // Reset every Monday 12:00AM
    const interval = setInterval(async () => {
      const now = new Date();
      if (
        now.getDay() === 1 &&
        now.getHours() === 0 &&
        now.getMinutes() === 0
      ) {
        await resetWeeklyAppUsageQuest();
        setAppUsageProgress(0);
        setAppUsageCompleted(false);
        console.log("🔄 Weekly 40-min quest reset at Monday 12AM");
      }
    }, 60000); // check every minute

    return () => {
      stopWeeklyAppUsageTimer();
      clearInterval(interval);
    };
  }, []);

  const handleResetTransactionQuest = async () => {
    try {
      await AsyncStorage.setItem("@weeklyTransactionCount", "0");

      // Reset local states
      setTransactionProgress(0);
      setTransactionCompleted(false);

      // Update the quest state in UI
      setQuests((prev) =>
        prev.map((q) =>
          q.id === "2"
            ? { ...q, progress: 0, completed: false, readyToComplete: false }
            : q
        )
      );

      showToast("🔄 Weekly Quest Reset: Add 50 Transactions");
      console.log("✅ 50 Transaction quest reset");
    } catch (err) {
      console.error("Error resetting Add 50 Transactions quest:", err);
    }
  };

  // quest 3
  useEffect(() => {
    const updateWeeklyAppUsage = async () => {
      const totalStr = await AsyncStorage.getItem(
        "@weekly_use_app_40min_total"
      );
      const totalSeconds = totalStr ? parseFloat(totalStr) : 0;

      const completed = totalSeconds >= 2400;

      setAppUsageProgress(Math.min(totalSeconds / 2400, 1));
      setAppUsageCompleted(completed);

      // ✅ Immediately update quest UI
      setQuests((prev) =>
        prev.map((q) =>
          q.id === "use_app_40min"
            ? {
                ...q,
                progress: totalSeconds,
                completed,
                readyToComplete: false,
              }
            : q
        )
      );

      // ✅ Instant persist (no need to wait for timer)
      if (completed) {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(today.setDate(diff));
        const mondayKey = "@weekly_use_app_40min_" + monday.toDateString();

        const alreadySet = await AsyncStorage.getItem(mondayKey);
        if (alreadySet !== "true") {
          await AsyncStorage.setItem(mondayKey, "true");
          console.log("✅ Quest immediately marked complete in UI + storage");
        }
      }
    };

    // Run immediately once
    updateWeeklyAppUsage();

    // Start timer and poll progress every 3s
    startWeeklyAppUsageTimer(showToast);
    const interval = setInterval(updateWeeklyAppUsage, 3000);

    return () => {
      stopWeeklyAppUsageTimer();
      clearInterval(interval);
    };
  }, []);

  const handleComplete = (id: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, completed: true, readyToComplete: false } : q
      )
    );
    const quest = WEEKLY_QUESTS.find((q) => q.id === id);
    if (quest) showToast(`🏆 Weekly Quest Completed: ${quest.title}`);
  };

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  const progress =
    quests.length > 0
      ? quests.filter((q) => q.completed).length / quests.length
      : 0;

  const handleResetLoginQuest = async () => {
    setQuests((prev) => resetWeeklyLoginQuest(prev));
    await AsyncStorage.setItem("@weeklyLoginStreak", "0");
    setLogin7DaysProgress(0);
    setLogin7DaysCompleted(false);
    showToast("✅ 7-Day Login Quest has been reset!");
  };

  return (
    <View className="flex-1 w-full">
      {/* Progress Bar */}
      <View className="flex-col items-end px-[32] gap-[6] pt-[16] pb-[32] mt-[20]">
        <View className="pr-6 mb-2">
          <SVG_ICONS.DailyReward width={50} height={66} />
        </View>
        <ProgressBar progress={progress} />
        <Text className="text-gray-500 text-sm mt-1">
          {(progress * 100).toFixed(0)}%
        </Text>
      </View>

      {/* Quest List */}
      <View className="px-[32] space-y-4 gap-4">
        {quests.map((quest, index) => (
          <View
            key={quest.id}
            className="rounded-[10] px-[16] py-[8]"
            style={{
              height: quest.id === "3" ? 70 : 100,
              backgroundColor: quest.completed ? "#8938E9" : "#FFFFFF",
              elevation: 5,
            }}
          >
            <Text
              className={`text-[16px] font-medium ${
                quest.completed ? "text-white" : "text-black"
              }`}
            >
              {quest.title}
            </Text>

            {/* Internal progress bar only for login_7days */}
            {quest.id === "login_7days" && !quest.completed && (
              <View className="mt-6">
                <ProgressBar progress={login7DaysProgress} />
                <Text className="text-sm text-gray-500 mt-1">
                  {Math.min(Math.round(login7DaysProgress * 7), 7)}/7 days
                </Text>
              </View>
            )}

            {/* Add 50 transactions progress bar */}
            {quest.id === "add_50_transactions" && !quest.completed && (
              <View className="mt-6">
                <ProgressBar progress={transactionProgress} />
                <Text className="text-sm text-gray-500 mt-1">
                  {Math.min(Math.round(transactionProgress * 50), 50)}/50
                  transactions
                </Text>
              </View>
            )}

            {/* Internal progress bar for Use App 40 Minutes */}
            {quest.id === "use_app_40min" && !quest.completed && (
              <View className="mt-6">
                <ProgressBar progress={appUsageProgress} />
                <Text className="text-sm text-gray-500 mt-1">
                  {Math.min(Math.round(appUsageProgress * 40), 40)}/40 minutes
                </Text>
              </View>
            )}

            {/* ✅ Single “Done” badge for completed quests */}
            {quest.completed && (
              <View className="items-end flex-1 justify-end mt-2">
                <View className="w-[71px] h-[27px] flex-row justify-center bg-white px-[8] py-[6] rounded-[10]">
                  <Text className="text-[#8938E9] text-[12px]">Done</Text>
                </View>
              </View>
            )}
          </View>
        ))}

        {/* <TouchableOpacity
          className="px-4 py-2 bg-purple-500 rounded"
          onPress={handleResetLoginQuest}
        >
          <Text className="text-white">Reset Login Quest</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          className="px-4 py-2 bg-purple-500 rounded mt-2"
          onPress={handleResetTransactionQuest}
        >
          <Text className="text-white">Reset Add 50 Transactions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="px-4 py-2 bg-purple-500 rounded mt-2"
          onPress={async () => {
            await autoCompleteTransactionQuest(setQuests);
            setTransactionProgress(1);
            setTransactionCompleted(true);
          }}
        >
          <Text className="text-white text-center">
            Auto Complete Quest (Test)
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default WeeklyContent;
