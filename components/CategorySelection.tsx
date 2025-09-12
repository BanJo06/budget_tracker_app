import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
// Adjust imports for both icon maps
import { CATEGORIES_EXPENSES_SVG_ICONS } from '@/assets/constants/categories_expenses_icons';
import { CATEGORIES_INCOME_SVG_ICONS } from '@/assets/constants/categories_income_icons';
// Correct import path for query functions
import { getExpenseCategories, getIncomeCategories } from '@/database/categoryQueries';

interface CategorySelectionProps {
    onSelectCategory: (category: any) => void;
    isVisible: boolean;
    // Add the new prop
    type: 'expense' | 'income';
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ onSelectCategory, isVisible, type }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (isVisible) {
            const fetchCategories = async () => {
                try {
                    let fetchedCategories;
                    if (type === 'expense') {
                        fetchedCategories = await getExpenseCategories();
                    } else if (type === 'income') {
                        fetchedCategories = await getIncomeCategories();
                    } else {
                        // Handle other types like 'transfer' if needed
                        fetchedCategories = [];
                    }
                    console.log(`Fetched ${type} Categories:`, fetchedCategories);
                    setCategories(fetchedCategories);
                } catch (error) {
                    console.error(`Failed to fetch ${type} categories:`, error);
                }
            };
            fetchCategories();
        }
    }, [isVisible, type]); // Rerun the effect when 'type' changes

    const renderCategoryItem = (category: any, index: number) => {
        // Select the correct icon map based on the type
        const iconMap = type === 'expense' ? CATEGORIES_EXPENSES_SVG_ICONS : CATEGORIES_INCOME_SVG_ICONS;
        const IconComponent = iconMap[category.icon_name];

        return (
            <TouchableOpacity
                key={index}
                onPress={() => onSelectCategory(category)}
                className="w-full flex-row items-center p-3 border-b border-gray-200"
            >
                <View className="w-[40] h-[40] bg-[#8938E9] rounded-full justify-center items-center mr-4">
                    {IconComponent && <IconComponent size={24} color="white" />}
                </View>
                <Text className="text-lg font-regular text-gray-800">{category.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView className="w-full h-full">
            {categories.map(renderCategoryItem)}
        </ScrollView>
    );
};

export default CategorySelection;