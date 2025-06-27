import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { SVG_ICONS } from '../../assets/constants/icons';
import ProgressBar from '../../components/ProgressBar';
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
            <Text className='font-medium text-white'>Dashboard</Text>
            </ReusableRoundedBoxComponent>

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

            <View className='w-full mt-[32] mb-[16] pl-[32]'> 
              <Text className='font-medium'>
              Planned Budgets
              </Text>
            </View>
            
            <View className='w-[330] h-[140] bg-white rounded-[20]'>
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