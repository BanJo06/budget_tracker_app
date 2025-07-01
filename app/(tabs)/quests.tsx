import { SVG_ICONS } from "@/assets/constants/icons";
import ProgressBar from "@/components/ProgressBar";
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import ReusableRoundedBoxComponent from '../../components/RoundedBoxComponent';

export default function Quests()  {

  const [currentProgress, setCurrentProgress] = useState(0.25); // State to manage progress

  // State to hold the currently selected value ('expense' or 'income')
      const [selectedOption, setSelectedOption] = useState('expense');
    
      // Options for the SwitchSelector
      const options = [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
      ];
    
      const handlePress = () => {
        console.log("Completed quest!");
      };

  return  (
    <View className='bg-[#f0f0f0]'>
      <ReusableRoundedBoxComponent> 
        <View className='flex-col px-[32] pt-[8]'>
          <View className='flex-row items-center gap-[4] pb-[16]'>
            <View className='w-[25] h-[25] bg-white'></View>
            <Text className='font-medium text-white'>Budget Tracker</Text>
          </View>

          <View className='flex-row items-center justify-center'>
            <SVG_ICONS.SideMenu width={30} height={30} style={{ position: 'absolute', left: 0 }}/>
            <Text className='text-[16px] font-medium text-white'>Quests</Text>
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

      <View className='flex-col items-end px-[32] gap-[6] pt-[16] pb-[32]'>
        <View className='pr-[24]'>
          <SVG_ICONS.DailyReward width={50} height={66} />
        </View>
        <ProgressBar progress={currentProgress}/>
      </View>

      <View className='flex-col px-[32] mb-[16]' >
        <View className='h-[80] rounded-[10] bg-[#8938E9] px-[16] py-[8]' 
          style={[
            { elevation: 5 },
                ]}>
          <Text className='text-[16px] text-white font-medium'>Use App</Text>

          <View className='items-end flex-1 justify-end'>
            <TouchableOpacity
              onPress={handlePress}
              className="w-[71px] h-[27px] flex-row justify-center bg-white px-[8] py-[6] rounded-[10] active:bg-[#F0E4FF]"
            >
              {/* Text beside the icon */}
              <Text className="text-[#8938E9] text-[12px]">
                Complete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className='flex-col px-[32] mb-[16]'>
        <View className='h-[80] rounded-[10] bg-white px-[16] py-[8]' 
          style={[
              { elevation: 5 },
                ]}>
          <Text className='text-[16px] text-black font-medium'>Add 1 task</Text>
        </View>
      </View>

      <View className='flex-col px-[32] mb-[16]'>
        <View className='h-[80] rounded-[10] bg-white px-[16] py-[8]' 
          style={[
          { elevation: 5 },
                ]}>
          <Text className='text-[16px] text-black font-medium'>Use the app for 5 minutes</Text>
        </View>
      </View>
    </View>
  )
}