import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Settings() {
  return (
    <View className="flex-1">
      <View className="pt-[28]">
        <View>
          <View className="pb-[16] px-[32]">
            <Text className="font-medium text-[12px]">Apperance</Text>
          </View>

          <View className="flex-col gap-4">
            <TouchableOpacity
              className="w-full active:bg-gray-400 py-[8]"
              onPress={() => console.log("UI Mode pressed")}
            >
              <View className="px-[32] gap-2">
                <Text className="text-[14px] font-medium">UI Mode</Text>
                <Text className="text-[14px] text-[#392F46] opacity-65">
                  System Default
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full active:bg-gray-400 py-[8]"
              onPress={() => console.log("Currency Position pressed")}
            >
              <View className="px-[32] gap-2">
                <Text className="text-[14px] font-medium">
                  Currency Position
                </Text>
                <Text className="text-[14px] text-[#392F46] opacity-65">
                  At the start of the amount
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full active:bg-gray-400 py-[8]"
              onPress={() => console.log("Decimal places pressed")}
            >
              <View className="px-[32] gap-2">
                <Text className="text-[14px] font-medium">Decimal places</Text>
                <Text className="text-[14px] text-[#392F46] opacity-65">
                  2 (eg. 10.45)
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="border border-gray-400 mt-[28]"></View>

      <View className="pt-[28]">
        <View>
          <View className="pb-[16] px-[32]">
            <Text className="font-medium text-[12px]">Notification</Text>
          </View>

          <View className="flex-col gap-4">
            <TouchableOpacity
              className="w-full active:bg-gray-400 py-[8]"
              onPress={() => console.log("UI Mode pressed")}
            >
              <View className="px-[32] gap-2">
                <Text className="text-[14px] font-medium">Remind everyday</Text>
                <Text className="text-[14px] text-[#392F46] opacity-65">
                  Remind to add expenses occasionally
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full active:bg-gray-400 py-[16]"
              onPress={() => console.log("Currency Position pressed")}
            >
              <View className="px-[32]">
                <Text className="text-[14px] font-medium">
                  Notification settings
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="border border-gray-400 mt-[28]"></View>

      <View className="pt-[28]">
        <View>
          <View className="pb-[16] px-[32]">
            <Text className="font-medium text-[12px]">About</Text>
          </View>

          <TouchableOpacity
            className="w-full active:bg-gray-400 py-[16]"
            onPress={() => console.log("Currency Position pressed")}
          >
            <View className="px-[32]">
              <Text className="text-[14px] font-medium">Privacy Policy</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
