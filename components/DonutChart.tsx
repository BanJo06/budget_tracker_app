import React from "react";
import { Text, View } from "react-native";
import { Circle, Svg } from "react-native-svg";

interface DonutChartProps {
  progress?: number;
  dailyBudget?: number;
  spent?: number;
  label?: string;
  color?: string;
  size?: number;
}

export default function DonutChart({
  progress = 0,
  dailyBudget = 0,
  spent = 0,
  label = "Daily Budget",
  color = "#8938E9",
  size = 140,
}: DonutChartProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const strokeDashoffset = circumference * (1 - clampedProgress);

  return (
    <View className="justify-center items-center">
      <Svg width={size} height={size}>
        <Circle
          stroke="#EDE1FB"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
      <View className="absolute justify-center items-center">
        <Text className="text-[12px] text-textPrimary-light dark:text-textPrimary-dark opacity-60">
          {label}
        </Text>
        <Text style={{ color: color }} className="text-[18px] font-bold">
          ₱{spent.toFixed(2)}
        </Text>
        <Text className="text-[12px] text-textPrimary-light dark:text-textPrimary-dark opacity-65">
          / ₱{dailyBudget.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}
