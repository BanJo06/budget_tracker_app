import { SVG_ICONS } from "@/assets/constants/icons";
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import ReusableRoundedBoxComponent from '../../../components/RoundedBoxComponent';

// import for ThreeWay Switch (content)

import AccountsContent from '../../screens/accounts';
import BudgetsContent from '../../screens/budgets';
import RecordsContent from '../../screens/records';

export default function Reports() {

  // State to manage the selected tab
  const [selectedReportTab, setSelectedReportTab] = useState('Records'); // State to manage the selected tab
  
    // Options for the SwitchSelector
    const options = [
      { label: 'Records', value: 'records' },
      { label: 'Budgets', value: 'budgets' },
      { label: 'Accounts', value: 'accounts' }
    ];

    // Function to render content based on the selected tab
  const renderContent = () => {
    switch (selectedReportTab) {
      case 'records':
        return <RecordsContent />;
      case 'budgets':
        return <BudgetsContent />;
      case 'accounts':
        return <AccountsContent />;
      default:
        return <RecordsContent />; // Fallback
    }
  };

  return  (
    <View className='bg-[#f0f0f0]'>
      <ReusableRoundedBoxComponent> 
        <View className='flex-col px-[32] pt-[8]'>
          <View className='flex-row items-center gap-[4] pb-[16]'>
            <View className='w-[25] h-[25] bg-white'></View>
            <Text className='font-medium text-white'>Budget Tracker</Text>
          </View>

          <View className='flex-row items-center justify-center'>
            <SVG_ICONS.SideMenu width={30} height={30} style={{ position: 'absolute', left: 0 }}/>
            <Text className='text-[16px] font-medium text-white'>Reports</Text>
          </View>

          {/* Container for the SwitchSelector and the Date/Month Selector Button */}
            <View className="flex-row justify-center w-full mt-10 gap-10">
              <SwitchSelector
                  options={options}
                  initial={0} // Index of the initially selected option (0 for Expense)
                  onPress={value => setSelectedReportTab(value)}
                  textColor={'#000000'} // Color for the unselected text
                  selectedColor={'#ffffff'} // Color for the selected text
                  buttonColor={'#7a44cf'} // Color for the selected button background
                  hasPadding={true}
                  borderRadius={30}
                  borderColor={'#ffffff'}
                  valuePadding={2}
                  height={40}
                  width={168}
                  // Removed fixed width here to allow flexbox to manage layout (This comment is misleading if width is present)
                  style={{ flex: 1}} // Use flex:1 to take available space, add margin to separate from button
                  // --- Styles for medium font weight ---
                  textStyle={{ fontSize: 12, fontWeight: '500' }} // Style for unselected text (medium font weight)
                  selectedTextStyle={{ fontSize: 12, fontWeight: '500' }} // Style for selected text (medium font weight)
              />
            </View>
          </View>
      </ReusableRoundedBoxComponent>
      {renderContent()}
    </View>
  )
}