import { deletePlannedBudget } from "@/utils/database";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Sharing from "expo-sharing";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { COLOR_OPTIONS } from "@/assets/constants/color_selection";
import { SVG_ICONS } from "@/assets/constants/icons";
import GeneralBudgetsModal from "@/components/GeneralBudgetsModal";
import ProgressBar from "@/components/ProgressBar";
import {
  getAllPlannedBudgetTransactions,
  getBudget as getBudgetDb,
  getDatabaseFilePath,
  getDb,
  getPlannedBudgets,
  initDatabase,
  saveBudget as saveBudgetDb,
  savePlannedBudget,
} from "@/utils/database";
import { useFocusEffect } from "@react-navigation/native";
import { useColorScheme } from "nativewind";
import { TouchableWithoutFeedback } from "react-native";

type PlannedBudget = {
  id?: number;
  budget_name: string;
  color_name: string;
  amount?: number;
  start_date?: string | null;
  end_date?: string | null;
  is_ongoing?: boolean;
};

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;

type NewPlannedBudgetModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSave: (d: Omit<PlannedBudget, "id">) => void;
  initialData?: PlannedBudget; // ✅ add this
};

const NewPlannedBudgetModal: React.FC<NewPlannedBudgetModalProps> = ({
  isVisible,
  onClose,
  onSave,
  initialData,
}) => {
  const [budgetName, setBudgetName] = useState(initialData?.budget_name ?? "");
  const [amount, setAmount] = useState(
    initialData?.amount ? String(initialData.amount) : ""
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    initialData?.color_name ?? null
  );
  const [isGoalDateEnabled, setIsGoalDateEnabled] = useState(
    !!initialData?.start_date || !!initialData?.end_date
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.start_date ? new Date(initialData.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData?.end_date ? new Date(initialData.end_date) : undefined
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // ✅ Populate modal state when initialData changes
  useEffect(() => {
    if (initialData) {
      setBudgetName(initialData.budget_name ?? "");
      setAmount(initialData.amount ? String(initialData.amount) : "");
      setSelectedColor(initialData.color_name ?? null);
      setIsGoalDateEnabled(!!initialData.start_date || !!initialData.end_date);
      setStartDate(
        initialData.start_date ? new Date(initialData.start_date) : undefined
      );
      setEndDate(
        initialData.end_date ? new Date(initialData.end_date) : undefined
      );
    }
  }, [initialData]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isVisible) {
      setBudgetName("");
      setAmount("");
      setSelectedColor(null);
      setIsGoalDateEnabled(false);
      setStartDate(undefined);
      setEndDate(undefined);
      setShowStartDatePicker(false);
      setShowEndDatePicker(false);
    }
  }, [isVisible]);

  const onChangeDate = (
    event: any,
    selectedDate: Date | undefined,
    isStart: boolean
  ) => {
    if (Platform.OS !== "ios") {
      if (event.type === "dismissed") {
        isStart ? setShowStartDatePicker(false) : setShowEndDatePicker(false);
        return;
      }
      isStart ? setShowStartDatePicker(false) : setShowEndDatePicker(false);
    }

    if (!selectedDate) return;

    if (isStart) {
      if (endDate && selectedDate > endDate) {
        Alert.alert("Date Error", "Start Date cannot be after End Date.");
        return;
      }
      setStartDate(selectedDate);
    } else {
      if (startDate && selectedDate < startDate) {
        Alert.alert("Date Error", "End Date cannot be before Start Date.");
        return;
      }
      setEndDate(selectedDate);
    }
  };

  const handleSave = () => {
    if (!budgetName.trim() || !selectedColor) {
      Alert.alert(
        "Missing Information",
        "Please enter a name, goal amount and select a color."
      );
      return;
    }

    const parsedAmount = parseFloat(amount.trim());
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      Alert.alert("Input Error", "Please enter a valid goal amount.");
      return;
    }

    if (isGoalDateEnabled && (!startDate || !endDate)) {
      Alert.alert(
        "Missing Goal Date",
        "Please select both start and end dates."
      );
      return;
    }

    const payload: Omit<PlannedBudget, "id"> = {
      budget_name: budgetName.trim(),
      color_name: selectedColor,
      amount: parsedAmount,
      ...(isGoalDateEnabled && {
        start_date: startDate ? formatDate(startDate) : null,
        end_date: endDate ? formatDate(endDate) : null,
      }),
    };

    onSave(payload);
    onClose();
  };

  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-bgModal-light dark:bg-bgModal-dark p-6 rounded-lg w-11/12">
          <Text className="text-xl font-bold mb-4 text-textPrimary-light dark:text-textPrimary-dark">
            Add new planned budget
          </Text>

          <View className="w-full flex-row gap-2 items-center mb-6">
            <Text className="text-textPrimary-light dark:text-textPrimary-dark">
              Budget Name
            </Text>
            <TextInput
              className="flex-1 h-[44] border-2 bg-bgModal-light dark:bg-bgModal-dark border-search-light dark:border-search-dark text-textPrimary-light dark:text-textPrimary-dark rounded-lg pl-2"
              placeholder="Untitled"
              value={budgetName}
              onChangeText={setBudgetName}
            />
          </View>

          <View className="w-full flex-row gap-2 items-center mb-2">
            <Text className="text-textPrimary-light dark:text-textPrimary-dark">
              Goal Amount
            </Text>
            <TextInput
              className="flex-1 h-[44] border-2 rounded-lg pl-2 bg-bgModal-light dark:bg-bgModal-dark border-search-light dark:border-search-dark text-textPrimary-light dark:text-textPrimary-dark"
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <View className="w-full flex-row items-center justify-between mb-4">
            <Text className="text-textPrimary-light dark:text-textPrimary-dark">
              Add Goal Date Range
            </Text>
            <Switch
              value={isGoalDateEnabled}
              onValueChange={setIsGoalDateEnabled}
              trackColor={{ false: "#ccc", true: "#8938E9" }}
              thumbColor={isGoalDateEnabled ? "#ffffff" : "#f4f3f4"}
            />
          </View>

          {isGoalDateEnabled && (
            <View className="w-full mb-6 mt-2 border-t pt-4 border-gray-200">
              <Text className="mb-2 text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark">
                Goal Period
              </Text>

              <View className="flex-row gap-2 items-center mb-3">
                <Text className="w-16 text-textPrimary-light dark:text-textPrimary-dark">
                  From:
                </Text>
                <TouchableOpacity
                  className="flex-1 h-10 border-2 bg-bgModal-light dark:bg-bgModal-dark rounded-lg justify-center border-search-light dark:border-search-dark text-textPrimary-light dark:text-textPrimary-dark"
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text
                    className="pl-2"
                    style={{ color: startDate ? "#000" : "#a1a1a1" }}
                  >
                    {startDate ? formatDate(startDate) : "YYYY-MM-DD"}
                  </Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(e, d) => onChangeDate(e, d, true)}
                    minimumDate={new Date()}
                    maximumDate={endDate}
                  />
                )}
              </View>

              <View className="flex-row gap-2 items-center">
                <Text className="w-16 text-textPrimary-light dark:text-textPrimary-dark">
                  To:
                </Text>
                <TouchableOpacity
                  className="flex-1 h-10 border-2 bg-bgModal-light dark:bg-bgModal-dark rounded-lg justify-center border-search-light dark:border-search-dark text-textPrimary-light dark:text-textPrimary-dark"
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text
                    className="pl-2"
                    style={{ color: endDate ? "#000" : "#a1a1a1" }}
                  >
                    {endDate ? formatDate(endDate) : "YYYY-MM-DD"}
                  </Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(e, d) => onChangeDate(e, d, false)}
                    minimumDate={startDate || new Date()}
                  />
                )}
              </View>
            </View>
          )}

          <View className="mb-6">
            <Text className="text-sm mb-2 text-textPrimary-light dark:text-textPrimary-dark">
              Select Color
            </Text>
            <View className="h-30">
              <ScrollView
                contentContainerStyle={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {COLOR_OPTIONS.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setSelectedColor(c.hex)}
                    className={`p-1 rounded-full m-2 ${
                      selectedColor === c.hex
                        ? "border-2 border-purple-600"
                        : "border-2 border-gray-300"
                    }`}
                  >
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: c.hex,
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View className="flex-row justify-end gap-4">
            <TouchableOpacity
              className="w-24 h-10 rounded-lg border-2 border-borderButton-light dark:border-borderButton-dark justify-center items-center"
              onPress={onClose}
            >
              <Text className="uppercase text-borderButton-light dark:text-borderButton-dark">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={
                "w-24 h-10 rounded-lg justify-center items-center bg-button-light dark:bg-button-dark"
              }
              onPress={handleSave}
              // disabled={!budgetName.trim() || !selectedColor}
            >
              <Text className="uppercase text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function Budgets() {
  const { colorScheme, setColorScheme } = useColorScheme();

  // Visual / state
  const [dailyBudget, setDailyBudget] = useState("0.00");

  const [isDailyBudgetModalVisible, setDailyBudgetModalVisible] =
    useState(false);

  const [isAlertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [dbInitialized, setDbInitialized] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isNewPlannedBudgetModalVisible, setNewPlannedBudgetVisible] =
    useState(false);
  const [plannedBudgets, setPlannedBudgets] = useState<PlannedBudget[]>([]);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const [progressMap, setProgressMap] = useState<Record<number, number>>({});

  const [spentMap, setSpentMap] = useState<Record<number, number>>({});

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertModalVisible(true);
  };

  const getBudgetValue = (name: string) => {
    try {
      const b = getBudgetDb(name);
      return b ? b.balance : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const saveBudgetValue = (name: string, value: string) => {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) throw new Error("Invalid budget value.");
    saveBudgetDb(name, parsed);
  };

  const getAndSetBudgetValue = useCallback(
    (name: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
      try {
        const v = getBudgetValue(name);
        setter(v !== null ? v.toFixed(2) : "0.00");
      } catch {
        setter("0.00");
      }
    },
    []
  );

  const loadAllBudgets = useCallback(() => {
    getAndSetBudgetValue("daily_budget", setDailyBudget);
    // getAndSetBudgetValue("weekly_budget", setWeeklyBudget);
    // getAndSetBudgetValue("monthly_budget", setMonthlyBudget);
  }, [getAndSetBudgetValue]);

  const loadPlannedBudgets = useCallback(async () => {
    try {
      await initDatabase();
      const budgets = await getPlannedBudgets(); // ✅ fetch all planned budgets
      setPlannedBudgets(budgets);

      const progressData: Record<number, number> = {};
      const spentData: Record<number, number> = {};

      for (const pb of budgets) {
        const transactions = await getAllPlannedBudgetTransactions(pb.id);
        const totalSpent = transactions.reduce(
          (sum, t) => sum + (t.amount ?? 0),
          0
        );
        const progress = pb.amount ? totalSpent / pb.amount : 0;

        progressData[pb.id] = progress;
        spentData[pb.id] = totalSpent;
      }

      setProgressMap(progressData);
      setSpentMap(spentData);
    } catch (error) {
      console.error("Error loading planned budgets:", error);
    }
  }, []);

  // ✅ Refresh data every time screen refocuses
  useFocusEffect(
    useCallback(() => {
      loadPlannedBudgets();
    }, [])
  );

  // Initialize DB and load data once
  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        setDbInitialized(true);
        loadAllBudgets();
        loadPlannedBudgets();
        const available = await Sharing.isAvailableAsync();
        setCanShare(available);
      } catch (error) {
        console.error(error);
        showAlert(
          "Initialization Error",
          (error as Error).message || "Could not initialize the database."
        );
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [loadAllBudgets, loadPlannedBudgets]);

  const shareDatabaseFile = useCallback(async () => {
    try {
      const dbPath = await getDatabaseFilePath();
      await Sharing.shareAsync(dbPath, {
        mimeType: "application/octet-stream",
        dialogTitle: "Share your budget database",
      });
    } catch (error) {
      console.error("Failed to share:", error);
      showAlert("Share Error", "Could not share the database file.");
    }
  }, []);

  const handleSaveBudget = async (budgetType: string, value: string) => {
    if (!dbInitialized) {
      showAlert(
        "Database Not Ready",
        "Please wait while the database initializes."
      );
      return;
    }
    if (value.trim() === "") {
      showAlert("Input Error", "Please enter a budget amount.");
      return;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      showAlert(
        "Input Error",
        "Please enter a valid numerical amount (e.g., 1000 or 1000.50)."
      );
      return;
    }
    try {
      saveBudgetValue(budgetType, value);
      const formattedBudgetType =
        budgetType.replace("_budget", "").charAt(0).toUpperCase() +
        budgetType.replace("_budget", "").slice(1);
      showAlert("Success", `${formattedBudgetType} Budget updated!`);
      loadAllBudgets();
    } catch (error) {
      console.error(error);
      showAlert(
        "Database Error",
        (error as Error).message || "Could not save budget."
      );
    }
  };

  const handlePlannedBudgetSave = async (
    data: Omit<PlannedBudget, "id">,
    existingPlannedBudget?: PlannedBudget
  ) => {
    try {
      const startDate = data.start_date || null;
      const endDate = data.end_date || null;

      if (existingPlannedBudget?.id) {
        // Update existing planned budget
        getDb().runSync(
          `
          UPDATE planned_budgets
          SET budget_name = ?, color_name = ?, amount = ?, start_date = ?, end_date = ?, is_ongoing = ?
          WHERE id = ?;
        `,
          [
            data.budget_name,
            data.color_name,
            data.amount ?? 0,
            startDate,
            endDate,
            1,
            existingPlannedBudget.id,
          ]
        );
      } else {
        // Insert new planned budget
        savePlannedBudget(
          data.budget_name,
          data.amount ?? 0,
          data.color_name ?? "#000000", // fallback
          startDate,
          endDate,
          true
        );
      }

      loadPlannedBudgets();
      showAlert(
        "Success",
        existingPlannedBudget
          ? `Planned budget '${data.budget_name}' updated!`
          : `Planned budget '${data.budget_name}' created!`
      );
    } catch (error) {
      console.error("Error saving planned budget:", error);
      showAlert(
        "Database Error",
        (error as Error).message || "Failed to save planned budget."
      );
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-bgPrimary-light dark:bg-bgPrimary-dark">
        <ActivityIndicator size="large" color="#007bff" />
        <Text className="mt-2 text-yellow-400">
          Loading application and budgets...
        </Text>
      </View>
    );
  }

  return (
    <View className="m-8 bg-bgPrimary-light dark:bg-bgPrimary-dark">
      <GeneralBudgetsModal
        isVisible={isAlertModalVisible}
        onClose={() => setAlertModalVisible(false)}
        title={alertTitle}
      >
        <Text>{alertMessage}</Text>
        <TouchableOpacity
          className="w-full h-8 rounded-md border mt-4 justify-center items-center"
          onPress={() => setAlertModalVisible(false)}
        >
          <Text className="uppercase">OK</Text>
        </TouchableOpacity>
      </GeneralBudgetsModal>

      <BudgetEditModal
        isVisible={isDailyBudgetModalVisible}
        onClose={() => setDailyBudgetModalVisible(false)}
        title="Set Daily Budget"
        budgetType="daily_budget"
        currentBudget={dailyBudget}
        onSave={(value) => handleSaveBudget("daily_budget", value)}
      />

      {/* ✅ General Budgets Section */}
      <Text className="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
        General Budgets
      </Text>

      <View className="mt-4 space-y-2 gap-4">
        {[
          {
            label: "Daily",
            value: dailyBudget,
            onPress: () => setDailyBudgetModalVisible(true),
          },
        ].map((b) => (
          <View
            key={b.label}
            className="w-full h-18 p-4 rounded-lg flex-row justify-between items-center shadow-md bg-card-light dark:bg-card-dark"
          >
            <View>
              <Text className="text-textPrimary-light dark:text-textPrimary-dark">
                {b.label}
              </Text>
              <View className="flex-row gap-2">
                <Text className="text-textPrimary-light dark:text-textPrimary-dark">
                  Budget:
                </Text>
                <Text className="text-accent-light dark:text-textPrimary-dark">
                  ₱{b.value}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="w-18 h-8 px-2 py-1 rounded-md items-center justify-center bg-button-light dark:bg-button-dark"
              onPress={b.onPress}
            >
              <Text className="text-textPrimary-light dark:text-textPrimary-dark text-[10px]">
                Change
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* ✅ Planned Budgets Section */}
      <View className="mt-11">
        <Text className="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
          Planned Budgets
        </Text>
      </View>

      <TouchableWithoutFeedback onPress={() => setOpenMenuId(null)}>
        {/* ✅ Only this part scrolls horizontally */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ overflow: "visible" }}
          contentContainerStyle={{
            paddingVertical: 10,
            gap: 16,
            paddingRight: 20,
            overflow: "visible",
          }}
        >
          {plannedBudgets.map((pb) => {
            const totalSpent = spentMap[pb.id] || 0;
            const currentProgress = progressMap[pb.id] || 0;

            return (
              <View
                key={pb.id}
                className="w-[137px] h-[136px] p-2 rounded-lg shadow-md bg-card-light dark:bg-card-dark"
                style={{
                  position: "relative",
                  zIndex: openMenuId === pb.id ? 9999 : 1,
                }}
              >
                <View className="flex-row pb-4 justify-between">
                  <View className="flex-row gap-2 items-center">
                    <View
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: pb.color_name || "#ccc" }}
                    />
                    <Text className="text-textPrimary-light dark:text-textPrimary-dark">
                      {pb.budget_name}
                    </Text>
                  </View>
                  <View className="relative">
                    <TouchableOpacity
                      onPress={() =>
                        setOpenMenuId(openMenuId === pb.id ? null : pb.id)
                      }
                    >
                      <SVG_ICONS.Ellipsis width={24} height={24} />
                    </TouchableOpacity>

                    {openMenuId === pb.id && (
                      <View
                        style={{
                          position: "absolute",
                          top: 28,
                          right: 0,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: "#d1d5db",
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4,
                          elevation: 10,
                          zIndex: 9999,
                          width: 120,
                        }}
                        className="bg-bgModal-light dark:bg-bgModal-dark"
                      >
                        {[
                          {
                            label: "Edit",
                            action: () => {
                              setSelectedBudget(pb); // 🟣 set current budget for editing
                              setNewPlannedBudgetVisible(true); // open same modal
                              setOpenMenuId(null);
                            },
                          },
                          {
                            label: "Delete",
                            action: () => {
                              setOpenMenuId(null);
                              Alert.alert(
                                "Delete Planned Budget",
                                "Are you sure you want to delete this planned budget?",
                                [
                                  { text: "Cancel", style: "cancel" },
                                  {
                                    text: "Delete",
                                    style: "destructive",
                                    onPress: async () => {
                                      try {
                                        deletePlannedBudget(pb.id);
                                        // 🧹 Re-fetch your planned budgets after deleting
                                        loadPlannedBudgets?.(); // optional refresh callback
                                        console.log(
                                          `🗑️ Planned budget ${pb.id} deleted.`
                                        );
                                      } catch (err) {
                                        console.error(
                                          "Error deleting budget:",
                                          err
                                        );
                                        Alert.alert(
                                          "Error",
                                          "Failed to delete planned budget."
                                        );
                                      }
                                    },
                                  },
                                ]
                              );
                            },
                          },
                        ].map((item, idx) => (
                          <TouchableOpacity
                            key={idx}
                            onPress={item.action}
                            style={{
                              paddingVertical: 10,
                              paddingHorizontal: 14,
                              borderBottomWidth: idx === 0 ? 1 : 0,
                              borderBottomColor: "#e5e7eb",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "500",
                              }}
                              className="text-textPrimary-light dark:text-textPrimary-dark"
                            >
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                <View className="items-center">
                  <Text className="text-xs pb-1 text-textPrimary-light dark:text-textPrimary-dark">
                    {pb.start_date && pb.end_date
                      ? `${pb.start_date} - ${pb.end_date}`
                      : "Ongoing"}
                  </Text>

                  <ProgressBar progress={currentProgress} />

                  <Text className="text-lg pt-1 text-textPrimary-light dark:text-textPrimary-dark">
                    ₱{totalSpent.toFixed(2)}
                  </Text>
                  <Text className="text-textPrimary-light dark:text-textPrimary-dark">
                    (₱{(pb.amount ?? 0).toFixed(2)})
                  </Text>
                </View>
              </View>
            );
          })}

          {/* ✅ “Add New Budget” button included in scroll */}
          <TouchableOpacity
            className="w-[137px] h-[136px] p-2 border rounded-lg justify-center items-center border-button-light dark:border-button-dark"
            onPress={() => setNewPlannedBudgetVisible(true)}
          >
            <View className="items-center gap-4">
              <View className="w-8 h-8 rounded-full border border-button-light dark:border-button-dark" />
              <Text className="text-button-light dark:text-button-dark">
                Add New Budget
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* ✅ Modal and Share Button (not scrollable) */}
      <NewPlannedBudgetModal
        isVisible={isNewPlannedBudgetModalVisible}
        onClose={() => {
          setNewPlannedBudgetVisible(false);
          setSelectedBudget(null);
        }}
        onSave={(data) => handlePlannedBudgetSave(data, selectedBudget)}
        initialData={selectedBudget}
      />

      {/* <View className="mt-4">
        <Button
          title="Share Database File"
          color="#6f42c1"
          onPress={shareDatabaseFile}
          disabled={!dbInitialized || !canShare}
        />
      </View> */}
    </View>
  );
}

// Reusable inline component (keeps file single)
const BudgetEditModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  title: string;
  budgetType: string;
  currentBudget: string;
  onSave: (value: string) => void;
}> = ({ isVisible, onClose, title, currentBudget, onSave }) => {
  const [inputValue, setInputValue] = useState(
    currentBudget === "0.00" ? "" : currentBudget
  );

  useEffect(() => {
    setInputValue(currentBudget === "0.00" ? "" : currentBudget);
  }, [currentBudget, isVisible]);

  const handleSave = () => {
    if (inputValue.trim() === "") return;
    onSave(inputValue);
    onClose();
  };

  return (
    <GeneralBudgetsModal isVisible={isVisible} onClose={onClose} title={title}>
      <View className="flex-row items-center gap-2">
        <Text className="text-textPrimary-light dark:text-textPrimary-dark">
          Limit
        </Text>
        <TextInput
          className="flex-1 border-2 border-search-light dark:border-search-dark rounded-md pl-2 h-[44] bg-bgTextbox-light dark:bg-bgTextbox-dark text-textTextbox-light dark:text-textTextbox-dark"
          placeholder="0"
          keyboardType="numeric"
          value={inputValue}
          onChangeText={setInputValue}
        />
      </View>

      <View className="flex-row pt-4 gap-4">
        <TouchableOpacity
          className="w-20 h-8 rounded-md border border-borderButton-light dark:border-borderButton-dark justify-center items-center"
          onPress={onClose}
        >
          <Text className="uppercase text-borderButton-light dark:text-borderButton-dark">
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-20 h-8 rounded-md bg-button-light dark:bg-button-dark justify-center items-center"
          onPress={handleSave}
        >
          <Text className="uppercase text-white">Set</Text>
        </TouchableOpacity>
      </View>
    </GeneralBudgetsModal>
  );
};
