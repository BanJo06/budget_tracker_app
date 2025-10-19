import { SVG_ICONS } from "@/assets/constants/icons";
import ProgressBar from "@/components/ProgressBar";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface WeeklyContentProps {
  currentProgress: number;
  setCurrentProgress: React.Dispatch<React.SetStateAction<number>>;
}

const WeeklyContent: React.FC<WeeklyContentProps> = ({
  currentProgress,
  setCurrentProgress,
}) => {
  const handlePress = () => {
    console.log("Completed weekly quest!");
    // Example: Increase progress by 0.2 on completion
    setCurrentProgress((prev) => Math.min(prev + 0.2, 1.0));
  };

  return (
    <View className="flex-1 w-full">
      {/* --- Weekly Progress Bar Section --- */}
      <View className="flex-col items-end px-[32] gap-[6] pt-[16] pb-[32]">
        <View className="pr-6 mb-2">
          <SVG_ICONS.DailyReward width={50} height={66} />
        </View>
        <ProgressBar progress={currentProgress} />
      </View>

      {/* Weekly Quests Container */}
      <View className="px-[32] space-y-4 gap-4">
        {/* Quest 1 */}
        <View
          className="h-[80] rounded-[10] bg-[#FF6B6B] px-[16] py-[8]"
          style={[{ elevation: 5 }]}
        >
          <Text className="text-[16px] text-white font-medium">
            Complete 3 daily quests
          </Text>
          <View className="items-end flex-1 justify-end">
            <TouchableOpacity
              onPress={handlePress}
              className="w-[71px] h-[27px] flex-row justify-center bg-white px-[8] py-[6] rounded-[10] active:bg-[#FFE5E5]"
            >
              <Text className="text-[#FF6B6B] text-[12px]">Complete</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quest 2 */}
        <View
          className="h-[80] rounded-[10] bg-white px-[16] py-[8]"
          style={[{ elevation: 5 }]}
        >
          <Text className="text-[16px] text-black font-medium">
            Add 5 tasks this week
          </Text>
        </View>

        {/* Quest 3 */}
        <View
          className="h-[80] rounded-[10] bg-white px-[16] py-[8]"
          style={[{ elevation: 5 }]}
        >
          <Text className="text-[16px] text-black font-medium">
            Use the app for 30 minutes
          </Text>
        </View>
      </View>
    </View>
  );
};

export default WeeklyContent;
