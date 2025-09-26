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
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
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

// Simplified NewAccountModal and AccountsModal components
const NewAccountModal = ({ isVisible, onClose, onSave }) => {
  const [initialAmount, setInitialAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);

  const handleSave = () => {
    const newAccountData = {
      name: accountName,
      balance: parseFloat(initialAmount) || 0,
      icon_name: selectedIcon,
    };
    if (onSave) {
      onSave(newAccountData);
    }
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
          <Text className="text-xl font-bold mb-4">Add new account</Text>
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
          <View className="w-full flex-row gap-2 items-center mb-6">
            <Text>Name</Text>
            <TextInput
              className="flex-1 h-[40] border-2 border-gray-300 rounded-lg pl-2 p-0 bg-purple-100"
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
                      color={selectedIcon === key ? "#8938E9" : "#000000"}
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

const AccountsModal = ({
  isVisible,
  onClose,
  accounts,
  onAddNewAccount,
  onSelectAccount,
}) => {
  const [isNewAccountModalVisible, setNewAccountModalVisible] = useState(false);

  const toggleNewAccountModal = () => {
    setNewAccountModalVisible(!isNewAccountModalVisible);
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
          <Text className="text-xl font-bold mb-4">Select Account</Text>
          <ScrollView>
            {accounts.map((account, index) => {
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
                    ₱{account.balance.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity
            onPress={toggleNewAccountModal}
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
            onClose={toggleNewAccountModal}
            onSave={onAddNewAccount}
          />
        </View>
      </View>
    </Modal>
  );
};

export default function addlaterecords() {
  const [selectedOption, setSelectedOption] = useState<"expense" | "income">(
    "expense"
  );
  const [initialAmount, setInitialAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isAccountsModalVisible, setAccountsModalVisible] = useState(false);
  const [isCategoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [isDatePickerModalVisible, setDatePickerModalVisible] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Date state
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    async function setupDatabaseAndLoadAccounts() {
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
    setupDatabaseAndLoadAccounts();
  }, []);

  const toggleAccountsModal = () => {
    setAccountsModalVisible(!isAccountsModalVisible);
  };

  const toggleCategoriesModal = () => {
    setCategoriesModalVisible(!isCategoriesModalVisible);
  };

  const toggleDatePickerModal = () => {
    setDatePickerModalVisible(!isDatePickerModalVisible);
  };

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
    setSelectedOption("expense");
    const current = new Date();
    setSelectedMonth(current.getMonth() + 1);
    setSelectedDay(current.getDate());
    setSelectedYear(current.getFullYear());
    console.log("Data cleared!");
  };

  const handleSave = async () => {
    const amount = parseFloat(initialAmount);
    const fromAccountId = selectedAccount?.id;
    const categoryId = selectedCategory?.id;
    const transactionType = selectedOption;
    const transactionNotes = notes;

    // Construct the Date object from the picker values
    const date = new Date(selectedYear, selectedMonth - 1, selectedDay);
    const transactionDate = date.toISOString();

    if (isNaN(amount) || amount <= 0 || !fromAccountId || !categoryId) {
      console.error(
        "Invalid input. Please check amount, account, and category."
      );
      return;
    }

    try {
      await updateAccountBalance(fromAccountId, amount, transactionType);
      await saveTransaction(
        fromAccountId,
        categoryId,
        amount,
        transactionType,
        transactionNotes,
        transactionDate
      );
      console.log("Transaction saved successfully!");
      // Add navigation logic if needed
    } catch (error) {
      console.error("Failed to save transaction:", error.message);
    }
  };

  const handleSwitchChange = (value) => {
    setSelectedOption(value);
    setSelectedCategory(null);
  };

  const options = [
    { label: "Income", value: "income" },
    { label: "Expense", value: "expense" },
  ];

  // Helper functions for date picker
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <View className="flex-1 items-center justify-center bg-[#C3C3C3] p-8">
      <AccountsModal
        isVisible={isAccountsModalVisible}
        onClose={toggleAccountsModal}
        accounts={accounts}
        onAddNewAccount={handleAddNewAccount}
        onSelectAccount={handleSelectAccount}
      />
      <CategoryModal
        isVisible={isCategoriesModalVisible}
        onClose={toggleCategoriesModal}
      >
        <CategorySelection
          onSelectCategory={handleSelectCategory}
          isVisible={isCategoriesModalVisible}
          type={selectedOption === "expense" ? "expense" : "income"}
        />
      </CategoryModal>
      {/* Date Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDatePickerModalVisible}
        onRequestClose={toggleDatePickerModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-11/12">
            <Text className="text-xl font-bold mb-4">Select Date</Text>
            <View className="flex-row justify-between w-full">
              {/* Month Picker */}
              <View className="w-1/3">
                <Picker
                  selectedValue={selectedMonth}
                  onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                >
                  {months.map((month) => (
                    <Picker.Item key={month} label={`${month}`} value={month} />
                  ))}
                </Picker>
              </View>
              {/* Day Picker */}
              <View className="w-1/3">
                <Picker
                  selectedValue={selectedDay}
                  onValueChange={(itemValue) => setSelectedDay(itemValue)}
                >
                  {days.map((day) => (
                    <Picker.Item key={day} label={`${day}`} value={day} />
                  ))}
                </Picker>
              </View>
              {/* Year Picker */}
              <View className="w-1/3">
                <Picker
                  selectedValue={selectedYear}
                  onValueChange={(itemValue) => setSelectedYear(itemValue)}
                >
                  {years.map((year) => (
                    <Picker.Item key={year} label={`${year}`} value={year} />
                  ))}
                </Picker>
              </View>
            </View>
            <TouchableOpacity
              className="mt-4 w-full h-10 rounded-lg bg-purple-600 justify-center items-center"
              onPress={toggleDatePickerModal}
            >
              <Text className="uppercase text-white">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Main UI */}
      <View className="w-full h-[80%] bg-white rounded-[20] p-4">
        <View className="items-center pb-7">
          <Text className="text-[14px] font-medium">Add new transaction</Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "position"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          className="flex-1"
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {/* DATE PICKER BUTTON */}
            <View className="flex-row items-center justify-between pb-5">
              <Text>Date</Text>
              <TouchableOpacity
                onPress={toggleDatePickerModal}
                className="w-[126px] h-[39px] flex-row items-center justify-center bg-[orange] px-5 py-3 rounded-full active:bg-[blue] gap-2"
              >
                <Text className="text-black text-[12px] font-medium">
                  {new Date(
                    selectedYear,
                    selectedMonth - 1,
                    selectedDay
                  ).toLocaleDateString()}
                </Text>
                <SVG_ICONS.ButtonArrowDown size={15} />
              </TouchableOpacity>
            </View>

            {/* ACCOUNT SELECT */}
            <View className="flex-row items-center justify-between pb-5">
              <Text>Account Select</Text>
              <TouchableOpacity
                onPress={toggleAccountsModal}
                className="w-[126px] h-12 flex-row gap-4 justify-center items-center bg-[#8938E9] rounded-full"
              >
                <SVG_ICONS.Account size={16} color="white" />
                <Text className="text-white text-base">
                  {selectedAccount ? selectedAccount.name : "Account"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* CASH FLOW */}
            <View className="flex-row items-center pb-5">
              <Text>Cash Flow</Text>
              <View className="flex-1 ml-[110]">
                <SwitchSelector
                  options={options}
                  initial={1}
                  onPress={handleSwitchChange}
                  backgroundColor={"#F0E4FF"}
                  textColor={"#000000"}
                  selectedColor={"#ffffff"}
                  buttonColor={"#7a44cf"}
                  hasPadding={true}
                  borderRadius={30}
                  borderColor={"#F0E4FF"}
                  height={40}
                  textStyle={{ fontSize: 12, fontWeight: "500" }}
                  selectedTextStyle={{ fontSize: 12, fontWeight: "500" }}
                />
              </View>
            </View>

            {/* CATEGORY PICKER */}
            <View className="flex-row items-center justify-between pb-5">
              <Text>Category Select</Text>
              <TouchableOpacity
                onPress={toggleCategoriesModal}
                className="w-[126px] h-12 flex-row gap-4 justify-center items-center bg-[#8938E9] rounded-full"
              >
                <SVG_ICONS.Category size={16} color="white" />
                <Text className="text-white text-base">
                  {selectedCategory ? selectedCategory.name : "Category"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* AMOUNT INPUT */}
            <View className="flex-col gap-2 justify-between pb-5">
              <Text>Amount</Text>
              <TextInput
                className="h-[40] border-2 border-gray-300 rounded-lg pl-2 p-0 bg-purple-100"
                placeholder="0"
                keyboardType="numeric"
                value={initialAmount}
                onChangeText={setInitialAmount}
              />
            </View>

            {/* NOTES */}
            <View className="flex-col gap-2 justify-between pb-5">
              <Text>Notes</Text>
              <TextInput
                className="w-full h-20 border-2 border-gray-300 rounded-lg p-2 bg-purple-100"
                placeholder="Write a note"
                multiline={true}
                numberOfLines={3}
                maxLength={100}
                value={notes}
                onChangeText={setNotes}
                textAlignVertical="top"
              />
            </View>

            {/* CLEAR AND SAVE BUTTON */}
            <View className="flex-row justify-end gap-4">
              <TouchableOpacity
                className="w-24 h-10 rounded-lg border-2 border-purple-500 justify-center items-center"
                onPress={handleClear}
              >
                <Text className="uppercase text-purple-600">Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-24 h-10 rounded-lg bg-purple-600 justify-center items-center"
                onPress={handleSave}
              >
                <Text className="uppercase text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
