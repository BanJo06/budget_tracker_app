import { SVG_ICONS } from "@/assets/constants/icons";
import ProgressBar from "@/components/ProgressBar";
import { WeeklyQuest, WEEKLY_QUESTS } from "@/data/weekly_quests";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface WeeklyContentProps {
  currentProgress: number;
  setCurrentProgress: React.Dispatch<React.SetStateAction<number>>;
}

interface QuestState extends WeeklyQuest {
  readyToComplete: boolean;
}

const WeeklyContent: React.FC<WeeklyContentProps> = ({
  currentProgress,
  setCurrentProgress,
}) => {
  const [quests, setQuests] = useState<QuestState[]>(
    WEEKLY_QUESTS.map((q) => ({ ...q, readyToComplete: false }))
  );

  // Simulate quest progress (temporary)
  const handleQuestAction = (id: string) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, readyToComplete: true } : q))
    );
  };

  // Mark quest as completed
  const handleComplete = (id: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, completed: true, readyToComplete: false } : q
      )
    );
  };

  // Recalculate progress dynamically
  useEffect(() => {
    const completedCount = quests.filter((q) => q.completed).length;
    const total = quests.length;
    const newProgress = completedCount / total;
    setCurrentProgress(newProgress);
  }, [quests]);

  return (
    <View className="flex-1 w-full">
      {/* --- Weekly Progress Bar Section --- */}
      <View className="flex-col items-end px-[32] gap-[6] pt-[16] pb-[32]">
        <View className="pr-6 mb-2">
          <SVG_ICONS.DailyReward width={50} height={66} />
        </View>
        <ProgressBar progress={currentProgress} />
        <Text className="text-gray-500 text-sm mt-1">
          {(currentProgress * 100).toFixed(0)}%
        </Text>
      </View>

      {/* --- Weekly Quests Section --- */}
      <View className="px-[32] space-y-4 gap-4">
        {quests.map((quest) => (
          <View
            key={quest.id}
            className="h-[80] rounded-[10] px-[16] py-[8]"
            style={[
              {
                backgroundColor: quest.completed ? "#FF6B6B" : "#FFFFFF",
                elevation: 5,
              },
            ]}
          >
            <Text
              className={`text-[16px] font-medium ${
                quest.completed ? "text-white" : "text-black"
              }`}
            >
              {quest.title}
            </Text>

            <View className="items-end flex-1 justify-end">
              {/* Show Complete button only when quest ready */}
              {quest.readyToComplete && !quest.completed && (
                <TouchableOpacity
                  onPress={() => handleComplete(quest.id)}
                  className="w-[71px] h-[27px] flex-row justify-center bg-[#FF6B6B] px-[8] py-[6] rounded-[10] active:bg-[#FFE5E5]"
                >
                  <Text className="text-white text-[12px]">Complete</Text>
                </TouchableOpacity>
              )}

              {/* Show Done if quest completed */}
              {quest.completed && (
                <View className="w-[71px] h-[27px] flex-row justify-center bg-white px-[8] py-[6] rounded-[10]">
                  <Text className="text-[#FF6B6B] text-[12px]">Done</Text>
                </View>
              )}
            </View>

            {/* TEMP simulate quest trigger (testing only) */}
            {!quest.readyToComplete && !quest.completed && (
              <TouchableOpacity
                onPress={() => handleQuestAction(quest.id)}
                className="absolute bottom-2 left-4"
              >
                <Text className="text-[12px] text-gray-400 underline">
                  (simulate quest done)
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default WeeklyContent;
