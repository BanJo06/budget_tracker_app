import { SVG_ICONS } from "@/assets/constants/icons";
import { usePurchase } from "@/components/PurchaseContext";
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

  const [coins, setCoins] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const { hasPurchasedDarkMode, setHasPurchasedDarkMode } = usePurchase();
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");

  const shopItems: ShopItem[] = [
    { name: "Dark Mode", price: 1 },
    // { name: "Themes", price: 250 },
    // { name: "Eye-Catching Icons", price: 250 },
    { name: "Skip Daily Quest (Not Available)", price: 250 },
    { name: "Skip Weekly Quest (Not Available)", price: 250 },
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
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-center text-white">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
