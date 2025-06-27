import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

// Define props for the ProgressBar component, now including className props for Tailwind CSS
interface ProgressBarProps {
  progress: number; // Current progress value (0 to 1)
  containerClassName?: string; // Tailwind CSS classes for the outer container track
  fillClassName?: string; // Tailwind CSS classes for the inner filled portion
}

// Reusable ProgressBar component as a default export
const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  // Default Tailwind CSS classes for basic styling, can be overridden by props
  containerClassName = 'w-full h-5 bg-[#EDE1FB] rounded-lg overflow-hidden',
  fillClassName = 'h-full bg-[#8938E9] rounded-[20]',
}) => {
  // useRef to hold the Animated.Value, ensuring it persists across re-renders
  const animatedProgress = useRef(new Animated.Value(0)).current;

  // useEffect hook to run animation whenever the 'progress' prop changes
  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress, // The target value for the animation (0 to 1)
      duration: 500, // Duration of the animation in milliseconds
      easing: Easing.linear, // Provides a smooth, constant speed animation
      useNativeDriver: false, // Essential for animating layout properties like 'width'
    }).start(); // Starts the animation
  }, [progress]); // Dependency array: the effect re-runs when 'progress' changes

  // Interpolate the animated value (0 to 1) to a CSS percentage string (0% to 100%)
  const progressBarWidth = animatedProgress.interpolate({
    inputRange: [0, 1], // Input range from the animatedProgress value
    outputRange: ['0%', '100%'], // Corresponding output width values
  });

  return (
    // The outer View component acts as the track for the progress bar
    // It accepts Tailwind CSS classes via the 'className' prop
    <View className={containerClassName}>
      {/* The inner Animated.View represents the filled portion of the progress bar */}
      <Animated.View
        className={fillClassName}
        style={{ width: progressBarWidth }} // Apply the animated width here
      />
    </View>
  );
};

export default ProgressBar;