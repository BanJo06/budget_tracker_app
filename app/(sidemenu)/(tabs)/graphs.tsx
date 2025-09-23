import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import SwitchSelector from "react-native-switch-selector";
import { SVG_ICONS } from "../../../assets/constants/icons";
import ReusableRoundedBoxComponent from "../../../components/RoundedBoxComponent";

import ExpenseContent from "../../screens/expense";
import IncomeContent from "../../screens/income";

export default function Graphs() {
  // State to hold the currently selected value ('expense' or 'income')
  const [selectedOption, setSelectedOption] = useState("expense");

  // Options for the SwitchSelector
  const options = [
    { label: "Expense", value: "expense" },
    { label: "Income", value: "income" },
  ];

  const handlePress = () => {
    console.log("Button pressed!");
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "expense":
        return <ExpenseContent />;
      case "income":
        return <IncomeContent />;
      default:
        return <ExpenseContent />;
    }
  };

  const [currentProgress, setCurrentProgress] = useState(0.25); // State to manage progress

  // Example: Parent manages the state, perhaps based on an external event or data
  const [currentDisplayMode, setCurrentDisplayMode] = useState(0); // 0 for Expense, 1 for Income

  return (
    <View className="items-center flex-1">
      <ReusableRoundedBoxComponent style={{ marginHorizontal: 20 }}>
        <View className="flex-col pt-[8] px-8">
          <View className="flex-row items-center gap-[4] pb-[16]">
            <View className="w-[25] h-[25] bg-white"></View>
            <Text className="font-medium text-white">Budget Tracker</Text>
          </View>

          <View className="flex-row items-center justify-center">
            <SVG_ICONS.SideMenu
              width={30}
              height={30}
              style={{ position: "absolute", left: 0 }}
            />
            <Text className="text-[16px] font-medium text-white">Graphs</Text>
          </View>

          {/* Container for the SwitchSelector and the Date/Month Selector Button */}
          <View className="flex-row justify-between w-full mt-10 gap-10">
            <SwitchSelector
              options={options}
              initial={0} // Index of the initially selected option (0 for Expense)
              onPress={(value) => setSelectedOption(value)} // Callback when an option is pressed
              textColor={"#000000"} // Color for the unselected text
              selectedColor={"#ffffff"} // Color for the selected text
              buttonColor={"#7a44cf"} // Color for the selected button background
              hasPadding={true}
              borderRadius={30}
              borderColor={"#ffffff"}
              valuePadding={2}
              height={40}
              width={168} // This is key!
              // Removed fixed width here to allow flexbox to manage layout (This comment is misleading if width is present)
              style={{ flex: 1, marginEnd: 10 }} // Use flex:1 to take available space, add margin to separate from button
              // --- Styles for medium font weight ---
              textStyle={{ fontSize: 12, fontWeight: "500" }} // Style for unselected text (medium font weight)
              selectedTextStyle={{ fontSize: 12, fontWeight: "500" }} // Style for selected text (medium font weight)
            />

            <TouchableOpacity
              onPress={handlePress}
              className="w-[126px] h-[39px] flex-row items-center justify-center bg-white px-5 py-3 rounded-full active:bg-[#F0E4FF] gap-2"
            >
              {/* Text beside the icon */}
              <Text className="text-black text-[12px] font-medium">
                April, 2025
              </Text>
              {/* Use your imported SVG icon component here */}
              {/* Ensure SVG_ICONS.ButtonArrowDown is correctly defined and imported */}
              <SVG_ICONS.ButtonArrowDown size={15} />
            </TouchableOpacity>
          </View>
        </View>
      </ReusableRoundedBoxComponent>
      {/* Wrap renderContent in a View with flex: 1 to ensure it takes up remaining space */}
      <View style={{ flex: 1 }}>{renderContent()}</View>
    </View>
  );
}
