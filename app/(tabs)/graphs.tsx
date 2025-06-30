import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import { SVG_ICONS } from '../../assets/constants/icons';
import ProgressRing from '../../components/ProgressRing';
import ReusableRoundedBoxComponent from '../../components/RoundedBoxComponent';


export default function Graphs() {

  // State to hold the currently selected value ('expense' or 'income')
  const [selectedOption, setSelectedOption] = useState('expense');

  // Options for the SwitchSelector
  const options = [
    { label: 'Expense', value: 'expense' },
    { label: 'Income', value: 'income' }
  ];

  const handlePress = () => {
    console.log("Button pressed!");
  };

  const [currentProgress, setCurrentProgress] = useState(0.25); // State to manage progress

    // Example: Parent manages the state, perhaps based on an external event or data
  const [currentDisplayMode, setCurrentDisplayMode] = useState(0); // 0 for Expense, 1 for Income

  return  (
    <View className='bg-[#f0f0f0] items-center'>
      <ReusableRoundedBoxComponent> 
        <View className='flex-col px-[32] pt-[8]'>
          <View className='flex-row items-center gap-[4] pb-[16]'>
            <View className='w-[25] h-[25] bg-white'></View>
            <Text className='font-medium text-white'>Budget Tracker</Text>
          </View>

          <View className='flex-row items-center justify-center'>
            <SVG_ICONS.SideMenu width={30} height={30} style={{ position: 'absolute', left: 0 }}/>
            <Text className='text-[16px] font-medium text-white'>Graphs</Text>
          </View>

          {/* Container for the SwitchSelector and the Date/Month Selector Button */}
            <View className="flex-row justify-between w-full mt-10 gap-10">
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
                  width={168} // This is key!
                  // Removed fixed width here to allow flexbox to manage layout (This comment is misleading if width is present)
                  style={{ flex: 1, marginEnd: 10 }} // Use flex:1 to take available space, add margin to separate from button
                  // --- Styles for medium font weight ---
                  textStyle={{ fontSize: 12, fontWeight: '500' }} // Style for unselected text (medium font weight)
                  selectedTextStyle={{ fontSize: 12, fontWeight: '500' }} // Style for selected text (medium font weight)
              />
            
              <TouchableOpacity
                onPress={handlePress}
                className="w-[126px] h-[39px] flex-row items-center justify-center bg-white px-5 py-3 rounded-full active:bg-[#F0E4FF] gap-2"
              >
                {/* Text beside the icon */}
                <Text className="text-black text-[12px] font-medium">
                  April, 2025
                </Text>
                {/* Use your imported SVG icon component here */}
                {/* Ensure SVG_ICONS.ButtonArrowDown is correctly defined and imported */}
                <SVG_ICONS.ButtonArrowDown size={15} />
              </TouchableOpacity>
            </View>
          </View>
      </ReusableRoundedBoxComponent>

      {/* Graph Overview */}
      <View className='w-[330] h-[220] p-[20] mt-[18] mb-[16] bg-white rounded-[20]'
            style={[
                    { elevation: 5 },
                  ]}>
              <View className='pb-[20] flex-row justify-between'>

              </View>
        
      {/* Graph Menu Pie Chart */}
          <View className='flex-row justify-between'>
              <ProgressRing 
                progress={currentProgress}
                radius={70}
                strokeWidth={15}
                progressColor="#8938E9"
                backgroundColor="#EDE1FB"
                duration={500}
                showPercentage={true}
              />

      {/* Graph Menu Category and Percent */}
            <View className='flex-1 flex-col items-start justify-start pl-[32] pr-[10] pb-[6] gap-[8]'>
              {/* Food */}
                <View className='flex-row gap-[8] w-full items-center'>
                    <View className='w-[15] h-[15] bg-[#8938E9] rounded-full'></View>
                  <View className='flex-row flex-1 justify-between items-center'> 
                    <Text className='text-[10px] font-medium'>Food</Text>
                    <Text className='text-[10px]'>60%</Text>
                  </View>
                </View>

              {/* Shopping */}
                <View className='flex-row gap-[8] w-full items-center'> 
                    <View className='w-[15] h-[15] bg-yellow-400 rounded-full'></View>
                  <View className='flex-row flex-1 justify-between items-center'> 
                    <Text className='text-[10px] font-medium'>Shopping</Text>
                    <Text className='text-[10px]'>32%</Text>
                  </View>
                </View>

              {/* Gifts */}
                <View className='flex-row gap-[8] w-full items-center'>
                    <View className='w-[15] h-[15] bg-green-500 rounded-full'></View>
                  <View className='flex-row flex-1 justify-between items-center'>
                    <Text className='text-[10px] font-medium'>Gifts</Text>
                    <Text className='text-[10px]'>8%</Text>
                  </View>
                </View>
            </View>
          </View>
      </View>

      <View className='w-full flex-row pl-[32] gap-[8]'>
          <View className='w-[104] h-[86] px-[12] py-[20] bg-white rounded-[20]' 
          style={[
                  { elevation: 5 },
                ]}>
            <View className='flex-col justify-center items-center gap-[8]'>
              <Text className='text-[16px] text-[#392F46] opacity-65'>Day</Text>
              <Text className='text-[16px] font-bold text-[#8938E9]'>₱500.00</Text>
            </View>
          </View>

          <View className='w-[104] h-[86] px-[12] py-[20] bg-white rounded-[20]' 
          style={[
                  { elevation: 5 },
                ]}>
            <View className='flex-col justify-center items-center gap-[8]'>
              <Text className='text-[16px] text-[#392F46] opacity-65'>Week</Text>
              <Text className='text-[16px] font-bold text-[#8938E9]'>₱800.00</Text>
            </View>
          </View>

          <View className='w-[104] h-[86] px-[12] py-[20] bg-white rounded-[20]' 
          style={[
                  { elevation: 5 },
                ]}>
            <View className='flex-col justify-center items-center gap-[8]'>
              <Text className='text-[16px] text-[#392F46] opacity-65'>Month</Text>
              <Text className='text-[16px] font-bold text-[#8938E9]'>₱2500.00</Text>
            </View>
          </View>
      </View>

  {/* Total Balance based on category */}
    <View className='w-full flex-col mt-[32] px-[32] gap-[16]'>
          <View className='flex-row gap-[16] w-full items-center'>
            <View className='w-[50] h-[50] bg-[#8938E9] rounded-full'></View>
            <View className='justify-center gap-[4]'>
              <Text className='text-[16px] font-medium'>Shopping</Text>
              <Text className='text-[12px] text-[#392F46] opacity-65'>Cash</Text>
            </View>
            <View className='flex-1 flex-col justify-end items-end gap-[4]'>
              <Text className='text-[16px] font-medium'>₱800.00</Text>
              <Text className='text-[12px] text-[#392F46] opacity-65'>32%</Text>
            </View>
          </View>
        
          <View className='flex-row gap-[16] w-full items-center'>
            <View className='w-[50] h-[50] bg-[#8938E9] rounded-full'></View>
            <View className='justify-center gap-[4]'>
              <Text className='text-[16px] font-medium'>Food</Text>
              <Text className='text-[12px] text-[#392F46] opacity-65'>Cash</Text>
            </View>
            <View className='flex-1 flex-col justify-end items-end gap-[4]'>
              <Text className='text-[16px] font-medium'>₱1500.00</Text>
              <Text className='text-[12px] text-[#392F46] opacity-65'>60%</Text>
            </View>
          </View>
        

          <View className='flex-row gap-[16] w-full items-center'>
            <View className='w-[50] h-[50] bg-[#8938E9] rounded-full'></View>
            <View className='justify-center gap-[4]'>
              <Text className='text-[16px] font-medium'>Gifts</Text>
              <Text className='text-[12px] text-[#392F46] opacity-65'>Cash</Text>
            </View>
            <View className='flex-1 flex-col justify-end items-end gap-[4]'>
              <Text className='text-[16px] font-medium'>₱200.00</Text>
              <Text className='text-[12px] text-[#392F46] opacity-65'>8%</Text>
            </View>
          </View>
        </View>
    </View>
  );
}