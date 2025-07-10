import { SVG_ICONS } from '@/assets/constants/icons';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

export default function Records() {
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
  
    return    (
      <View>
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