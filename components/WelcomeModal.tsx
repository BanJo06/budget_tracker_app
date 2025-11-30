import React, { useEffect, useRef } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

interface WelcomeModalProps {
  visible: boolean;
  name: string;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  visible,
  name,
  onClose,
}) => {
  const confettiRef = useRef<ConfettiCannon>(null);

  // Trigger confetti whenever the modal becomes visible
  useEffect(() => {
    if (visible && confettiRef.current) {
      confettiRef.current.start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      {/* pointerEvents="box-none" allows clicks to pass through empty spaces 
        if we wanted, but here we want a backdrop.
      */}
      <View className="flex-1 justify-center items-center bg-black/60">
        {/* Confetti Cannon - Placed here to be on top of background but behind or around modal */}
        {visible && (
          <ConfettiCannon
            count={200}
            origin={{ x: -10, y: 0 }} // Explosion from top-left, falling down
            autoStart={true}
            ref={confettiRef}
            fadeOut={true}
          />
        )}

        <View className="bg-bgModal-light dark:bg-bgModal-dark w-[85%] rounded-3xl p-6 items-center shadow-lg">
          <Text className="text-4xl mb-2">🎉</Text>

          <Text className="text-2xl font-bold text-center text-purple-700 dark:text-purple-300 mb-2">
            You're all set!
          </Text>

          <Text className="text-lg text-center text-textPrimary-light dark:text-textPrimary-dark mb-6">
            Welcome to PeraPal, <Text className="font-bold">{name}</Text>!
          </Text>

          <TouchableOpacity
            onPress={onClose}
            className="bg-[#8938E9] w-full py-4 rounded-xl shadow-sm"
          >
            <Text className="text-white text-center font-bold text-lg">
              Let's Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default WelcomeModal;
