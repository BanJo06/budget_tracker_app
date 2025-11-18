import { SVG_ICONS } from "@/assets/constants/icons";
import { usePurchase } from "@/components/PurchaseContext";
import { useToast } from "@/components/ToastContext";
import { QuestState, WEEKLY_QUESTS } from "@/data/weekly_quests_items";
import { skipQuestById } from "@/data/weekly_skip_helpers";
import { getCoins } from "@/utils/coins"; // 🪙 import helper
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useCallback, useState } from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import ReusableRoundedBoxComponent from "../components/RoundedBoxComponent";

type ShopItem = {
  name: string;
  price: number;
};

export default function Shop() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { showToast } = useToast();

  const [coins, setCoins] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const { hasPurchasedDarkMode, setHasPurchasedDarkMode } = usePurchase();
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");

  const [hasPurchasedSkipWeekly, setHasPurchasedSkipWeekly] = useState(false);
  const [skipModalVisible, setSkipModalVisible] = useState(false);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [confirmSkipModalVisible, setConfirmSkipModalVisible] = useState(false);

  const [weeklyQuests, setWeeklyQuests] = useState<QuestState[]>(
    WEEKLY_QUESTS.map((q) => ({ ...q, readyToComplete: false }))
  );

  // Weekly quests list (IDs must match your quest system)
  const SKIPPABLE_QUESTS = [
    { id: "login_7days", label: "Skip Login 7 Days" },
    { id: "use_app_40min", label: "Skip Use App 40 Minutes" },
    { id: "add_50_transactions", label: "Skip Add 50 Transactions" },
  ];

  const shopItems: ShopItem[] = [
    { name: "Dark Mode", price: 1 },
    // { name: "Themes", price: 250 },
    // { name: "Eye-Catching Icons", price: 250 },
    // { name: "Skip Daily Quest (Not Available)", price: 250 },
    { name: "Skip Weekly Quest", price: 1 },
  ];

  useFocusEffect(
    useCallback(() => {
      const loadCoins = async () => {
        const total = await getCoins();
        setCoins(total);
      };
      loadCoins();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      const loadPurchases = async () => {
        const purchased = await AsyncStorage.getItem("purchasedDarkMode");
        setHasPurchasedDarkMode(purchased === "true");
      };
      loadPurchases();
    }, [])
  );

  const handlePurchase = async (item: ShopItem) => {
    if (coins >= item.price) {
      setCoins((prev) => prev - item.price);

      if (item.name === "Dark Mode") {
        setHasPurchasedDarkMode(true);
        await AsyncStorage.setItem("purchasedDarkMode", "true");
      }

      if (item.name === "Skip Weekly Quest (Not Available)") {
        setHasPurchasedSkipWeekly(true);
        await AsyncStorage.setItem("purchasedSkipWeekly", "true");
      }

      setMessage(`You purchased "${item.name}" successfully!`);
    } else {
      setMessage("Insufficient Funds");
    }

    setModalVisible(true);
  };

  const resetPurchases = async () => {
    try {
      // Reset Dark Mode purchase
      setHasPurchasedDarkMode(false);
      await AsyncStorage.removeItem("purchasedDarkMode");

      // You can reset other items similarly:
      // await AsyncStorage.removeItem("purchasedThemes");
      // await AsyncStorage.removeItem("purchasedIcons");

      // Optionally reset coins
      setCoins(1000); // or whatever default starting coins

      Alert.alert("Shop Reset", "All purchases have been reset!");
    } catch (error) {
      console.log("Failed to reset purchases:", error);
    }
  };

  return (
    <View
      className={`flex-1 w-full ${isDark ? "bg-[#121212]" : "bg-[#F5F5F5]"}`}
    >
      <ReusableRoundedBoxComponent>
        <View className="flex-col px-[32] pt-[8]">
          <View className="flex-row items-center gap-[4] pb-[16]">
            <View className="w-[25] h-[25] bg-white"></View>
            <Text className="font-medium text-white">Budget Tracker</Text>
          </View>

          <View className="flex-row items-center justify-center">
            <TouchableOpacity
              className="w-[30px] h-[30px] rounded-full flex-row absolute left-0 active:bg-[#F0E4FF]"
              onPress={() => router.push("/quests")}
            >
              <SVG_ICONS.ShopBackButton size={30} />
            </TouchableOpacity>
            <Text className="text-[16px] font-medium text-white">Shop</Text>
          </View>

          {/* 🪙 Coin Display */}
          <View className="flex-row mt-10 justify-center">
            <View className="w-[71] h-[37] rounded-full bg-white justify-center items-center">
              <View className="flex-row gap-2 items-center">
                <View className="w-[16] h-[16] rounded-full bg-[#F9C23C]" />
                <Text className="text-[14px] text-[#8938E9] font-medium">
                  {coins}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ReusableRoundedBoxComponent>

      {/* ... existing Shop items */}
      <View
        className={`flex-col mx-8 mt-4 ${
          isDark ? "bg-[#121212]" : "bg-[#F5F5F5]"
        }`}
      >
        <View className="gap-2">
          <Text
            className={`text-sm mt-1 ${
              isDark ? "text-gray-300" : "text-gray-500"
            }`}
          >
            App Icons
          </Text>
          <View className="h-[2] bg-black rounded-full" />

          <View className="flex-row gap-10">
            {[1, 2, 3].map((_, i) => (
              <View key={i} className="flex-col gap-2 items-center">
                <View className="w-[70] h-[70] rounded-[10] bg-orange-400 items-center justify-center">
                  <Text className="text-[10px]">Not Available</Text>
                </View>
                <View className="flex-row gap-2 items-center">
                  <View className="w-[16] h-[16] rounded-full bg-[#F9C23C]" />
                  <Text
                    className={`text-sm mt-1 ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    100
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View
        className={`flex-col mx-8 mt-4 ${
          isDark ? "bg-[#121212]" : "bg-[#F5F5F5]"
        }`}
      >
        <Text
          className={`text-sm mt-1 ${
            isDark ? "text-gray-300" : "text-gray-500"
          }`}
        >
          Shop Items
        </Text>
        <View className="h-[2] bg-black rounded-full mb-4" />

        <View className="flex-col gap-4">
          {shopItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              className="flex-row justify-between p-4 bg-gray-200 dark:bg-gray-700 rounded-lg"
              onPress={() => {
                setSelectedItem(item);
                handlePurchase(item);
              }}
            >
              <Text
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {item.name}
              </Text>
              <View className="flex-row gap-2 items-center">
                <View className="w-[16] h-[16] rounded-full bg-[#F9C23C]" />
                <Text
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {item.price}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {/* <TouchableOpacity
          className="mt-6 bg-red-500 p-3 rounded-lg"
          onPress={resetPurchases}
        >
          <Text className="text-white text-center font-medium">
            Reset Shop Purchases
          </Text>
        </TouchableOpacity> */}
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white dark:bg-gray-800 p-6 rounded-xl w-[80%]">
            <Text className="text-center text-lg text-black dark:text-white">
              {message}
            </Text>
            <TouchableOpacity
              className="mt-4 bg-purple-500 rounded-lg p-3"
              onPress={() => {
                setModalVisible(false);

                if (selectedItem?.name === "Skip Weekly Quest") {
                  setSkipModalVisible(true); // ✅ Only open for skip purchase
                }

                setSelectedItem(null); // clear selection
              }}
            >
              <Text className="text-center text-white">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* STEP 1 — Pick quest to skip */}
      <Modal
        visible={skipModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSkipModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white dark:bg-gray-800 p-6 rounded-xl w-[85%]">
            <Text className="text-center text-lg text-black dark:text-white mb-4">
              Select a Weekly Quest to Skip
            </Text>

            {weeklyQuests.map((quest) => (
              <TouchableOpacity
                key={quest.id}
                className={`p-3 my-1 rounded-lg 
            ${
              quest.completed
                ? "bg-gray-400"
                : selectedQuestId === quest.id
                ? "bg-purple-700"
                : "bg-purple-500"
            }`}
                disabled={quest.completed}
                onPress={() => setSelectedQuestId(quest.id)}
              >
                <Text
                  className={`text-center font-medium 
            ${quest.completed ? "text-gray-700" : "text-white"}`}
                >
                  {quest.completed
                    ? `${quest.title} - Already Completed`
                    : quest.title}
                </Text>
              </TouchableOpacity>
            ))}

            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="bg-gray-500 py-2 px-4 rounded-lg"
                onPress={() => {
                  setSelectedQuestId(null);
                  setSkipModalVisible(false);
                }}
              >
                <Text className="text-white text-center">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`py-2 px-4 rounded-lg 
            ${selectedQuestId ? "bg-green-600" : "bg-green-300"}`}
                disabled={!selectedQuestId}
                onPress={() => setConfirmSkipModalVisible(true)}
              >
                <Text className="text-white">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* STEP 2 — Confirm skip */}
      <Modal
        visible={confirmSkipModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmSkipModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white dark:bg-gray-800 p-6 rounded-xl w-[75%]">
            <Text className="text-center text-lg text-black dark:text-white mb-4">
              Skip this quest?
            </Text>

            <View className="flex-row justify-between mt-2">
              <TouchableOpacity
                className="bg-gray-500 py-2 px-4 rounded-lg"
                onPress={() => setConfirmSkipModalVisible(false)}
              >
                <Text className="text-white">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-red-600 py-2 px-4 rounded-lg"
                onPress={async () => {
                  if (!selectedQuestId) return;

                  await skipQuestById(selectedQuestId);

                  // Update UI instantly
                  setWeeklyQuests((prev) =>
                    prev.map((q) =>
                      q.id === selectedQuestId
                        ? { ...q, skipped: true, completed: true }
                        : q
                    )
                  );

                  showToast("Weekly Quest Skipped!");

                  // Close both modals
                  setConfirmSkipModalVisible(false);
                  setSkipModalVisible(false);
                  setSelectedQuestId(null);
                }}
              >
                <Text className="text-white">Yes, Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
