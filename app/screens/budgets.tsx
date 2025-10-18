import DateTimePicker from "@react-native-community/datetimepicker";
import * as Sharing from "expo-sharing";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
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
  getBudget as getBudgetDb,
  getDatabaseFilePath,
  getDb,
  getPlannedBudgets,
  getPlannedBudgetTransactions,
  initDatabase,
  saveBudget as saveBudgetDb,
  savePlannedBudget,
} from "@/utils/database";
import { useFocusEffect } from "@react-navigation/native";
import SwitchSelector from "react-native-switch-selector";

type PlannedBudget = {
  id: number;
  budget_name: string;
  budget_type: "income" | "expense";
  color_name: string;
  start_date?: string | null;
  end_date?: string | null;
  amount?: number;
  is_ongoing?: boolean;
};

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;

const NewPlannedBudgetModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  onSave: (d: Omit<PlannedBudget, "id">) => void;
}> = ({ isVisible, onClose, onSave }) => {
  const [budgetName, setBudgetName] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<"income" | "expense">(
    "expense"
  );
  const [isGoalDateEnabled, setIsGoalDateEnabled] = useState(false);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      // reset when modal closes
      setBudgetName("");
      setInitialAmount("");
      setSelectedColor(null);
      setSelectedOption("expense");
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
    // handle platform differences
    if (Platform.OS !== "ios") {
      if (event.type === "dismissed") {
        isStart ? setShowStartDatePicker(false) : setShowEndDatePicker(false);
        return;
      }
      // on 'set' we let selectedDate through
      isStart ? setShowStartDatePicker(false) : setShowEndDatePicker(false);
    } else {
      // ios - we close after selection as well
      isStart ? setShowStartDatePicker(false) : setShowEndDatePicker(false);
    }

    if (!selectedDate) return;

    if (isStart) {
      if (endDate && selectedDate.getTime() > endDate.getTime()) {
        Alert.alert("Date Error", "Start Date cannot be after End Date.");
        return;
      }
      setStartDate(selectedDate);
    } else {
      if (startDate && selectedDate.getTime() < startDate.getTime()) {
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
        "Please enter a name and select a color."
      );
      return;
    }
    const amount = parseFloat(initialAmount.trim());
    if (isNaN(amount) || amount < 0) {
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
    if (isGoalDateEnabled && startDate && endDate && startDate > endDate) {
      Alert.alert("Date Error", "Start Date cannot be after End Date.");
      return;
    }

    const payload: Omit<PlannedBudget, "id"> = {
      budget_name: budgetName.trim(),
      budget_type: selectedOption,
      color_name: selectedColor,
      amount: amount,
      ...(isGoalDateEnabled && {
        start_date: startDate ? formatDate(startDate) : null,
        end_date: endDate ? formatDate(endDate) : null,
      }),
    };

    onSave(payload);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-11/12">
          <Text className="text-xl font-bold mb-4">Add new planned budget</Text>

          <View className="flex-row items-center pb-5">
            <Text>Cash Flow</Text>
            <View className="flex-1 ml-[110]">
              <SwitchSelector
                options={[
                  { label: "Income", value: "income" },
                  { label: "Expense", value: "expense" },
                ]}
                initial={selectedOption === "income" ? 0 : 1}
                onPress={(v) => {
                  const val = v as "income" | "expense";
                  setSelectedOption(val);
                  setSelectedColor(null);
                  setInitialAmount("");
                  setStartDate(undefined);
                  setEndDate(undefined);
                }}
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

          <View className="w-full flex-row gap-2 items-center mb-6">
            <Text>Budget Name</Text>
            <TextInput
              className="flex-1 h-10 border-2 border-gray-300 rounded-lg pl-2 bg-purple-100"
              placeholder="Untitled"
              value={budgetName}
              onChangeText={setBudgetName}
            />
          </View>

          <View className="w-full flex-row gap-2 items-center mb-2">
            <Text>Goal Amount</Text>
            <TextInput
              className="flex-1 h-10 border-2 border-gray-300 rounded-lg pl-2 bg-purple-100"
              placeholder="0.00"
              keyboardType="numeric"
              value={initialAmount}
              onChangeText={setInitialAmount}
            />
          </View>

          <View className="w-full flex-row items-center justify-between mb-4">
            <Text>Add Goal Date Range</Text>
            <Switch
              value={isGoalDateEnabled}
              onValueChange={setIsGoalDateEnabled}
              trackColor={{ false: "#ccc", true: "#8938E9" }}
              thumbColor={isGoalDateEnabled ? "#ffffff" : "#f4f3f4"}
            />
          </View>

          {isGoalDateEnabled && (
            <View className="w-full mb-6 mt-2 border-t pt-4 border-gray-200">
              <Text className="mb-2 text-sm font-semibold text-purple-600">
                Goal Period
              </Text>

              <View className="flex-row gap-2 items-center mb-3">
                <Text className="w-16">From:</Text>
                <TouchableOpacity
                  className="flex-1 h-10 border-2 border-gray-300 rounded-lg justify-center bg-purple-100"
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
                <Text className="w-16">To:</Text>
                <TouchableOpacity
                  className="flex-1 h-10 border-2 border-gray-300 rounded-lg justify-center bg-purple-100"
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
            <Text className="text-sm mb-2">Select Color</Text>
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
              className="w-24 h-10 rounded-lg border-2 border-purple-500 justify-center items-center"
              onPress={onClose}
            >
              <Text className="uppercase text-purple-600">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`w-24 h-10 rounded-lg justify-center items-center ${
                budgetName.trim() && selectedColor
                  ? "bg-purple-600"
                  : "bg-gray-400"
              }`}
              onPress={handleSave}
              disabled={!budgetName.trim() || !selectedColor}
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
  // Visual / state
  const [currentProgress] = useState(0.25);
  const [dailyBudget, setDailyBudget] = useState("0.00");
  const [weeklyBudget, setWeeklyBudget] = useState("0.00");
  const [monthlyBudget, setMonthlyBudget] = useState("0.00");

  const [isDailyBudgetModalVisible, setDailyBudgetModalVisible] =
    useState(false);
  const [isWeeklyBudgetModalVisible, setWeeklyBudgetModalVisible] =
    useState(false);
  const [isMonthlyBudgetModalVisible, setMonthlyBudgetModalVisible] =
    useState(false);

  const [isAlertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const [dbInitialized, setDbInitialized] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isNewPlannedBudgetModalVisible, setNewPlannedBudgetVisible] =
    useState(false);
  const [plannedBudgets, setPlannedBudgets] = useState<PlannedBudget[]>([]);
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
    getAndSetBudgetValue("weekly_budget", setWeeklyBudget);
    getAndSetBudgetValue("monthly_budget", setMonthlyBudget);
  }, [getAndSetBudgetValue]);

  const loadPlannedBudgets = useCallback(async () => {
    try {
      await initDatabase();
      const budgets = await getPlannedBudgets();
      setPlannedBudgets(budgets);

      const progressData: Record<number, number> = {};
      const spentData: Record<number, number> = {};

      for (const pb of budgets) {
        const transactions = await getPlannedBudgetTransactions(pb.id);

        // ✅ totalSpent is scoped only within this loop
        const totalSpent = transactions.reduce(
          (sum: number, t: any) => sum + (t.amount ?? 0),
          0
        );

        const progress = pb.amount ? totalSpent / pb.amount : 0;

        progressData[pb.id] = progress;
        spentData[pb.id] = totalSpent; // ✅ store it by budget ID
      }

      // ✅ Set both maps after loop finishes
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

  const handlePlannedBudgetSave = async (data: Omit<PlannedBudget, "id">) => {
    try {
      const categoryInsert = getDb().runSync(
        `
        INSERT INTO categories (name, type, color_name)
        VALUES (?, ?, ?)
        ON CONFLICT(name) DO UPDATE SET
          type = excluded.type,
          color_name = excluded.color_name;
      `,
        [data.budget_name, data.budget_type, data.color_name]
      );

      const categoryRow = getDb().getFirstSync(
        "SELECT id FROM categories WHERE name = ?;",
        [data.budget_name]
      ) as { id: number } | undefined;

      if (!categoryRow)
        throw new Error("Failed to fetch category ID after insertion.");

      const categoryId = categoryRow.id;
      const startDate = data.start_date || null;
      const endDate = data.end_date || null;

      savePlannedBudget(categoryId, data.amount ?? 0, startDate, endDate, true);

      // refresh list
      loadPlannedBudgets();
      showAlert(
        "Success",
        `Category '${data.budget_name}' saved as a new ${data.budget_type} budget!`
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
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#007bff" />
        <Text className="mt-2 text-yellow-400">
          Loading application and budgets...
        </Text>
      </View>
    );
  }

  return (
    <View className="m-8">
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
        onSave={handleSaveBudget}
      />

      <BudgetEditModal
        isVisible={isWeeklyBudgetModalVisible}
        onClose={() => setWeeklyBudgetModalVisible(false)}
        title="Set Weekly Budget"
        budgetType="weekly_budget"
        currentBudget={weeklyBudget}
        onSave={handleSaveBudget}
      />

      <BudgetEditModal
        isVisible={isMonthlyBudgetModalVisible}
        onClose={() => setMonthlyBudgetModalVisible(false)}
        title="Set Monthly Budget"
        budgetType="monthly_budget"
        currentBudget={monthlyBudget}
        onSave={handleSaveBudget}
      />

      {/* ✅ General Budgets Section */}
      <Text className="text-sm font-medium">General Budgets</Text>

      <View className="mt-4 space-y-2 gap-4">
        {[
          {
            label: "Daily",
            value: dailyBudget,
            onPress: () => setDailyBudgetModalVisible(true),
          },
          {
            label: "Weekly",
            value: weeklyBudget,
            onPress: () => setWeeklyBudgetModalVisible(true),
          },
          {
            label: "Monthly",
            value: monthlyBudget,
            onPress: () => setMonthlyBudgetModalVisible(true),
          },
        ].map((b) => (
          <View
            key={b.label}
            className="w-full h-18 p-4 bg-white rounded-lg flex-row justify-between items-center shadow-md"
          >
            <View>
              <Text>{b.label}</Text>
              <View className="flex-row gap-2">
                <Text>Budget:</Text>
                <Text className="text-purple-600">₱{b.value}</Text>
              </View>
            </View>
            <TouchableOpacity
              className="w-16 h-6 px-2 py-1 border rounded-md items-center justify-center"
              onPress={b.onPress}
            >
              <Text className="text-xs">Change</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* ✅ Planned Budgets Section */}
      <View className="mt-11">
        <Text className="text-sm font-medium">Planned Budgets</Text>
      </View>

      {/* ✅ Only this part scrolls horizontally */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 10,
          gap: 16,
          paddingRight: 20,
        }}
      >
        {plannedBudgets.map((pb) => {
          const totalSpent = spentMap[pb.id] || 0;
          const currentProgress = progressMap[pb.id] || 0;

          return (
            <View
              key={pb.id}
              className="w-[137px] h-[136px] p-2 bg-white rounded-lg shadow-md"
            >
              <View className="flex-row pb-4 justify-between">
                <View className="flex-row gap-2 items-center">
                  <View
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: pb.color_name || "#ccc" }}
                  />
                  <Text>{pb.budget_name}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => console.log("Menu pressed", pb.id)}
                >
                  <SVG_ICONS.Ellipsis width={24} height={24} />
                </TouchableOpacity>
              </View>

              <View className="items-center">
                <Text className="text-xs pb-1">
                  {pb.start_date && pb.end_date
                    ? `${pb.start_date} - ${pb.end_date}`
                    : "Ongoing"}
                </Text>

                <ProgressBar progress={currentProgress} />

                <Text className="text-lg pt-1">₱{totalSpent.toFixed(2)}</Text>
                <Text className="text-">(₱{(pb.amount ?? 0).toFixed(2)})</Text>
              </View>
            </View>
          );
        })}

        {/* ✅ “Add New Budget” button included in scroll */}
        <TouchableOpacity
          className="w-[137px] h-[136px] p-2 border border-purple-600 rounded-lg justify-center items-center"
          onPress={() => setNewPlannedBudgetVisible(true)}
        >
          <View className="items-center gap-4">
            <View className="w-8 h-8 rounded-full border border-purple-600" />
            <Text className="text-purple-600">Add New Budget</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* ✅ Modal and Share Button (not scrollable) */}
      <NewPlannedBudgetModal
        isVisible={isNewPlannedBudgetModalVisible}
        onClose={() => setNewPlannedBudgetVisible(false)}
        onSave={handlePlannedBudgetSave}
      />

      <View className="mt-4">
        <Button
          title="Share Database File"
          color="#6f42c1"
          onPress={shareDatabaseFile}
          disabled={!dbInitialized || !canShare}
        />
      </View>
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
  onSave: (budgetType: string, value: string) => void;
}> = ({ isVisible, onClose, title, budgetType, currentBudget, onSave }) => {
  const [inputValue, setInputValue] = useState(
    currentBudget === "0.00" ? "" : currentBudget
  );

  useEffect(() => {
    setInputValue(currentBudget === "0.00" ? "" : currentBudget);
  }, [currentBudget, isVisible]);

  const handleSave = () => {
    if (inputValue.trim() === "") return;
    onSave(budgetType, inputValue);
    onClose();
  };

  return (
    <GeneralBudgetsModal isVisible={isVisible} onClose={onClose} title={title}>
      <View className="flex-row items-center gap-2">
        <Text>Limit</Text>
        <TextInput
          className="flex-1 border-2 rounded-md pl-2 h-10"
          placeholder="0"
          keyboardType="numeric"
          value={inputValue}
          onChangeText={setInputValue}
          style={{ backgroundColor: "#D4BFED" }}
        />
      </View>

      <View className="flex-row pt-4 gap-4">
        <TouchableOpacity
          className="w-20 h-8 rounded-md border border-gray-400 justify-center items-center"
          onPress={onClose}
        >
          <Text className="uppercase text-gray-800">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-20 h-8 rounded-md border border-purple-600 bg-purple-600 justify-center items-center"
          onPress={handleSave}
        >
          <Text className="uppercase text-white">Set</Text>
        </TouchableOpacity>
      </View>
    </GeneralBudgetsModal>
  );
};
