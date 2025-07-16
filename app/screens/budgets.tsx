import ProgressBar from '@/components/ProgressBar';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import GeneralBudgetsModal from '../../components/GeneralBudgetsModal';

export default function Budgets() {
  const [isDailyBudgetModalVisible, setDailyBudgetModalVisible] = useState(false);

  const toggleDailyBudgetModal = () => {
    setDailyBudgetModalVisible(!isDailyBudgetModalVisible);
  }

  const [currentProgress, setCurrentProgress] = useState(0.25); // State to manage progress
  
  return    (
    <View className='m-8'>
      {/* Modal for Daily Budget */}
      <GeneralBudgetsModal 
        isVisible={isDailyBudgetModalVisible}
        onClose={toggleDailyBudgetModal}
        title="Set Daily Budget" >
            <View className='flex-row items-center gap-2'>
              <Text>Limit</Text>
              <TextInput
                className='flex-1 border rounded-[10]'
                placeholder='0'
                style={[
                    { backgroundColor: '#D4BFED' },
                  ]}
              />
            </View>
      </GeneralBudgetsModal>
      
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
                  onPress={toggleDailyBudgetModal}
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