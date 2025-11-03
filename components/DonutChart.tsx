import React, { useMemo } from "react";
import { Dimensions, StyleSheet, useColorScheme, View } from "react-native";
// Import Circle from react-native-svg
import Svg, { Circle, Text as SvgText } from "react-native-svg";

const typeColors = ["#ff6667", "#42d7b5", "#f8b591", "#1869ff"];

const typeSpending = [{ total: 20 }, { total: 30 }, { total: 50 }];

const DonutChart = () => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  // Fix: percentBgColor value was incomplete/invalid in original code
  const percentBgColor = colorScheme === "dark" ? "#000000" : "#f0f0f0";

  // Use 'window' for overall screen dimensions, better for layout
  const screenWidth = Dimensions.get("window").width;
  const size = screenWidth - 250;
  const strokeWidth = 16;
  const center = size / 2;
  // Adjusted radius calculation to ensure it fits within the size
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const totalAmount = useMemo(
    () => typeSpending.reduce((sum, item) => sum + item.total, 0),
    [typeSpending]
  );

  const startingAngles = useMemo(() => {
    let angle = -90; // Start at 12 o'clock
    return typeSpending.map((item) => {
      const currentAngle = angle;
      const percentage = totalAmount ? (item.total / totalAmount) * 360 : 0;
      angle += percentage;
      return currentAngle;
    });
  }, [typeSpending, totalAmount]);

  return (
    <View style={{ alignItems: "center" }}>
      {/* Set the width and height to the calculated size for better scaling */}
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Draw a background circle for the donut effect */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={percentBgColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {typeSpending.map((spend, index) => (
          <OneDonut
            key={index}
            center={center}
            radius={radius}
            circumference={circumference}
            color={typeColors[index]}
            percentage={(spend.total / totalAmount) * 100}
            strokeWidth={strokeWidth}
            rotation={startingAngles[index]} // Passing rotation angle
          />
        ))}
      </Svg>
    </View>
  );
};

export default DonutChart;

// Destructure the actual props being passed from DonutChart
const OneDonut = ({
  center,
  radius,
  color,
  percentage,
  circumference,
  strokeWidth,
  rotation, // Use rotation instead of angle
}: any) => {
  // Calculate the strokeDashOffset based on the percentage
  const strokeDashOffset = circumference * (1 - percentage / 100);

  return (
    <>
      <Circle
        cx={center}
        cy={center}
        r={radius}
        // Added originX and originY to correctly set the rotation point
        originX={center}
        originY={center}
        strokeWidth={strokeWidth}
        stroke={color}
        fill="none" // Important: Donut segments should not be filled
        strokeLinecap="round" // Optional: gives a cleaner edge
        // Use the 'rotation' prop passed from the parent
        rotation={rotation}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashOffset} // Corrected prop name: strokeDashoffset
      />
      <SvgText
        color={"#fff"}
        x={center}
        y={center + 5}
        textAnchor={"middle"}
        fontSize={20}
      >
        Hello
      </SvgText>
    </>
  );
};

const styles = StyleSheet.create({});
