// components/PieChartComponent.tsx
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

interface PieChartProps {
  data: { value: number; color: string }[];
  totalFiltered: number;
  noDataText?: string;
  width?: number; // Add this prop
  height?: number; // Add this prop
}

const PieChartComponent: React.FC<PieChartProps> = ({
  data,
  totalFiltered,
  noDataText = "No data for this period",
  width = 160, // Set a default value
  height = 160, // Set a default value
}) => {
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  // Calculate the total value to find the percentage.
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const percentage =
    totalValue > 0 ? ((totalFiltered / totalValue) * 100).toFixed(0) : 0;

  // This component will be rendered in the center of the donut chart.
  const CenterLabel = () => {
    return (
      <View style={styles.centerTextContainer}>
        <Text style={styles.centerTextBold}>{totalFiltered}</Text>
        <Text style={styles.centerText}>Items</Text>
      </View>
    );
  };

  return (
    <View
      style={[styles.chartContainer, { width, height }]}
      onLayout={() => setIsLayoutReady(true)}
    >
      {isLayoutReady && totalFiltered > 0 && data.length > 0 ? (
        <PieChart
          donut
          data={data}
          radius={80}
          innerRadius={50}
          initialAngle={-180}
          strokeWidth={0}
          paddingHorizontal={0}
          centerLabelComponent={CenterLabel} // This prop adds the component to the center
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text>{noDataText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerTextContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerTextBold: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#000",
  },
  centerText: {
    fontSize: 14,
    color: "#777",
  },
});

export default PieChartComponent;
