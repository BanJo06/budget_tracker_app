import React, { useEffect, useRef } from "react";
import { Animated, Easing, useColorScheme, View } from "react-native";

interface ProgressBarProps {
  progress: number;
  containerClassName?: string;
  fillClassName?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  containerClassName,
  fillClassName,
}) => {
  const scheme = useColorScheme(); // "light" or "dark"

  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const progressBarWidth = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  // Default styles per theme
  const defaultContainerClass =
    scheme === "dark"
      ? "w-full h-5 bg-[#1E1E1E] rounded-lg overflow-hidden"
      : "w-full h-5 bg-[#EDE1FB] rounded-lg overflow-hidden";

  const defaultFillClass =
    scheme === "dark"
      ? "h-full bg-[#B18CF5] rounded-[20]"
      : "h-full bg-[#8938E9] rounded-[20]";

  return (
    <View className={containerClassName || defaultContainerClass}>
      <Animated.View
        className={fillClassName || defaultFillClass}
        style={{ width: progressBarWidth }}
      />
    </View>
  );
};

export default ProgressBar;
