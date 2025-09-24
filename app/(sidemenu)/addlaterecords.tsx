import { SVG_ICONS } from "@/assets/constants/icons";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import SwitchSelector from "react-native-switch-selector";

const handlePress = () => {
  console.log("Button pressed!");
};

const handleClear = () => {
  console.log("Data cleared!");
};

const handleSave = () => {
  console.log("Data saved!");
};

const options = [
  { label: "Income", value: "income" },
  { label: "Expense", value: "expense" },
];

export default function addlaterecords() {
  const [selectedOption, setSelectedOption] = useState<"expense" | "income">(
    "expense"
  );
  const [initialAmount, setInitialAmount] = useState("");

  const handleSwitchChange = (value) => {
    setSelectedOption(value);
  };
  return (
    <View className="flex-1 items-center justify-center bg-[#C3C3C3] p-8">
      <View className="w-full h-[65%] bg-white rounded-[20] p-4">
        <View className="items-center pb-7">
          <Text className="text-[14px] font-medium">Add new transaction</Text>
        </View>
        <View className="flex-row items-center justify-between pb-5">
          <Text>Date</Text>
          <TouchableOpacity
            onPress={handlePress}
            className="w-[126px] h-[39px] flex-row items-center justify-center bg-[orange] px-5 py-3 rounded-full active:bg-[blue] gap-2"
          >
            {/* Text beside the icon */}
            <Text className="text-black text-[12px] font-medium">
              April 25, 2025
            </Text>
            {/* Use your imported SVG icon component here */}
            <SVG_ICONS.ButtonArrowDown size={15} />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-between pb-5">
          <Text>Account Select</Text>
          <TouchableOpacity
            onPress={handlePress}
            className="w-[126px] h-12 flex-row gap-4 justify-center items-center bg-[#8938E9] rounded-full"
          >
            <SVG_ICONS.Account size={16} color="white" />
            <Text className="text-white text-base">Account</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center pb-5">
          <Text>Cash Flow</Text>
          <View className="flex-1 ml-[110]">
            <SwitchSelector
              options={options}
              initial={1}
              onPress={handleSwitchChange}
              backgroundColor={"#F0E4FF"}
              textColor={"#000000"}
              selectedColor={"#ffffff"}
              buttonColor={"#7a44cf"}
              hasPadding={true}
              borderRadius={30}
              borderColor={"#F0E4FF"}
              height={40}
              textStyle={{ fontSize: 12, fontWeight: "500" }}
              selectedTextStyle={{ fontSize: 12, fontWeight: "500" }}
            />
          </View>
        </View>

        <View className="flex-row items-center justify-between pb-5">
          <Text>Category Select</Text>
          <TouchableOpacity
            onPress={handlePress}
            className="w-[126px] h-12 flex-row gap-4 justify-center items-center bg-[#8938E9] rounded-full"
          >
            <SVG_ICONS.Category size={16} color="white" />
            <Text className="text-white text-base">Category</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-col gap-2 justify-between pb-5">
          <Text>Amount</Text>
          <TextInput
            className="h-[40] border-2 border-gray-300 rounded-lg pl-2 p-0 bg-purple-100"
            placeholder="0"
            keyboardType="numeric"
            value={initialAmount}
            onChangeText={setInitialAmount}
          />
        </View>

        <View className="flex-row justify-end gap-4">
          <TouchableOpacity
            className="w-24 h-10 rounded-lg border-2 border-purple-500 justify-center items-center"
            onPress={handleClear}
          >
            <Text className="uppercase text-purple-600">Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-24 h-10 rounded-lg bg-purple-600 justify-center items-center"
            onPress={handleSave}
          >
            <Text className="uppercase text-white">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
