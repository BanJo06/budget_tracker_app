import { SVG_ICONS } from "@/assets/constants/icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import SwitchSelector from "react-native-switch-selector";
import ReusableRoundedBoxComponent from "../../../components/RoundedBoxComponent";

import DailyContent from "../../screens/daily";
import WeeklyContent from "../../screens/weekly";

export default function Quests() {
  const [currentProgress, setCurrentProgress] = useState(0.25); // State to manage progress

  // State to hold the currently selected value ('daily' or 'weekly')
  const [selectedOption, setSelectedOption] = useState("daily");

  // Options for the SwitchSelector
  const options = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
  ];

  const handlePress = () => {
    console.log("Completed quest!");
  };

  const renderContent = () => {
    if (selectedOption === "daily")
      // *** PASS STATE AND SETTER AS PROPS HERE ***
      return (
        <DailyContent
          currentProgress={currentProgress}
          setCurrentProgress={setCurrentProgress}
        />
      );

    if (selectedOption === "weekly")
      return (
        <WeeklyContent
          currentProgress={currentProgress}
          setCurrentProgress={setCurrentProgress}
        />
      );
  };

  return (
    <View className="flex-1 bg-[#f0f0f0]">
      <ReusableRoundedBoxComponent>
        <View className="flex-col px-[32] pt-[8]">
          <View className="flex-row items-center gap-[4] pb-[16]">
            <View className="w-[25] h-[25] bg-white"></View>
            <Text className="font-medium text-white">Budget Tracker</Text>
          </View>

          <View className="flex-row items-center justify-center">
            <SVG_ICONS.SideMenu
              size={30}
              style={{ position: "absolute", left: 0 }}
            />
            <Text className="text-[16px] font-medium text-white">Quests</Text>
            <TouchableOpacity
              onPress={() => router.push("/shop")}
              className="w-[30px] h-[30px] rounded-full flex-row absolute right-0 active:bg-[#F0E4FF]"
            >
              <SVG_ICONS.Shop size={30} />
            </TouchableOpacity>
          </View>

          {/* Container for the SwitchSelector and the Date/Month Selector Button */}
          <View className="flex-row justify-center w-full mt-10 gap-10">
            <SwitchSelector
              options={options}
              initial={0}
              onPress={(value) => setSelectedOption(value)}
              textColor={"#000000"}
              selectedColor={"#ffffff"}
              buttonColor={"#7a44cf"}
              hasPadding={true}
              borderRadius={30}
              borderColor={"#ffffff"}
              valuePadding={2}
              height={40}
              width={168}
              // Removed fixed width here to allow flexbox to manage layout (This comment is misleading if width is present)
              style={{ flex: 1 }}
              // --- Styles for medium font weight ---
              textStyle={{ fontSize: 12, fontWeight: "500" }}
              selectedTextStyle={{ fontSize: 12, fontWeight: "500" }}
            />
          </View>
        </View>
      </ReusableRoundedBoxComponent>

      <View className="flex-1 w-full">{renderContent()}</View>
    </View>
  );
}
