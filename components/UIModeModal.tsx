// import React from "react";
// import {
//   Button,
//   Modal,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// interface UIModeModalProps {
//   visible: boolean;
//   currentMode: "system" | "dark";
//   onClose: () => void;
//   onSelectMode: (mode: "system" | "dark") => void;
// }

// const UIModeModal: React.FC<UIModeModalProps> = ({
//   visible,
//   currentMode,
//   onClose,
//   onSelectMode,
// }) => {
//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="slide"
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <Text style={styles.modalTitle}>Select UI Mode</Text>

//           {/* System Default */}
//           <TouchableOpacity
//             style={styles.radioOption}
//             onPress={() => {
//               onSelectMode("system");
//               onClose();
//             }}
//           >
//             <View style={styles.radioCircle}>
//               {currentMode === "system" && <View style={styles.radioChecked} />}
//             </View>
//             <Text style={styles.radioText}>System Default</Text>
//           </TouchableOpacity>

//           {/* Dark Mode */}
//           <TouchableOpacity
//             style={styles.radioOption}
//             onPress={() => {
//               onSelectMode("dark");
//               onClose();
//             }}
//           >
//             <View style={styles.radioCircle}>
//               {currentMode === "dark" && <View style={styles.radioChecked} />}
//             </View>
//             <Text style={styles.radioText}>Dark Mode</Text>
//           </TouchableOpacity>

//           <Button title="Cancel" onPress={onClose} />
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default UIModeModal;

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     width: "80%",
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   radioOption: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   radioCircle: {
//     height: 20,
//     width: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: "#392F46",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   radioChecked: {
//     height: 10,
//     width: 10,
//     borderRadius: 5,
//     backgroundColor: "#392F46",
//   },
//   radioText: {
//     fontSize: 14,
//   },
// });

// import React from "react";
// import {
//   Button,
//   Modal,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// interface UIModeModalProps {
//   visible: boolean;
//   currentMode: "system" | "dark";
//   hasPurchasedDarkMode?: boolean; // ✅ add this
//   onClose: () => void;
//   onSelectMode: (mode: "system" | "dark") => void;
// }

// const UIModeModal: React.FC<UIModeModalProps> = ({
//   visible,
//   currentMode,
//   hasPurchasedDarkMode = false, // default false
//   onClose,
//   onSelectMode,
// }) => {
//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="slide"
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalOverlay}>
//         <View
//           style={styles.modalContent}
//           className="bg-bgModal-light dark:bg-bgModal-dark"
//         >
//           <Text
//             style={styles.modalTitle}
//             className="text-textPrimary-light dark:text-textPrimary-dark"
//           >
//             Select UI Mode
//           </Text>

//           {/* System Default */}
//           <TouchableOpacity
//             style={styles.radioOption}
//             onPress={() => {
//               onSelectMode("system");
//               onClose();
//             }}
//           >
//             <View
//               style={styles.radioCircle}
//               className="border-textPrimary-light dark:border-textPrimary-dark"
//             >
//               {currentMode === "system" && (
//                 <View
//                   style={styles.radioChecked}
//                   className="rounded-full bg-textPrimary-light dark:bg-textPrimary-dark"
//                 />
//               )}
//             </View>
//             <Text
//               style={styles.radioText}
//               className="text-textPrimary-light dark:text-textPrimary-dark"
//             >
//               System Default
//             </Text>
//           </TouchableOpacity>

//           {/* Dark Mode */}
//           <TouchableOpacity
//             style={[
//               styles.radioOption,
//               !hasPurchasedDarkMode && { opacity: 0.5 }, // visually disabled
//             ]}
//             onPress={() => {
//               if (!hasPurchasedDarkMode) return; // prevent selecting
//               onSelectMode("dark");
//               onClose();
//             }}
//             disabled={!hasPurchasedDarkMode} // prevent touch
//           >
//             <View
//               style={[
//                 styles.radioCircle,
//                 !hasPurchasedDarkMode && { borderColor: "#aaa" }, // gray border if disabled
//               ]}
//               className="border-textPrimary-light dark:border-textPrimary-dark"
//             >
//               {currentMode === "dark" && hasPurchasedDarkMode && (
//                 <View
//                   style={styles.radioChecked}
//                   className="rounded-full bg-textPrimary-light dark:bg-textPrimary-dark"
//                 />
//               )}
//             </View>
//             <Text
//               style={[
//                 styles.radioText,
//                 !hasPurchasedDarkMode && { color: "#aaa" },
//               ]}
//               className="text-textPrimary-light dark:text-textPrimary-dark"
//             >
//               Dark Mode
//             </Text>
//           </TouchableOpacity>

//           <Button title="Cancel" onPress={onClose} />
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default UIModeModal;

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     width: "80%",
//     borderRadius: 12,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   radioOption: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   radioCircle: {
//     height: 20,
//     width: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   radioChecked: {
//     height: 10,
//     width: 10,
//   },
//   radioText: {
//     fontSize: 14,
//   },
// });

import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Button,
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

          <View className="mt-4">
            <Button title="Close" onPress={onClose} />
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
