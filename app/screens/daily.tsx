import { SVG_ICONS } from "@/assets/constants/icons";
import ProgressBar from "@/components/ProgressBar";
import { DailyQuest, DAILY_QUESTS } from "@/data/daily_quests_items";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
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
  onTransactionQuestCompleted?: (questId: string) => void;
}

const DailyContent: React.FC<DailyContentProps> = ({
  currentProgress,
  setCurrentProgress,
  showToast,
  readyIds,
  onTransactionQuestCompleted,
}) => {
  const [quests, setQuests] = useState<QuestState[]>([]);

  // ✅ Initialize quests when component mounts
  useEffect(() => {
    const initialized = DAILY_QUESTS.map((q) => ({
      ...q,
      completed: false,
      readyToComplete: false,
    }));
    setQuests(initialized);
  }, []);

  // ✅ Update quests based on readyIds
  // Update quests based on readyIds
  useEffect(() => {
    if (!readyIds || readyIds.length === 0) return;

    console.log("🎯 [DailyContent] Applying readyIds =", readyIds);

    setQuests((prev) =>
      prev.map((q) =>
        readyIds.includes(q.id)
          ? { ...q, completed: true, readyToComplete: false }
          : q
      )
    );
  }, [readyIds]);

  useEffect(() => {
    const loadQuestState = async () => {
      const lastUseApp = await AsyncStorage.getItem("useAppQuestDate");
      const today = new Date().toDateString();

      setQuests((prev) =>
        prev.map((q) => {
          if (q.id === "1" && lastUseApp === today) {
            return { ...q, completed: true };
          }
          return q;
        })
      );
    };

    loadQuestState();
  }, []);

  useEffect(() => {
    console.log("🎯 [DailyContent] Checking quests completion status:");
    quests.forEach((q) => {
      console.log(
        `- Quest "${q.title}" (id=${q.id}): completed = ${q.completed}`
      );
    });
  }, [quests]);

  // ✅ Update progress bar dynamically
  useEffect(() => {
    const completedCount = quests.filter((q) => q.completed).length;
    const total = quests.length;
    const progress = total > 0 ? completedCount / total : 0;
    setCurrentProgress(progress);
  }, [quests]);

  // ✅ Handle manual completion
  const handleComplete = (id: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, completed: true, readyToComplete: false } : q
      )
    );

    const quest = DAILY_QUESTS.find((q) => q.id === id);
    if (quest) showToast(`🎉 Quest Completed: ${quest.title}`);

    if (id === "2") onTransactionQuestCompleted?.(id); // notify parent
  };

  const screenWidth = Dimensions.get("window").width;
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 44;

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
    </View>
  );
};

export default DailyContent;
