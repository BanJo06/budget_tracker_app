import React from "react";
import { Text, View } from "react-native";
import { Circle, Svg } from "react-native-svg";

interface DonutChartProps {
  progress?: number; // between 0–1
  dailyBudget?: number; // total daily budget
  spent?: number; // amount spent
  label?: string;
}

export default function DonutChart({
  progress = 0,
  dailyBudget = 0,
  spent = 0,
  label = "Daily Budget",
}: DonutChartProps) {
  console.log("DonutChart props:", { dailyBudget, spent, progress });
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View className="justify-center items-center">
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          stroke="#EDE1FB"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        {/* Progress Circle */}
        <Circle
          stroke="#8938E9"
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

      {/* Center Text */}
      <View className="absolute justify-center items-center">
        <Text className="text-[12px] text-[#392F46] opacity-60">{label}</Text>
        <Text className="text-[18px] font-bold text-[#8938E9]">
          ₱{spent.toFixed(2)}
        </Text>
        <Text className="text-[12px] text-[#392F46] opacity-65">
          / ₱{dailyBudget.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}
