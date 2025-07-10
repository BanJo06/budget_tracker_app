import React from 'react'
import { Text, View } from 'react-native'

export default function Accounts() {
  return (
    <View className='m-8'>
      <Text className='text-[14px] font-medium'>My Accounts</Text>

      {/* Account Container */}
      <View className='flex-col mt-4 gap-2'>
        {/* Card */}
        <View className='w-full h-[70] px-4 py-[10] bg-white rounded-[10] flex-row justify-between' 
            style={[
                    { elevation: 5 },
                  ]}>
            <View className='flex-row gap-2'>
              <View className='w-[50] h-[50] bg-[#8938E9]'></View>        
              <View className='flex-col gap-4'>
                <Text>Card</Text>
                <View className='flex-row gap-2'>
                  <Text>Balance:</Text>
                  <Text className='text-[#8938E9]'>₱0.00</Text>
                </View>

              </View>
            </View>

              <View className='w-[20] h-[20] border rounded-[10]'></View>
        </View>

        {/* Pocket Money */}
        <View className='w-full h-[70] px-4 py-[10] bg-white rounded-[10] flex-row justify-between' 
            style={[
                    { elevation: 5 },
                  ]}>
            <View className='flex-row gap-2'>
              <View className='w-[50] h-[50] bg-[#8938E9]'></View>        
              <View className='flex-col gap-4'>
                <Text>Pocket Money</Text>
                <View className='flex-row gap-2'>
                  <Text>Balance:</Text>
                  <Text className='text-[#8938E9]'>₱3500.00</Text>
                </View>

              </View>
            </View>

              <View className='w-[20] h-[20] border rounded-[10]'></View>
        </View> 
      </View> 

      {/* Planned Budget Container */}
      <View className='flex-row mt-6 gap-8 justify-center'>

        {/* Add New Account Button */}
        <View className='w-[180] h-[36] px-4 py-2 border-[#8938E9] rounded-[10] border justify-center'>
          <View className='flex-row items-center gap-2'>
            <View className='w-[20] h-[20] rounded-full border border-[#8938E9]'></View>
            <Text className='text-[#8938E9]'>Add New Account</Text>
          </View>
        </View>

      </View>
    </View>
  )
}