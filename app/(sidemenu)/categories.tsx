import { CATEGORIES_EXPENSES_SVG_ICONS } from "@/assets/constants/categories_expenses_icons";
import { CATEGORIES_INCOME_SVG_ICONS } from "@/assets/constants/categories_income_icons";
import { SVG_ICONS } from "@/assets/constants/icons";
import {
  getExpenseCategories,
  getIncomeCategories,
  saveNewCategory,
} from "@/database/categoryQueries";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SwitchSelector from "react-native-switch-selector";

// Define a type/interface for a category object for better type safety
interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
  icon_name: string;
}

// Helper component to render a single category item
interface CategoryItemProps {
  category: Category;
  IconMap: { [key: string]: React.FC<any> };
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, IconMap }) => {
  const IconComponent = IconMap[category.icon_name];
  return (
    <View className="pt-4 flex-row items-center justify-between">
      <View className="flex-row gap-4 items-center">
        {/* Category Icon Container */}
        <View className="w-[50] h-[50] rounded-full bg-[#8938E9] justify-center items-center">
          {IconComponent ? (
            <IconComponent width={30} height={30} color="#FFFFFF" />
          ) : (
            <Text style={{ color: "#FFFFFF" }}>?</Text>
          )}
        </View>
        <Text className="text-base">{category.name}</Text>
      </View>

      {/* Ellipsis/Menu Icon */}
      <View className="justify-center">
        <SVG_ICONS.Ellipsis width={24} height={24} />
      </View>
    </View>
  );
};

interface NewCategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (data: Omit<Category, "id">) => void;
}

const NewCategoryModal: React.FC<NewCategoryModalProps> = ({
  isVisible,
  onClose,
  onSave,
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<"income" | "expense">(
    "expense"
  );

  const handleSave = () => {
    if (!categoryName.trim() || !selectedIcon) {
      Alert.alert(
        "Missing Information",
        "Please enter a name and select an icon for the new category."
      );
      return;
    }

    const newCategoryData: Omit<Category, "id"> = {
      name: categoryName.trim(),
      type: selectedOption,
      icon_name: selectedIcon,
    };

    onSave(newCategoryData);
    setCategoryName("");
    setSelectedIcon(null);
    setSelectedOption("expense");
    onClose();
  };

  const handleSwitchChange = (value: "income" | "expense") => {
    setSelectedOption(value);
    setSelectedIcon(null);
  };

  const options = [
    { label: "Income", value: "income" },
    { label: "Expense", value: "expense" },
  ];

  const IconMap =
    selectedOption === "income"
      ? CATEGORIES_INCOME_SVG_ICONS
      : CATEGORIES_EXPENSES_SVG_ICONS;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-11/12">
          <Text className="text-xl font-bold mb-4">Add new category</Text>

          {/* Cash Flow Switch */}
          <View className="flex-row items-center pb-5">
            <Text>Cash Flow</Text>
            <View className="flex-1 ml-[110]">
              <SwitchSelector
                options={options}
                initial={selectedOption === "income" ? 0 : 1}
                onPress={(value) =>
                  handleSwitchChange(value as "income" | "expense")
                }
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

          {/* Category Name Input */}
          <View className="w-full flex-row gap-2 items-center mb-6">
            <Text>Name</Text>
            <TextInput
              className="flex-1 h-[40] border-2 border-gray-300 rounded-lg pl-2 p-0 bg-purple-100"
              placeholder="Untitled"
              value={categoryName}
              onChangeText={setCategoryName}
            />
          </View>

          {/* Icon Selection */}
          <View className="mb-6">
            <Text className="text-sm mb-2">
              Select Icon ({selectedOption.toUpperCase()})
            </Text>
            <View className="flex-row flex-wrap justify-start gap-4 h-[120px]">
              <ScrollView
                contentContainerStyle={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                {Object.entries(IconMap).map(([key, IconComponent]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setSelectedIcon(key)}
                    className={`p-2 rounded-full border-2 ${
                      selectedIcon === key
                        ? "border-purple-600 bg-purple-100"
                        : "border-gray-300"
                    }`}
                  >
                    <IconComponent
                      width={24}
                      height={24}
                      color={selectedIcon === key ? "#8938E9" : "#000000"}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
              className={`w-24 h-10 rounded-lg justify-center items-center ${
                categoryName.trim() && selectedIcon
                  ? "bg-purple-600"
                  : "bg-gray-400"
              }`}
              onPress={handleSave}
              disabled={!categoryName.trim() || !selectedIcon}
            >
              <Text className="uppercase text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function Categories() {
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 💡 State to trigger a reload
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const [isNewCategoryModalVisible, setNewCategoryModalVisible] =
    useState(false);

  const toggleNewCategoryModal = () => {
    setNewCategoryModalVisible(!isNewCategoryModalVisible);
  };

  // 💡 Function to load categories
  const loadCategories = useCallback(() => {
    try {
      setLoading(true);
      const income = getIncomeCategories();
      setIncomeCategories(income as Category[]);

      const expense = getExpenseCategories();
      setExpenseCategories(expense as Category[]);

      setError(null);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError("Failed to load categories. Check console for details.");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means it's created once

  // 💡 useEffect now depends on reloadTrigger
  useEffect(() => {
    loadCategories();
  }, [reloadTrigger, loadCategories]);

  // 💡 Handler to save the new category to the database
  const handleSaveNewCategory = (newCategoryData: Omit<Category, "id">) => {
    try {
      const newId = saveNewCategory(newCategoryData); // <-- Call the actual DB function

      // OPTIONAL: Instead of reloading the whole list, you can update the state directly
      const newCategory: Category = { ...newCategoryData, id: newId };
      if (newCategory.type === "income") {
        setIncomeCategories((prev) => [...prev, newCategory]);
      } else {
        setExpenseCategories((prev) => [...prev, newCategory]);
      }
      // OR, simply: setReloadTrigger(prev => prev + 1);

      Alert.alert("Success", `Category '${newCategory.name}' added!`);
    } catch (e: any) {
      console.error("Save Category Error:", e);
      Alert.alert(
        "Save Failed",
        e.message || "Could not save the category to the database."
      );
      // Re-open the modal or handle error appropriately if needed
      setNewCategoryModalVisible(true);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <View style={styles.fullscreenCenter}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2">Loading Categories...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.fullscreenCenter}>
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  // Main content wrapped in ScrollView
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Income Categories Section */}
      <View className="p-8">
        <Text className="text-xl font-bold mb-1">Income categories</Text>
        <View className="border-t-2 border-black mt-1"></View>

        {incomeCategories.length === 0 ? (
          <Text className="pt-4 text-gray-500">
            No income categories found.
          </Text>
        ) : (
          incomeCategories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              IconMap={CATEGORIES_INCOME_SVG_ICONS}
            />
          ))
        )}
      </View>
      <View className="border-b border-gray-200"></View>
      {/* Expense Categories Section */}
      <View className="py-4 px-8">
        <Text className="text-xl font-bold mb-1">Expense categories</Text>
        <View className="border-t-2 border-black mt-1"></View>

        {expenseCategories.length === 0 ? (
          <Text className="pt-4 text-gray-500">
            No expense categories found.
          </Text>
        ) : (
          expenseCategories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              IconMap={CATEGORIES_EXPENSES_SVG_ICONS}
            />
          ))
        )}
      </View>

      {/* Button container with increased bottom padding */}
      <View className="px-8 pb-8">
        <TouchableOpacity
          onPress={toggleNewCategoryModal}
          className="w-full h-[40] justify-center items-center border-2 border-purple-500 rounded-lg mt-4"
        >
          <View className="flex-row items-center justify-center gap-2">
            <SVG_ICONS.SmallAdd size={15} color="#8938E9" />
            <Text className="font-medium text-purple-600">
              ADD NEW CATEGORY
            </Text>
          </View>
        </TouchableOpacity>
        <NewCategoryModal
          isVisible={isNewCategoryModalVisible}
          onClose={toggleNewCategoryModal}
          onSave={handleSaveNewCategory}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  fullscreenCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});
