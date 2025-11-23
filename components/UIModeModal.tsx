import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface UIModeModalProps {
  visible: boolean;
  currentMode: "system" | "dark";
  hasPurchasedDarkMode?: boolean;
  onClose: () => void;
  onSelectMode: (mode: "system" | "dark") => void;
}

const UIModeModal: React.FC<UIModeModalProps> = ({
  visible,
  currentMode,
  hasPurchasedDarkMode = false,
  onClose,
  onSelectMode,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade" // Changed to fade for smoother look
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={styles.modalContent}
          className="bg-bgModal-light dark:bg-bgModal-dark"
        >
          <Text
            style={styles.modalTitle}
            className="text-textPrimary-light dark:text-textPrimary-dark"
          >
            Select UI Mode
          </Text>

          {/* Option 1: System Default */}
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => {
              onSelectMode("system");
              onClose();
            }}
          >
            <View
              style={styles.radioCircle}
              className="border-textPrimary-light dark:border-textPrimary-dark"
            >
              {currentMode === "system" && (
                <View
                  style={styles.radioChecked}
                  className="rounded-full bg-textPrimary-light dark:bg-textPrimary-dark"
                />
              )}
            </View>
            <Text
              style={styles.radioText}
              className="text-textPrimary-light dark:text-textPrimary-dark"
            >
              System Default
            </Text>
          </TouchableOpacity>

          {/* Option 2: Dark Mode (with Lock Logic) */}
          <TouchableOpacity
            style={[
              styles.radioOption,
              !hasPurchasedDarkMode && { opacity: 0.6 }, // Dim slightly, but keep clickable
            ]}
            // 1. Remove the 'disabled' prop so we can catch the click
            onPress={() => {
              if (!hasPurchasedDarkMode) {
                // 2. Show Alert if not purchased
                Alert.alert(
                  "Night Mode Locked",
                  "Dark Mode is a premium feature. Please purchase it in the Shop to unlock.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Go to Shop",
                      onPress: () => {
                        onClose(); // Close modal first
                        router.push("/shop"); // Navigate to shop
                      },
                    },
                  ]
                );
              } else {
                // 3. Normal selection if purchased
                onSelectMode("dark");
                onClose();
              }
            }}
          >
            <View
              style={[
                styles.radioCircle,
                !hasPurchasedDarkMode && { borderColor: "#aaa" },
              ]}
              className="border-textPrimary-light dark:border-textPrimary-dark"
            >
              {currentMode === "dark" && hasPurchasedDarkMode && (
                <View
                  style={styles.radioChecked}
                  className="rounded-full bg-textPrimary-light dark:bg-textPrimary-dark"
                />
              )}
            </View>

            <View className="flex-row items-center">
              <Text
                style={[
                  styles.radioText,
                  !hasPurchasedDarkMode && { color: "#aaa" },
                ]}
                className="text-textPrimary-light dark:text-textPrimary-dark"
              >
                Dark Mode
              </Text>

              {/* 4. Display Lock Icon if not purchased */}
              {!hasPurchasedDarkMode && (
                <View className="ml-2">
                  <Feather name="lock" size={16} color="#aaa" />
                </View>
              )}
            </View>
          </TouchableOpacity>

          <View className="mt-4 items-center">
            <TouchableOpacity
              onPress={onClose}
              className="w-[200] h-[36] rounded-[10] justify-center items-center bg-button-light dark:bg-button-dark"
            >
              <Text className="text-white">CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UIModeModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 4,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioChecked: {
    height: 12,
    width: 12,
  },
  radioText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
