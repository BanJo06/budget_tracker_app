import ProgressRing from '@/components/ProgressRing';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

export default function expense() {
    const [currentProgress, setCurrentProgress] = useState(0.25); // State to manage progress
    return (
        <View className="items-center">
            {/* Graph Overview */}
            <View className='w-[330] h-[220] p-[20] mt-[18] mb-[16] bg-white rounded-[20]'
                style={[
                    { elevation: 5 },
                ]}>
                <View className='pb-[20] flex-row justify-between'>
                    <Text>Expense</Text>
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

            {/* Day, Week, Month */}
            <View className='flex-row gap-[8]'>
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
            <View className='flex-col mt-[32] gap-[16]'>
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
    )
}