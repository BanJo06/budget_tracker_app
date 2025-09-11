import { getDb } from "@/utils/database";

const db = getDb();

/**
 * Gets all expense categories from the database.
 * @returns {Array<Object>} An array of expense category objects.
 */
export const getExpenseCategories = () => {
    try {
        const allRows = db.getAllSync('SELECT * FROM expense_categories;');
        return allRows;
    } catch (error) {
        console.error('Error getting expense categories:', error);
        throw new Error('Failed to retrieve expense categories from the database.');
    }
};

/**
 * Gets all income categories from the database.
 * @returns {Array<Object>} An array of income category objects.
 */
export const getIncomeCategories = () => {
    try {
        const allRows = db.getAllSync('SELECT * FROM income_categories;');
        return allRows;
    } catch (error) {
        console.error('Error getting income categories:', error);
        throw new Error('Failed to retrieve income categories from the database.');
    }
};