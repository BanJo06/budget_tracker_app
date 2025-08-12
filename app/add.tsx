import { SVG_ICONS } from "@/assets/constants/icons";
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';

// This hides the header for the screen
export const unstable_settings = {
  headerShown: false,
};

// A simplified AccountsModal component
const AccountsModal = ({ isVisible, onClose }) => {
  // State for a new account modal within this modal
  const [isNewAccountModalVisible, setNewAccountModalVisible] = useState(false);

  const toggleNewAccountModal = () => {
    setNewAccountModalVisible(!isNewAccountModalVisible);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-11/12">
          <Text className="text-xl font-bold mb-4">Select Account</Text>
          {/* Account List */}
          <View className='w-full h-[50] px-4 flex-row justify-between items-center mb-2'>
            <View className='flex-row gap-2 items-center'>
              <View className='w-[40] h-[40] bg-[#8938E9] rounded-full'></View>
              <Text className='text-lg'>Card</Text>
            </View>
            <Text className='text-[#8938E9] text-lg'>₱0.00</Text>
          </View>
          <View className='w-full h-[50] px-4 flex-row justify-between items-center'>
            <View className='flex-row gap-2 items-center'>
              <View className='w-[40] h-[40] bg-[#8938E9] rounded-full'></View>
              <Text className='text-lg'>Pocket Money</Text>
            </View>
            <Text className='text-[#8938E9] text-lg'>₱3,500.00</Text>
          </View>

          <TouchableOpacity
            onPress={toggleNewAccountModal}
            className="w-full h-[40] justify-center items-center border-2 border-purple-500 rounded-lg mt-4"
          >
            <View className='flex-row items-center justify-center gap-2'>
              <SVG_ICONS.SmallAdd size={15} color="#8938E9" />
              <Text className="font-medium text-purple-600">ADD NEW ACCOUNT</Text>
            </View>
          </TouchableOpacity>

          <NewAccountModal
            isVisible={isNewAccountModalVisible}
            onClose={toggleNewAccountModal} 
            onSave={undefined}          
          />
        </View>
      </View>
    </Modal>
  );
};

// A simplified NewAccountModal component
const NewAccountModal = ({ isVisible, onClose, onSave }) => {
  const [initialAmount, setInitialAmount] = useState('');
  const [accountName, setAccountName] = useState('');

  const handleSave = () => {
    // You would typically save the new account here
    console.log("Saving new account:", { name: accountName, amount: initialAmount });
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-11/12">
          <Text className="text-xl font-bold mb-4">Add new account</Text>

          <View className="w-full flex-row gap-2 items-center mb-4">
            <Text>Initial Amount</Text>
            <TextInput
              className='flex-1 h-[40] border-2 border-gray-300 rounded-lg pl-2 p-0 bg-purple-100'
              placeholder='0'
              keyboardType='numeric'
              value={initialAmount}
              onChangeText={setInitialAmount}
            />
          </View>

          <View className="w-full flex-row gap-2 items-center mb-6">
            <Text>Name</Text>
            <TextInput
              className='flex-1 h-[40] border-2 border-gray-300 rounded-lg pl-2 p-0 bg-purple-100'
              placeholder='Untitled'
              value={accountName}
              onChangeText={setAccountName}
            />
          </View>

          <View className='flex-row justify-end gap-4'>
            <TouchableOpacity
              className="w-24 h-10 rounded-lg border-2 border-purple-500 justify-center items-center"
              onPress={onClose}
            >
              <Text className="uppercase text-purple-600">Cancel</Text>
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
    </Modal>
  );
};

// Main Add screen component
export default function Add() {
  // Calculator state
  const [firstValue, setFirstValue] = useState('');
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState('');

  // Other state
  const [notes, setNotes] = useState('');
  const [selectedOption, setSelectedOption] = useState('expense');
  const [isAccountsModalVisible, setAccountsModalVisible] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

  // Calculator Logic
  const handleNumberInput = (num) => {
    setDisplayValue(prev => (prev === '0' ? num : prev + num));
  };

  const handleOperatorInput = (op) => {
    setOperator(op);
    setFirstValue(displayValue);
    setDisplayValue('0');
  };

  const handleCalculation = () => {
    const num1 = parseFloat(firstValue);
    const num2 = parseFloat(displayValue);

    if (isNaN(num1) || isNaN(num2)) {
      return;
    }

    let result;
    switch (operator) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '*':
        result = num1 * num2;
        break;
      case '/':
        result = num1 / num2;
        break;
      default:
        return;
    }
    setDisplayValue(result.toString());
    setOperator('');
    setFirstValue('');
  };

  const handleClear = () => {
    setDisplayValue('0');
    setOperator('');
    setFirstValue('');
  };

  const handleDelete = () => {
    setDisplayValue(prev => (prev.length === 1 ? '0' : prev.slice(0, -1)));
  };

  // UI Event Handlers
  const handleCancel = () => {
    router.replace('/(sidemenu)/(tabs)');
  };

  const handleSave = () => {
    console.log("Transaction saved!");
    // Logic to save the transaction goes here
  };

  const toggleAccountsModal = () => {
    setAccountsModalVisible(!isAccountsModalVisible);
  };

  const toggleCategoryModal = () => {
    setCategoryModalVisible(!isCategoryModalVisible);
  };

  // SwitchSelector options
  const options = [
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
    { label: 'Transfer', value: 'transfer' }
  ];

  return (
    <View className='p-8 flex-1 bg-white'>
      <StatusBar barStyle={'dark-content'} />

      <AccountsModal isVisible={isAccountsModalVisible} onClose={toggleAccountsModal} />
      {/* CategoryModal is not included in the provided code */}

      <View className='flex-row justify-between mt-4'>
        <TouchableOpacity
          onPress={handleCancel}
          className="w-32 h-10 justify-center items-center bg-[#8938E9] rounded-lg"
        >
          <Text className="text-white text-base font-medium">CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          className="w-32 h-10 justify-center items-center bg-[#8938E9] rounded-lg"
        >
          <Text className="text-white text-base font-medium">SAVE</Text>
        </TouchableOpacity>
      </View>
      <View className="mt-10">
        <SwitchSelector
          options={options}
          initial={1}
          onPress={setSelectedOption}
          backgroundColor={'#F0E4FF'}
          textColor={'#000000'}
          selectedColor={'#ffffff'}
          buttonColor={'#7a44cf'}
          hasPadding={true}
          borderRadius={30}
          borderColor={'#F0E4FF'}
          height={40}
          textStyle={{ fontSize: 12, fontWeight: '500' }}
          selectedTextStyle={{ fontSize: 12, fontWeight: '500' }}
        />
      </View>

      <View className='flex-row justify-between mt-8'>
        <View className='items-center flex-1 mr-2'>
          <Text className='text-sm mb-2'>Account</Text>
          <TouchableOpacity
            onPress={toggleAccountsModal}
            className="w-full h-12 flex-row gap-4 justify-center items-center bg-[#8938E9] rounded-lg"
          >
            <SVG_ICONS.Account size={16} color="white" />
            <Text className="text-white text-base">Account</Text>
          </TouchableOpacity>
        </View>

        <View className='items-center flex-1 ml-2'>
          <Text className='text-sm mb-2'>Category</Text>
          <TouchableOpacity
            onPress={toggleCategoryModal}
            className="w-full h-12 flex-row gap-4 justify-center items-center bg-[#8938E9] rounded-lg"
          >
            <SVG_ICONS.Category size={16} color="white" />
            <Text className="text-white text-base">Category</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className='mt-6'>
        <TextInput
          className="w-full h-24 border-2 rounded-lg p-4 text-base"
          placeholder="Notes"
          multiline={true}
          numberOfLines={3}
          maxLength={100}
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
        />
      </View>

      <View className='mt-4'>
        <View className='w-full h-[80] border-2 rounded-lg p-2 flex items-end justify-center'>
          <Text className='text-7xl text-right' style={{ lineHeight: 65, includeFontPadding: false }}>
            {displayValue}
          </Text>
        </View>
      </View>

      {/* Calculator Body */}
      <View className='mt-4'>
        {/* Row 1 */}
        <View className='flex-row mb-2 justify-between'>
          <CalculatorButton label="←" onPress={handleDelete} isLarge={true} />
          <CalculatorButton label="C" onPress={handleClear} />
          <CalculatorButton label="÷" onPress={() => handleOperatorInput('/')} />
        </View>
        {/* Row 2 */}
        <View className='flex-row mb-2 justify-between'>
          <CalculatorButton label="7" onPress={() => handleNumberInput('7')} />
          <CalculatorButton label="8" onPress={() => handleNumberInput('8')} />
          <CalculatorButton label="9" onPress={() => handleNumberInput('9')} />
          <CalculatorButton label="x" onPress={() => handleOperatorInput('*')} />
        </View>
        {/* Row 3 */}
        <View className='flex-row mb-2 justify-between'>
          <CalculatorButton label="4" onPress={() => handleNumberInput('4')} />
          <CalculatorButton label="5" onPress={() => handleNumberInput('5')} />
          <CalculatorButton label="6" onPress={() => handleNumberInput('6')} />
          <CalculatorButton label="-" onPress={() => handleOperatorInput('-')} />
        </View>
        {/* Row 4 */}
        <View className='flex-row mb-2 justify-between'>
          <CalculatorButton label="1" onPress={() => handleNumberInput('1')} />
          <CalculatorButton label="2" onPress={() => handleNumberInput('2')} />
          <CalculatorButton label="3" onPress={() => handleNumberInput('3')} />
          <CalculatorButton label="+" onPress={() => handleOperatorInput('+')} />
        </View>
        {/* Row 5 */}
        <View className='flex-row justify-between'>
          <CalculatorButton label="0" onPress={() => handleNumberInput('0')} />
          <CalculatorButton label="00" onPress={() => handleNumberInput('00')} />
          <CalculatorButton label="." onPress={() => handleNumberInput('.')} />
          <CalculatorButton label="=" onPress={handleCalculation} />
        </View>
      </View>
    </View>
  );
}

// A reusable component for calculator buttons
const CalculatorButton = ({ label, onPress, isLarge = false }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`h-[60] border-2 rounded-lg justify-center items-center active:bg-[#8938E9] ${isLarge ? 'w-[49%]' : 'w-[24%]'}`}
      style={isLarge ? { width: '49%' } : { width: '24%' }}
    >
      {label === "←" ? (
        <SVG_ICONS.Backspace size={36} />
      ) : (
        <Text className='text-3xl font-bold text-gray-700'>{label}</Text>
      )}
    </TouchableOpacity>
  );
};