import { SVG_ICONS } from "@/assets/constants/icons";
import { usePurchase } from "@/components/PurchaseContext";
import { useToast } from "@/components/ToastContext";
import { QuestState, WEEKLY_QUESTS } from "@/data/weekly_quests_items";
import { skipQuestById } from "@/data/weekly_skip_helpers";
import { getCoins, setCoins as saveCoins } from "@/utils/coins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useCallback, useState } from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import ReusableRoundedBoxComponent from "../components/RoundedBoxComponent";

// App Icons
import Icon1 from "@/assets/icons/shopIcons/icon1.png";
import Icon2 from "@/assets/icons/shopIcons/icon2.png";
import Icon3 from "@/assets/icons/shopIcons/icon3.png";

type AppIconItem = {
  id: string;
  name: string;
  icon: any;
  price: number;
  purchased?: boolean;
};

const appIcons: AppIconItem[] = [
  { id: "icon1", name: "Icon 1", icon: Icon1, price: 100 },
  { id: "icon2", name: "Icon 2", icon: Icon2, price: 100 },
  { id: "icon3", name: "Icon 3", icon: Icon3, price: 100 },
];

type ShopItem = { name: string; price: number };

export default function Shop() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { showToast } = useToast();

  const [coins, setCoins] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  // Use context for Dark Mode state
  const {
    hasPurchasedDarkMode,
    setHasPurchasedDarkMode,
    hasPurchasedExport,
    setHasPurchasedExport,
  } = usePurchase();

  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");

  const [skipModalVisible, setSkipModalVisible] = useState(false);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [appIconsState, setAppIcons] = useState<AppIconItem[]>(appIcons);
  const [selectedHomeIconId, setSelectedHomeIconId] = useState<string | null>(
    null
  );

  const [confirmSkipModalVisible, setConfirmSkipModalVisible] = useState(false);

  const [weeklyQuests, setWeeklyQuests] = useState<QuestState[]>(
    WEEKLY_QUESTS.map((q) => ({ ...q, readyToComplete: false }))
  );

  const shopItems: ShopItem[] = [
    { name: "Dark Mode", price: 1 },
    { name: "Skip Weekly Quest", price: 1 },
    { name: "Export Records", price: 1 },
  ];

  // 1. Load Coins
  useFocusEffect(
    useCallback(() => {
      const loadCoins = async () => {
        const total = await getCoins();
        setCoins(total);
      };
      loadCoins();
    }, [])
  );

  // 2. Load Purchases (Dark Mode)
  useFocusEffect(
    React.useCallback(() => {
      const loadPurchases = async () => {
        const purchasedDark = await AsyncStorage.getItem("purchasedDarkMode");
        setHasPurchasedDarkMode(purchasedDark === "true");
      };
      loadPurchases();
    }, [])
  );

  // 3. Load App Icons
  useFocusEffect(
    useCallback(() => {
      const loadAppIconPurchases = async () => {
        const updatedIcons = await Promise.all(
          appIcons.map(async (icon) => {
            const purchased = await AsyncStorage.getItem(
              `purchased_${icon.id}`
            );
            return { ...icon, purchased: purchased === "true" };
          })
        );
        setAppIcons(updatedIcons);
      };
      loadAppIconPurchases();
    }, [])
  );

  // 4. NEW: Load Weekly Quest Status to determine "All Done"
  useFocusEffect(
    useCallback(() => {
      const loadQuestStatuses = async () => {
        try {
          const updatedQuests = await Promise.all(
            WEEKLY_QUESTS.map(async (q) => {
              // This key matches what we save in the Modal below
              const completed = await AsyncStorage.getItem(
                `quest_completed_${q.id}`
              );

              return {
                ...q,
                readyToComplete: false,
                completed: completed === "true",
              };
            })
          );
          setWeeklyQuests(updatedQuests);
        } catch (error) {
          console.log("Error loading quests:", error);
        }
      };
      loadQuestStatuses();
    }, [])
  );

  const handlePurchase = async (item: ShopItem) => {
    if (coins >= item.price) {
      // 1. Deduct Coins & Save
      const newBalance = coins - item.price;
      setCoins(newBalance);
      await saveCoins(newBalance);

      if (item.name === "Dark Mode") {
        setHasPurchasedDarkMode(true);
        await AsyncStorage.setItem("purchasedDarkMode", "true");
      } else if (item.name === "Export Records") {
        setHasPurchasedExport(true);
        await AsyncStorage.setItem("purchasedExportRecords", "true");
      }

      // 2. Handle Skip Quest Purchase
      if (item.name === "Skip Weekly Quest") {
        // Just proceed to show success message, the modal logic handles the rest
      }

      setMessage(`You purchased "${item.name}" successfully!`);
    } else {
      // 3. FAILURE: clear the selected item so the Modal doesn't trigger the Skip screen
      setSelectedItem(null);
      setMessage("Insufficient Funds");
    }

    setModalVisible(true);
  };

  const handleAppIconPurchase = async (item: AppIconItem) => {
    if (coins >= item.price) {
      const newBalance = coins - item.price;
      setCoins(newBalance);
      await saveCoins(newBalance);

      await AsyncStorage.setItem(`purchased_${item.id}`, "true");

      setAppIcons((prev) =>
        prev.map((icon) =>
          icon.id === item.id ? { ...icon, purchased: true } : icon
        )
      );

      setSelectedHomeIconId(item.id);

      Alert.alert(
        "Home Screen Icon Updated",
        `${item.name} is your new home screen icon`
      );
    } else {
      Alert.alert("Insufficient Funds", "You don't have enough coins.");
    }
  };

  return (
    <View
      className={`flex-1 w-full ${isDark ? "bg-[#121212]" : "bg-[#F5F5F5]"}`}
    >
      <ReusableRoundedBoxComponent>
        <View className="flex-col px-[32] pt-[8]">
          <View className="flex-row items-center gap-[4] pb-[16]">
            <Text className="font-medium text-white">PeraPal</Text>
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

      {/* ... App Icons Section ... */}
      <View
        className={`flex-col mx-8 mt-4 ${
          isDark ? "bg-[#121212]" : "bg-[#F5F5F5]"
        }`}
      ></View>

      {/* Shop Items Section */}
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
          {shopItems.map((item) => {
            let isPurchased = false;

            // 1. Dark Mode Logic (One-time purchase)
            if (item.name === "Dark Mode") {
              isPurchased = hasPurchasedDarkMode;
            } else if (item.name === "Export Records") {
              isPurchased = hasPurchasedExport;
            }
            // 2. Skip Logic (Purchasable until all quests are done)
            else if (item.name === "Skip Weekly Quest") {
              // Check if EVERY quest is completed
              const areAllQuestsCompleted = weeklyQuests.every(
                (q) => q.completed
              );
              isPurchased = areAllQuestsCompleted;
            }

            return (
              <TouchableOpacity
                key={item.name}
                disabled={isPurchased}
                className={`flex-row justify-between p-4 rounded-lg ${
                  isPurchased
                    ? "bg-gray-300 dark:bg-gray-800 opacity-70"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
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
                  {!isPurchased && (
                    <View className="w-[16] h-[16] rounded-full bg-[#F9C23C]" />
                  )}
                  <Text
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {/* Display 'All Done' for Skip Quest, 'Purchased' for others */}
                    {isPurchased
                      ? item.name === "Skip Weekly Quest"
                        ? "All Done"
                        : "Purchased"
                      : item.price}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ... Modals ... */}
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

                // Only open skip modal if purchase was valid
                if (
                  message !== "Insufficient Funds" &&
                  selectedItem?.name === "Skip Weekly Quest"
                ) {
                  setSkipModalVisible(true);
                }

                setSelectedItem(null);
              }}
            >
              <Text className="text-center text-white">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Skip Modal (Step 1) - Non-Closable */}
      <Modal
        visible={skipModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
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

            <View className="flex-row justify-center mt-4">
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

      {/* Confirm Skip Modal (Step 2) */}
      <Modal
        visible={confirmSkipModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
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

                  // 1. Run the existing helper
                  await skipQuestById(selectedQuestId);

                  // 2. ⚠️ FORCE SAVE TO STORAGE (This fixes your issue)
                  // We explicitly save the key exactly how the loader expects it
                  await AsyncStorage.setItem(
                    `quest_completed_${selectedQuestId}`,
                    "true"
                  );

                  // 3. Update UI locally so "All Done" appears immediately
                  setWeeklyQuests((prev) =>
                    prev.map((q) =>
                      q.id === selectedQuestId
                        ? { ...q, skipped: true, completed: true }
                        : q
                    )
                  );

                  showToast("Weekly Quest Skipped!");

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
