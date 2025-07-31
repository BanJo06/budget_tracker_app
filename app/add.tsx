import { SVG_ICONS } from "@/assets/constants/icons";
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Button, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import AccountsModal from '../components/AccountsModal';

// Add this export to configure the screen options
export const unstable_settings = {
  headerShown: false, // This will hide the header for this specific screen
};

export default function Add() {
  const [firstValue, setFirstValue] = useState('');
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState('');

  const handleNumberInput = (num: string) =>  {
    if ( displayValue == '0' )  {
      setDisplayValue(num);
    } else  {
      setDisplayValue(displayValue + num);
    }
  }

  const handleOperatorInput = (operator: string) => {
    setOperator(operator);
    setFirstValue(displayValue)
    setDisplayValue('0');
  }

  const handleCalculation = () => {
    const num1 = parseFloat(firstValue)
    const num2 = parseFloat(displayValue)

    if (operator === '+') {
      setDisplayValue( (num1 + num2).toString())
    } else if (operator === '-')  {
      setDisplayValue( (num1 - num2).toString())
    } else if (operator === '*')  {
      setDisplayValue( (num1 * num2).toString())
    } else if (operator === '/')  {
      setDisplayValue( (num1 / num2).toString())
    }

    setOperator('')
    setFirstValue('')
  }

  const handleClear = () => {
    setDisplayValue('0');
    setOperator('');
    setFirstValue('');
  }

  const handleDelete = () =>  {
    if (displayValue.length == 1) {
      setDisplayValue('0')
    } else  {
    setDisplayValue(displayValue.slice(0, -1))
    }
  }

  const [value, setValue] = useState('');

  const cancelButton = () => {
    router.replace('/(sidemenu)/(tabs)');
  };

  const handlePress = () => {
        console.log("Completed quest!");
      };

  // State to hold the currently selected value ('expense' or 'income')
        const [selectedOption, setSelectedOption] = useState('expense');
      
        // Options for the SwitchSelector
        const options = [
          { label: 'Income', value: 'income' },
          { label: 'Expense', value: 'expense' },
          { label: 'Transfer', value: 'transfer' }
        ];

  // State for AccountsModal Visibility
  const [isAccountsModalVisible, setAccountsModalVisible] = useState(false);

  const toggleAccountsModal = () => {
    setAccountsModalVisible(!isAccountsModalVisible);
  }

  // State for CategoryModal Visibility
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

  return  (
    <View className='m-[32]'>
      <AccountsModal
      isVisible={isAccountsModalVisible}
      onClose={toggleAccountsModal}
      >
        <View className="flex-col gap-4 items-center">
          <View className='w-full h-[50] px-4 flex-row justify-between'>
            <View className='flex-row gap-2'>
              <View className='w-[50] h-[50] bg-[#8938E9]'></View>        
              <View className='flex-col gap-4 justify-center'>
                <Text>Card</Text>
              </View>
            </View>
          
            <View className='justify-center'>
              <Text className='text-[#8938E9]'>₱0.00</Text>
            </View>
          </View>

          <View className='w-full h-[50] px-4 flex-row justify-between'>
            <View className='flex-row gap-2'>
              <View className='w-[50] h-[50] bg-[#8938E9]'></View>        
              <View className='flex-col gap-4 justify-center'>
                <Text>Pocket Money</Text>
              </View>
            </View>
          
            <View className='justify-center'>
              <Text className='text-[#8938E9]'>₱3,500.00</Text>
            </View>
          </View>
          
          {/* Button Container */}
          <View className="flex-row gap-2">
            <Button title="Cancel" onPress={toggleAccountsModal}/>
            <Button title="ADD NEW ACCOUNT" onPress={handlePress}/>
          </View>
        </View>
      </AccountsModal>

      <StatusBar
                backgroundColor={'white'}
                barStyle={'dark-content'}
                translucent={true}
      />

      <View className='mt-[16] flex-row justify-between'>
        <TouchableOpacity
          onPress={cancelButton}
          className="w-[128px] h-[35px] justify-center items-center bg-[#8938E9] px-[8] py-[6] rounded-[10] active:bg-[#F0E4FF]"
        >
          {/* Text beside the icon */}
          <Text className="text-white text-[16px] font-medium">
            CANCEL
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePress}
          className="w-[128px] h-[35px] justify-center items-center bg-[#8938E9] px-[8] py-[6] rounded-[10] active:bg-[#F0E4FF]"
        >
          {/* Text beside the icon */}
          <Text className="text-white text-[16px] font-medium">
            SAVE
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center w-full mt-8">
        <SwitchSelector
            options={options}
            initial={0} // Index of the initially selected option (0 for Expense)
            onPress={value => setSelectedOption(value)} // Callback when an option is pressed
            backgroundColor={'#F0E4FF'}
            textColor={'#000000'} // Color for the unselected text
            selectedColor={'#ffffff'} // Color for the selected text
            buttonColor={'#7a44cf'} // Color for the selected button background
            hasPadding={true}
            borderRadius={30}
            borderColor={'#F0E4FF'}
            valuePadding={2}
            height={40}
            width={168}
            // Removed fixed width here to allow flexbox to manage layout (This comment is misleading if width is present)
            style={{ flex: 1 }} // Use flex:1 to take available space, add margin to separate from button
            // --- Styles for medium font weight ---
            textStyle={{ fontSize: 12, fontWeight: '500' }} // Style for unselected text (medium font weight)
            selectedTextStyle={{ fontSize: 12, fontWeight: '500' }} // Style for selected text (medium font weight)
        />
      </View>

      <View className='mt-[16] flex-row justify-between'>
        <View className='items-center gap-[8]'>
          <Text className='text-[14px]'>Account</Text>
          <TouchableOpacity
            onPress={() => setAccountsModalVisible(true)}
            className="w-[152px] h-[51px] flex-row gap-4 justify-center items-center bg-[#8938E9] px-[8] py-[6] rounded-[10] active:bg-[#F0E4FF]"
          >

            <SVG_ICONS.Account size={16} />

            {/* Text beside the icon */}
            <Text className="text-white text-[16px]">
              Account
            </Text>
          </TouchableOpacity>
        </View>

        <View className='items-center gap-[8]'>
          <Text className='text-[14px]'>Category</Text>
          <TouchableOpacity
            onPress={handlePress}
            className="w-[152px] h-[51px] flex-row gap-4 justify-center items-center bg-[#8938E9] px-[8] py-[6] rounded-[10] active:bg-[#F0E4FF]"
          >

            <SVG_ICONS.Category size={16} />

            {/* Text beside the icon */}
            <Text className="text-white text-[16px]">
              Category
            </Text>
          </TouchableOpacity>
        </View>  
      </View>
      
      <View className='mt-[24]'>
        <TextInput
          className="w-full h-[100] border-2 rounded-[10] p-4 text-[16px]"
          placeholder="Notes"
          multiline={true}
          numberOfLines={3}
          maxLength={100}
          value={value}
          onChangeText={setValue}
          textAlignVertical="top"
        />
      </View>
      
      <View className='mt-4'>
        <View className='w-full h-[80] border-2 rounded-[10] p-2 flex items-end justify-center'>
        <Text className='text-[75px] text-right' style={{ lineHeight: 65, includeFontPadding: false}}>
          {displayValue}
        </Text>
        </View>
      </View>

      {/* Calculator Body */}
      <View className='mt-[16] flex-col'>

        {/* First Row */}
        <View className='flex-row mb-2 justify-between'>
          <TouchableOpacity
            onPress={handleDelete}
            style={{
                width: '49%',
                flexGrow: 0,
                flexShrink: 0,
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]" // No flex here yet
          >
            <SVG_ICONS.Backspace size={36} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClear}
            style={{
                width: '24%',
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <Text className='text-[30px] font-bold text-[#392F46]'>C</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOperatorInput('/')}
            style={{
                width: '24%',
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <Text className='text-[30px] font-bold text-[#392F46]'>÷</Text>
          </TouchableOpacity>
        </View>

        {/* Second Row */}
        <View className='flex-row justify-between mb-2'>
          <TouchableOpacity
            onPress={() => handleNumberInput('7')}
            style={{
                width: '24%',
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <Text className='text-[30px] font-bold text-[#392F46]'>7</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNumberInput('8')}
            style={{
                width: '24%',
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <Text className='text-[30px] font-bold text-[#392F46]'>8</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNumberInput('9')}
            style={{
                width: '24%',
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <Text className='text-[30px] font-bold text-[#392F46]'>9</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOperatorInput('*')}
            style={{
                width: '24%',
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <Text className='text-[30px] font-bold text-[#392F46]'>x</Text>
          </TouchableOpacity>
        </View>

        {/* Third Row */}
        <View className='flex-row justify-between mb-2'>
          <TouchableOpacity
            onPress={() => handleNumberInput('4')}
            style={{
                width: '24%',
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <Text className='text-[30px] font-bold text-[#392F46]'>4</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNumberInput('5')}
            style={{
                width: '24%',
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <Text className='text-[30px] font-bold text-[#392F46]'>5</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNumberInput('6')}
            style={{
                width: '24%',
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <Text className='text-[30px] font-bold text-[#392F46]'>6</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOperatorInput('-')}
            style={{
                width: '24%',
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <Text className='text-[30px] font-bold text-[#392F46]'>-</Text>
          </TouchableOpacity>
        </View>

        {/* Fourth Row */}
        <View className='flex-row justify-between mb-2'>
          <TouchableOpacity
            onPress={() => handleNumberInput('1')}
            style={{
                width: '24%',
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <Text className='text-[30px] font-bold text-[#392F46]'>1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNumberInput('2')}
            style={{
                width: '24%',
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <Text className='text-[30px] font-bold text-[#392F46]'>2</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNumberInput('3')}
            style={{
                width: '24%',
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <Text className='text-[30px] font-bold text-[#392F46]'>3</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOperatorInput('+')}
            style={{
                width: '24%',
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <Text className='text-[30px] font-bold text-[#392F46]'>+</Text>
          </TouchableOpacity>
        </View>

        {/* Fifth Row */}
        <View className='flex-row justify-between mb-2'>
          <TouchableOpacity
            onPress={() => handleNumberInput('0')}
            style={{
                width: '24%',
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <Text className='text-[30px] font-bold text-[#392F46]'>0</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNumberInput('00')}
            style={{
                width: '24%',
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <Text className='text-[30px] font-bold text-[#392F46]'>00</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNumberInput('.')}
            style={{
                width: '24%',
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <Text className='text-[30px] font-bold text-[#392F46]'>.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCalculation}
            style={{
                width: '24%',
            }}
            className="h-[60] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <Text className='text-[30px] font-bold text-[#392F46]'>=</Text>
          </TouchableOpacity>
        </View>
      </View>

      
    </View>
  )
}