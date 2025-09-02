import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Assuming ProgressBar is a component you have
import ProgressBar from '@/components/ProgressBar';
// Assuming GeneralBudgetsModal is a component you have that provides the basic modal structure
import GeneralBudgetsModal from '@/components/GeneralBudgetsModal';
// Import the database utility functions
import { getBudget as getBudgetDb, getDatabaseFilePath, initDatabase, saveBudget as saveBudgetDb } from "@/utils/database";

export default function Budgets() {
  console.log('Database path:', FileSystem.documentDirectory + 'SQLite/budget_tracker_db.db');
  const [currentProgress, setCurrentProgress] = useState(0.25);

  // State to manage current budget values
  const [dailyBudget, setDailyBudget] = useState('0.00');
  const [weeklyBudget, setWeeklyBudget] = useState('0.00');
  const [monthlyBudget, setMonthlyBudget] = useState('0.00');

  // State to control the visibility of budget modals
  const [isDailyBudgetModalVisible, setDailyBudgetModalVisible] = useState(false);
  const [isWeeklyBudgetModalVisible, setWeeklyBudgetModalVisible] = useState(false);
  const [isMonthlyBudgetModalVisible, setMonthlyBudgetModalVisible] = useState(false);

  // State for the custom alert modal
  const [isAlertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');

  // General app states
  const [dbInitialized, setDbInitialized] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to show a custom alert modal
  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertModalVisible(true);
  };

  // Helper function to get a budget value from the database
  const getBudgetValue = (name) => {
    try {
      const budget = getBudgetDb(name);
      return budget ? budget.balance : null;
    } catch (error) {
      console.error(`Error getting value for ${name}:`, error);
      throw error;
    }
  };

  // Helper function to save a budget value to the database
  const saveBudgetValue = (name, value) => {
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

  // Reusable helper to get and set a budget value to a state hook
  const getAndSetBudgetValue = useCallback((name, setter) => {
    try {
      const budget = getBudgetValue(name);
      setter(budget !== null ? budget.toFixed(2) : '0.00');
    } catch (error) {
      console.error(`Error loading ${name}, setting to default.`, error);
      setter('0.00');
    }
  }, [getBudgetValue]);

  // Function to load all budget values from the database
  const loadAllBudgets = useCallback(() => {
    getAndSetBudgetValue('daily_budget', setDailyBudget);
    getAndSetBudgetValue('weekly_budget', setWeeklyBudget);
    getAndSetBudgetValue('monthly_budget', setMonthlyBudget);
  }, [getAndSetBudgetValue]);

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
        console.error('App-level database initialization failed:', error);
        showAlert('Initialization Error', error.message || 'Could not initialize the database.');
      } finally {
        setIsLoading(false);
      }
    };
    initializeAppDatabase();
  }, [loadAllBudgets]);

  // Generic function to handle saving a budget value for a specific type
  const handleSaveBudget = async (budgetType, value) => {
    if (!dbInitialized) {
      showAlert('Database Not Ready', 'Please wait while the database initializes.');
      return;
    }
    if (value.trim() === '') {
      showAlert('Input Error', 'Please enter a budget amount.');
      return;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      showAlert('Input Error', 'Please enter a valid numerical amount (e.g., 1000 or 1000.50).');
      return;
    }
    try {
      saveBudgetValue(budgetType, value);
      const formattedBudgetType = budgetType.replace('_budget', '').charAt(0).toUpperCase() + budgetType.replace('_budget', '').slice(1);
      showAlert('Success', `${formattedBudgetType} Budget updated!`);
      loadAllBudgets();
    } catch (error) {
      console.error(`Error saving ${budgetType} budget:`, error);
      showAlert('Database Error', error.message || `Could not save budget.`);
    }
  };

  // Function to get the database file path and share it with other apps
  const shareDatabaseFile = useCallback(async () => {
    try {
      const dbPath = await getDatabaseFilePath();
      await Sharing.shareAsync(dbPath, { mimeType: 'application/octet-stream', dialogTitle: 'Share your budget database' });
    } catch (error) {
      console.error("Failed to share the database file:", error);
      showAlert('Share Error', 'Could not share the database file.');
    }
  }, []);

  // Display loading indicator while app initializes
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading application and budgets...</Text>
      </View>
    );
  }

  return (
    <View className='m-8'>
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

      <Text className='text-[14px] font-medium'>General Budgets</Text>

      {/* Budget Container */}
      <View className='flex-col mt-4 gap-2'>
        {/* Daily Budget */}
        <View className='w-full h-[70] p-4 bg-white rounded-[10] flex-row justify-between items-center'
          style={styles.shadowStyle}>
          <View className='flex-col gap-4'>
            <Text>Daily</Text>
            <View className='flex-row gap-2'>
              <Text>Budget:</Text>
              <Text className='text-[#8938E9]'>₱{dailyBudget}</Text>
            </View>
          </View>

          <TouchableOpacity
            className="w-[60] h-[24] px-2 py-1 border rounded-[10] items-center"
            onPress={() => setDailyBudgetModalVisible(true)}
          >
            <Text className='text-[12px]'>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Budget */}
        <View className='w-full h-[70] p-4 bg-white rounded-[10] flex-row justify-between items-center'
          style={styles.shadowStyle}>
          <View className='flex-col gap-4'>
            <Text>Weekly</Text>
            <View className='flex-row gap-2'>
              <Text>Budget:</Text>
              <Text className='text-[#8938E9]'>₱{weeklyBudget}</Text>
            </View>
          </View>

          <TouchableOpacity
            className="w-[60] h-[24] px-2 py-1 border rounded-[10] items-center"
            onPress={() => setWeeklyBudgetModalVisible(true)}
          >
            <Text className='text-[12px]'>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Monthly Budget */}
        <View className='w-full h-[70] p-4 bg-white rounded-[10] flex-row justify-between items-center'
          style={styles.shadowStyle}>
          <View className='flex-col gap-4'>
            <Text>Monthly</Text>
            <View className='flex-row gap-2'>
              <Text>Budget:</Text>
              <Text className='text-[#8938E9]'>₱{monthlyBudget}</Text>
            </View>
          </View>
          <TouchableOpacity
            className="w-[60] h-[24] px-2 py-1 border rounded-[10] items-center"
            onPress={() => setMonthlyBudgetModalVisible(true)}
          >
            <Text className='text-[12px]'>Change</Text>
          </TouchableOpacity>
        </View>

      </View>

      <View className='mt-11'>
        <Text className='text-[14px] font-medium'>Planned Budgets</Text>
      </View>

      {/* Planned Budget Container */}
      <View className='flex-row mt-6 gap-8'>

        <View className='w-[137] h-[136] p-2 bg-white rounded-[10]'
          style={styles.shadowStyle}>
          <View className='flex-row gap-4 pb-9'>
            <View className='w-[16] h-[16] bg-[#FCC21B]'></View>
            <Text>Clothes</Text>
          </View>

          <View className='flex-col items-center'>
            <ProgressBar progress={currentProgress} />
            <Text className='text-[16px] pt-2'>₱600.00</Text>
            <Text className='text-[12px] pt-1'>(₱1000.00)</Text>
          </View>
        </View>

        {/* Add Budget Plan */}
        <TouchableOpacity
          className='w-[137] h-[136] p-2 border-[#8938E9] rounded-[10] border justify-center'
          onPress={() => console.log('Add New Budget button pressed!')}
        >
          <View className='flex-col items-center gap-[18]'>
            <View className='w-[30] h-[30] rounded-full border border-[#8938E9]'></View>
            <Text className='text-[#8938E9]'>Add New Budget</Text>
          </View>
        </TouchableOpacity>

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
const BudgetEditModalContent = ({ isVisible, onClose, title, budgetType, currentBudget, onSave }) => {
  const [inputValue, setInputValue] = useState(currentBudget === '0.00' ? '' : currentBudget);

  // This effect ensures the input field is updated when the currentBudget prop changes
  useEffect(() => {
    setInputValue(currentBudget === '0.00' ? '' : currentBudget);
  }, [currentBudget, isVisible]); // isVisible is added to trigger on modal open

  const handleSave = () => { // Removed async
    if (inputValue.trim() === '') {
      // Logic for showing a custom alert if needed, instead of a system alert
      // But for simplicity, we'll let the onSave function handle error messages.
      return;
    }
    onSave(budgetType, inputValue); // Removed await
    onClose();
  };

  return (
    <GeneralBudgetsModal
      isVisible={isVisible}
      onClose={onClose}
      title={title}
    >
      <View className='flex-row items-center gap-2'>
        <Text>Limit</Text>
        <TextInput
          className='flex-1 border-2 rounded-[10]'
          placeholder='0'
          keyboardType='numeric'
          value={inputValue}
          onChangeText={setInputValue}
          style={{ backgroundColor: '#D4BFED' }}
        />
      </View>
      {/* Cancel and Set Buttons */}
      <View className='flex-row pt-[14] gap-4'>
        <TouchableOpacity
          className="w-[74] h-[33] rounded-[10] border-2 justify-center items-center"
          onPress={onClose}
        >
          <Text className="uppercase">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-[74] h-[33] rounded-[10] border-2 justify-center items-center"
          onPress={handleSave}
        >
          <Text className="uppercase">Set</Text>
        </TouchableOpacity>
      </View>
    </GeneralBudgetsModal>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
    textAlign: 'center',
  },
  budgetDisplayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  budgetValueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
    textAlign: 'center',
    flex: 1,
  },
  budgetSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#495057',
    fontWeight: 'bold',
  },
  currentBudgetDisplay: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 15,
  },
  note: {
    marginTop: 30,
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ffc107',
  },
  shadowStyle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }
});
