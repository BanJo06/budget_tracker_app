import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import SwitchSelector from "react-native-switch-selector";
import { SVG_ICONS } from "../../../assets/constants/icons";
import ReusableRoundedBoxComponent from "../../../components/RoundedBoxComponent";

import ExpenseContent from "../../screens/expense";
import IncomeContent from "../../screens/income";

export default function Graphs() {
  // State to hold the currently selected value ('expense' or 'income')
  const [selectedOption, setSelectedOption] = useState("expense");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Options for the SwitchSelector
  const options = [
    { label: "Expense", value: "expense" },
    { label: "Income", value: "income" },
  ];

  // Month & Year helper arrays
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

  const currentMonthName = months.find((m) => m.value === selectedMonth)?.label;

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push({ label: String(i), value: i });
  }

  // Render content based on selected switch
  const renderContent = () => {
    if (selectedOption === "expense")
      return <ExpenseContent month={selectedMonth} year={selectedYear} />;
    if (selectedOption === "income")
      return <IncomeContent month={selectedMonth} year={selectedYear} />;
    return null;
  };

  return (
    <View className="flex-1 items-center bg-gray-50">
      {/* Top Box */}
      <ReusableRoundedBoxComponent style={{ marginHorizontal: 20 }}>
        <View className="flex-col pt-2 px-2">
          {/* Header */}
          <View className="flex-row items-center gap-2 pb-4">
            <View className="w-6 h-6 bg-white rounded-full"></View>
            <Text className="font-medium text-white text-lg">
              Budget Tracker
            </Text>
          </View>

          {/* Title */}
          <View className="flex-row justify-center items-center">
            <SVG_ICONS.SideMenu
              width={30}
              height={30}
              className="absolute left-0"
            />
            <Text className="text-white font-medium text-[16px]">Graphs</Text>
          </View>

          {/* Switch + Date Picker */}
          <View className="flex-row justify-between mt-6 gap-4 w-full">
            <SwitchSelector
              options={options}
              initial={0}
              onPress={(value) => setSelectedOption(value)}
              textColor="#000"
              selectedColor="#fff"
              buttonColor="#7a44cf"
              hasPadding
              borderRadius={30}
              borderColor="#fff"
              valuePadding={2}
              height={40}
              width={168}
              style={{ flex: 1, marginEnd: 10 }}
              textStyle={{ fontSize: 12, fontWeight: "500" }}
              selectedTextStyle={{ fontSize: 12, fontWeight: "500" }}
            />

            {/* Date Picker Button */}
            <TouchableOpacity
              onPress={() => setIsModalVisible(true)}
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

      {/* Render Graph Content */}
      <View className="flex-1 w-full">{renderContent()}</View>

      {/* Month/Year Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-8 m-4 w-[90%] shadow-md items-center">
            <Text className="text-lg font-bold mb-4">
              Select Month and Year
            </Text>

            <View className="flex-row items-center gap-2">
              {/* Month Picker */}
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(value) => setSelectedMonth(value)}
                style={{ width: 150, height: 150 }} // Important: native style
              >
                {months.map((m) => (
                  <Picker.Item key={m.value} label={m.label} value={m.value} />
                ))}
              </Picker>

              {/* Year Picker */}
              <Picker
                selectedValue={selectedYear}
                onValueChange={(value) => setSelectedYear(value)}
                style={{ width: 150, height: 150 }} // Important: native style
              >
                {years.map((y) => (
                  <Picker.Item key={y.value} label={y.label} value={y.value} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              className="mt-4 bg-blue-500 px-5 py-2 rounded-xl"
            >
              <Text className="text-white font-bold text-center">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
