import React, { useEffect } from "react";
import type { TextProps } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  AnimatedProps,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

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
  textColor?: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  radius,
  strokeWidth,
  progress,
  progressColor,
  backgroundColor,
  duration,
  showPercentage,
  textColor = "#333",
}) => {
  const circumference = 2 * Math.PI * radius;
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: duration,
      easing: Easing.out(Easing.ease),
    });
  }, [progress, duration]);

  const animatedCircleProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - animatedProgress.value);
    return {
      strokeDashoffset,
    };
  });

  // 👇 --- TROUBLESHOOTING CHANGE START ---

  // NOTE: We are bypassing the animated percentage logic for a static test string
  const animatedTextProps = useAnimatedProps<AnimatedProps<TextProps>>(() => {
    return {
      // Hardcode a visible string
      text: `TEST`,
    } as any;
  });

  // 👇 --- TROUBLESHOOTING CHANGE END ---

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
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          animatedProps={animatedCircleProps}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </Svg>
      {showPercentage && (
        <AnimatedText
          style={[
            styles.percentageText,
            {
              fontSize: radius * 0.4,
              color: textColor,
            },
          ]}
          animatedProps={
            animatedTextProps as unknown as AnimatedProps<TextProps>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Keeps the SVG and Text centered within this component's boundaries
    justifyContent: "center",
  },
  percentageText: {
    position: "absolute",

    // 👇 CRITICAL FIX: Pin the text container to all edges of the parent View
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    // These ensure the text content is centered within the pinned container
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
  },
});

export default ProgressRing;
