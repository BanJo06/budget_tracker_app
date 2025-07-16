import React from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';

interface GeneralBudgetsModalProps {
    isVisible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    animationType?: 'none' | 'slide' | 'fade';
    transparent?: boolean;
    backgroundColor?: string;
}

const GeneralBudgetsModal: React.FC<GeneralBudgetsModalProps> = ({
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
            <View className='w-[348] h-[160] bg-white items-center justify-center rounded-[10] px-5 py-4'>
            {title && <Text className='pb-4 font-medium'>{title}</Text>}
            {children}
            <View className='flex-row gap-2 pt-4'>
                <Button 
                title="Cancel"
                color="green"
                onPress={onClose}>
                </Button>
                <Button 
                title="Set"
                color="green"
                onPress={onClose}>
                </Button>
            </View>
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

export default GeneralBudgetsModal;