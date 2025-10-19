import { SVG_ICONS } from "@/assets/constants/icons";
import ProgressBar from "@/components/ProgressBar";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DailyContentProps {
  currentProgress: number;
  setCurrentProgress: React.Dispatch<React.SetStateAction<number>>;
}

const DailyContent: React.FC<DailyContentProps> = ({
  currentProgress,
  setCurrentProgress,
}) => {
  const handlePress = () => {
    console.log("Completed quest!");
    // Example: Increase progress by 0.25 on completion
    setCurrentProgress((prev) => Math.min(prev + 0.25, 1.0));
  };

  return (
    <View className="flex-1 w-full">
      {/* --- Progress Bar Section --- */}
      <View className="flex-col items-end px-[32] gap-[6] pt-[16] pb-[32]">
        <View className="pr-6 mb-2">
          <SVG_ICONS.DailyReward width={50} height={66} />
        </View>
        <ProgressBar progress={currentProgress} />
      </View>

      {/* Quests Container */}
      <View className="px-[32] space-y-4 gap-4">
        {/* Quest 1: Use App (Completed Style) */}
        <View
          className="h-[80] rounded-[10] bg-[#8938E9] px-[16] py-[8]"
          style={[{ elevation: 5 }]}
        >
          <Text className="text-[16px] text-white font-medium">Use App</Text>

          <View className="items-end flex-1 justify-end">
            <TouchableOpacity
              onPress={handlePress}
              className="w-[71px] h-[27px] flex-row justify-center bg-white px-[8] py-[6] rounded-[10] active:bg-[#F0E4FF]"
            >
              <Text className="text-[#8938E9] text-[12px]">Complete</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quest 2: Add 1 task (White Background) */}
        <View
          className="h-[80] rounded-[10] bg-white px-[16] py-[8]"
          style={[{ elevation: 5 }]}
        >
          <Text className="text-[16px] text-black font-medium">Add 1 task</Text>
        </View>

        {/* Quest 3: Use the app for 5 minutes (White Background) */}
        <View
          className="h-[80] rounded-[10] bg-white px-[16] py-[8]"
          style={[{ elevation: 5 }]}
        >
          <Text className="text-[16px] text-black font-medium">
            Use the app for 5 minutes
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DailyContent;
