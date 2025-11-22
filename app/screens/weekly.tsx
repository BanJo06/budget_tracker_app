import { SVG_ICONS } from "@/assets/constants/icons";
import ProgressBar from "@/components/ProgressBar";
import { QuestState, WEEKLY_QUESTS } from "@/data/weekly_quests_items";
import {
  checkWeeklyAppUsageCompleted,
  resetWeeklyAppUsageQuest,
  startWeeklyAppUsageTimer,
  stopWeeklyAppUsageTimer,
} from "@/data/weekly_quests_logic";
import { addCoins } from "@/utils/coins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Check } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [quests, setQuests] = useState<QuestState[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [login7DaysProgress, setLogin7DaysProgress] = useState(0);
  const [login7DaysCompleted, setLogin7DaysCompleted] = useState(false);

  const [transactionProgress, setTransactionProgress] = useState(0);
  const [transactionCompleted, setTransactionCompleted] = useState(false);

  const [appUsageProgress, setAppUsageProgress] = useState(0); // 0 to 1
  const [appUsageCompleted, setAppUsageCompleted] = useState(false);

  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const lastProgressRef = useRef(0);

  // useEffect(() => {
  //   const loadQuests = async () => {
  //     const loadedQuests: QuestState[] = await Promise.all(
  //       WEEKLY_QUESTS.map(async (q) => {
  //         const completed =
  //           (await AsyncStorage.getItem(`@weeklyQuest_${q.id}`)) ===
  //           "completed";
  //         return { ...q, completed, readyToComplete: false };
  //       })
  //     );
  //     setQuests(loadedQuests);
  //     setIsLoaded(true);
  //   };

  //   loadQuests();
  // }, []);
  useEffect(() => {
    const loadRewardStatus = async () => {
      const claimed = await AsyncStorage.getItem("weeklyRewardClaimed");
      if (claimed === "true") setRewardClaimed(true);
    };
    loadRewardStatus();
  }, []);

  useEffect(() => {
    const loadQuests = async () => {
      const loadedQuests: QuestState[] = await Promise.all(
        WEEKLY_QUESTS.map(async (q) => {
          const completed =
            (await AsyncStorage.getItem(`@weeklyQuest_${q.id}`)) ===
            "completed";

          const skipped =
            (await AsyncStorage.getItem(`@weeklyQuest_skip_${q.id}`)) ===
            "true";

          return {
            ...q,
            completed: completed || skipped,
            skipped,
            readyToComplete: false,
          };
        })
      );

      setQuests(loadedQuests);
      setIsLoaded(true);
    };

    loadQuests();
  }, []);

  // Initialize quests only once
  // useEffect(() => {
  //   const initialized = WEEKLY_QUESTS.map((q) => ({
  //     ...q,
  //     completed: readyIds.includes(q.id),
  //     readyToComplete: false,
  //   }));
  //   console.log("Initialized weekly quests:", initialized);
  //   setQuests(initialized);
  //   setIsLoaded(true);
  // }, [readyIds]);

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
        prev.map((q) => {
          if (q.id !== "login_7days") return q;
          if (q.skipped) return q; // ⛔ do not override skipped quests

          return {
            ...q,
            progress: streak,
            completed: streak >= 7,
          };
        })
      );
    };
    updateLoginQuest();
  }, [isLoaded]);

  //Weekly 7 day log in quest logic
  // useEffect(() => {
  //   const loadLoginStreak = async () => {
  //     const streak = Number(
  //       (await AsyncStorage.getItem("@weeklyLoginStreak")) || "0"
  //     );
  //     setLogin7DaysProgress(Math.min(streak / 7, 1));
  //     const completed = streak >= 7;
  //     setLogin7DaysCompleted(completed);

  //     // ✅ Immediately mark as completed in quests
  //     setQuests((prev) =>
  //       prev.map((q) =>
  //         q.id === "login_7days"
  //           ? { ...q, completed, readyToComplete: false, progress: streak }
  //           : q
  //       )
  //     );
  //   };
  //   loadLoginStreak();
  // }, []);
  useEffect(() => {
    const loadLoginStreak = async () => {
      const streak = Number(
        (await AsyncStorage.getItem("@weeklyLoginStreak")) || "0"
      );
      setLogin7DaysProgress(Math.min(streak / 7, 1));
      const completed = streak >= 7;
      setLogin7DaysCompleted(completed);

      // Respect skipped flag when updating quests
      setQuests((prev) =>
        prev.map((q) => {
          if (q.id !== "login_7days") return q;
          if (q.skipped)
            return { ...q, completed: true, progress: q.progress ?? 7 }; // keep skipped as completed
          return { ...q, completed, readyToComplete: false, progress: streak };
        })
      );
    };
    loadLoginStreak();
  }, [isLoaded]);

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
          prev.map((q) => {
            if (q.id !== "add_50_transactions") return q;
            if (q.skipped) return { ...q, completed: true, progress: 50 };
            return { ...q, progress: count, completed, readyToComplete: false };
          })
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

      // ✅ Updated logic with skip protection
      setQuests((prev) =>
        prev.map((q) => {
          if (q.id !== "use_app_40min") return q;

          // ⛔ prevent overwriting skipped quests
          if (q.skipped) return q;

          return {
            ...q,
            progress: totalSeconds,
            completed,
            readyToComplete: false,
          };
        })
      );

      // Persist if completed
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

    // Run immediately
    updateWeeklyAppUsage();

    // Poll every 3s
    startWeeklyAppUsageTimer(showToast);
    const interval = setInterval(updateWeeklyAppUsage, 3000);

    return () => {
      stopWeeklyAppUsageTimer();
      clearInterval(interval);
    };
  }, []);

  // Weekly reward logic
  useEffect(() => {
    const checkWeeklyReward = async () => {
      const total = quests.length;
      const completed = quests.filter((q) => q.completed).length;
      const progress = total > 0 ? completed / total : 0;

      // Check persisted reward status in AsyncStorage
      const alreadyClaimed = await AsyncStorage.getItem("weeklyRewardClaimed");

      if (progress === 1 && !rewardClaimed && alreadyClaimed !== "true") {
        await AsyncStorage.setItem("weeklyRewardClaimed", "true");
        await addCoins(30); // +30 coins
        setRewardClaimed(true);
        setShowRewardModal(true);
        showToast("🎉 You earned 30 coins for completing weekly quests!");
      }
    };
    checkWeeklyReward();
  }, [quests, rewardClaimed, showToast]);

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
      <View className="flex-1 items-center justify-center bg-white dark:bg-[#121212]">
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

  const handleResetWeeklyQuests = async () => {
    // Remove completion flags
    for (const quest of WEEKLY_QUESTS) {
      await AsyncStorage.removeItem(`@weeklyQuest_${quest.id}`);
      await AsyncStorage.removeItem(`@weeklyQuest_skip_${quest.id}`);
    }

    // Reset progress keys
    await AsyncStorage.removeItem("@weeklyLoginStreak");
    await AsyncStorage.removeItem("@weeklyTransactionCount");
    await AsyncStorage.removeItem("@weekly_use_app_40min_total");

    // Reset local state
    const resetQuests: QuestState[] = WEEKLY_QUESTS.map((q) => ({
      ...q,
      completed: false,
      skipped: false,
      readyToComplete: false,
      progress: 0,
    }));

    setQuests(resetQuests);

    alert("Weekly quests have been reset!");
  };

  return (
    <View
      className={`flex-1 w-full ${isDark ? "bg-[#121212]" : "bg-[#F5F5F5]"}`}
    >
      {/* Reward Modal */}
      <Modal visible={showRewardModal} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View
            className={`w-[80%] p-6 rounded-2xl items-center ${
              isDark ? "bg-[#1E1E1E]" : "bg-white"
            }`}
          >
            <SVG_ICONS.DailyReward width={70} height={90} />
            <Text
              className={`text-xl font-bold mt-4 ${
                isDark ? "text-[#C8A6FF]" : "text-[#8938E9]"
              }`}
            >
              🎉 Weekly Reward!
            </Text>
            <Text
              className={`text-base mt-2 text-center ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              You’ve completed all weekly quests and earned{" "}
              <Text className="font-bold">30 coins</Text>!
            </Text>
            <TouchableOpacity
              className="mt-5 bg-[#8938E9] px-5 py-2 rounded-xl"
              onPress={() => setShowRewardModal(false)}
            >
              <Text className="text-white font-medium">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Progress Header */}
      <View className="flex-col items-end px-[32] pt-[16] pb-[32] mt-[20]">
        <View className="pr-6 mb-2">
          <SVG_ICONS.DailyReward width={50} height={66} />
        </View>
        <ProgressBar progress={progress} />
        <Text
          className={`text-sm mt-1 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {(progress * 100).toFixed(0)}%
        </Text>
      </View>

      {/* Quest Cards */}
      <View className="px-[32] space-y-4 gap-4 pb-[60]">
        {quests.map((quest) => {
          const isCompleted = quest.completed;
          const cardBg = isCompleted
            ? isDark
              ? "#2A2A2A" // dark mode completed background (dark gray)
              : "#8938E9" // light mode completed background (violet)
            : isDark
            ? "#1E1E1E" // dark mode uncompleted background
            : "#FFFFFF"; // light mode uncompleted background
          const textColor = isCompleted
            ? "text-white"
            : isDark
            ? "text-gray-100"
            : "text-black";

          const cardHeight =
            quest.id === "login_7days" ||
            quest.id === "add_50_transactions" ||
            quest.id === "use_app_40min"
              ? 100
              : "auto";

          return (
            <View
              key={quest.id}
              className={`rounded-[10] px-[16] py-[8]`}
              style={{
                backgroundColor: cardBg,
                elevation: 4,
                height: cardHeight,
              }}
            >
              <Text className={`text-[16px] font-medium ${textColor}`}>
                {quest.title}
              </Text>

              {/* Progress bars for quests */}
              {quest.id === "login_7days" && !quest.completed && (
                <View className="mt-6">
                  <ProgressBar progress={login7DaysProgress} />
                  <Text
                    className={`text-sm mt-1 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {Math.min(Math.round(login7DaysProgress * 7), 7)}/7 days
                  </Text>
                </View>
              )}

              {quest.id === "add_50_transactions" && !quest.completed && (
                <View className="mt-6">
                  <ProgressBar progress={transactionProgress} />
                  <Text
                    className={`text-sm mt-1 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {Math.min(Math.round(transactionProgress * 50), 50)}/50
                    transactions
                  </Text>
                </View>
              )}

              {/* Internal progress bar for Use App 40 Minutes */}
              {quest.id === "use_app_40min" && !quest.completed && (
                <View className="mt-6">
                  <ProgressBar progress={appUsageProgress} />
                  <Text
                    className={`text-sm mt-1 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {Math.min(Math.round(appUsageProgress * 40), 40)}/40 minutes
                  </Text>
                </View>
              )}

              {isCompleted && (
                <View className="items-end flex-1 justify-end mt-2">
                  <View className={`flex-row justify-center`}>
                    <Check
                      size={28}
                      color={isDark ? "white" : "#8938E9"}
                      strokeWidth={3}
                    />
                    {/* <Text
                      className={`text-[12px] ${
                        isDark ? "text-white" : "text-[#8938E9]"
                      }`}
                    >
                      {quest.skipped ? "Skipped" : "Done"}
                    </Text> */}
                  </View>
                </View>
              )}
            </View>
          );
        })}
        <TouchableOpacity
          onPress={handleResetWeeklyQuests}
          className="mt-4 bg-red-500 p-3 rounded-lg self-center"
        >
          <Text className="text-white font-bold">
            Reset Weekly Quests (Testing)
          </Text>
        </TouchableOpacity>
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
