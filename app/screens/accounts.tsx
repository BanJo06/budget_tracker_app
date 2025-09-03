import { ACCOUNTS_SVG_ICONS } from '@/assets/constants/accounts_icons';
import { SVG_ICONS } from '@/assets/constants/icons';
import { getAccounts } from '@/utils/accounts';
import { initDatabase } from '@/utils/database';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [menuState, setMenuState] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    selectedAccount: null,
  });

  const fetchAccounts = async () => {
    setRefreshing(true);
    try {
      await initDatabase();
      const fetchedAccounts = await getAccounts();
      setAccounts(fetchedAccounts);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleEllipsisPress = (event, account) => {
    const { pageX, pageY } = event.nativeEvent;
    setMenuState({
      isVisible: true,
      x: pageX,
      y: pageY,
      selectedAccount: account,
    });
  };

  const handleEdit = () => {
    console.log("Editing account:", menuState.selectedAccount.name);
    // TODO: Implement the actual edit logic
    setMenuState({ ...menuState, isVisible: false });
  };

  const handleDelete = () => {
    console.log("Deleting account:", menuState.selectedAccount.name);
    // TODO: Implement the actual delete logic
    setMenuState({ ...menuState, isVisible: false });
  };

  const handleIgnore = () => {
    console.log("Ignoring account selection.");
    setMenuState({ ...menuState, isVisible: false });
  };

  return (
    <ScrollView
      className='m-8'
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchAccounts} />
      }>
      <Text className='text-[14px] font-medium'>My Accounts</Text>
      <View className='flex-col mt-4 gap-2'>
        {accounts.length > 0 ? (
          accounts.map((account) => {
            const IconComponent = ACCOUNTS_SVG_ICONS[account.icon_name];
            return (
              <View
                key={account.id}
                className='w-full h-[70] px-4 py-[10] bg-white rounded-[10] flex-row justify-between items-center'
                style={{ elevation: 5 }}
              >
                <View className='flex-row gap-2 items-center'>
                  <View className='w-[50] h-[50] rounded-full bg-[#8938E9] justify-center items-center'>
                    {IconComponent && <IconComponent size={24} color="white" />}
                  </View>
                  <View className='flex-col gap-1'>
                    <Text className="text-lg font-semibold">{account.name}</Text>
                    <View className='flex-row gap-2'>
                      <Text className="text-sm">Balance:</Text>
                      <Text className='text-sm text-[#8938E9]'>₱{parseFloat(account.balance).toFixed(2)}</Text>
                    </View>
                  </View>
                </View>
                <View>
                  <TouchableOpacity onPress={(event) => handleEllipsisPress(event, account)}>
                    <SVG_ICONS.Ellipsis width={24} height={24} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <Text className="text-gray-500 text-center mt-4">No accounts found. Add a new one!</Text>
        )}
      </View>
      <View className='flex-row mt-6 gap-8 justify-center'>
        <View className='w-[180] h-[36] px-4 py-2 border-[#8938E9] rounded-[10] border justify-center'>
          <View className='flex-row items-center gap-2'>
            <View className='w-[20] h-[20] rounded-full border border-[#8938E9]'></View>
            <Text className='text-[#8938E9]'>Add New Account</Text>
          </View>
        </View>
      </View>
      {menuState.isVisible && (
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={() => setMenuState({ ...menuState, isVisible: false })}
          activeOpacity={1}
        >
          <View
            style={{
              position: 'absolute',
              top: menuState.y - 220, // Adjust this value to move the menu up
              left: menuState.x - 80, // Adjust this value to move the menu left
            }}
            className='bg-white rounded-lg border border-gray-200'
          >
            <TouchableOpacity onPress={handleEdit} className="p-3">
              <Text className="text-lg">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} className="p-3">
              <Text className="text-lg text-red-600">Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleIgnore} className="p-3">
              <Text className="text-lg text-gray-500">Ignore</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}