import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

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
                <Text className='pb-7 font-medium'>Select an account</Text>
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