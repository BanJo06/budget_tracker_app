import { SVG_ICONS } from "@/assets/constants/icons";
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import ReusableRoundedBoxComponent from '../../../components/RoundedBoxComponent';

import AccountsContent from '../../screens/accounts';
import BudgetsContent from '../../screens/budgets';
import RecordsContent from '../../screens/records';

export default function Reports() {
  const [selectedReportTab, setSelectedReportTab] = useState('Records');

  const options = [
    { label: 'Records', value: 'records' },
    { label: 'Budgets', value: 'budgets' },
    { label: 'Accounts', value: 'accounts' }
  ];

  const renderContent = () => {
    switch (selectedReportTab) {
      case 'records':
        return <RecordsContent />;
      case 'budgets':
        return <BudgetsContent />;
      case 'accounts':
        return <AccountsContent />;
      default:
        return <RecordsContent />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <ReusableRoundedBoxComponent>
        <View className='flex-col px-[32] pt-[8]'>
          <View className='flex-row items-center gap-[4] pb-[16]'>
            <View className='w-[25] h-[25] bg-white'></View>
            <Text className='font-medium text-white'>Budget Tracker</Text>
          </View>

          <View className='flex-row items-center justify-center'>
            <SVG_ICONS.SideMenu width={30} height={30} style={{ position: 'absolute', left: 0 }} />
            <Text className='text-[16px] font-medium text-white'>Reports</Text>
          </View>

          <View className="flex-row justify-center w-full mt-10 gap-10">
            <SwitchSelector
              options={options}
              initial={0}
              onPress={value => setSelectedReportTab(value)}
              textColor={'#000000'}
              selectedColor={'#ffffff'}
              buttonColor={'#7a44cf'}
              hasPadding={true}
              borderRadius={30}
              borderColor={'#ffffff'}
              valuePadding={2}
              height={40}
              width={168}
              style={{ flex: 1 }}
              textStyle={{ fontSize: 12, fontWeight: '500' }}
              selectedTextStyle={{ fontSize: 12, fontWeight: '500' }}
            />
          </View>
        </View>
      </ReusableRoundedBoxComponent>
      {/* Wrap renderContent in a View with flex: 1 to ensure it takes up remaining space */}
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>
    </View>
  );
}