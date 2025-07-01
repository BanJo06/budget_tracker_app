import { SVG_ICONS } from "@/assets/constants/icons";
import React, { useState } from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';

export default function Add() {

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

  return  (
    <View className='m-[32]'>
      <StatusBar
                backgroundColor={'white'}
                barStyle={'dark-content'}
                translucent={true}
      />

      <View className='mt-[16] flex-row justify-between'>
        <TouchableOpacity
          onPress={handlePress}
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
            onPress={handlePress}
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
          <View className='w-full h-[130] border-2 rounded-[10] p-4'>
            <Text className='text-[14px]'>Notes</Text>
          </View>
      </View>

      <View className='mt-[16]'>
        <View className='w-full h-[90] border-2 rounded-[10] p-2 flex items-end justify-center'>
        <Text className='text-[75px] text-right' style={{ lineHeight: 75, includeFontPadding: false}}>
          0
        </Text>
        </View>
      </View>

      {/* Calculator Body */}
      <View className='mt-[16] flex-col gap-4'>
        <View className='flex-row gap-2'>
          <TouchableOpacity
            onPress={handlePress}
            className="flex-1 w-1/2 h-[66] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            <SVG_ICONS.Backspace size={36} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePress}
            className="flex w-1/4 h-[66] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            {/* Text beside the icon */}
            <Text className='text-[30px] font-bold text-[#392F46]'>C</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePress}
            className="flex w-1/4 h-[66] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            {/* Text beside the icon */}
            <Text className='text-[30px] font-bold text-[#392F46]'>÷</Text>
          </TouchableOpacity>
        </View>

        <View className='flex-row gap-2'>
          <TouchableOpacity
            onPress={handlePress}
            className="flex-1 h-[66] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            {/* Text beside the icon */}
            <Text className='text-[30px] font-bold text-[#392F46]'>7</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePress}
            className="flex-1 h-[66] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            {/* Text beside the icon */}
            <Text className='text-[30px] font-bold text-[#392F46]'>8</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePress}
            className="flex-1 h-[66] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            {/* Text beside the icon */}
            <Text className='text-[30px] font-bold text-[#392F46]'>9</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePress}
            className="flex-1 h-[66] border-2 rounded-[10] justify-center items-center active:bg-[#8938E9]"
          >
            {/* Text beside the icon */}
            <Text className='text-[30px] font-bold text-[#392F46]'>X</Text>
          </TouchableOpacity>
        </View>

          

      </View>


    </View>
  )
}