import { SVG_ICONS } from '@/assets/constants/icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AccountsModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    animationType?: 'none' | 'slide' | 'fade';
    transparent?: boolean;
    backgroundColor?: string;
}

const AccountsModal: React.FC<AccountsModalProps> = ({
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
            <TouchableOpacity
                onPress={onClose}
                className='absolute left-5 top-4 z-10' // z-10 ensures it's above the text
            >
                <SVG_ICONS.Close size={24} />
            </TouchableOpacity>

            {/* This view centers the text horizontally */}
            <View className='w-full items-center'>
                <Text className='font-medium pb-7'>Select an account</Text>
            </View>
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

export default AccountsModal;