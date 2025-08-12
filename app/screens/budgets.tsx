import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Assuming ProgressBar is a component you have
import ProgressBar from '@/components/ProgressBar';
// Assuming GeneralBudgetsModal is a component you have that provides the basic modal structure
import GeneralBudgetsModal from '../../components/GeneralBudgetsModal';
// Import the database utility functions
import { getBudgetValue, getDatabaseFilePath, initDatabase, saveBudgetValue } from '../../utils/database';

export default function Budgets() {
  // Updated console log to reflect the new database name
  console.log('Database path:', FileSystem.documentDirectory + 'SQLite/budget_tracker_db.db');
  const [currentProgress, setCurrentProgress] = useState(0.25);

  // States for displaying current saved budgets
  const [dailyBudget, setDailyBudget] = useState('0.00');
  const [weeklyBudget, setWeeklyBudget] = useState('0.00');
  const [monthlyBudget, setMonthlyBudget] = useState('0.00');

  // States for modal visibility
  const [isDailyBudgetModalVisible, setDailyBudgetModalVisible] = useState(false);
  const [isWeeklyBudgetModalVisible, setWeeklyBudgetModalVisible] = useState(false);
  const [isMonthlyBudgetModalVisible, setMonthlyBudgetModalVisible] = useState(false);

  // General app states
  const [dbInitialized, setDbInitialized] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to load all budget values from the database
  const loadAllBudgets = useCallback(async () => {
    try {
      const daily = await getBudgetValue('daily_budget');
      const weekly = await getBudgetValue('weekly_budget');
      const monthly = await getBudgetValue('monthly_budget');

      setDailyBudget(daily || '0.00');
      setWeeklyBudget(weekly || '0.00');
      setMonthlyBudget(monthly || '0.00');
    } catch (error) {
      console.error('Error loading budgets from DB:', error);
      Alert.alert('Load Error', error.message || 'Could not load budgets.');
    }
  }, []);

  // useEffect to initialize the database and load initial budgets
  useEffect(() => {
    const initializeAppDatabase = async () => {
      try {
        await initDatabase();
        setDbInitialized(true);
        await loadAllBudgets();

        const available = await Sharing.isAvailableAsync();
        setCanShare(available);

      } catch (error) {
        console.error('App-level database initialization failed:', error);
        Alert.alert('Initialization Error', error.message || 'Could not initialize the database.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAppDatabase();
  }, [loadAllBudgets]);

  // Generic function to handle saving/updating a budget value for a specific type
  const handleSaveBudget = async (budgetType, value) => {
    if (!dbInitialized) {
      Alert.alert('Database Not Ready', 'Please wait while the database initializes.');
      return;
    }
    if (value.trim() === '') {
      Alert.alert('Input Error', 'Please enter a budget amount.');
      return;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      Alert.alert('Input Error', 'Please enter a valid numerical amount (e.g., 1000 or 1000.50).');
      return;
    }

    try {
      await saveBudgetValue(budgetType, value);
      Alert.alert('Success', `${budgetType.replace('_budget', '').charAt(0).toUpperCase() + budgetType.replace('_budget', '').slice(1)} Budget updated!`);
      await loadAllBudgets();
    } catch (error) {
      console.error(`Error saving ${budgetType} budget:`, error);
      Alert.alert('Database Error', error.message || `Could not save ${budgetType.replace('_budget', '').charAt(0).toUpperCase() + budgetType.replace('_budget', '').slice(1)} Budget.`);
    }
  };

  // Function to share the database file
  const shareDatabaseFile = async () => {
    if (!dbInitialized) {
      Alert.alert('Database Not Ready', 'Please wait while the database initializes.');
      return;
    }
    if (!canShare) {
      Alert.alert('Sharing Not Available', 'File sharing is not supported on this device or platform.');
      return;
    }

    try {
      const dbUri = getDatabaseFilePath();
      console.log("Attempting to share database from URI:", dbUri);

      const fileInfo = await FileSystem.getInfoAsync(dbUri);
      if (!fileInfo.exists) {
        Alert.alert('File Not Found', 'The database file does not exist yet. Please save some data first to create it.');
        return;
      }

      await Sharing.shareAsync(dbUri, {
        mimeType: 'application/x-sqlite3',
        dialogTitle: 'Share budget_tracker_db.db', // Updated dialog title
        UTI: 'public.database',
      });
      console.log('Database file shared successfully.');
    } catch (error) {
      console.error('Error sharing database file:', error);
      Alert.alert('Sharing Error', 'Could not share the database file. ' + error.message);
    }
  };

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
        <View className='w-[137] h-[136] p-2 border-[#8938E9] rounded-[10] border justify-center'>
          <View className='flex-col items-center gap-[18]'>
            <View className='w-[30] h-[30] rounded-full border border-[#8938E9]'></View>
            <Text className='text-[#8938E9]'>Add New Budget</Text>
          </View>
        </View>

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

  useEffect(() => {
    setInputValue(currentBudget === '0.00' ? '' : currentBudget);
  }, [currentBudget]);

  const handleSave = async () => {
    if (inputValue.trim() === '') {
      Alert.alert('Input Error', 'Please enter a budget amount.');
      return;
    }
    await onSave(budgetType, inputValue);
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
