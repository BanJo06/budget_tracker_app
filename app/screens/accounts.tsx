import { ACCOUNTS_SVG_ICONS } from "@/assets/constants/accounts_icons";
import { SVG_ICONS } from "@/assets/constants/icons";
import {
  addAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from "@/utils/accounts";
import { initDatabase } from "@/utils/database";
import { useColorScheme } from "nativewind";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// A simplified NewAccountModal component
const NewAccountModal = ({ isVisible, onClose, onSave, accountToEdit }) => {
  const [initialAmount, setInitialAmount] = useState(
    accountToEdit ? String(accountToEdit.balance) : ""
  );
  const [accountName, setAccountName] = useState(
    accountToEdit ? accountToEdit.name : ""
  );
  const [selectedIcon, setSelectedIcon] = useState(
    accountToEdit ? accountToEdit.icon_name : null
  );

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
    // ⚠️ New condition to check for empty accountName
    if (!accountName.trim()) {
      Alert.alert(
        "Missing Account Name",
        "Please enter a name for your new account."
      );
      return; // Stop the function execution if the name is missing
    }

    // ⚠️ Check for selectedIcon
    if (!selectedIcon) {
      Alert.alert(
        "Missing Icon",
        "Please select an icon for your new account."
      );
      return; // Stop the function execution if the icon is missing
    }
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
        <View className="bg-bgModal-light dark:bg-bgModal-dark p-6 rounded-lg w-11/12">
          <Text className="text-xl font-bold mb-4 text-textPrimary-light dark:text-textPrimary-dark">
            {accountToEdit ? "Edit Account" : "Add new account"}
          </Text>
          {/* Initial Amount Input */}
          <View className="w-full flex-row gap-2 items-center mb-4">
            <Text className="text-textPrimary-light dark:text-textPrimary-dark">
              Initial Amount
            </Text>
            <TextInput
              className="flex-1 h-[40] border-2 border-textTextbox-light dark:border-textTextbox-dark rounded-lg pl-2 p-0 bg-bgTextbox-light dark:bg-bgTextbox-dark text-textTextbox-light dark:text-textTextbox-dark"
              placeholder="0"
              keyboardType="numeric"
              value={initialAmount}
              onChangeText={setInitialAmount}
            />
          </View>
          {/* Account Name Input */}
          <View className="w-full flex-row gap-2 items-center mb-6">
            <Text className="text-textPrimary-light dark:text-textPrimary-dark">
              Name
            </Text>
            <TextInput
              className="flex-1 h-[40] border-2 border-textTextbox-light dark:border-textTextbox-dark rounded-lg pl-2 p-0 bg-bgTextbox-light dark:bg-bgTextbox-dark text-textTextbox-light dark:text-textTextbox-dark"
              placeholder="Untitled"
              value={accountName}
              onChangeText={setAccountName}
            />
          </View>
          {/* Icon Selector */}
          <View className="mb-6">
            <Text className="text-sm mb-2 text-textPrimary-light dark:text-textPrimary-dark">
              Select Icon
            </Text>
            <View className="flex-row flex-wrap justify-start gap-4">
              {Object.entries(ACCOUNTS_SVG_ICONS).map(
                ([key, IconComponent]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setSelectedIcon(key)}
                    className={`p-2 rounded-full border-2 ${
                      selectedIcon === key
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
              className="w-24 h-10 rounded-lg border-2 border-borderButton-light dark:border-borderButton-dark justify-center items-center"
              onPress={onClose}
            >
              <Text className="uppercase text-borderButton-light dark:text-borderButton-dark">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-24 h-10 rounded-lg bg-button-light dark:bg-button-dark justify-center items-center"
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
const ConfirmationModal = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  message,
}) => {
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
  const { colorScheme, setColorScheme } = useColorScheme();
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
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false);

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

  const ellipsisRefs = useRef<{
    [key: string]: React.ComponentRef<typeof TouchableOpacity> | null;
  }>({});
  const DROPDOWN_WIDTH = 140;

  const handleEllipsisPress = (accountId: string) => {
    const ref = ellipsisRefs.current[accountId];
    if (ref) {
      ref.measureInWindow((x, y, width, height) => {
        // Calculate centered position
        let left = x + width / 2 - DROPDOWN_WIDTH / 2;

        // Ensure dropdown doesn't go off-screen
        const screenWidth = Dimensions.get("window").width;
        if (left < 8) left = 8;
        if (left + DROPDOWN_WIDTH > screenWidth - 8)
          left = screenWidth - DROPDOWN_WIDTH - 8;

        setMenuState({
          isVisible:
            menuState.isVisible && menuState.selectedAccount?.id === accountId
              ? false
              : true,
          x: left,
          y: y + height + 5,
          selectedAccount: accounts.find((a) => a.id === accountId) || null,
        });
      });
    }
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
        updateAccount(
          accountToEdit.id,
          accountData.name,
          accountType,
          accountData.balance,
          accountData.icon_name
        );
      } catch (error) {
        console.error("Failed to update account:", error);
      }
    } else {
      // Handle create new account logic
      console.log("Saving new account:", accountData.name);
      try {
        addAccount(
          accountData.name,
          accountType,
          accountData.balance,
          accountData.icon_name
        );
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
        }
      >
        <View className="m-8">
          <Text className="text-[14px] font-medium text-textPrimary-light dark:text-textPrimary-dark">
            My Accounts
          </Text>
          <View className="flex-col mt-4 gap-2">
            {accounts.length > 0 ? (
              accounts.map((account) => {
                const IconComponent = ACCOUNTS_SVG_ICONS[account.icon_name];
                return (
                  <View
                    key={account.id}
                    className="w-full h-[70] px-4 py-[10] rounded-[10] flex-row justify-between items-center bg-card-light dark:bg-card-dark"
                    style={{ elevation: 5 }}
                  >
                    <View className="flex-row gap-2 items-center">
                      <View className="w-[50] h-[50] rounded-full bg-[#8938E9] justify-center items-center">
                        {IconComponent && (
                          <IconComponent size={24} color="white" />
                        )}
                      </View>
                      <View className="flex-col gap-1">
                        <Text className="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark">
                          {account.name}
                        </Text>
                        <View className="flex-row gap-2">
                          <Text className="text-sm text-textPrimary-light dark:text-textPrimary-dark">
                            Balance:
                          </Text>
                          <Text className="text-sm text-textHighlight-light dark:text-textHighlight-dark">
                            ₱{parseFloat(account.balance).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View>
                      <TouchableOpacity
                        ref={(el) => {
                          ellipsisRefs.current[account.id] = el;
                        }}
                        onPress={() => handleEllipsisPress(account.id)}
                      >
                        <SVG_ICONS.Ellipsis width={24} height={24} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text className="text-center mt-4 text-textPrimary-light dark:text-textPrimary-dark">
                No accounts found. Add a new one!
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(true);
              setAccountToEdit(null);
            }}
          >
            <View className="flex-row mt-6 gap-8 justify-center">
              <View className="w-[200] h-[36] rounded-[10] justify-center items-center bg-button-light dark:bg-button-dark">
                <View className="flex-row">
                  <Text className="uppercase text-textButton-light dark:text-textButton-dark">
                    Add New Account
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {menuState.isVisible && menuState.selectedAccount && (
        <TouchableWithoutFeedback
          onPress={() =>
            setMenuState({
              ...menuState,
              isVisible: false,
              selectedAccount: null,
            })
          }
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
            }}
          >
            {/* Actual dropdown menu */}
            <View
              style={{
                position: "absolute",
                top: menuState.y - 170,
                left: menuState.x - 70,
                width: DROPDOWN_WIDTH,
                // backgroundColor: "#fff",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#d1d5db",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 10,
                zIndex: 9999,
              }}
              className="bg-bgModal-light dark:bg-bgModal-dark"
            >
              {[
                { label: "Edit", action: handleEdit },
                { label: "Delete", action: handleDelete },
                { label: "Ignore", action: handleIgnore },
              ].map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={item.action}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderBottomWidth: idx < 2 ? 1 : 0,
                    borderBottomColor: "#e5e7eb",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                    className="text-textPrimary-light dark:text-textPrimary-dark"
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
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
