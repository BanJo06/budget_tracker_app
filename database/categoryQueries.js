import { getDb } from "@/utils/database";

const db = getDb();

/**
 * Gets all expense categories from the database.
 * @returns {Array<Object>} An array of expense category objects.
 */
export const getExpenseCategories = () => {
    try {
        const db = getDb();
        // Fix: Use the correct table name 'categories' and filter by type 'expense'
        const allRows = db.getAllSync('SELECT * FROM categories WHERE type = ?;', ['expense']);
        console.log(`Fetched ${allRows.length} expense categories.`);
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
        const db = getDb();
        // Use the correct table name 'categories' and filter by type 'income'
        const allRows = db.getAllSync('SELECT * FROM categories WHERE type = ?;', ['income']);
        console.log(`Fetched ${allRows.length} income categories.`);
        return allRows;
    } catch (error) {
        console.error('Error getting income categories:', error);
        throw new Error('Failed to retrieve income categories from the database.');
    }
};

export const getCategoriesByType = (type) => {
    try {
        const db = getDb();
        const allRows = db.getAllSync('SELECT * FROM categories WHERE type = ?;', [type]);
        console.log(`Fetched ${allRows.length} categories of type '${type}'.`);
        return allRows;
    } catch (error) {
        console.error(`Error fetching categories of type '${type}':`, error);
        throw new Error(`Failed to retrieve categories of type '${type}' from the database.`);
    }
};