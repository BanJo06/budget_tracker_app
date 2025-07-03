import { SVG_ICONS } from '@/assets/constants/icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ReusableRoundedBoxComponent from '../components/RoundedBoxComponent';

export default function Shop() {
    return (
    <View>
        <ReusableRoundedBoxComponent> 
        <View className='flex-col px-[32] pt-[8]'>
            <View className='flex-row items-center gap-[4] pb-[16]'>
                <View className='w-[25] h-[25] bg-white'></View>
                <Text className='font-medium text-white'>Budget Tracker</Text>
            </View>

            <View className='flex-row items-center justify-center'>
                <TouchableOpacity
                className="w-[30px] h-[30px] rounded-full flex-row absolute left-0 active:bg-[#F0E4FF]"
                onPress={() => router.push('/quests')}
                >
                <SVG_ICONS.ShopBackButton size={30}/>
                </TouchableOpacity>
                <Text className='text-[16px] font-medium text-white'>Shop</Text>
                <TouchableOpacity
                className="w-[30px] h-[30px] rounded-full flex-row absolute right-0 active:bg-[#F0E4FF]"
                >
                    
                <SVG_ICONS.Shop size={30}/>
                </TouchableOpacity>
            </View>

            <View className='flex-row mt-10 justify-center'>
                <View className='w-[71] h-[37] rounded-full bg-white'></View>
            </View>
        </View>
      </ReusableRoundedBoxComponent>
            <Text>Shop</Text>
    </View>
    )
}