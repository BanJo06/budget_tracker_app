import ProgressBar from '@/components/ProgressBar';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import GeneralBudgetsModal from '../../components/GeneralBudgetsModal';
import { getDatabaseFilePath, initDatabase, saveAmountToDb } from '../../utils/database';


export default function Budgets() {
  console.log('Database path:', FileSystem.documentDirectory + 'SQLite/general_budgets_db.db');
  // setVisible Modals for Change Button
  const [isDailyBudgetModalVisible, setDailyBudgetModalVisible] = useState(false);

  const toggleDailyBudgetModal = () => {
    setDailyBudgetModalVisible(!isDailyBudgetModalVisible);
  }

  const [amount, setAmount] = useState('');
  const [dbInitialized, setDbInitialized] = useState(false);
    // For Database for sharing
  const [canShare, setCanShare] = useState(false);

  // useEffect to initialize database and check sharing availability
  useEffect(() => {
    const initializeAppDatabase = async () => {
      try {
        await initDatabase();
        setDbInitialized(true);

        // Check if sharing is available on this device
        const available = await Sharing.isAvailableAsync();
        setCanShare(available);

      } catch (error) {
        console.error('App-level database initialization failed:', error);
        Alert.alert('Initialization Error', error.message || 'Could not initialize the database.');
      }
    };

    initializeAppDatabase();
  }, []);

  // Function to save the amount to the database
  const saveAmount = async () => {
    if (!dbInitialized) {
      Alert.alert('Database Not Ready', 'Please wait while the database initializes.');
      return;
    }

    if (amount.trim() === '') {
      Alert.alert('Input Error', 'Please enter an amount.');
      return;
    }

    if (!/^\d+(\.\d+)?$/.test(amount)) {
      Alert.alert('Input Error', 'Please enter a valid numerical amount (e.g., 1000 or 1000.50).');
      return;
    }

    try {
      await saveAmountToDb(amount); // Call the external save function
      Alert.alert('Success', 'Amount saved to database!');
      setAmount(''); // Clear the input field after saving
    } catch (error) {
      console.error('Error saving amount in App:', error);
      Alert.alert('Database Error', error.message || 'Could not save the amount.');
    }
  };

  const shareDatabaseFile = async () => {
    // Prevent sharing if the database is not initialized or sharing is not available
    if (!dbInitialized) {
      Alert.alert('Database Not Ready', 'Please wait while the database initializes.');
      return;
    }
    if (!canShare) {
      Alert.alert('Sharing Not Available', 'File sharing is not supported on this device or platform.');
      return;
    }

    try {
      // Get the internal URI of the database file from utils/database.js
      const dbUri = getDatabaseFilePath();
      console.log("Attempting to share database from URI:", dbUri);

      // Before sharing, check if the database file actually exists
      const fileInfo = await FileSystem.getInfoAsync(dbUri);
      if (!fileInfo.exists) {
        Alert.alert('File Not Found', 'The database file does not exist yet. Please save some data first to create it.');
        return;
      }

      // Use expo-sharing to open the native share sheet
      await Sharing.shareAsync(dbUri, {
        mimeType: 'application/x-sqlite3', // Standard MIME type for SQLite databases
        dialogTitle: 'Share general_budgets.db', // Title for the share dialog (Android)
        UTI: 'public.database', // Universal Type Identifier for iOS (helps iOS identify file type)
      });
      console.log('Database file shared successfully.');
    } catch (error) {
      // Log and alert if sharing fails
      console.error('Error sharing database file:', error);
      Alert.alert('Sharing Error', 'Could not share the database file. ' + error.message);
    }
  };


  const [currentProgress, setCurrentProgress] = useState(0.25); // State to manage progress
  
  
  return    (
    <View className='m-8'>
      {/* Modal for Daily Budget */}
      <GeneralBudgetsModal 
        isVisible={isDailyBudgetModalVisible}
        onClose={toggleDailyBudgetModal}
        title="Set Daily Budget" >
            <View className='flex-row items-center gap-2'>
              <Text>Limit</Text>
              <TextInput
                className='flex-1 border-2 rounded-[10]'
                placeholder='0'
                keyboardType='numeric'
                value={amount}
                onChangeText={setAmount}
                style={[
                    { backgroundColor: '#D4BFED' },
                  ]}
              />
            </View>
            {/* Cancel and Set Buttons */}
            <View className='flex-row pt-[14] gap-4'>
                <TouchableOpacity
                  className="w-[74] h-[33] rounded-[10] border-2 justify-center items-center"
                  onPress={toggleDailyBudgetModal}
                >
                  {/* Text beside the icon */}
                  <Text className="uppercase">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="w-[74] h-[33] rounded-[10] border-2 justify-center items-center"
                  onPress={saveAmount}
                >
                  {/* Text beside the icon */}
                  <Text className="uppercase">
                    Set
                  </Text>
                </TouchableOpacity>
            </View>
      </GeneralBudgetsModal>
      
      <Text className='text-[14px] font-medium'>General Budgets</Text>

      {/* Budget Container */}
      <View className='flex-col mt-4 gap-2'>
        {/* Daily Budget */}
        <View className='w-full h-[70] p-4 bg-white rounded-[10] flex-row justify-between items-center' 
            style={[
                    { elevation: 5 },
                  ]}>
            <View className='flex-col gap-4'>
                  <Text>Daily</Text>
                  <View className='flex-row gap-2'>
                  <Text>Budget:</Text>
                  <Text className='text-[#8938E9]'>₱800.00</Text>
                  </View>
            </View>

                <TouchableOpacity
                  className="w-[60] h-[24] px-2 py-1 border rounded-[10] items-center"
                  onPress={toggleDailyBudgetModal}
                >
                  <Text className='text-[12px]'>Change</Text>
                </TouchableOpacity>

        </View>

        {/* Weekly Budget */}
        <View className='w-full h-[70] p-4 bg-white rounded-[10] flex-row justify-between items-center' 
            style={[
                    { elevation: 5 },
                  ]}>
            <View className='flex-col gap-4'>
                  <Text>Weekly</Text>
                  <View className='flex-row gap-2'>
                  <Text>Budget:</Text>
                  <Text className='text-[#8938E9]'>₱1500.00</Text>
                  </View>
            </View>
              <View className='w-[60] h-[24] px-2 py-1 border rounded-[10] items-center'>
                <Text className='text-[12px]'>Change</Text>
              </View>
        </View>

        {/* Monthly Budget */}
        <View className='w-full h-[70] p-4 bg-white rounded-[10] flex-row justify-between items-center' 
            style={[
                    { elevation: 5 },
                  ]}>
            <View className='flex-col gap-4'>
                  <Text>Monthly</Text>
                  <View className='flex-row gap-2'>
                  <Text>Budget:</Text>
                  <Text className='text-[#8938E9]'>₱7000.00</Text>
                  </View>
            </View>
              <View className='w-[60] h-[24] px-2 py-1 border rounded-[10] items-center'>
                <Text className='text-[12px]'>Change</Text>
              </View>
        </View>

      </View> 

      <View className='mt-11'>
        <Text className='text-[14px] font-medium'>Planned Budgets</Text>
      </View>

      {/* Planned Budget Container */}
      <View className='flex-row mt-6 gap-8'>

        <View className='w-[137] h-[136] p-2 bg-white rounded-[10]' 
        style={[
                { elevation: 5 },
              ]}>
          <View className='flex-row gap-4 pb-9'>
            <View className='w-[16] h-[16] bg-[#FCC21B]'></View>
            <Text>Clothes</Text>
          </View>

          <View className='flex-col items-center'>
              <ProgressBar progress={currentProgress}/>
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
    )
}