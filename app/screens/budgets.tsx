import DateTimePicker from "@react-native-community/datetimepicker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { CATEGORIES_EXPENSES_SVG_ICONS } from "@/assets/constants/categories_expenses_icons";
import { CATEGORIES_INCOME_SVG_ICONS } from "@/assets/constants/categories_income_icons";
import { SVG_ICONS } from "@/assets/constants/icons";
import GeneralBudgetsModal from "@/components/GeneralBudgetsModal";
import ProgressBar from "@/components/ProgressBar";
import {
  getBudget as getBudgetDb,
  getDatabaseFilePath,
  initDatabase,
  saveBudget as saveBudgetDb,
} from "@/utils/database";
import SwitchSelector from "react-native-switch-selector";

interface PlannedBudget {
  id: number;
  name: string;
  type: "income" | "expense";
  icon_name: string;
  start_date?: string | null;
  end_date?: string | null;
  initial_amount?: number;
}

interface NewPlannedBudgetModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (data: Omit<PlannedBudget, "id">) => void;
}

// Helper function to format a Date object into 'YYYY-MM-DD' string
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const NewPlannedBudgetModal: React.FC<NewPlannedBudgetModalProps> = ({
  isVisible,
  onClose,
  onSave,
}) => {
  const [budgetName, setBudgetName] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<"income" | "expense">(
    "expense"
  );
  const [isGoalDateEnabled, setIsGoalDateEnabled] = useState(false);

  // New States for Date Range - Use Date objects for picker
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // New States for showing the date picker
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // State to display the formatted date strings in the TextInput
  const [startDateDisplay, setStartDateDisplay] = useState("");
  const [endDateDisplay, setEndDateDisplay] = useState("");

  // Effect to update display strings when Date objects change
  useEffect(() => {
    setStartDateDisplay(startDate ? formatDate(startDate) : "");
    setEndDateDisplay(endDate ? formatDate(endDate) : "");
  }, [startDate, endDate]);

  // Handler for date changes
  const onChangeDate = (
    event: any,
    selectedDate: Date | undefined,
    isStart: boolean
  ) => {
    const currentDate = selectedDate || (isStart ? startDate : endDate);

    // Hide picker immediately for iOS
    if (Platform.OS === "ios") {
      isStart ? setShowStartDatePicker(false) : setShowEndDatePicker(false);
    } else {
      // For Android, hide picker only on 'set' or 'cancel' (event.type)
      if (event.type === "set") {
        isStart ? setShowStartDatePicker(false) : setShowEndDatePicker(false);
      } else if (event.type === "dismissed") {
        isStart ? setShowStartDatePicker(false) : setShowEndDatePicker(false);
        return;
      }
    }

    if (currentDate) {
      if (isStart) {
        // Validate start date is not after end date
        if (endDate && currentDate.getTime() > endDate.getTime()) {
          Alert.alert("Date Error", "Start Date cannot be after End Date.");
          return;
        }
        setStartDate(currentDate);
      } else {
        // Validate end date is not before start date
        if (startDate && currentDate.getTime() < startDate.getTime()) {
          Alert.alert("Date Error", "End Date cannot be before Start Date.");
          return;
        }
        setEndDate(currentDate);
      }
    }
  };

  // Functions to show the pickers
  const showStartDateModal = () => {
    setShowStartDatePicker(true);
  };

  const showEndDateModal = () => {
    setShowEndDatePicker(true);
  };

  const handleSaveNewPlannedBudget = () => {
    if (!budgetName.trim() || !selectedIcon) {
      Alert.alert(
        "Missing Information",
        "Please enter a name and select an icon for the new budget."
      );
      return;
    }

    // Convert amount to number and validate
    const amountValue = parseFloat(initialAmount.trim());
    if (isNaN(amountValue) || amountValue < 0) {
      Alert.alert("Input Error", "Please enter a valid goal amount.");
      return;
    }

    if (isGoalDateEnabled && (!startDate || !endDate)) {
      Alert.alert(
        "Missing Goal Date",
        "Please select both a start and end date, or disable the date range option."
      );
      return;
    }

    // Final validation for date order before saving
    if (
      isGoalDateEnabled &&
      startDate &&
      endDate &&
      startDate.getTime() > endDate.getTime()
    ) {
      Alert.alert("Date Error", "Start Date cannot be after End Date.");
      return;
    }

    const newCategoryData: Omit<PlannedBudget, "id"> = {
      name: budgetName.trim(),
      type: selectedOption,
      icon_name: selectedIcon,
      initial_amount: amountValue,
      // Conditionally add date fields, formatted as strings
      ...(isGoalDateEnabled && {
        start_date: startDate ? formatDate(startDate) : null,
        end_date: endDate ? formatDate(endDate) : null,
      }),
    };

    onSave(newCategoryData);

    // Reset states
    setBudgetName("");
    setInitialAmount("");
    setStartDate(undefined); // Reset Date objects
    setEndDate(undefined); // Reset Date objects
    setIsGoalDateEnabled(false);
    setSelectedIcon(null);
    setSelectedOption("expense");
    onClose();
  };

  const handleSwitchChange = (value: "income" | "expense") => {
    setSelectedOption(value);
    setSelectedIcon(null);
    // Optionally reset date/amount fields when switching flow type
    setInitialAmount("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const options = [
    { label: "Income", value: "income" },
    { label: "Expense", value: "expense" },
  ];

  const IconMap =
    selectedOption === "income"
      ? CATEGORIES_INCOME_SVG_ICONS
      : CATEGORIES_EXPENSES_SVG_ICONS;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-11/12">
          <Text className="text-xl font-bold mb-4">Add new planned budget</Text>

          {/* Cash Flow Switch */}
          <View className="flex-row items-center pb-5">
            <Text>Cash Flow</Text>
            <View className="flex-1 ml-[110]">
              <SwitchSelector
                options={options}
                initial={selectedOption === "income" ? 0 : 1}
                onPress={(value) =>
                  handleSwitchChange(value as "income" | "expense")
                }
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

          {/* Budget Name Input */}
          <View className="w-full flex-row gap-2 items-center mb-6">
            <Text>Budget Name</Text>
            <TextInput
              className="flex-1 h-[40] border-2 border-gray-300 rounded-lg pl-2 p-0 bg-purple-100"
              placeholder="Untitled"
              value={budgetName}
              onChangeText={setBudgetName}
            />
          </View>

          {/* Budget Goal Input */}
          <View className="w-full flex-row gap-2 items-center mb-2">
            <Text>Goal Amount</Text>
            <TextInput
              className="flex-1 h-[40] border-2 border-gray-300 rounded-lg pl-2 p-0 bg-purple-100"
              placeholder="0.00"
              keyboardType="numeric"
              value={initialAmount}
              onChangeText={setInitialAmount}
            />
          </View>

          {/* New: Add Goal Date Checkbox/Switch */}
          <View className="w-full flex-row items-center justify-between mb-4">
            <Text>Add Goal Date Range</Text>
            <Switch
              value={isGoalDateEnabled}
              onValueChange={setIsGoalDateEnabled}
              trackColor={{ false: "#ccc", true: "#8938E9" }}
              thumbColor={isGoalDateEnabled ? "#ffffff" : "#f4f3f4"}
            />
          </View>

          {/* New: Goal Date Range Inputs (Conditional) */}
          {isGoalDateEnabled && (
            <View className="w-full mb-6 mt-2 border-t pt-4 border-gray-200">
              <Text className="mb-2 text-sm font-semibold text-purple-600">
                Goal Period
              </Text>

              {/* Start Date Picker Setup */}
              <View className="flex-row gap-2 items-center mb-3">
                <Text className="w-16">From:</Text>
                <TouchableOpacity
                  className="flex-1 h-[40] border-2 border-gray-300 rounded-lg justify-center bg-purple-100"
                  onPress={showStartDateModal}
                >
                  <Text
                    className="pl-2"
                    style={{ color: startDateDisplay ? "#000" : "#a1a1a1" }}
                  >
                    {startDateDisplay || "YYYY-MM-DD"}
                  </Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, date) => onChangeDate(event, date, true)}
                    minimumDate={new Date()} // Optional: Start date cannot be in the past
                    maximumDate={endDate} // Optional: Cannot set start date after end date
                  />
                )}
              </View>

              {/* End Date Picker Setup */}
              <View className="flex-row gap-2 items-center">
                <Text className="w-16">To:</Text>
                <TouchableOpacity
                  className="flex-1 h-[40] border-2 border-gray-300 rounded-lg justify-center bg-purple-100"
                  onPress={showEndDateModal}
                >
                  <Text
                    className="pl-2"
                    style={{ color: endDateDisplay ? "#000" : "#a1a1a1" }}
                  >
                    {endDateDisplay || "YYYY-MM-DD"}
                  </Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, date) => onChangeDate(event, date, false)}
                    minimumDate={startDate || new Date()} // Optional: End date cannot be before start date
                  />
                )}
              </View>
            </View>
          )}

          {/* Icon Selection */}
          <View className="mb-6">
            <Text className="text-sm mb-2">
              Select Icon ({selectedOption.toUpperCase()})
            </Text>
            {/* ... (Existing Icon Selection ScrollView) ... */}
            <View className="flex-row flex-wrap justify-start gap-4 h-[120px]">
              <ScrollView
                contentContainerStyle={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                {Object.entries(IconMap).map(([key, IconComponent]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setSelectedIcon(key)}
                    className={`p-2 rounded-full border-2 ${
                      selectedIcon === key
                        ? "border-purple-600 bg-purple-100"
                        : "border-gray-300"
                    }`}
                  >
                    <IconComponent
                      width={24}
                      height={24}
                      color={selectedIcon === key ? "#8938E9" : "#000000"}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-end gap-4">
            <TouchableOpacity
              className="w-24 h-10 rounded-lg border-2 border-purple-500 justify-center items-center"
              onPress={onClose}
            >
              <Text className="uppercase text-purple-600">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`w-24 h-10 rounded-lg justify-center items-center ${
                budgetName.trim() && selectedIcon
                  ? "bg-purple-600"
                  : "bg-gray-400"
              }`}
              onPress={handleSaveNewPlannedBudget}
              disabled={!budgetName.trim() || !selectedIcon}
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
  console.log(
    "Database path:",
    FileSystem.documentDirectory + "SQLite/budget_tracker_db.db"
  );

  // State to manage current budget values
  const [currentProgress, setCurrentProgress] = useState(0.25);
  const [dailyBudget, setDailyBudget] = useState("0.00");
  const [weeklyBudget, setWeeklyBudget] = useState("0.00");
  const [monthlyBudget, setMonthlyBudget] = useState("0.00");

  // State to control the visibility of budget modals
  const [isDailyBudgetModalVisible, setDailyBudgetModalVisible] =
    useState(false);
  const [isWeeklyBudgetModalVisible, setWeeklyBudgetModalVisible] =
    useState(false);
  const [isMonthlyBudgetModalVisible, setMonthlyBudgetModalVisible] =
    useState(false);

  // State for the custom alert modal
  const [isAlertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  // General app states
  const [dbInitialized, setDbInitialized] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isNewPlannedBudgetModalVisible, setNewPlannedBudgetVisible] =
    useState(false);

  // --- 2. HELPER FUNCTIONS THAT DO NOT USE HOOKS ---

  // Function to show a custom alert modal
  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertModalVisible(true);
  };

  // Helper function to get a budget value from the database
  const getBudgetValue = (name: string) => {
    try {
      const budget = getBudgetDb(name);
      return budget ? budget.balance : null;
    } catch (error) {
      console.error(`Error getting value for ${name}:`, error);
      throw error;
    }
  };

  // Helper function to save a budget value to the database
  const saveBudgetValue = (name: string, value: string) => {
    try {
      const parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        throw new Error("Invalid budget value.");
      }
      saveBudgetDb(name, parsedValue);
    } catch (error) {
      console.error(`Error saving value for ${name}:`, error);
      throw error;
    }
  };

  // --- 3. CALLBACKS (HOOKS) ---

  // Reusable helper to get and set a budget value to a state hook
  const getAndSetBudgetValue = useCallback(
    (name: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
      try {
        const budget = getBudgetValue(name);
        setter(budget !== null ? budget.toFixed(2) : "0.00");
      } catch (error) {
        console.error(`Error loading ${name}, setting to default.`, error);
        setter("0.00");
      }
    },
    [] // Removed getBudgetValue from dependencies as it's not a state/prop/ref, preventing infinite loop possibility
  );

  // Function to load all budget values from the database
  const loadAllBudgets = useCallback(() => {
    getAndSetBudgetValue("daily_budget", setDailyBudget);
    getAndSetBudgetValue("weekly_budget", setWeeklyBudget);
    getAndSetBudgetValue("monthly_budget", setMonthlyBudget);
  }, [getAndSetBudgetValue]);

  // Function to get the database file path and share it with other apps
  const shareDatabaseFile = useCallback(async () => {
    try {
      const dbPath = await getDatabaseFilePath();
      await Sharing.shareAsync(dbPath, {
        mimeType: "application/octet-stream",
        dialogTitle: "Share your budget database",
      });
    } catch (error) {
      console.error("Failed to share the database file:", error);
      showAlert("Share Error", "Could not share the database file.");
    }
  }, []);

  // --- 4. EFFECTS (HOOKS) ---

  // Effect hook to initialize the database and load initial budgets on app start
  useEffect(() => {
    const initializeAppDatabase = async () => {
      try {
        await initDatabase();
        setDbInitialized(true);
        loadAllBudgets();
        const available = await Sharing.isAvailableAsync();
        setCanShare(available);
      } catch (error) {
        console.error("App-level database initialization failed:", error);
        showAlert(
          "Initialization Error",
          (error as Error).message || "Could not initialize the database."
        );
      } finally {
        setIsLoading(false);
      }
    };
    initializeAppDatabase();
  }, [loadAllBudgets]);

  // --- 5. CONDITIONAL RETURN (TO AVOID HOOK ORDER VIOLATION) ---

  // Display loading indicator while app initializes
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>
          Loading application and budgets...
        </Text>
      </View>
    );
  }

  // --- 6. MAIN RENDER LOGIC ---

  // Generic function to handle saving a budget value for a specific type
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
      console.error(`Error saving ${budgetType} budget:`, error);
      showAlert(
        "Database Error",
        (error as Error).message || `Could not save budget.`
      );
    }
  };

  const toggleNewPlannedBudgetModal = () => {
    setNewPlannedBudgetVisible(!isNewPlannedBudgetModalVisible);
  };

  const handlePlannedBudgetSave = (data: Omit<PlannedBudget, "id">) => {
    console.log("New Planned Budget Data:", data);
    showAlert(
      "Category Added",
      `Category '${data.name}' saved as a new ${data.type} budget!`
    );
    // **TODO:** Implement logic to save the new planned budget to the database
  };

  return (
    <View className="m-8">
      {/* Custom Alert Modal */}
      <GeneralBudgetsModal
        isVisible={isAlertModalVisible}
        onClose={() => setAlertModalVisible(false)}
        title={alertTitle}
      >
        <Text>{alertMessage}</Text>
        <TouchableOpacity
          className="w-full h-[33] rounded-[10] border-2 mt-4 justify-center items-center"
          onPress={() => setAlertModalVisible(false)}
        >
          <Text className="uppercase">OK</Text>
        </TouchableOpacity>
      </GeneralBudgetsModal>
      {/* Modal for Daily Budget */}
      <BudgetEditModalContent
        isVisible={isDailyBudgetModalVisible}
        onClose={() => setDailyBudgetModalVisible(false)}
        title="Set Daily Budget"
        budgetType="daily_budget"
        currentBudget={dailyBudget}
        onSave={handleSaveBudget}
      />

      {/* Modal for Weekly Budget */}
      <BudgetEditModalContent
        isVisible={isWeeklyBudgetModalVisible}
        onClose={() => setWeeklyBudgetModalVisible(false)}
        title="Set Weekly Budget"
        budgetType="weekly_budget"
        currentBudget={weeklyBudget}
        onSave={handleSaveBudget}
      />

      {/* Modal for Monthly Budget */}
      <BudgetEditModalContent
        isVisible={isMonthlyBudgetModalVisible}
        onClose={() => setMonthlyBudgetModalVisible(false)}
        title="Set Monthly Budget"
        budgetType="monthly_budget"
        currentBudget={monthlyBudget}
        onSave={handleSaveBudget}
      />

      <Text className="text-[14px] font-medium">General Budgets</Text>

      {/* Budget Container */}
      <View className="flex-col mt-4 gap-2">
        {/* Daily Budget */}
        <View
          className="w-full h-[70] p-4 bg-white rounded-[10] flex-row justify-between items-center"
          style={styles.shadowStyle}
        >
          <View className="flex-col gap-4">
            <Text>Daily</Text>
            <View className="flex-row gap-2">
              <Text>Budget:</Text>
              <Text className="text-[#8938E9]">₱{dailyBudget}</Text>
            </View>
          </View>

          <TouchableOpacity
            className="w-[60] h-[24] px-2 py-1 border rounded-[10] items-center"
            onPress={() => setDailyBudgetModalVisible(true)}
          >
            <Text className="text-[12px]">Change</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Budget */}
        <View
          className="w-full h-[70] p-4 bg-white rounded-[10] flex-row justify-between items-center"
          style={styles.shadowStyle}
        >
          <View className="flex-col gap-4">
            <Text>Weekly</Text>
            <View className="flex-row gap-2">
              <Text>Budget:</Text>
              <Text className="text-[#8938E9]">₱{weeklyBudget}</Text>
            </View>
          </View>

          <TouchableOpacity
            className="w-[60] h-[24] px-2 py-1 border rounded-[10] items-center"
            onPress={() => setWeeklyBudgetModalVisible(true)}
          >
            <Text className="text-[12px]">Change</Text>
          </TouchableOpacity>
        </View>

        {/* Monthly Budget */}
        <View
          className="w-full h-[70] p-4 bg-white rounded-[10] flex-row justify-between items-center"
          style={styles.shadowStyle}
        >
          <View className="flex-col gap-4">
            <Text>Monthly</Text>
            <View className="flex-row gap-2">
              <Text>Budget:</Text>
              <Text className="text-[#8938E9]">₱{monthlyBudget}</Text>
            </View>
          </View>
          <TouchableOpacity
            className="w-[60] h-[24] px-2 py-1 border rounded-[10] items-center"
            onPress={() => setMonthlyBudgetModalVisible(true)}
          >
            <Text className="text-[12px]">Change</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-11">
        <Text className="text-[14px] font-medium">Planned Budgets</Text>
      </View>

      {/* Planned Budget Container */}
      <View className="flex-row mt-6 gap-8">
        {/* Planned Budget */}
        <View
          className="w-[137] h-[136] p-2 bg-white rounded-[10]"
          style={styles.shadowStyle}
        >
          <View className="flex-row pb-4 justify-between">
            <View className="flex-row gap-2 items-center">
              <View className="w-[16] h-[16] bg-[#FCC21B]"></View>
              <Text>Clothes</Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => console.log("Menu is pressed")}>
                <SVG_ICONS.Ellipsis width={24} height={24} />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-col items-center">
            <Text className="text-[10px] pb-1">Apr. 12 - 15, 2025</Text>
            <ProgressBar progress={currentProgress} />
            <Text className="text-[16px] pt-2">₱600.00</Text>
            <Text className="text-[12px] pt-1">(₱1000.00)</Text>
          </View>
        </View>

        {/* Add Budget Plan */}
        <TouchableOpacity
          className="w-[137] h-[136] p-2 border-[#8938E9] rounded-[10] border justify-center"
          onPress={toggleNewPlannedBudgetModal} // <-- FIXED: Opens the new budget modal
        >
          <View className="flex-col items-center gap-[18]">
            <View className="w-[30] h-[30] rounded-full border border-[#8938E9]"></View>
            <Text className="text-[#8938E9]">Add New Budget</Text>
          </View>
        </TouchableOpacity>
        <NewPlannedBudgetModal
          isVisible={isNewPlannedBudgetModalVisible}
          onClose={toggleNewPlannedBudgetModal}
          onSave={handlePlannedBudgetSave} // <-- FIXED: Passes the handler for saving new data
        />
      </View>
      <View style={{ marginTop: 15 }}>
        <Button
          title="Share Database File"
          onPress={shareDatabaseFile}
          color="#6f42c1"
          disabled={!dbInitialized || !canShare}
        />
      </View>
    </View>
  );
}

// Reusable Modal Component for Budget Editing
const BudgetEditModalContent = ({
  isVisible,
  onClose,
  title,
  budgetType,
  currentBudget,
  onSave,
}: {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  budgetType: string;
  currentBudget: string;
  onSave: (budgetType: string, value: string) => void;
}) => {
  const [inputValue, setInputValue] = useState(
    currentBudget === "0.00" ? "" : currentBudget
  );

  useEffect(() => {
    setInputValue(currentBudget === "0.00" ? "" : currentBudget);
  }, [currentBudget, isVisible]);

  const handleSave = () => {
    if (inputValue.trim() === "") {
      return;
    }
    onSave(budgetType, inputValue);
    onClose();
  };

  return (
    <GeneralBudgetsModal isVisible={isVisible} onClose={onClose} title={title}>
      <View className="flex-row items-center gap-2">
        <Text>Limit</Text>
        <TextInput
          className="flex-1 border-2 rounded-[10] pl-2 h-10" // Added h-10 and pl-2 for better styling
          placeholder="0"
          keyboardType="numeric"
          value={inputValue}
          onChangeText={setInputValue}
          style={{ backgroundColor: "#D4BFED" }}
        />
      </View>
      {/* Cancel and Set Buttons */}
      <View className="flex-row pt-[14] gap-4">
        <TouchableOpacity
          className="w-[74] h-[33] rounded-[10] border-2 border-gray-400 justify-center items-center"
          onPress={onClose}
        >
          <Text className="uppercase text-gray-800">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-[74] h-[33] rounded-[10] border-2 border-purple-600 bg-purple-600 justify-center items-center"
          onPress={handleSave}
        >
          <Text className="uppercase text-white">Set</Text>
        </TouchableOpacity>
      </View>
    </GeneralBudgetsModal>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#343a40",
    textAlign: "center",
  },
  budgetDisplayContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  budgetValueText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007bff",
    textAlign: "center",
    flex: 1,
  },
  budgetSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: "#495057",
    fontWeight: "bold",
  },
  currentBudgetDisplay: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 15,
  },
  note: {
    marginTop: 30,
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#ffc107",
  },
  shadowStyle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
