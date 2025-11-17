import { SVG_ICONS } from "@/assets/constants/icons";
import ProgressBar from "@/components/ProgressBar";
import { DailyQuest, DAILY_QUESTS } from "@/data/daily_quests_items";
import { addCoins } from "@/utils/coins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface QuestState extends DailyQuest {
  readyToComplete: boolean;
}

interface DailyContentProps {
  currentProgress: number;
  setCurrentProgress: React.Dispatch<React.SetStateAction<number>>;
  showToast: (message: string) => void;
  readyIds: string[];
}

const DailyContent: React.FC<DailyContentProps> = ({
  currentProgress,
  setCurrentProgress,
  showToast,
  readyIds,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [quests, setQuests] = useState<QuestState[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastSentProgress, setLastSentProgress] = useState<number | null>(null);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardProcessedInSession, setRewardProcessedInSession] =
    useState(false);

  useEffect(() => {
    const initQuests = async () => {
      try {
        const today = new Date().toDateString();
        const lastUseApp = await AsyncStorage.getItem("useAppQuestDate");
        const rewardStatus = await AsyncStorage.getItem("dailyRewardClaimed");

        const claimedToday = rewardStatus === today;
        setRewardClaimed(claimedToday);

        const initialized = DAILY_QUESTS.map((q) => {
          const completedFromReadyIds = readyIds.includes(q.id);
          const completedFromStorage =
            q.id === "1" && lastUseApp === today ? true : false;

          return {
            ...q,
            completed: completedFromReadyIds || completedFromStorage,
            readyToComplete: false,
          };
        });

        setQuests(initialized);

        const completedCount = initialized.filter((q) => q.completed).length;
        const progress =
          DAILY_QUESTS.length > 0 ? completedCount / DAILY_QUESTS.length : 0;

        if (
          lastSentProgress === null ||
          Math.abs(progress - lastSentProgress) > 0.0001
        ) {
          setCurrentProgress(progress);
          setLastSentProgress(progress);
        }

        setTimeout(() => setIsLoaded(true), 50);
      } catch (error) {
        console.error("Error initializing quests:", error);
        setIsLoaded(true);
      }
    };

    initQuests();
  }, [readyIds]);

  useEffect(() => {
    if (!isLoaded) return;
    const completedCount = quests.filter((q) => q.completed).length;
    const total = quests.length;
    const progress = total > 0 ? completedCount / total : 0;

    if (
      lastSentProgress === null ||
      Math.abs(progress - lastSentProgress) > 0.0001
    ) {
      setCurrentProgress(progress);
      setLastSentProgress(progress);
    }
  }, [quests, isLoaded, setCurrentProgress, lastSentProgress]);

  // 🎁 Detect when progress hits 100% in daily.tsx
  useEffect(() => {
    const checkReward = async () => {
      // 🛑 This condition MUST be sufficient. If rewardClaimed is true from initQuests, it skips.
      if (currentProgress === 1 && !rewardClaimed) {
        const today = new Date().toDateString();
        // --- 🥇 GRANT REWARD & PERSIST STATUS ---
        await AsyncStorage.setItem("dailyRewardClaimed", today);
        await addCoins(10); // 🪙 Add 10 coins here
        // --- 🥇 UPDATE STATE & SHOW MODAL ---
        setRewardClaimed(true);
        setShowRewardModal(true);
        showToast("🎉 You earned 10 coins!");
      }
    };
    checkReward();
  }, [currentProgress, rewardClaimed, showToast]);

  const handleComplete = (id: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, completed: true, readyToComplete: false } : q
      )
    );
    const quest = DAILY_QUESTS.find((q) => q.id === id);
    if (quest) showToast(`🎉 Quest Completed: ${quest.title}`);
  };

  const screenWidth = Dimensions.get("window").width;
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 44;

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-[#121212]">
        <ActivityIndicator size="large" color="#8938E9" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-bgPrimary-dark">
      {/* 🎁 Reward Modal */}
      <Modal visible={showRewardModal} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="bg-white dark:bg-[#1E1E1E] w-[80%] p-6 rounded-2xl items-center">
            <SVG_ICONS.DailyReward width={70} height={90} />
            <Text className="text-xl font-bold mt-4 text-[#8938E9] dark:text-[#BB86FC]">
              🎉 Daily Reward!
            </Text>
            <Text className="text-base mt-2 text-center text-black dark:text-gray-200">
              You’ve completed all daily quests and earned{" "}
              <Text className="font-bold">10 coins</Text>!
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

      {/* Progress Bar */}
      <View className="flex-col items-end px-[32] gap-[6] pt-[16] pb-[32] mt-[20]">
        <View className="pr-6 mb-2">
          <SVG_ICONS.DailyReward width={50} height={66} />
        </View>
        <ProgressBar progress={currentProgress} />
        <Text className="text-gray-500 dark:text-textPrimary-dark text-sm mt-1">
          {(currentProgress * 100).toFixed(0)}%
        </Text>
      </View>

      {/* Quest List */}
      <View className="px-[32] space-y-4 gap-4">
        {quests.map((quest) => (
          <View
            key={quest.id}
            className="h-[80] rounded-[10] px-[16] py-[8] border-gray-200 dark:border-gray-700"
            style={{
              elevation: 5,
              backgroundColor: quest.completed
                ? isDark
                  ? "#2A2A2A"
                  : "#8938E9"
                : isDark
                ? "#1E1E1E"
                : "#FFFFFF",
            }}
          >
            <Text
              className={`text-[16px] font-medium ${
                quest.completed
                  ? "text-white"
                  : isDark
                  ? "text-gray-100"
                  : "text-black"
              }
              `}
            >
              {quest.title}
            </Text>

            <View className="items-end flex-1 justify-end">
              {quest.readyToComplete && !quest.completed && (
                <TouchableOpacity
                  onPress={() => handleComplete(quest.id)}
                  className="w-[71px] h-[27px] flex-row justify-center bg-[#8938E9] px-[8] py-[6] rounded-[10]"
                >
                  <Text className="text-white text-[12px]">Complete</Text>
                </TouchableOpacity>
              )}

              {quest.completed && (
                <View
                  className={`w-[71px] h-[27px] flex-row justify-center ${
                    isDark ? "bg-[#121212]" : "bg-white"
                  } px-[8] py-[6] rounded-[10]`}
                >
                  <Text
                    className={`text-[12px] ${
                      isDark ? "text-white" : "text-[#8938E9]"
                    }`}
                  >
                    Done
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Reset Buttons (for debugging) */}
      {/* <TouchableOpacity
        onPress={resetAddTransactionQuest}
        className="mt-4 px-4"
      >
        <Text className="text-center text-[#8938E9] font-medium">
          Reset Add 1 transaction
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={resetUseApp5MinQuest} className="mt-4 px-4">
        <Text className="text-center text-[#8938E9] font-medium">
          Reset Use the app for 5 minutes
        </Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default DailyContent;
