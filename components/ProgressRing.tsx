import React, { useEffect } from 'react';
import type { TextProps } from 'react-native'; // Import TextProps for typing
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  AnimateProps,
  Easing,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

interface ProgressRingProps {
  radius?: number;
  strokeWidth?: number;
  progress: number; // Value between 0 and 1
  progressColor?: string;
  backgroundColor?: string;
  duration?: number;
  showPercentage?: boolean;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  radius,
  strokeWidth,
  progress,
  progressColor,
  backgroundColor,
  duration,
  showPercentage,
}) => {
  const circumference = 2 * Math.PI * radius;
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: duration,
      easing: Easing.out(Easing.ease),
    });
  }, [progress, duration]);

  // Animated props for the Circle's strokeDashoffset
  const animatedCircleProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - animatedProgress.value);
    return {
      strokeDashoffset,
    };
  });

  // Derived value for the numeric percentage
  const animatedPercentageValue = useDerivedValue(() => {
    return Math.round(animatedProgress.value * 100);
  });

  // Animated props for the Text component's 'text' prop
  // Use a type assertion to satisfy TypeScript
  const animatedTextProps = useAnimatedProps<AnimateProps<TextProps>>(() => {
    return {
      text: `${animatedPercentageValue.value}%`,
    } as any; // Cast to 'any' to bypass the specific 'text' prop type issue if the AnimateProps assertion isn't enough
  });


  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2}>
        {/* Background Circle */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          fill="transparent"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <AnimatedCircle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          fill="transparent"
          stroke={progressColor} // Color of the progress fill
          strokeWidth={strokeWidth}
          strokeDasharray={circumference} // Defines the pattern of dashes and gaps (one long dash, one long gap)
          strokeLinecap="round" // Makes the ends of the stroke rounded
          animatedProps={animatedCircleProps} // Apply the animated strokeDashoffset
          // Transform to rotate the circle so the starting point is at 12 o'clock.
          // By default, SVG draws strokes from the 3 o'clock position (0 degrees).
          // Rotating it by -90 degrees around its center moves the start to 12 o'clock.
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </Svg>
      {showPercentage && (
        <AnimatedText
          style={[styles.percentageText, { fontSize: radius * 0.4 }]}
          // Here's the key: type assertion for animatedProps
          animatedProps={animatedTextProps as unknown as AnimateProps<TextProps>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  percentageText: {
    position: 'absolute',
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
});

export default ProgressRing;