import React from "react";
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DecimalPlacesModalProps {
  visible: boolean;
  currentValue: 0 | 1 | 2;
  onClose: () => void;
  onSelectValue: (value: 0 | 1 | 2) => void;
}

const DecimalPlacesModal: React.FC<DecimalPlacesModalProps> = ({
  visible,
  currentValue,
  onClose,
  onSelectValue,
}) => {
  const options: (0 | 1 | 2)[] = [0, 1, 2];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Decimal Places</Text>

          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.radioOption}
              onPress={() => {
                onSelectValue(option);
                onClose();
              }}
            >
              <View style={styles.radioCircle}>
                {currentValue === option && (
                  <View style={styles.radioChecked} />
                )}
              </View>
              <Text style={styles.radioText}>{option}</Text>
            </TouchableOpacity>
          ))}

          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default DecimalPlacesModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
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
    borderColor: "#392F46",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioChecked: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#392F46",
  },
  radioText: {
    fontSize: 14,
  },
});
