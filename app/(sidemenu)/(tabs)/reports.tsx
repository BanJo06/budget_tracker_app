import { SVG_ICONS } from "@/assets/constants/icons";
import { TabHomeScreenNavigationProp } from "@/types";
import { useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import SwitchSelector from "react-native-switch-selector";
import ReusableRoundedBoxComponent from "../../../components/RoundedBoxComponent";

import AccountsContent from "../../screens/accounts";
import BudgetsContent from "../../screens/budgets";
import RecordsContent from "../../screens/records";

export default function Reports() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [selectedReportTab, setSelectedReportTab] = useState<
    "records" | "budgets" | "accounts"
  >("records");
  const navigation = useNavigation<TabHomeScreenNavigationProp>();

  const options = [
    { label: "Records", value: "records" },
    { label: "Budgets", value: "budgets" },
    { label: "Accounts", value: "accounts" },
  ];

  const renderContent = () => {
    switch (selectedReportTab) {
      case "records":
        return <RecordsContent />;
      case "budgets":
        return <BudgetsContent />;
      case "accounts":
        return <AccountsContent />;
      default:
        return <RecordsContent />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#FFFFFF" }}>
      <ReusableRoundedBoxComponent>
        <View className="flex-col px-[32] pt-[8]">
          <View className="flex-row items-center gap-[4] pb-[16]">
            <Text className="font-medium text-white">PeraPal</Text>
          </View>

          <View className="flex-row items-center justify-center">
            <TouchableOpacity
              className="w-[30px] h-[30px] rounded-full flex-row absolute left-0 active:bg-[#F0E4FF]"
              onPress={() => navigation.openDrawer()}
            >
              <SVG_ICONS.SideMenu width={30} height={30} />
            </TouchableOpacity>
            <Text className="text-[16px] font-medium text-white">Reports</Text>
          </View>

          <View className="flex-row justify-center w-full mt-10 gap-10">
            <SwitchSelector
              options={options}
              initial={0}
              onPress={(value) => setSelectedReportTab(value)}
              textColor={"#000000"}
              selectedColor={colorScheme === "dark" ? "#fff" : "#fff"}
              buttonColor={colorScheme === "dark" ? "#461C78" : "#8938E9"}
              hasPadding={true}
              borderRadius={30}
              borderColor={"#ffffff"}
              valuePadding={2}
              height={40}
              width={168}
              style={{ flex: 1 }}
              textStyle={{ fontSize: 12, fontWeight: "500" }}
              selectedTextStyle={{ fontSize: 12, fontWeight: "500" }}
            />
          </View>
        </View>
      </ReusableRoundedBoxComponent>
      {/* Wrap renderContent in a View with flex: 1 to ensure it takes up remaining space */}
      <View style={{ flex: 1 }}>{renderContent()}</View>
    </View>
  );
}
