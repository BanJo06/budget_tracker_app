import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

interface CategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationType?: "none" | "slide" | "fade";
  transparent?: boolean;
  backgroundColor?: string;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isVisible,
  onClose,
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
        className="flex-1 justify-end"
        style={[styles.modalOverlay, { paddingBottom: 40 }]} // <-- add padding here
      >
        <View className="w-full h-[400] bg-bgModal-light dark:bg-bgModal-dark items-center rounded-t-[10] px-5 py-4">
          <Text className="font-medium text-textPrimary-light dark:text-textPrimary-dark">
            Select a category
          </Text>
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

export default CategoryModal;
