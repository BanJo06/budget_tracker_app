import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

interface NewAccountModalProps {
    isVisible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    animationType?: 'none' | 'slide' | 'fade';
    transparent?: boolean;
    backgroundColor?: string;
}

const NewAccountModal: React.FC<NewAccountModalProps> = ({
    isVisible,
    onClose,
    title,
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
        <View className='flex-1 justify-center items-center' style={styles.modalOverlay}>
            <View className='w-[348] h-[326] bg-white items-center rounded-[10] px-5 py-4'>
            {title && <Text className='pb-4 font-medium'>{title}</Text>}
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

export default NewAccountModal;