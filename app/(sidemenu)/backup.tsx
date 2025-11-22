import { backupDatabase, restoreDatabase } from "@/utils/DatabaseBackup";
import React from "react";
import {
  Alert,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const BackupScreen = () => {
  const theme = useColorScheme();

  const handleBackup = async () => {
    try {
      await backupDatabase();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create database backup.");
    }
  };

  const handleRestore = async () => {
    try {
      await restoreDatabase();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Restore process failed.");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-bgPrimary-light dark:bg-bgPrimary-dark p-5">
      {/* Status bar theme */}
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <Text className="text-2xl font-bold mb-10 text-textPrimary-light dark:text-textPrimary-dark">
        Backup & Restore
      </Text>

      <TouchableOpacity
        className="w-4/5 py-4 bg-green-500 rounded-xl mb-[44] items-center shadow-lg"
        style={{
          shadowColor: "#4caf50",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 8,
        }}
        onPress={handleBackup}
      >
        <Text className="text-textButton-light dark:text-textButton-dark text-lg font-semibold">
          Backup Database
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-4/5 py-4 bg-button-light dark:bg-button-dark rounded-xl items-center shadow-lg"
        style={{
          shadowColor: "#2196f3",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 8,
        }}
        onPress={handleRestore}
      >
        <Text className="text-textButton-light dark:text-textButton-dark text-lg font-semibold">
          Restore Database
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BackupScreen;
