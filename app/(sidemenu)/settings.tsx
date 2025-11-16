import DecimalPlacesModal from "@/components/DecimalPlacesModal";
import {
  cancelAllScheduledNotifications,
  requestNotificationPermission,
  scheduleDailyNotification,
  sendTestNotification,
} from "@/components/notifications";
import { usePurchase } from "@/components/PurchaseContext";
import UIModeModal from "@/components/UIModeModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Linking,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Function to open app notification settings
const openNotificationSettings = () => {
  if (Platform.OS === "android") {
    Linking.openSettings();
  } else {
    console.log("Notification settings are only available on Android.");
  }
};

export default function Settings() {
  //Dark Mode states
  const { colorScheme, setColorScheme } = useColorScheme(); // 👈 control dark/light
  const [uiMode, setUIMode] = useState<"system" | "dark">("system");

  const [isUIModalVisible, setIsUIModalVisible] = useState(false);

  const [isDecimalModalVisible, setIsDecimalModalVisible] = useState(false);
  const [decimalPlaces, setDecimalPlaces] = useState<0 | 1 | 2>(2); // default 2

  const [isRemindEverydayEnabled, setIsRemindEverydayEnabled] = useState(false);

  const { hasPurchasedDarkMode } = usePurchase();

  // Dark Mode Logic
  const toggleDarkMode = () => {
    const newMode = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(newMode);
    setUIMode(newMode === "dark" ? "dark" : "system");
  };

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedMode = await AsyncStorage.getItem("uiMode");
        if (savedMode === "dark" || savedMode === "system") {
          setUIMode(savedMode);
          setColorScheme(savedMode === "dark" ? "dark" : "light");
        }
      } catch (error) {
        console.log("Failed to load UI mode:", error);
      }
    };
    loadSettings();
  }, []);

  const toggleRemindEveryday = async () => {
    const newValue = !isRemindEverydayEnabled;
    setIsRemindEverydayEnabled(newValue);

    if (newValue) {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        await scheduleDailyNotification(); // schedule daily local notification
        // await sendTestNotification(); // optional: immediate test notification
      } else {
        Alert.alert(
          "Permission denied",
          "Cannot schedule notifications without permission."
        );
        setIsRemindEverydayEnabled(false);
      }
    } else {
      await cancelAllScheduledNotifications();
    }
  };

  const handleTestNotification = async () => {
    const result = await sendTestNotification();
    if (result)
      Alert.alert("Test Scheduled", "Notification should appear in 5 seconds!");
    else
      Alert.alert("Permission Error", "Permission denied for notifications.");
  };

  return (
    <View className="flex-1 bg-white dark:bg-[#121212]">
      {/* Appearance Section */}
      <View className="pt-[28]">
        <View>
          <View className="pb-[16] px-[32]">
            <Text className="font-medium text-[12px] text-black dark:text-white">
              Appearance
            </Text>
          </View>

          <View className="flex-col gap-4">
            {/* UI Mode */}
            <TouchableOpacity
              className="w-full py-[8] active:bg-gray-100 dark:active:bg-gray-800"
              onPress={() => setIsUIModalVisible(true)}
            >
              <View className="px-[32] gap-2">
                <Text className="text-[14px] font-medium text-black dark:text-white">
                  UI Mode
                </Text>
                <Text className="text-[14px] text-[#392F46] dark:text-gray-300 opacity-65">
                  {uiMode === "system" ? "System Default" : "Dark Mode"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Currency Position */}
            <TouchableOpacity
              className="w-full py-[8] active:bg-gray-100 dark:active:bg-gray-800"
              onPress={() => console.log("Currency Position pressed")}
            >
              <View className="px-[32] gap-2">
                <Text className="text-[14px] font-medium text-black dark:text-white">
                  Currency Position
                </Text>
                <Text className="text-[14px] text-[#392F46] dark:text-gray-300 opacity-65">
                  At the start of the amount
                </Text>
              </View>
            </TouchableOpacity>

            {/* Decimal Places */}
            <TouchableOpacity
              className="w-full py-[8] active:bg-gray-100 dark:active:bg-gray-800"
              onPress={() => setIsDecimalModalVisible(true)}
            >
              <View className="px-[32] gap-2">
                <Text className="text-[14px] font-medium text-black dark:text-white">
                  Decimal places
                </Text>
                <Text className="text-[14px] text-[#392F46] dark:text-gray-300 opacity-65">
                  {decimalPlaces} (eg.{" "}
                  {decimalPlaces === 2
                    ? "10.45"
                    : decimalPlaces === 1
                    ? "10.5"
                    : "10"}
                  )
                </Text>
              </View>
            </TouchableOpacity>

            {/* Manual Dark Mode Toggle Button */}
            {/* <TouchableOpacity
              onPress={toggleDarkMode}
              className="w-full py-[12] bg-gray-200 dark:bg-gray-700 rounded-lg mx-[32] mt-2"
            >
              <Text className="text-center text-black dark:text-white font-medium">
                Toggle Dark Mode ({colorScheme})
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>

      <View className="border border-gray-300 dark:border-gray-700 mt-[28]" />

      {/* Notification Section */}
      <View className="pt-[28]">
        <View>
          <View className="pb-[16] px-[32]">
            <Text className="font-medium text-[12px] text-black dark:text-white">
              Notification
            </Text>
          </View>

          <View className="flex-col gap-4">
            {/* 1. Remind Everyday */}
            <TouchableOpacity
              className="w-full py-[8] active:bg-gray-100 dark:active:bg-gray-800"
              onPress={toggleRemindEveryday}
            >
              <View className="px-[32] flex-row items-center justify-between">
                <View className="flex-shrink">
                  <Text className="text-[14px] font-medium text-black dark:text-white">
                    Remind everyday
                  </Text>
                  <Text className="text-[14px] text-[#392F46] dark:text-gray-300 opacity-65">
                    Remind to add expenses occasionally
                  </Text>
                </View>

                <Switch
                  value={isRemindEverydayEnabled}
                  onValueChange={toggleRemindEveryday}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isRemindEverydayEnabled ? "#f5dd4b" : "#f4f3f4"}
                />
              </View>
            </TouchableOpacity>

            {/* 2. Notification Settings */}
            <TouchableOpacity
              className="w-full py-[16] active:bg-gray-100 dark:active:bg-gray-800"
              onPress={openNotificationSettings}
            >
              <View className="px-[32]">
                <Text className="text-[14px] font-medium text-black dark:text-white">
                  Notification settings
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="border border-gray-300 dark:border-gray-700 mt-[28]" />

      {/* About Section */}
      <View className="pt-[28]">
        <View>
          <View className="pb-[16] px-[32]">
            <Text className="font-medium text-[12px] text-black dark:text-white">
              About
            </Text>
          </View>

          <TouchableOpacity
            className="w-full py-[16] active:bg-gray-100 dark:active:bg-gray-800"
            onPress={() => console.log("Privacy Policy pressed")}
          >
            <View className="px-[32]">
              <Text className="text-[14px] font-medium text-black dark:text-white">
                Privacy Policy
              </Text>
            </View>
          </TouchableOpacity>

          <View className="px-[32] mt-4">
            <Button
              title="FIRE TEST NOTIFICATION"
              onPress={handleTestNotification}
              color={colorScheme === "dark" ? "#999" : undefined}
            />
          </View>
        </View>
      </View>

      {/* UI Mode Modal */}
      <UIModeModal
        visible={isUIModalVisible}
        currentMode={uiMode}
        hasPurchasedDarkMode={hasPurchasedDarkMode} // ✅ important
        onClose={() => setIsUIModalVisible(false)}
        onSelectMode={async (mode) => {
          if (mode === "dark" && !hasPurchasedDarkMode) return; // prevent selection
          setUIMode(mode);
          setColorScheme(mode === "dark" ? "dark" : "light");
          await AsyncStorage.setItem("uiMode", mode);
        }}
      />

      {/* Decimal Places Modal */}
      <DecimalPlacesModal
        visible={isDecimalModalVisible}
        currentValue={decimalPlaces}
        onClose={() => setIsDecimalModalVisible(false)}
        onSelectValue={(value) => setDecimalPlaces(value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
