import { SVG_ICONS } from "@/assets/constants/icons";
import { getCoins } from "@/utils/coins"; // 🪙 import helper
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ReusableRoundedBoxComponent from "../components/RoundedBoxComponent";

export default function Shop() {
  const [coins, setCoins] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      const loadCoins = async () => {
        const total = await getCoins();
        setCoins(total);
      };
      loadCoins();
    }, [])
  );

  return (
    <View>
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
      <View className="flex-col m-8">
        <View className="gap-2">
          <Text className="text-[16px] font-medium">App Icons</Text>
          <View className="h-[2] bg-black rounded-full" />

          <View className="flex-row gap-10">
            {[1, 2, 3].map((_, i) => (
              <View key={i} className="flex-col gap-2 items-center">
                <View className="w-[70] h-[70] rounded-[10] bg-orange-400"></View>
                <View className="flex-row gap-2 items-center">
                  <View className="w-[16] h-[16] rounded-full bg-[#F9C23C]" />
                  <Text>100</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="flex-col mt-8 gap-4">
          {[
            { name: "Dark Mode", price: 150 },
            { name: "Themes", price: 250 },
            { name: "Eye-Catching Icons", price: 250 },
          ].map((item) => (
            <View key={item.name} className="flex-row justify-between">
              <Text>{item.name}</Text>
              <View className="flex-row gap-2 items-center">
                <View className="w-[16] h-[16] rounded-full bg-[#F9C23C]" />
                <Text>{item.price}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
