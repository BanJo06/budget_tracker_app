import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { SVG_ICONS } from '../../assets/constants/icons';
import ProgressRing from '../../components/ProgressRing';
import ReusableRoundedBoxComponent from '../../components/RoundedBoxComponent';

export default function Index() {
  
  const [currentProgress, setCurrentProgress] = useState(0.25); // State to manage progress

  const increaseProgress = () => {
    setCurrentProgress((prev) => Math.min(prev + 0.1, 1));
  };

  const decreaseProgress = () => {
    setCurrentProgress((prev) => Math.max(prev - 0.1, 0));
  };

  return (
    <View className='bg-[#f0f0f0] items-center'>
            <ReusableRoundedBoxComponent>
              Dashboard
            </ReusableRoundedBoxComponent>

          <View className='w-[330] h-[220] p-[20] bg-white rounded-2xl'
            style={[
                    { elevation: 5 },
                  ]}>
              <View className='pb-[20] flex-row justify-between'>
                <Text>Overview</Text>

                {/* This is for navigation for 'This day', 'This week', and 'This month' */}
                
                <View className='flex-row justify-between gap-x-2'>
                  <SVG_ICONS.ArrowLeft width={24} height={24}/>
                  <Text>This Week</Text>
                  <SVG_ICONS.ArrowRight width={24} height={24}/>
                </View>
              </View>

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
            
            <View className='w-full px-[32] py-[16]'> 
              <Text className='font-medium'>
              Planned Budgets
              </Text>
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 50, gap: 10 }}>
              <Button title="Increase" onPress={increaseProgress} />
              <Button title="Decrease" onPress={decreaseProgress} />
            </View>
    </View>
  );
}