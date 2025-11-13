import { SVG_ICONS } from "@/assets/constants/icons";
import ReusableRoundedBoxComponent from "@/components/RoundedBoxComponent";
import { useToast } from "@/components/ToastContext";
import {
  checkAppUsageDuration,
  checkDailyQuests,
  isTransactionQuestCompletedToday,
} from "@/data/daily_quests_logic";
import { TabHomeScreenNavigationProp } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import SwitchSelector from "react-native-switch-selector";
import DailyContent from "../../screens/daily";
import WeeklyContent from "../../screens/weekly";

export default function Quests() {
  const navigation = useNavigation<TabHomeScreenNavigationProp>();
  const [currentProgress, setCurrentProgress] = useState(0);
  const [selectedOption, setSelectedOption] = useState("daily");
  const [readyQuests, setReadyQuests] = useState<string[]>([]);
  const [completedWeeklyQuestIds, setCompletedWeeklyQuestIds] = useState<
    string[]
  >([]);
  const { showToast } = useToast();

  const updateProgress = useCallback((value: number) => {
    setCurrentProgress(value);
    console.log("Parent currentProgress updated:", value);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeQuests();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const initializeQuests = async () => {
    const { readyIds } = await checkDailyQuests();
    setReadyQuests(readyIds);

    const today = new Date().toDateString();

    // Show toast examples
    if (readyIds.includes("1")) {
      const toastKey = "@useAppQuestToastDate";
      const lastToastDate = await AsyncStorage.getItem(toastKey);
      if (lastToastDate !== today) {
        showToast("🎉 Quest Completed: Use App");
        await AsyncStorage.setItem(toastKey, today);
      }
    }

    const transactionCompleted = await isTransactionQuestCompletedToday();
    const toastKey2 = "@transactionQuestToastDate";
    const lastToast2 = await AsyncStorage.getItem(toastKey2);
    if (transactionCompleted && lastToast2 !== today) {
      showToast("🎉 Quest Completed: Add 1 transaction");
      await AsyncStorage.setItem(toastKey2, today);
    }

    const fiveMinCompleted = await checkAppUsageDuration();
    const toastKey3 = "@fiveMinQuestToastDate";
    const lastToast3 = await AsyncStorage.getItem(toastKey3);
    if (fiveMinCompleted && lastToast3 !== today) {
      showToast("🎉 Quest Completed: Use the app for 5 minutes");
      await AsyncStorage.setItem(toastKey3, today);
    }
  };

  const renderContent = () => {
    if (selectedOption === "daily") {
      return (
        <DailyContent
          currentProgress={currentProgress}
          setCurrentProgress={updateProgress}
          readyIds={readyQuests}
          showToast={showToast}
        />
      );
    }

    if (selectedOption === "weekly") {
      return (
        <WeeklyContent
          currentProgress={currentProgress}
          setCurrentProgress={updateProgress}
          showToast={showToast}
          readyIds={completedWeeklyQuestIds}
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
            <TouchableOpacity
              className="w-[30px] h-[30px] rounded-full flex-row absolute left-0 active:bg-[#F0E4FF]"
              onPress={() => navigation.openDrawer()}
            >
              <SVG_ICONS.SideMenu width={30} height={30} />
            </TouchableOpacity>
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
