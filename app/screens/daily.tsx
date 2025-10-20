import { SVG_ICONS } from "@/assets/constants/icons";
import ProgressBar from "@/components/ProgressBar";
import { DailyQuest, DAILY_QUESTS } from "@/data/daily_quests";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DailyContentProps {
  currentProgress: number;
  setCurrentProgress: React.Dispatch<React.SetStateAction<number>>;
}

interface QuestState extends DailyQuest {
  readyToComplete: boolean;
}

const DailyContent: React.FC<DailyContentProps> = ({
  currentProgress,
  setCurrentProgress,
}) => {
  const [quests, setQuests] = useState<QuestState[]>(
    DAILY_QUESTS.map((q) => ({ ...q, readyToComplete: false }))
  );

  const [notification, setNotification] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  // --- Handle quest trigger (user performs the quest) ---
  const handleQuestAction = (id: string) => {
    const triggeredQuest = quests.find((q) => q.id === id);
    if (!triggeredQuest || triggeredQuest.readyToComplete) return;

    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, readyToComplete: true } : q))
    );

    // ✅ Show toast immediately
    showNotification(`🎯 Quest Completed: ${triggeredQuest.title}`);
  };

  // --- Mark quest as completed (after pressing Complete) ---
  const handleComplete = (id: string) => {
    const completedQuest = quests.find((q) => q.id === id);
    if (!completedQuest) return;

    setQuests((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, completed: true, readyToComplete: false } : q
      )
    );
  };

  // --- Toast animation logic ---
  const showNotification = (message: string) => {
    setNotification(message);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => setNotification(null));
      }, 2000);
    });
  };

  // --- Update progress based on completed quests ---
  useEffect(() => {
    const completedCount = quests.filter((q) => q.completed).length;
    const total = quests.length;
    setCurrentProgress(completedCount / total);
  }, [quests]);

  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 44;
  const screenWidth = Dimensions.get("window").width;

  return (
    <View className="flex-1 w-full">
      {/* --- Toast Notification (absolute to screen top) --- */}
      {notification && (
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            position: "absolute",
            top: statusBarHeight + 10,
            left: 0,
            width: screenWidth,
            alignItems: "center",
            zIndex: 1000,
            elevation: 10,
          }}
        >
          <View className="bg-[#8938E9] px-6 py-3 rounded-[12] shadow-lg">
            <Text className="text-white text-[14px] font-semibold">
              {notification}
            </Text>
          </View>
        </Animated.View>
      )}

      {/* --- Progress Bar Section --- */}
      <View className="flex-col items-end px-[32] gap-[6] pt-[16] pb-[32] mt-[20]">
        <View className="pr-6 mb-2">
          <SVG_ICONS.DailyReward width={50} height={66} />
        </View>
        <ProgressBar progress={currentProgress} />
        <Text className="text-gray-500 text-sm mt-1">
          {(currentProgress * 100).toFixed(0)}%
        </Text>
      </View>

      {/* --- Quests Container --- */}
      <View className="px-[32] space-y-4 gap-4">
        {quests.map((quest) => (
          <View
            key={quest.id}
            className="h-[80] rounded-[10] px-[16] py-[8]"
            style={[
              {
                backgroundColor: quest.completed ? "#8938E9" : "#FFFFFF",
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
              {/* Show Complete button only if quest ready */}
              {quest.readyToComplete && !quest.completed && (
                <TouchableOpacity
                  onPress={() => handleComplete(quest.id)}
                  className="w-[71px] h-[27px] flex-row justify-center bg-[#8938E9] px-[8] py-[6] rounded-[10] active:bg-[#F0E4FF]"
                >
                  <Text className="text-white text-[12px]">Complete</Text>
                </TouchableOpacity>
              )}

              {/* Show Done if quest completed */}
              {quest.completed && (
                <View className="w-[71px] h-[27px] flex-row justify-center bg-white px-[8] py-[6] rounded-[10]">
                  <Text className="text-[#8938E9] text-[12px]">Done</Text>
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

export default DailyContent;
