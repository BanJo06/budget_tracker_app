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

import React from "react";
import {
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
  hasPurchasedDarkMode?: boolean; // ✅ add this
  onClose: () => void;
  onSelectMode: (mode: "system" | "dark") => void;
}

const UIModeModal: React.FC<UIModeModalProps> = ({
  visible,
  currentMode,
  hasPurchasedDarkMode = false, // default false
  onClose,
  onSelectMode,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
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

          {/* System Default */}
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

          {/* Dark Mode */}
          <TouchableOpacity
            style={[
              styles.radioOption,
              !hasPurchasedDarkMode && { opacity: 0.5 }, // visually disabled
            ]}
            onPress={() => {
              if (!hasPurchasedDarkMode) return; // prevent selecting
              onSelectMode("dark");
              onClose();
            }}
            disabled={!hasPurchasedDarkMode} // prevent touch
          >
            <View
              style={[
                styles.radioCircle,
                !hasPurchasedDarkMode && { borderColor: "#aaa" }, // gray border if disabled
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
            <Text
              style={[
                styles.radioText,
                !hasPurchasedDarkMode && { color: "#aaa" },
              ]}
              className="text-textPrimary-light dark:text-textPrimary-dark"
            >
              Dark Mode
            </Text>
          </TouchableOpacity>

          <Button title="Cancel" onPress={onClose} />
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
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioChecked: {
    height: 10,
    width: 10,
  },
  radioText: {
    fontSize: 14,
  },
});
