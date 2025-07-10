import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// Assuming these are correctly imported from your project structure
import { useNavigation, useRouter } from 'expo-router';
import { SVG_ICONS } from '../../../assets/constants/icons';
import ProgressBar from '../../../components/ProgressBar';
import ProgressRing from '../../../components/ProgressRing';
import ReusableRoundedBoxComponent from '../../../components/RoundedBoxComponent';
import type { TabHomeScreenNavigationProp } from '../../../types';

export default function Index() {
  const navigation = useNavigation<TabHomeScreenNavigationProp>();
  const router = useRouter(); // If you need router for other actions

  const [currentProgress, setCurrentProgress] = useState(0.25); // State to manage progress

  const increaseProgress = () => {
    setCurrentProgress((prev) => Math.min(prev + 0.1, 1));
  };

  const decreaseProgress = () => {
    setCurrentProgress((prev) => Math.max(prev - 0.1, 0));
  };

  return (
    // Main Header (Side menu, Logo and app name and Dashboard label)
    <View className='items-center'>
            <ReusableRoundedBoxComponent>
              <View className='flex-col px-[32] pt-[8]'>
                <View className='flex-row items-center gap-[4] pb-[16]'>
                  <View className='w-[25] h-[25] bg-white'></View>
                  <Text className='font-medium text-white'>Budget Tracker</Text>
                </View>
              
                <View className='flex-row items-center justify-center'>
                  <TouchableOpacity
                    className="w-[30px] h-[30px] rounded-full flex-row absolute left-0 active:bg-[#F0E4FF]"
                    onPress={() => navigation.openDrawer()}
                  >
                    <SVG_ICONS.SideMenu width={30} height={30}/>
                  </TouchableOpacity>
                  <Text className='text-[16px] font-medium text-white'>Dashboard</Text>
                </View> 
              </View>
            </ReusableRoundedBoxComponent>

      {/* Dashboard Overview */}
          <View className='w-[330] h-[220] -mt-[46] p-[20] bg-white rounded-[20]'
            style={[
                    { elevation: 5 },
                  ]}>
              <View className='pb-[20] flex-row justify-between'>
                <Text className='text-[12px] font-medium self-center'>Overview</Text>

                {/* This is for navigation for 'This day', 'This week', and 'This month' */}
                
                <View className='flex-row justify-between gap-x-2'>
                  <SVG_ICONS.ArrowLeft width={24} height={24}/>
                  <Text className='text-[12px] font-medium self-center'>This Week</Text>
                  <SVG_ICONS.ArrowRight width={24} height={24}/>
                </View>
              </View>
        
        {/* Dashboard Pie Graph */}
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

              <View className='flex-col items-end justify-end pr-[10] pb-[6]'>
                <View className='flex-row mb-[4] px-[8] py-[4] gap-[4] bg-[#EDE1FB] rounded-[16]'><SVG_ICONS.Insight width={16} height={16}/>
                <Text className='text-[12px] text-[#8938E9]'>Insight</Text>
                </View>
                <Text className='text-[8px] text-[#392F46] opacity-65'>You spent 5% more</Text>
                <Text className='text-[8px] text-[#392F46] opacity-65'>than last week</Text>
              </View>
            </View>
          </View>

          {/* Expense overview (this week)  */}
            <View className='w-[330] h-[80] my-[16] p-[16] bg-white rounded-[20]' 
            style={[
                    { elevation: 5 },
                  ]}>
                <View className='flex-row'>
                  <View className='w-[48] h-[48] bg-[#8938E9] rounded-[16]'>
                  </View>

                  <View className='pl-[20] gap-[6] self-center'>
                    <Text className='text-[12px] text-[#392F46] opacity-65'>Spent this week:</Text>
                    <Text className='text-[16px] font-medium'>₱800.00</Text>
                  </View>
                  
                  <View className='flex-1 self-center items-end'>
                    <SVG_ICONS.ArrowRight width={24} height={24}/>
                  </View>
                </View>
            </View>

            {/* Income overview (this week)  */}
            <View className='w-[330] h-[80] p-[16] bg-white rounded-[20]' 
            style={[
                    { elevation: 5 },
                  ]}>
                <View className='flex-row'>
                  <View className='w-[48] h-[48] bg-[#8938E9] rounded-[16]'>
                  </View>

                  <View className='pl-[20] gap-[6] self-center'>
                    <Text className='text-[12px] text-[#392F46] opacity-65'>Earned this week:</Text>
                    <Text className='text-[16px] font-medium'>₱1300.00</Text>
                  </View>
                  
                  <View className='flex-1 self-center items-end'>
                    <SVG_ICONS.ArrowRight width={24} height={24}/>
                  </View>
                </View>
            </View>

          {/* Planned Budgets Label */}
            <View className='w-full mt-[32] mb-[16] pl-[32]'> 
              <Text className='font-medium text-[16px]'>
              Planned Budgets
              </Text>
            </View>
            
          {/* Budget Progress -- this section must have multiple data entries */}
            <View className='w-[330] h-[140] bg-white rounded-[20]' 
            style={[
                    { elevation: 5 },
                  ]}>
              <View className='w-[330] h-[40] px-[16] bg-[#8938E9]/40 rounded-t-[20] justify-center'>
                <View className='flex-row gap-[12] items-center'>
                  <View className='w-[16] h-[16] bg-[#FCC21B]'></View>
                  <Text className='text-[14px]'>Clothes</Text>
                </View>
              </View>

                  <View className='py-[16] px-[20]'>
                    <ProgressBar progress={currentProgress}/>
                      <View className='mt-[8]'>
                        <Text className='text-[14px]'>Spent ₱600 from <Text className='text-[14px] text-[#8938E9]'>₱1000</Text></Text>
                      </View>
                  </View>
            </View>

            {/* <View style={{ flexDirection: 'row', marginBottom: 50, gap: 10 }}>
              <Button title="Increase" onPress={increaseProgress} />
              <Button title="Decrease" onPress={decreaseProgress} />
            </View> */}
    </View>
  );
}