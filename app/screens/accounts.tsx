// import { ACCOUNTS_SVG_ICONS } from '@/assets/constants/accounts_icons';
// import { SVG_ICONS } from '@/assets/constants/icons';
// import { getAccounts } from '@/utils/accounts';
// import { initDatabase } from '@/utils/database';
// import React, { useEffect, useState } from 'react';
// import { Modal, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// // A simplified NewAccountModal component
// const NewAccountModal = ({ isVisible, onClose, onSave, accountToEdit }) => {
//   const [initialAmount, setInitialAmount] = useState(accountToEdit ? String(accountToEdit.balance) : "");
//   const [accountName, setAccountName] = useState(accountToEdit ? accountToEdit.name : "");
//   const [selectedIcon, setSelectedIcon] = useState(accountToEdit ? accountToEdit.icon_name : null);

//   useEffect(() => {
//     if (accountToEdit) {
//       setInitialAmount(String(accountToEdit.balance));
//       setAccountName(accountToEdit.name);
//       setSelectedIcon(accountToEdit.icon_name);
//     } else {
//       setInitialAmount("");
//       setAccountName("");
//       setSelectedIcon(null);
//     }
//   }, [accountToEdit]);

//   const handleSave = () => {
//     const newAccountData = {
//       ...accountToEdit, // Spread existing properties for an update
//       name: accountName,
//       balance: parseFloat(initialAmount) || 0,
//       icon_name: selectedIcon,
//     };
//     if (onSave) {
//       onSave(newAccountData);
//     }
//     onClose();
//   };

//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={isVisible}
//       onRequestClose={onClose}
//     >
//       <View className="flex-1 justify-center items-center bg-black/50">
//         <View className="bg-white p-6 rounded-lg w-11/12">
//           <Text className="text-xl font-bold mb-4">{accountToEdit ? "Edit Account" : "Add new account"}</Text>
//           {/* Initial Amount Input */}
//           <View className="w-full flex-row gap-2 items-center mb-4">
//             <Text>Initial Amount</Text>
//             <TextInput
//               className="flex-1 h-[40] border-2 border-gray-300 rounded-lg pl-2 p-0 bg-purple-100"
//               placeholder="0"
//               keyboardType="numeric"
//               value={initialAmount}
//               onChangeText={setInitialAmount}
//             />
//           </View>
//           {/* Account Name Input */}
//           <View className="w-full flex-row gap-2 items-center mb-6">
//             <Text>Name</Text>
//             <TextInput
//               className="flex-1 h-[40] border-2 border-gray-300 rounded-lg pl-2 p-0 bg-purple-100"
//               placeholder="Untitled"
//               value={accountName}
//               onChangeText={setAccountName}
//             />
//           </View>
//           {/* Icon Selector */}
//           <View className="mb-6">
//             <Text className="text-sm mb-2">Select Icon</Text>
//             <View className="flex-row flex-wrap justify-start gap-4">
//               {Object.entries(ACCOUNTS_SVG_ICONS).map(
//                 ([key, IconComponent]) => (
//                   <TouchableOpacity
//                     key={key}
//                     onPress={() => setSelectedIcon(key)}
//                     className={`p-2 rounded-full border-2 ${selectedIcon === key
//                       ? "border-purple-600"
//                       : "border-gray-300"
//                       }`}
//                   >
//                     <IconComponent
//                       size={24}
//                       color={selectedIcon === key ? "#8938E9" : "#000000"}
//                     />
//                   </TouchableOpacity>
//                 )
//               )}
//             </View>
//           </View>
//           {/* Action Buttons */}
//           <View className="flex-row justify-end gap-4">
//             <TouchableOpacity
//               className="w-24 h-10 rounded-lg border-2 border-purple-500 justify-center items-center"
//               onPress={onClose}
//             >
//               <Text className="uppercase text-purple-600">Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               className="w-24 h-10 rounded-lg bg-purple-600 justify-center items-center"
//               onPress={handleSave}
//             >
//               <Text className="uppercase text-white">Save</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default function Accounts() {
//   const [accounts, setAccounts] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [menuState, setMenuState] = useState({
//     isVisible: false,
//     x: 0,
//     y: 0,
//     selectedAccount: null,
//   });
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [accountToEdit, setAccountToEdit] = useState(null);

//   const fetchAccounts = async () => {
//     setRefreshing(true);
//     try {
//       await initDatabase();
//       const fetchedAccounts = await getAccounts();
//       setAccounts(fetchedAccounts);
//     } catch (error) {
//       console.error("Failed to fetch accounts:", error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchAccounts();
//   }, []);

//   const handleEllipsisPress = (event, account) => {
//     const { pageX, pageY } = event.nativeEvent;
//     setMenuState({
//       isVisible: true,
//       x: pageX,
//       y: pageY,
//       selectedAccount: account,
//     });
//   };

//   const handleEdit = () => {
//     // Set the account to be edited and show the modal
//     setAccountToEdit(menuState.selectedAccount);
//     setIsModalVisible(true);
//     // Hide the dropdown menu
//     setMenuState({ ...menuState, isVisible: false });
//   };

//   const handleDelete = () => {
//     console.log("Deleting account:", menuState.selectedAccount.name);
//     // TODO: Implement the actual delete logic
//     setMenuState({ ...menuState, isVisible: false });
//   };

//   const handleIgnore = () => {
//     console.log("Ignoring account selection.");
//     setMenuState({ ...menuState, isVisible: false });
//   };

//   const handleSaveAccount = (accountData) => {
//     if (accountToEdit) {
//       // Handle edit logic
//       console.log("Updating account:", accountData.name);
//       // TODO: Call a function to update the account in the database
//     } else {
//       // Handle create new account logic
//       console.log("Saving new account:", accountData.name);
//       // TODO: Call a function to save the new account to the database
//     }
//     fetchAccounts(); // Refresh the list
//   };

//   const handleCloseModal = () => {
//     setIsModalVisible(false);
//     setAccountToEdit(null); // Reset the account to edit
//   };

//   return (
//     <>
//       <ScrollView
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={fetchAccounts} />
//         }>
//         <View className='m-8'>
//           <Text className='text-[14px] font-medium'>My Accounts</Text>
//           <View className='flex-col mt-4 gap-2'>
//             {accounts.length > 0 ? (
//               accounts.map((account) => {
//                 const IconComponent = ACCOUNTS_SVG_ICONS[account.icon_name];
//                 return (
//                   <View
//                     key={account.id}
//                     className='w-full h-[70] px-4 py-[10] bg-white rounded-[10] flex-row justify-between items-center'
//                     style={{ elevation: 5 }}
//                   >
//                     <View className='flex-row gap-2 items-center'>
//                       <View className='w-[50] h-[50] rounded-full bg-[#8938E9] justify-center items-center'>
//                         {IconComponent && <IconComponent size={24} color="white" />}
//                       </View>
//                       <View className='flex-col gap-1'>
//                         <Text className="text-lg font-semibold">{account.name}</Text>
//                         <View className='flex-row gap-2'>
//                           <Text className="text-sm">Balance:</Text>
//                           <Text className='text-sm text-[#8938E9]'>₱{parseFloat(account.balance).toFixed(2)}</Text>
//                         </View>
//                       </View>
//                     </View>
//                     <View>
//                       <TouchableOpacity onPress={(event) => handleEllipsisPress(event, account)}>
//                         <SVG_ICONS.Ellipsis width={24} height={24} />
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 );
//               })
//             ) : (
//               <Text className="text-gray-500 text-center mt-4">No accounts found. Add a new one!</Text>
//             )}
//           </View>
//           <TouchableOpacity onPress={() => { setIsModalVisible(true); setAccountToEdit(null); }}>
//             <View className='flex-row mt-6 gap-8 justify-center'>
//               <View className='w-[180] h-[36] px-4 py-2 border-[#8938E9] rounded-[10] border justify-center'>
//                 <View className='flex-row items-center gap-2'>
//                   <View className='w-[20] h-[20] rounded-full border border-[#8938E9]'></View>
//                   <Text className='text-[#8938E9]'>Add New Account</Text>
//                 </View>
//               </View>
//             </View>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//       {menuState.isVisible && (
//         <TouchableOpacity
//           style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
//           onPress={() => setMenuState({ ...menuState, isVisible: false })}
//           activeOpacity={1}
//         >
//           <View
//             style={{
//               position: 'absolute',
//               top: menuState.y,
//               left: menuState.x - 40,
//             }}
//             className='bg-white rounded-lg border border-gray-200'
//           >
//             <TouchableOpacity onPress={handleEdit} className="p-3">
//               <Text className="text-lg">Edit</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={handleDelete} className="p-3">
//               <Text className="text-lg text-red-600">Delete</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={handleIgnore} className="p-3">
//               <Text className="text-lg text-gray-500">Ignore</Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       )}
//       {/* Render the modal */}
//       <NewAccountModal
//         isVisible={isModalVisible}
//         onClose={handleCloseModal}
//         onSave={handleSaveAccount}
//         accountToEdit={accountToEdit}
//       />
//     </>
//   );
// }

import { ACCOUNTS_SVG_ICONS } from '@/assets/constants/accounts_icons';
import { SVG_ICONS } from '@/assets/constants/icons';
import { addAccount, deleteAccount, getAccounts, updateAccount } from '@/utils/accounts';
import { initDatabase } from '@/utils/database';
import React, { useEffect, useState } from 'react';
import { Modal, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// A simplified NewAccountModal component
const NewAccountModal = ({ isVisible, onClose, onSave, accountToEdit }) => {
  const [initialAmount, setInitialAmount] = useState(accountToEdit ? String(accountToEdit.balance) : "");
  const [accountName, setAccountName] = useState(accountToEdit ? accountToEdit.name : "");
  const [selectedIcon, setSelectedIcon] = useState(accountToEdit ? accountToEdit.icon_name : null);

  useEffect(() => {
    if (accountToEdit) {
      setInitialAmount(String(accountToEdit.balance));
      setAccountName(accountToEdit.name);
      setSelectedIcon(accountToEdit.icon_name);
    } else {
      setInitialAmount("");
      setAccountName("");
      setSelectedIcon(null);
    }
  }, [accountToEdit]);

  const handleSave = () => {
    // Create an object with the new account's data
    const newAccountData = {
      name: accountName,
      balance: parseFloat(initialAmount) || 0,
      icon_name: selectedIcon,
    };
    // Call the onSave function passed from the parent with the new data
    if (onSave) {
      onSave(newAccountData);
    }
    // Close the modal and reset state
    onClose();
    setInitialAmount("");
    setAccountName("");
    setSelectedIcon(null);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-11/12">
          <Text className="text-xl font-bold mb-4">{accountToEdit ? "Edit Account" : "Add new account"}</Text>
          {/* Initial Amount Input */}
          <View className="w-full flex-row gap-2 items-center mb-4">
            <Text>Initial Amount</Text>
            <TextInput
              className="flex-1 h-[40] border-2 border-gray-300 rounded-lg pl-2 p-0 bg-purple-100"
              placeholder="0"
              keyboardType="numeric"
              value={initialAmount}
              onChangeText={setInitialAmount}
            />
          </View>
          {/* Account Name Input */}
          <View className="w-full flex-row gap-2 items-center mb-6">
            <Text>Name</Text>
            <TextInput
              className="flex-1 h-[40] border-2 border-gray-300 rounded-lg pl-2 p-0 bg-purple-100"
              placeholder="Untitled"
              value={accountName}
              onChangeText={setAccountName}
            />
          </View>
          {/* Icon Selector */}
          <View className="mb-6">
            <Text className="text-sm mb-2">Select Icon</Text>
            <View className="flex-row flex-wrap justify-start gap-4">
              {Object.entries(ACCOUNTS_SVG_ICONS).map(
                ([key, IconComponent]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setSelectedIcon(key)}
                    className={`p-2 rounded-full border-2 ${selectedIcon === key
                      ? "border-purple-600"
                      : "border-gray-300"
                      }`}
                  >
                    <IconComponent
                      size={24}
                      color={selectedIcon === key ? "#8938E9" : "#000000"}
                    />
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
          {/* Action Buttons */}
          <View className="flex-row justify-end gap-4">
            <TouchableOpacity
              className="w-24 h-10 rounded-lg border-2 border-purple-500 justify-center items-center"
              onPress={onClose}
            >
              <Text className="uppercase text-purple-600">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-24 h-10 rounded-lg bg-purple-600 justify-center items-center"
              onPress={handleSave}
            >
              <Text className="uppercase text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Confirmation modal component
const ConfirmationModal = ({ isVisible, onClose, onConfirm, title, message }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-11/12">
          <Text className="text-xl font-bold mb-2">{title}</Text>
          <Text className="mb-6">{message}</Text>
          <View className="flex-row justify-end gap-4">
            <TouchableOpacity
              className="w-24 h-10 rounded-lg border-2 border-gray-400 justify-center items-center"
              onPress={onClose}
            >
              <Text className="uppercase text-gray-700">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-24 h-10 rounded-lg bg-red-600 justify-center items-center"
              onPress={onConfirm}
            >
              <Text className="uppercase text-white">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [menuState, setMenuState] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    selectedAccount: null,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState(null);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);

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
    setAccountToEdit(menuState.selectedAccount);
    setIsModalVisible(true);
    setMenuState({ ...menuState, isVisible: false });
  };

  const handleDelete = () => {
    // Show the confirmation modal instead of deleting directly
    setIsDeleteConfirmationVisible(true);
    // The account to delete is already stored in menuState.selectedAccount
    setMenuState({ ...menuState, isVisible: false });
  };

  const handleConfirmDelete = async () => {
    if (menuState.selectedAccount) {
      try {
        await deleteAccount(menuState.selectedAccount.id);
        fetchAccounts(); // Refresh the list after successful deletion
      } catch (error) {
        console.error("Failed to delete account:", error);
      }
    }
    setIsDeleteConfirmationVisible(false); // Hide the confirmation modal
    setMenuState({ ...menuState, selectedAccount: null });
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmationVisible(false);
    setMenuState({ ...menuState, selectedAccount: null });
  };

  const handleIgnore = () => {
    console.log("Ignoring account selection.");
    setMenuState({ ...menuState, isVisible: false });
  };

  const handleSaveAccount = (accountData) => {
    // A simplified way to check for a valid type, since your accounts table requires it.
    const accountType = "default";

    if (accountToEdit) {
      // Handle edit logic
      console.log("Updating account:", accountData.name);
      try {
        updateAccount(accountToEdit.id, accountData.name, accountType, accountData.balance, accountData.icon_name);
      } catch (error) {
        console.error("Failed to update account:", error);
      }
    } else {
      // Handle create new account logic
      console.log("Saving new account:", accountData.name);
      try {
        addAccount(accountData.name, accountType, accountData.balance, accountData.icon_name);
      } catch (error) {
        console.error("Failed to save new account:", error);
      }
    }
    fetchAccounts(); // Refresh the list
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setAccountToEdit(null); // Reset the account to edit
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchAccounts} />
        }>
        <View className='m-8'>
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
          <TouchableOpacity onPress={() => { setIsModalVisible(true); setAccountToEdit(null); }}>
            <View className='flex-row mt-6 gap-8 justify-center'>
              <View className='w-[180] h-[36] px-4 py-2 border-[#8938E9] rounded-[10] border justify-center'>
                <View className='flex-row items-center gap-2'>
                  <View className='w-[20] h-[20] rounded-full border border-[#8938E9]'></View>
                  <Text className='text-[#8938E9]'>Add New Account</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {menuState.isVisible && (
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={() => setMenuState({ ...menuState, isVisible: false })}
          activeOpacity={1}
        >
          <View
            style={{
              position: 'absolute',
              top: menuState.y,
              left: menuState.x - 40,
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
      {/* Render the modals */}
      <NewAccountModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveAccount}
        accountToEdit={accountToEdit}
      />
      <ConfirmationModal
        isVisible={isDeleteConfirmationVisible}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the account "${menuState.selectedAccount?.name}"? This action cannot be undone.`}
      />
    </>
  );
}