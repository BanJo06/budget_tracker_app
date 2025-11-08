// import React, { useMemo } from "react";
// import { Dimensions, StyleSheet, useColorScheme, View } from "react-native";
// // Import Circle from react-native-svg
// import Svg, { Circle, Text as SvgText } from "react-native-svg";
// import { getDailyBudget } from "@/utils/database";

// const typeColors = ["#ff6667", "#42d7b5", "#f8b591", "#1869ff"];

// const typeSpending = [{ total: 20 }, { total: 30 }, { total: 50 }];

// const DonutChart = () => {
//   const colorScheme = useColorScheme();
//   const textColor = colorScheme === "dark" ? "#fff" : "#000";
//   // Fix: percentBgColor value was incomplete/invalid in original code
//   const percentBgColor = colorScheme === "dark" ? "#000000" : "#f0f0f0";

//   // Use 'window' for overall screen dimensions, better for layout
//   const screenWidth = Dimensions.get("window").width;
//   const size = screenWidth - 250;
//   const strokeWidth = 16;
//   const center = size / 2;
//   // Adjusted radius calculation to ensure it fits within the size
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;

//   const totalAmount = useMemo(
//     () => typeSpending.reduce((sum, item) => sum + item.total, 0),
//     [typeSpending]
//   );

//   const startingAngles = useMemo(() => {
//     let angle = -90; // Start at 12 o'clock
//     return typeSpending.map((item) => {
//       const currentAngle = angle;
//       const percentage = totalAmount ? (item.total / totalAmount) * 360 : 0;
//       angle += percentage;
//       return currentAngle;
//     });
//   }, [typeSpending, totalAmount]);

//   return (
//     <View style={{ alignItems: "center" }}>
//       {/* Set the width and height to the calculated size for better scaling */}
//       <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
//         {/* Draw a background circle for the donut effect */}
//         <Circle
//           cx={center}
//           cy={center}
//           r={radius}
//           stroke={percentBgColor}
//           strokeWidth={strokeWidth}
//           fill="none"
//         />

//         {typeSpending.map((spend, index) => (
//           <OneDonut
//             key={index}
//             center={center}
//             radius={radius}
//             circumference={circumference}
//             color={typeColors[index]}
//             percentage={(spend.total / totalAmount) * 100}
//             strokeWidth={strokeWidth}
//             rotation={startingAngles[index]} // Passing rotation angle
//           />
//         ))}
//       </Svg>
//     </View>
//   );
// };

// export default DonutChart;

// // Destructure the actual props being passed from DonutChart
// const OneDonut = ({
//   center,
//   radius,
//   color,
//   percentage,
//   circumference,
//   strokeWidth,
//   rotation, // Use rotation instead of angle
// }: any) => {
//   // Calculate the strokeDashOffset based on the percentage
//   const strokeDashOffset = circumference * (1 - percentage / 100);

//   return (
//     <>
//       <Circle
//         cx={center}
//         cy={center}
//         r={radius}
//         // Added originX and originY to correctly set the rotation point
//         originX={center}
//         originY={center}
//         strokeWidth={strokeWidth}
//         stroke={color}
//         fill="none" // Important: Donut segments should not be filled
//         strokeLinecap="round" // Optional: gives a cleaner edge
//         // Use the 'rotation' prop passed from the parent
//         rotation={rotation}
//         strokeDasharray={circumference}
//         strokeDashoffset={strokeDashOffset} // Corrected prop name: strokeDashoffset
//       />
//       <SvgText
//         color={"#fff"}
//         x={center}
//         y={center + 5}
//         textAnchor={"middle"}
//         fontSize={20}
//       >
//         0/1000
//       </SvgText>
//     </>
//   );
// };

// const styles = StyleSheet.create({});

// import { getDailyBudget } from "@/utils/database";
// import React, { useEffect, useMemo, useState } from "react";
// import { Dimensions, StyleSheet, useColorScheme, View } from "react-native";
// import Svg, { Circle, Text as SvgText } from "react-native-svg";

// const typeColors = ["#ff6667", "#42d7b5", "#f8b591", "#1869ff"];
// const typeSpending = [{ total: 20 }, { total: 30 }, { total: 50 }];

// const DonutChart = () => {
//   const [dailyBudget, setDailyBudget] = useState<number>(0);

//   // Fetch the daily budget from the database
//   useEffect(() => {
//     const fetchBudget = async () => {
//       try {
//         const budget = await getDailyBudget();
//         setDailyBudget(budget);
//       } catch (error) {
//         console.error("Failed to load daily budget:", error);
//       }
//     };
//     fetchBudget();
//   }, []);

//   const colorScheme = useColorScheme();
//   const textColor = colorScheme === "dark" ? "#fff" : "#000";
//   const percentBgColor = colorScheme === "dark" ? "#000000" : "#f0f0f0";

//   const screenWidth = Dimensions.get("window").width;
//   const size = screenWidth - 250;
//   const strokeWidth = 16;
//   const center = size / 2;
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;

//   const totalAmount = useMemo(
//     () => typeSpending.reduce((sum, item) => sum + item.total, 0),
//     [typeSpending]
//   );

//   const startingAngles = useMemo(() => {
//     let angle = -90;
//     return typeSpending.map((item) => {
//       const currentAngle = angle;
//       const percentage = totalAmount ? (item.total / totalAmount) * 360 : 0;
//       angle += percentage;
//       return currentAngle;
//     });
//   }, [typeSpending, totalAmount]);

//   return (
//     <View style={{ alignItems: "center" }}>
//       <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
//         <Circle
//           cx={center}
//           cy={center}
//           r={radius}
//           stroke={percentBgColor}
//           strokeWidth={strokeWidth}
//           fill="none"
//         />

//         {typeSpending.map((spend, index) => (
//           <OneDonut
//             key={index}
//             center={center}
//             radius={radius}
//             circumference={circumference}
//             color={typeColors[index]}
//             percentage={(spend.total / totalAmount) * 100}
//             strokeWidth={strokeWidth}
//             rotation={startingAngles[index]}
//           />
//         ))}

//         {/* Center text displaying total spent and daily budget */}
//         <SvgText
//           x={center}
//           y={center + 5}
//           textAnchor="middle"
//           fontSize={20}
//           fill={textColor}
//           fontWeight="bold"
//         >
//           {`${totalAmount}/${dailyBudget}`}
//         </SvgText>
//       </Svg>
//     </View>
//   );
// };

// export default DonutChart;

// const OneDonut = ({
//   center,
//   radius,
//   color,
//   percentage,
//   circumference,
//   strokeWidth,
//   rotation,
// }: any) => {
//   const strokeDashOffset = circumference * (1 - percentage / 100);

//   return (
//     <Circle
//       cx={center}
//       cy={center}
//       r={radius}
//       originX={center}
//       originY={center}
//       strokeWidth={strokeWidth}
//       stroke={color}
//       fill="none"
//       strokeLinecap="round"
//       rotation={rotation}
//       strokeDasharray={circumference}
//       strokeDashoffset={strokeDashOffset}
//     />
//   );
// };

// const styles = StyleSheet.create({});

// DonutChart.tsx
import React from "react";
import { Text, View } from "react-native";
import { Circle, Svg } from "react-native-svg";

interface DonutChartProps {
  progress?: number; // between 0–1
  dailyBudget?: number; // add this prop
}

export default function DonutChart({
  progress = 0.5,
  dailyBudget = 0,
}: DonutChartProps) {
  const size = 120;
  const strokeWidth = 15;
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

      {/* Display the Daily Budget value */}
      <View className="absolute justify-center items-center">
        <Text className="text-[12px] text-[#392F46] opacity-60">
          Daily Budget
        </Text>
        <Text className="text-[18px] font-bold text-[#8938E9]">
          ₱{dailyBudget.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}
