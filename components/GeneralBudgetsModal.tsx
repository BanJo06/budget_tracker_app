import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

interface GeneralBudgetsModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  animationType?: "none" | "slide" | "fade";
  transparent?: boolean;
  backgroundColor?: string;
}

const GeneralBudgetsModal: React.FC<GeneralBudgetsModalProps> = ({
  isVisible,
  onClose,
  title,
  children,
  animationType = "fade",
  transparent = true,
}) => {
  return (
    <Modal
      animationType={animationType}
      transparent={transparent}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-center items-center"
        style={styles.modalOverlay}
      >
        <View className="w-[348] h-[160] bg-bgModal-light dark:bg-bgModal-dark items-center justify-center rounded-[10] px-5 py-4">
          {title && (
            <Text className="pb-4 font-medium text-textPrimary-light dark:text-textPrimary-dark">
              {title}
            </Text>
          )}
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default GeneralBudgetsModal;
