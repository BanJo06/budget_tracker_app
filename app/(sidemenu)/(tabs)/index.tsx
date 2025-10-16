import { getPlannedBudgets, initDatabase } from "@/utils/database";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SVG_ICONS } from "../../../assets/constants/icons";
import ProgressBar from "../../../components/ProgressBar";
import ProgressRing from "../../../components/ProgressRing";
import ReusableRoundedBoxComponent from "../../../components/RoundedBoxComponent";
import type { TabHomeScreenNavigationProp } from "../../../types";

export default function Index() {
  const navigation = useNavigation<TabHomeScreenNavigationProp>();
  const router = useRouter();

  const [plannedBudgets, setPlannedBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(0.25);

  const loadPlannedBudgets = useCallback(async () => {
    try {
      setLoading(true);
      await initDatabase();
      const budgets = await getPlannedBudgets();
      console.log("📊 Planned Budgets fetched from DB:", budgets);
      setPlannedBudgets(budgets);
    } catch (error) {
      console.error("❌ Error loading planned budgets:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlannedBudgets();
  }, [loadPlannedBudgets]);

  useFocusEffect(
    useCallback(() => {
      loadPlannedBudgets();
    }, [loadPlannedBudgets])
  );

  const getProgress = (budget) => 0.6; // Example progress

  // === Render each planned budget card ===
  const renderBudgetCard = ({ item: budget }) => {
    const progress = getProgress(budget);
    return (
      <View
        className="w-[280] h-[140] bg-white rounded-[20]"
        style={{
          elevation: 5,
          marginRight: 16, // ✅ spacing between cards
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
      >
        {/* === Header === */}
        <View className="w-full h-[40] rounded-t-[20] overflow-hidden">
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: budget.color_name || "#8938E9",
              opacity: 0.4,
            }}
          />
          <View className="flex-row gap-[12] items-center h-full px-[16]">
            <View
              className="w-[16] h-[16] rounded-[4]"
              style={{
                backgroundColor: budget.color_name || "#FCC21B",
              }}
            />
            <Text className="text-[14px] text-[#392F46]">
              {budget.budget_name || "Unnamed Budget"}
            </Text>
          </View>
        </View>

        {/* === Progress & Info === */}
        <View className="py-[16] px-[20]">
          <ProgressBar progress={progress} />
          <View className="mt-[8]">
            <Text className="text-[14px]">
              Spent ₱{(budget.amount * progress).toFixed(0)} from{" "}
              <Text className="text-[14px] text-[#8938E9]">
                ₱{budget.amount.toFixed(0)}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="items-center">
      {/* === Header === */}
      <ReusableRoundedBoxComponent>
        <View className="flex-col px-[32] pt-[8]">
          <View className="flex-row items-center gap-[4] pb-[16]">
            <View className="w-[25] h-[25] bg-white" />
            <Text className="font-medium text-white">Budget Tracker</Text>
          </View>

          <View className="flex-row items-center justify-center">
            <TouchableOpacity
              className="w-[30px] h-[30px] rounded-full flex-row absolute left-0 active:bg-[#F0E4FF]"
              onPress={() => navigation.openDrawer()}
            >
              <SVG_ICONS.SideMenu width={30} height={30} />
            </TouchableOpacity>
            <Text className="text-[16px] font-medium text-white">
              Dashboard
            </Text>
          </View>
        </View>
      </ReusableRoundedBoxComponent>

      {/* === Overview === */}
      <View
        className="w-[330] h-[220] -mt-[46] p-[20] bg-white rounded-[20]"
        style={{ elevation: 5 }}
      >
        <View className="pb-[20] flex-row justify-between">
          <Text className="text-[12px] font-medium self-center">Overview</Text>

          <View className="flex-row justify-between gap-x-2">
            <SVG_ICONS.ArrowLeft width={24} height={24} />
            <Text className="text-[12px] font-medium self-center">
              This Week
            </Text>
            <SVG_ICONS.ArrowRight width={24} height={24} />
          </View>
        </View>

        <View className="flex-row justify-between">
          <ProgressRing
            progress={currentProgress}
            radius={70}
            strokeWidth={15}
            progressColor="#8938E9"
            backgroundColor="#EDE1FB"
            duration={500}
            showPercentage={true}
          />

          <View className="flex-col items-end justify-end pr-[10] pb-[6]">
            <View className="flex-row mb-[4] px-[8] py-[4] gap-[4] bg-[#EDE1FB] rounded-[16]">
              <SVG_ICONS.Insight width={16} height={16} />
              <Text className="text-[12px] text-[#8938E9]">Insight</Text>
            </View>
            <Text className="text-[8px] text-[#392F46] opacity-65">
              You spent 5% more
            </Text>
            <Text className="text-[8px] text-[#392F46] opacity-65">
              than last week
            </Text>
          </View>
        </View>
      </View>

      {/* === Expense & Income === */}
      <View
        className="w-[330] h-[80] my-[16] p-[16] bg-white rounded-[20]"
        style={{ elevation: 5 }}
      >
        <View className="flex-row">
          <View className="w-[48] h-[48] bg-[#8938E9] rounded-[16]" />
          <View className="pl-[20] gap-[6] self-center">
            <Text className="text-[12px] text-[#392F46] opacity-65">
              Spent this week:
            </Text>
            <Text className="text-[16px] font-medium">₱800.00</Text>
          </View>
          <View className="flex-1 self-center items-end">
            <SVG_ICONS.ArrowRight width={24} height={24} />
          </View>
        </View>
      </View>

      <View
        className="w-[330] h-[80] p-[16] bg-white rounded-[20]"
        style={{ elevation: 5 }}
      >
        <View className="flex-row">
          <View className="w-[48] h-[48] bg-[#8938E9] rounded-[16]" />
          <View className="pl-[20] gap-[6] self-center">
            <Text className="text-[12px] text-[#392F46] opacity-65">
              Earned this week:
            </Text>
            <Text className="text-[16px] font-medium">₱1300.00</Text>
          </View>
          <View className="flex-1 self-center items-end">
            <SVG_ICONS.ArrowRight width={24} height={24} />
          </View>
        </View>
      </View>

      {/* === Planned Budgets Section === */}
      <View
        className="w-full mt-[32] mb-[16] pl-[32]"
        style={{ overflow: "visible" }}
      >
        <Text className="font-medium text-[16px] mb-[8]">Planned Budgets</Text>

        {loading ? (
          <Text className="text-gray-500">Loading planned budgets...</Text>
        ) : plannedBudgets.length === 0 ? (
          <Text className="text-gray-500">No planned budgets yet.</Text>
        ) : (
          <View style={{ overflow: "visible" }}>
            <FlatList
              horizontal
              data={plannedBudgets}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{
                paddingRight: 32,
                gap: 16,
                paddingBottom: 16,
              }}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item: budget }) => {
                const progress = getProgress(budget);
                return (
                  <View
                    className="w-[280] h-[140] bg-white rounded-[20]"
                    style={{
                      // ✅ Independent shadow for each card
                      elevation: 6,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.25,
                      shadowRadius: 6,
                      marginBottom: 8,
                    }}
                  >
                    {/* === Header === */}
                    <View className="w-full h-[40] rounded-t-[20] overflow-hidden">
                      <View
                        style={{
                          ...StyleSheet.absoluteFillObject,
                          backgroundColor: budget.color_name || "#8938E9",
                          opacity: 0.4,
                        }}
                      />
                      <View className="flex-row gap-[12] items-center h-full px-[16]">
                        <View
                          className="w-[16] h-[16] rounded-[4]"
                          style={{
                            backgroundColor: budget.color_name || "#FCC21B",
                          }}
                        />
                        <Text className="text-[14px] text-[#392F46]">
                          {budget.budget_name || "Unnamed Budget"}
                        </Text>
                      </View>
                    </View>

                    {/* === Progress & Info === */}
                    <View className="py-[16] px-[20]">
                      <ProgressBar progress={progress} />
                      <View className="mt-[8]">
                        <Text className="text-[14px]">
                          Spent ₱{(budget.amount * progress).toFixed(0)} from{" "}
                          <Text className="text-[14px] text-[#8938E9]">
                            ₱{budget.amount.toFixed(0)}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              }}
              style={{ overflow: "visible" }}
            />
          </View>
        )}
      </View>
    </View>
  );
}
