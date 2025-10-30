import { SVG_ICONS } from "@/assets/constants/icons";
import ProgressBar from "@/components/ProgressBar";
import { DailyQuest, DAILY_QUESTS } from "@/data/daily_quests_items";
import { resetAddTransactionQuest } from "@/data/daily_quests_logic";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
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
  const [quests, setQuests] = useState<QuestState[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // ✅ prevents 0% flash

  useEffect(() => {
    const initQuests = async () => {
      try {
        const today = new Date().toDateString();
        const lastUseApp = await AsyncStorage.getItem("useAppQuestDate");

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

        // Calculate progress once after initialization
        const completedCount = initialized.filter((q) => q.completed).length;
        const progress =
          DAILY_QUESTS.length > 0 ? completedCount / DAILY_QUESTS.length : 0;
        setCurrentProgress(progress);

        // ✅ Delay render until everything is ready
        setTimeout(() => setIsLoaded(true), 50);
      } catch (error) {
        console.error("Error initializing quests:", error);
        setIsLoaded(true);
      }
    };

    initQuests();
  }, [readyIds]);

  // ✅ Keep progress synced with quest updates
  useEffect(() => {
    if (!isLoaded) return; // skip until ready
    const completedCount = quests.filter((q) => q.completed).length;
    const total = quests.length;
    const progress = total > 0 ? completedCount / total : 0;
    setCurrentProgress(progress);
  }, [quests, isLoaded]);

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
    // ✅ Optional loader — avoids flicker entirely
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#8938E9" />
      </View>
    );
  }

  return (
    <View className="flex-1 w-full">
      {/* Progress Bar */}
      <View className="flex-col items-end px-[32] gap-[6] pt-[16] pb-[32] mt-[20]">
        <View className="pr-6 mb-2">
          <SVG_ICONS.DailyReward width={50} height={66} />
        </View>
        <ProgressBar progress={currentProgress} />
        <Text className="text-gray-500 text-sm mt-1">
          {(currentProgress * 100).toFixed(0)}%
        </Text>
      </View>

      {/* Quest List */}
      <View className="px-[32] space-y-4 gap-4">
        {quests.map((quest) => (
          <View
            key={quest.id}
            className="h-[80] rounded-[10] px-[16] py-[8]"
            style={{
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
                <View className="w-[71px] h-[27px] flex-row justify-center bg-white px-[8] py-[6] rounded-[10]">
                  <Text className="text-[#8938E9] text-[12px]">Done</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Reset Button */}
      <TouchableOpacity
        onPress={resetAddTransactionQuest}
        className="mt-4 px-4"
      >
        <Text className="text-center text-[#8938E9] font-medium">
          Reset Daily Quests
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DailyContent;
