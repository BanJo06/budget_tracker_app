import { ACCOUNTS_SVG_ICONS } from "@/assets/constants/accounts_icons";
import { SVG_ICONS } from "@/assets/constants/icons";
import CategoryModal from "@/components/CategoryModal";
import CategorySelection from "@/components/CategorySelection";
import {
  addAccount,
  getAccounts,
  updateAccountBalance,
} from "@/utils/accounts";
import { initDatabase } from "@/utils/database";
import { saveTransaction } from "@/utils/transactions";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SwitchSelector from "react-native-switch-selector";
import { seedDefaultCategories } from "../../database/categoryDefaultSelection";

// ------------------ New Account Modal ------------------
const NewAccountModal = ({ isVisible, onClose, onSave }) => {
  const [initialAmount, setInitialAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);

  const handleSave = () => {
    const newAccountData = {
      name: accountName || "Untitled",
      balance: parseFloat(initialAmount) || 0,
      icon_name: selectedIcon,
    };
    if (onSave) onSave(newAccountData);
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
      <View className="flex-1 justify-center items-center bg-bgPrimary-light dark:bg-bgPrimary-dark">
        <View className="bg-white p-6 rounded-lg w-11/12">
          <Text className="text-xl font-bold mb-4">Add new account</Text>
          <View className="w-full flex-row gap-2 items-center mb-4">
            <Text>Initial Amount</Text>
            <TextInput
              className="flex-1 h-[40] border-2 border-gray-300 rounded-lg pl-2 bg-purple-100"
              placeholder="0"
              keyboardType="numeric"
              value={initialAmount}
              onChangeText={setInitialAmount}
            />
          </View>
          <View className="w-full flex-row gap-2 items-center mb-6">
            <Text>Name</Text>
            <TextInput
              className="flex-1 h-[40] border-2 border-gray-300 rounded-lg pl-2 bg-purple-100"
              placeholder="Untitled"
              value={accountName}
              onChangeText={setAccountName}
            />
          </View>
          <View className="mb-6">
            <Text className="text-sm mb-2">Select Icon</Text>
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
                      color={selectedIcon === key ? "#8938E9" : "#000"}
                    />
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
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

// ------------------ Accounts Modal ------------------
const AccountsModal = ({
  isVisible,
  onClose,
  accounts,
  onAddNewAccount,
  onSelectAccount,
}) => {
  const [isNewAccountModalVisible, setNewAccountModalVisible] = useState(false);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-11/12">
          <Text className="text-xl font-bold mb-4">Select Account</Text>
          <ScrollView keyboardShouldPersistTaps="handled">
            {Array.isArray(accounts) &&
              accounts.map((account, index) => {
                const IconComponent = ACCOUNTS_SVG_ICONS[account.icon_name];
                return (
                  <TouchableOpacity
                    key={index}
                    className="w-full h-[50] px-4 flex-row justify-between items-center mb-2"
                    onPress={() => {
                      onSelectAccount(account);
                      onClose();
                    }}
                  >
                    <View className="flex-row gap-2 items-center">
                      <View className="w-[40] h-[40] bg-[#8938E9] rounded-full justify-center items-center">
                        {IconComponent && (
                          <IconComponent size={24} color="white" />
                        )}
                      </View>
                      <Text className="text-lg">{account.name}</Text>
                    </View>
                    <Text className="text-[#8938E9] text-lg">
                      ₱{Number(account.balance || 0).toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
          <TouchableOpacity
            onPress={() => setNewAccountModalVisible(true)}
            className="w-full h-[40] justify-center items-center border-2 border-purple-500 rounded-lg mt-4"
          >
            <View className="flex-row items-center justify-center gap-2">
              <SVG_ICONS.SmallAdd size={15} color="#8938E9" />
              <Text className="font-medium text-purple-600">
                ADD NEW ACCOUNT
              </Text>
            </View>
          </TouchableOpacity>

          <NewAccountModal
            isVisible={isNewAccountModalVisible}
            onClose={() => setNewAccountModalVisible(false)}
            onSave={onAddNewAccount}
          />
        </View>
      </View>
    </Modal>
  );
};

// ------------------ Main Add Transaction Component ------------------
export default function AddLateRecords() {
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense"
  );
  const [initialAmount, setInitialAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAccountsModalVisible, setAccountsModalVisible] = useState(false);
  const [isCategoriesModalVisible, setCategoriesModalVisible] = useState(false);

  // Date state
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    async function setup() {
      try {
        await initDatabase();
        await seedDefaultCategories();
        const initialAccounts = await getAccounts();
        setAccounts(initialAccounts);
      } catch (error) {
        console.error(
          "Error initializing database or loading accounts:",
          error
        );
      }
    }
    setup();
  }, []);

  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    setAccountsModalVisible(false);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setCategoriesModalVisible(false);
  };

  const handleAddNewAccount = async (newAccountData) => {
    try {
      await addAccount(
        newAccountData.name,
        "Default Type",
        newAccountData.balance,
        newAccountData.icon_name
      );
      const updatedAccounts = await getAccounts();
      setAccounts(updatedAccounts);
    } catch (error) {
      console.error("Error saving new account:", error);
    }
  };

  const handleClear = () => {
    setInitialAmount("");
    setNotes("");
    setSelectedCategory(null);
    setSelectedAccount(null);
    setTransactionType("expense");
    setDate(new Date());
  };

  const handleSave = async () => {
    const amount = parseFloat(initialAmount);
    const fromAccountId = selectedAccount?.id;
    const categoryId = selectedCategory?.id;
    const transactionNotes = notes;

    if (!fromAccountId || !categoryId || isNaN(amount) || amount <= 0) {
      Alert.alert("Error", "Please check your inputs.");
      return;
    }

    try {
      // Update balance in DB
      await updateAccountBalance(fromAccountId, amount, transactionType);

      // Save transaction
      await saveTransaction(
        fromAccountId,
        selectedAccount.name || "Unknown Account",
        categoryId,
        amount,
        transactionType,
        transactionNotes,
        date.toISOString(),
        true
      );

      // Fetch updated accounts and update state
      const updatedAccounts = await getAccounts();
      setAccounts(updatedAccounts);

      // Also update selectedAccount so the UI shows new balance
      const updatedSelectedAccount = updatedAccounts.find(
        (acc) => acc.id === fromAccountId
      );
      setSelectedAccount(updatedSelectedAccount);

      Alert.alert("Success", "Transaction saved!");
      handleClear(); // optional: clear the form
    } catch (error) {
      console.error("Failed to save transaction:", error.message);
      Alert.alert("Error", "Failed to save transaction.");
    }
  };

  const handleSwitchChange = (value) => {
    setTransactionType(value);
    setSelectedCategory(null);
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios"); // iOS keeps picker open
    if (selectedDate) setDate(selectedDate);
  };

  const options = [
    { label: "Income", value: "income" },
    { label: "Expense", value: "expense" },
  ];

  return (
    <View className="flex-1 items-center justify-center p-8 bg-bgPrimary-light dark:bg-bgPrimary-dark">
      <AccountsModal
        isVisible={isAccountsModalVisible}
        onClose={() => setAccountsModalVisible(false)}
        accounts={accounts}
        onAddNewAccount={handleAddNewAccount}
        onSelectAccount={handleSelectAccount}
      />

      <CategoryModal
        key={`${transactionType}-${isCategoriesModalVisible}`}
        isVisible={isCategoriesModalVisible}
        onClose={() => setCategoriesModalVisible(false)}
      >
        <CategorySelection
          onSelectCategory={handleSelectCategory}
          isVisible={isCategoriesModalVisible}
          type={transactionType}
        />
      </CategoryModal>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 w-full"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full h-[80%] bg-card-light dark:bg-card-dark rounded-[20] p-4">
            {/* Date Picker */}
            <View className="flex-row items-center justify-between pb-5">
              <Text className="text-textPrimary-light dark:text-textPrimary-dark">
                Date
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="w-[126px] h-[39px] flex-row items-center justify-center bg-[orange] px-5 py-3 rounded-full gap-2"
              >
                <Text className="text-black text-[12px] font-medium">
                  {date.toLocaleDateString()}
                </Text>
                <SVG_ICONS.ButtonArrowDown size={15} />
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}

            {/* Account Select */}
            <View className="flex-row items-center justify-between pb-5">
              <Text className="text-textPrimary-light dark:text-textPrimary-dark">
                Account Select
              </Text>
              <TouchableOpacity
                onPress={() => setAccountsModalVisible(true)}
                className="w-[126px] h-12 flex-row gap-4 justify-center items-center bg-[#8938E9] rounded-full"
              >
                <SVG_ICONS.Account size={16} color="white" />
                <Text className="text-white text-base">
                  {selectedAccount ? selectedAccount.name : "Account"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Cash Flow */}
            <View className="flex-row items-center pb-5">
              <Text className="text-textPrimary-light dark:text-textPrimary-dark">
                Cash Flow
              </Text>
              <View className="flex-1 ml-[110]">
                <SwitchSelector
                  options={options}
                  initial={1}
                  onPress={handleSwitchChange}
                  backgroundColor="#F0E4FF"
                  textColor="#000000"
                  selectedColor="#ffffff"
                  buttonColor="#7a44cf"
                  hasPadding
                  borderRadius={30}
                  borderColor="#F0E4FF"
                  height={40}
                  textStyle={{ fontSize: 12, fontWeight: "500" }}
                  selectedTextStyle={{ fontSize: 12, fontWeight: "500" }}
                />
              </View>
            </View>

            {/* Category Select */}
            <View className="flex-row items-center justify-between pb-5">
              <Text className="text-textPrimary-light dark:text-textPrimary-dark">
                Category Select
              </Text>
              <TouchableOpacity
                onPress={() => setCategoriesModalVisible(true)}
                className="w-[126px] h-12 flex-row gap-4 justify-center items-center bg-[#8938E9] rounded-full"
              >
                <SVG_ICONS.Category size={16} color="white" />
                <Text className="text-white text-base">
                  {selectedCategory ? selectedCategory.name : "Category"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Amount & Notes */}
            <View className="flex-col gap-2 justify-between pb-5">
              <Text className="text-textPrimary-light dark:text-textPrimary-dark">
                Amount
              </Text>
              <TextInput
                className="h-[40] border-2 border-gray-300 rounded-lg pl-2 p-0 bg-card-light dark:bg-card-dark"
                placeholder="0"
                keyboardType="numeric"
                value={initialAmount}
                onChangeText={setInitialAmount}
              />
            </View>

            <View className="flex-col gap-2 justify-between pb-5">
              <Text className="text-textPrimary-light dark:text-textPrimary-dark">
                Notes
              </Text>
              <TextInput
                className="w-full h-20 border-2 border-gray-300 rounded-lg p-2 bg-card-light dark:bg-card-dark"
                placeholder="Write a note"
                multiline
                maxLength={100}
                value={notes}
                onChangeText={setNotes}
                textAlignVertical="top"
              />
            </View>

            {/* Buttons */}
            <View className="flex-row justify-end gap-4">
              <TouchableOpacity
                className="w-24 h-10 rounded-lg border-2 border-button-light dark:border-button-dark justify-center items-center"
                onPress={handleClear}
              >
                <Text className="uppercase text-button-light dark:text-button-dark">
                  Clear
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-24 h-10 rounded-lg justify-center items-center bg-button-light dark:bg-button-dark"
                onPress={handleSave}
              >
                <Text className="uppercase text-textInsidePrimary-light dark:text-textInsidePrimary-dark">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
