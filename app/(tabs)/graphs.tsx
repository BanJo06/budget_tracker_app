import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { SVG_ICONS } from '../../assets/constants/icons';
import ProgressRing from '../../components/ProgressRing';
import ReusableRoundedBoxComponent from '../../components/RoundedBoxComponent';


export default function Graphs() {

  const [currentProgress, setCurrentProgress] = useState(0.25); // State to manage progress
  
    const increaseProgress = () => {
      setCurrentProgress((prev) => Math.min(prev + 0.1, 1));
    };
  
    const decreaseProgress = () => {
      setCurrentProgress((prev) => Math.max(prev - 0.1, 0));
    };
  
  return  (
    <View className='bg-[#f0f0f0] items-center'>
      <ReusableRoundedBoxComponent>
              <View className='flex-col p-[32]'>
                <View className='flex-row items-center gap-[4] mb-[16]'>
                  <View className='w-[25] h-[25] bg-white'></View>
                  <Text className='font-medium text-white'>Budget Tracker</Text>
                </View>

                <View className='flex-row items-center justify-center'>
                  <SVG_ICONS.SideMenu width={30} height={30} style={{ position: 'absolute', left: 0 }}/>
                  <Text className='text-[16px] font-medium text-white'>Dashboard</Text>
                </View>
              </View>
      </ReusableRoundedBoxComponent>

      {/* Graph Overview */}
      <View className='w-[330] h-[220] p-[20] bg-white rounded-[20]'
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

    </View>
  );
}