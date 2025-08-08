import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

interface CategoryModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    animationType?: 'none' | 'slide' | 'fade';
    transparent?: boolean;
    backgroundColor?: string;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
    isVisible,
    onClose,
    children,
    animationType = 'fade',
    transparent = true,
})  => {
    return (
        <Modal
            animationType={animationType}
              transparent = {transparent}
              visible={isVisible}
              onRequestClose={onClose}
              >
        <View className='flex-1 justify-end' style={styles.modalOverlay}>
            <View className='w-full h-[370] bg-white items-center rounded-t-[10] px-5 py-4'>
                <Text className='pb-[60px] font-medium'>Select an category</Text>
                {children}
            </View>
        </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay:   {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
});

export default CategoryModal;