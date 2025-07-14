import ProgressBar from '@/components/ProgressBar';
import React, { useState } from 'react';
import { Button, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Budgets() {
  const [isModalVisible, setModalVisible] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(0.25); // State to manage progress
  
  return    (
    <View className='m-8'>
      <Modal
      transparent = {true}
      visible={isModalVisible}
      onRequestClose={() => {
        setModalVisible(!isModalVisible)
      }}
      >
        <View className='flex-1 justify-center items-center'>
          <View className='w-[348] h-[160] bg-white items-center justify-center rounded-[10] px-5 py-4'>
            <Text className='pb-4'>Set Daily Budget</Text>
            <View className='flex-row items-center gap-2'>
              <Text>Limit</Text>
              <TextInput
                className='flex-1 border rounded-[10]'
              />
            </View>

            <View className='flex-row gap-2 pt-4'>
              <Button 
                title="Cancel"
                color="green"
                onPress={()=> setModalVisible(false)}>
              </Button>
              <Button 
                title="Set"
                color="green"
                onPress={()=> setModalVisible(false)}>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <Text className='text-[14px] font-medium'>General Budgets</Text>

      {/* Budget Container */}
      <View className='flex-col mt-4 gap-2'>
        {/* Daily Budget */}
        <View className='w-full h-[70] p-4 bg-white rounded-[10] flex-row justify-between items-center' 
            style={[
                    { elevation: 5 },
                  ]}>
            <View className='flex-col gap-4'>
                  <Text>Daily</Text>
                  <View className='flex-row gap-2'>
                  <Text>Budget:</Text>
                  <Text className='text-[#8938E9]'>₱800.00</Text>
                  </View>
            </View>

                <TouchableOpacity
                  className="w-[60] h-[24] px-2 py-1 border rounded-[10] items-center"
                  onPress={() => setModalVisible(true)}
                >
                  <Text className='text-[12px]'>Change</Text>
                </TouchableOpacity>

        </View>

        {/* Weekly Budget */}
        <View className='w-full h-[70] p-4 bg-white rounded-[10] flex-row justify-between items-center' 
            style={[
                    { elevation: 5 },
                  ]}>
            <View className='flex-col gap-4'>
                  <Text>Weekly</Text>
                  <View className='flex-row gap-2'>
                  <Text>Budget:</Text>
                  <Text className='text-[#8938E9]'>₱1500.00</Text>
                  </View>
            </View>
              <View className='w-[60] h-[24] px-2 py-1 border rounded-[10] items-center'>
                <Text className='text-[12px]'>Change</Text>
              </View>
        </View>

        {/* Monthly Budget */}
        <View className='w-full h-[70] p-4 bg-white rounded-[10] flex-row justify-between items-center' 
            style={[
                    { elevation: 5 },
                  ]}>
            <View className='flex-col gap-4'>
                  <Text>Monthly</Text>
                  <View className='flex-row gap-2'>
                  <Text>Budget:</Text>
                  <Text className='text-[#8938E9]'>₱7000.00</Text>
                  </View>
            </View>
              <View className='w-[60] h-[24] px-2 py-1 border rounded-[10] items-center'>
                <Text className='text-[12px]'>Change</Text>
              </View>
        </View>

      </View> 

      <View className='mt-11'>
        <Text className='text-[14px] font-medium'>Planned Budgets</Text>
      </View>

      {/* Planned Budget Container */}
      <View className='flex-row mt-6 gap-8'>

        <View className='w-[137] h-[136] p-2 bg-white rounded-[10]' 
        style={[
                { elevation: 5 },
              ]}>
          <View className='flex-row gap-4 pb-9'>
            <View className='w-[16] h-[16] bg-[#FCC21B]'></View>
            <Text>Clothes</Text>
          </View>

          <View className='flex-col items-center'>
              <ProgressBar progress={currentProgress}/>
            <Text className='text-[16px] pt-2'>₱600.00</Text>
            <Text className='text-[12px] pt-1'>(₱1000.00)</Text>
          </View>
        </View>

        {/* Add Budget Plan */}
        <View className='w-[137] h-[136] p-2 border-[#8938E9] rounded-[10] border justify-center'>
          <View className='flex-col items-center gap-[18]'>
            <View className='w-[30] h-[30] rounded-full border border-[#8938E9]'></View>
            <Text className='text-[#8938E9]'>Add New Budget</Text>
          </View>
        </View>

      </View>
    </View>
    )
}