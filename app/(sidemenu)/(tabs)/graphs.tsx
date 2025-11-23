import { TabHomeScreenNavigationProp } from "@/types";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useMemo, useRef, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SwitchSelector from "react-native-switch-selector";
import { SVG_ICONS } from "../../../assets/constants/icons";
import ReusableRoundedBoxComponent from "../../../components/RoundedBoxComponent";

import ExpenseContent from "../../screens/expense";
import IncomeContent from "../../screens/income";

export default function Graphs() {
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation<TabHomeScreenNavigationProp>();

  // 1. State for Selection
  const [selectedOption, setSelectedOption] = useState("expense");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 2. Refs for Modal (Prevents re-renders while scrolling the picker)
  const tempMonthRef = useRef(selectedMonth);
  const tempYearRef = useRef(selectedYear);

  // Data helpers
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const months = monthNames.map((name, i) => ({ label: name, value: i + 1 }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => ({
    label: String(currentYear - i),
    value: currentYear - i,
  }));

  const currentMonthName = months.find((m) => m.value === selectedMonth)?.label;

  const options = [
    { label: "Expense", value: "expense" },
    { label: "Income", value: "income" },
  ];

  // 3. Handlers
  const handleOpenModal = () => {
    tempMonthRef.current = selectedMonth;
    tempYearRef.current = selectedYear;
    setIsModalVisible(true);
  };

  const handleConfirmSelection = () => {
    setSelectedMonth(tempMonthRef.current);
    setSelectedYear(tempYearRef.current);
    setIsModalVisible(false);
  };

  const handleCancelSelection = () => {
    setIsModalVisible(false);
  };

  // 4. Memoized Content
  // This ensures we don't recreate the component unless specific props change
  const content = useMemo(() => {
    if (selectedOption === "expense") {
      return (
        <ExpenseContent
          key={`expense-${selectedMonth}-${selectedYear}`} // Forces a fresh mount on date change
          month={selectedMonth}
          year={selectedYear}
        />
      );
    }
    if (selectedOption === "income") {
      return (
        <IncomeContent
          key={`income-${selectedMonth}-${selectedYear}`}
          month={selectedMonth}
          year={selectedYear}
        />
      );
    }
    return null;
  }, [selectedOption, selectedMonth, selectedYear]);

  return (
    <View className="flex-1 items-center bg-bgPrimary-light dark:bg-bgPrimary-dark">
      {/* Header Section */}
      <ReusableRoundedBoxComponent style={{ marginHorizontal: 20 }}>
        <View className="flex-col px-[32] pt-[8]">
          {/* Top Bar */}
          <View className="flex-row items-center gap-[4] pb-[16]">
            <Text className="font-medium text-textInsidePrimary-light dark:text-textInsidePrimary-dark">
              PeraPal
            </Text>
          </View>

          {/* Title & Menu */}
          <View className="flex-row items-center justify-center">
            <TouchableOpacity
              className="w-[30px] h-[30px] rounded-full flex-row absolute left-0 active:bg-[#F0E4FF]"
              onPress={() => navigation.openDrawer()}
            >
              <SVG_ICONS.SideMenu width={30} height={30} />
            </TouchableOpacity>
            <Text className="text-[16px] font-medium text-textInsidePrimary-light dark:text-textInsidePrimary-dark">
              Graphs
            </Text>
          </View>

          {/* Controls */}
          <View className="flex-row justify-between w-full mt-10 gap-10">
            <SwitchSelector
              options={options}
              initial={0}
              onPress={(value) => setSelectedOption(value)}
              textColor="#000"
              selectedColor="#fff"
              buttonColor={colorScheme === "dark" ? "#461C78" : "#8938E9"}
              hasPadding
              borderRadius={30}
              borderColor="#fff"
              valuePadding={2}
              height={40}
              style={{ flex: 1, marginEnd: 10 }}
              textStyle={{ fontSize: 12, fontWeight: "500" }}
              selectedTextStyle={{ fontSize: 12, fontWeight: "500" }}
            />

            <TouchableOpacity
              onPress={handleOpenModal}
              className="w-[126px] h-[39px] flex-row items-center justify-center bg-white rounded-full gap-2"
            >
              <Text className="text-black font-medium text-[12px]">
                {currentMonthName}, {selectedYear}
              </Text>
              <SVG_ICONS.ButtonArrowDown size={15} />
            </TouchableOpacity>
          </View>
        </View>
      </ReusableRoundedBoxComponent>

      {/* Graph Content */}
      <View className="flex-1 w-full">{content}</View>

      {/* Date Picker Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCancelSelection}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-bgModal-light dark:bg-bgModal-dark rounded-2xl p-8 m-4 w-[90%] shadow-md items-center">
            <Text className="text-lg font-bold mb-4 text-black text-textPrimary-light dark:text-textPrimary-dark">
              Select Month and Year
            </Text>

            <View className="flex-row items-center gap-2 mb-6">
              <Picker
                selectedValue={tempMonthRef.current}
                onValueChange={(val) => {
                  tempMonthRef.current = val;
                  setIsModalVisible(true);
                }} // Force update purely to rerender picker visual
                style={pickerStyles.picker}
              >
                {months.map((m) => (
                  <Picker.Item key={m.value} label={m.label} value={m.value} />
                ))}
              </Picker>

              <Picker
                selectedValue={tempYearRef.current}
                onValueChange={(val) => {
                  tempYearRef.current = val;
                  setIsModalVisible(true);
                }}
                style={pickerStyles.picker}
              >
                {years.map((y) => (
                  <Picker.Item key={y.value} label={y.label} value={y.value} />
                ))}
              </Picker>
            </View>

            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={handleCancelSelection}
                className="bg-gray-300 px-6 py-3 rounded-full"
              >
                <Text className="text-black font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmSelection}
                className="bg-[#8938E9] px-6 py-3 rounded-full"
              >
                <Text className="text-white font-medium">Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const pickerStyles = StyleSheet.create({
  picker: { width: 140, height: 150 },
});
