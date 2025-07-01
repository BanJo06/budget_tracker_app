import { SVG_ICONS } from "@/assets/constants/icons";
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import ReusableRoundedBoxComponent from '../../components/RoundedBoxComponent';

export default function Reports() {

  // State to hold the currently selected value ('expense' or 'income')
    const [selectedOption, setSelectedOption] = useState('expense');
  
    // Options for the SwitchSelector
    const options = [
      { label: 'Records', value: 'records' },
      { label: 'Budgets', value: 'budgets' },
      { label: 'Accounts', value: 'accounts' }
    ];
  
    const handlePress = () => {
      console.log("Button pressed!");
    };

  return(
    <View className='bg-[#f0f0f0]'>
      <ReusableRoundedBoxComponent> 
        <View className='flex-col px-[32] pt-[8]'>
          <View className='flex-row items-center gap-[4] pb-[16]'>
            <View className='w-[25] h-[25] bg-white'></View>
            <Text className='font-medium text-white'>Budget Tracker</Text>
          </View>

          <View className='flex-row items-center justify-center'>
            <SVG_ICONS.SideMenu width={30} height={30} style={{ position: 'absolute', left: 0 }}/>
            <Text className='text-[16px] font-medium text-white'>Reports</Text>
          </View>

          {/* Container for the SwitchSelector and the Date/Month Selector Button */}
            <View className="flex-row justify-center w-full mt-10 gap-10">
              <SwitchSelector
                  options={options}
                  initial={0} // Index of the initially selected option (0 for Expense)
                  onPress={value => setSelectedOption(value)} // Callback when an option is pressed
                  textColor={'#000000'} // Color for the unselected text
                  selectedColor={'#ffffff'} // Color for the selected text
                  buttonColor={'#7a44cf'} // Color for the selected button background
                  hasPadding={true}
                  borderRadius={30}
                  borderColor={'#ffffff'}
                  valuePadding={2}
                  height={40}
                  width={168}
                  // Removed fixed width here to allow flexbox to manage layout (This comment is misleading if width is present)
                  style={{ flex: 1}} // Use flex:1 to take available space, add margin to separate from button
                  // --- Styles for medium font weight ---
                  textStyle={{ fontSize: 12, fontWeight: '500' }} // Style for unselected text (medium font weight)
                  selectedTextStyle={{ fontSize: 12, fontWeight: '500' }} // Style for selected text (medium font weight)
              />
            </View>
          </View>
      </ReusableRoundedBoxComponent>

        <View className='flex-row justify-end px-[32] pt-[16] pb-[8]'>
          <SVG_ICONS.Search size={30}/>
        </View>

        {/* Records for April 17 */}

        <View className='flex-col mx-8 gap-[16] my-4'>
          <View className='gap-[8]'>
            <Text className='font-medium'>April 17, Thursday</Text>
            <View className="h-[2] bg-black rounded-full" />
          </View>
          <View className='flex-row gap-[16] items-center'>
            <View className='w-[50] h-[50] bg-[#8938E9] rounded-full'></View>
            <View className='justify-center gap-[4]'>
              <Text className='text-[16px] font-medium'>Gift</Text>
              <Text className='text-[12px] text-[#392F46] opacity-65'>Cash</Text>
            </View>
            <View className='flex-1 flex-col justify-end items-end gap-[4]'>
              <Text className='text-[16px] font-bold'>-₱200.00</Text>
            </View>
          </View>

          <View className='flex-row gap-[16] items-center'>
            <View className='w-[50] h-[50] bg-[#8938E9] rounded-full'></View>
            <View className='justify-center gap-[4]'>
              <Text className='text-[16px] font-medium'>Food</Text>
              <Text className='text-[12px] text-[#392F46] opacity-65'>Cash</Text>
            </View>
            <View className='flex-1 flex-col justify-end items-end gap-[4]'>
              <Text className='text-[16px] font-bold'>-₱200.00</Text>
            </View>
          </View>
        </View>

        {/* Records for April 15 */}

        <View className='flex-col mx-8 gap-[16] my-4'>
          <View className='gap-[8]'>
            <Text className='font-medium'>April 15, Tuesday</Text>
            <View className="h-[2] bg-black rounded-full" />
          </View>
          <View className='flex-row gap-[16] items-center'>
            <View className='w-[50] h-[50] bg-[#8938E9] rounded-full'></View>
            <View className='justify-center gap-[4]'>
              <Text className='text-[16px] font-medium'>Salary</Text>
              <Text className='text-[12px] text-[#392F46] opacity-65'>Cash</Text>
            </View>
            <View className='flex-1 flex-col justify-end items-end gap-[4]'>
              <Text className='text-[16px] font-bold text-[#8938E9]'>+₱1,300.00</Text>
            </View>
          </View>

          <View className='flex-row gap-[16] items-center'>
            <View className='w-[50] h-[50] bg-[#8938E9] rounded-full'></View>
            <View className='justify-center gap-[4]'>
              <Text className='text-[16px] font-medium'>Food</Text>
              <Text className='text-[12px] text-[#392F46] opacity-65'>Cash</Text>
            </View>
            <View className='flex-1 flex-col justify-end items-end gap-[4]'>
              <Text className='text-[16px] font-bold'>-₱200.00</Text>
            </View>
          </View>
        </View>
    </View>
  )
}