import { SVG_ICONS } from "@/assets/constants/icons";
import { useToast } from "@/components/ToastContext";
import {
  checkDailyQuests,
  isTransactionQuestCompletedToday,
} from "@/data/daily_quests_logic";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import SwitchSelector from "react-native-switch-selector";
import ReusableRoundedBoxComponent from "../../../components/RoundedBoxComponent";
import DailyContent from "../../screens/daily";
import WeeklyContent from "../../screens/weekly";

export default function Quests() {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [selectedOption, setSelectedOption] = useState("daily");
  const [readyQuests, setReadyQuests] = useState<string[]>([]);
  const { showToast } = useToast();

  // 🔥 delay to ensure toast is visible (ToastProvider mounted)
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeQuests();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const initializeQuests = async () => {
    console.log("🎯 Running quest check...");
    const { readyIds } = await checkDailyQuests();
    setReadyQuests(readyIds);

    const totalQuests = 3;
    setCurrentProgress(readyIds.length / totalQuests);

    const today = new Date().toDateString();

    // ✅ Use App Quest
    if (readyIds.includes("1")) {
      const toastKey = "@useAppQuestToastDate";
      const lastToastDate = await AsyncStorage.getItem(toastKey);
      if (lastToastDate !== today) {
        showToast("🎉 Quest Completed: Use App");
        await AsyncStorage.setItem(toastKey, today);
      }
    }

    // ✅ Add 1 Transaction Quest
    const transactionCompleted = await isTransactionQuestCompletedToday();
    const toastKey = "@transactionQuestToastDate";
    const lastToastDate = await AsyncStorage.getItem(toastKey);

    if (transactionCompleted && lastToastDate !== today) {
      console.log("🔥 Showing toast for 'Add 1 transaction'");
      showToast("🎉 Quest Completed: Add 1 transaction");
      await AsyncStorage.setItem(toastKey, today);
    }
  };

  const renderContent = () => {
    if (selectedOption === "daily") {
      return (
        <DailyContent
          currentProgress={currentProgress}
          setCurrentProgress={setCurrentProgress}
          readyIds={readyQuests}
          showToast={showToast}
        />
      );
    }

    if (selectedOption === "weekly") {
      return (
        <WeeklyContent
          currentProgress={currentProgress}
          setCurrentProgress={setCurrentProgress}
        />
      );
    }

    return null;
  };

  return (
    <View className="flex-1 bg-[#f0f0f0]">
      <ReusableRoundedBoxComponent>
        <View className="flex-col px-[32] pt-[8]">
          <View className="flex-row items-center gap-[4] pb-[16]">
            <View className="w-[25] h-[25] bg-white" />
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

          <View className="flex-row justify-center w-full mt-10 gap-10">
            <SwitchSelector
              options={[
                { label: "Daily", value: "daily" },
                { label: "Weekly", value: "weekly" },
              ]}
              initial={0}
              onPress={(value) => setSelectedOption(value)}
              textColor="#000"
              selectedColor="#fff"
              buttonColor="#7a44cf"
              hasPadding
              borderRadius={30}
              borderColor="#fff"
              height={40}
              style={{ flex: 1 }}
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
