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
    const allRows = db.getAllSync("SELECT * FROM categories WHERE type = ?;", [
      "expense",
    ]);
    console.log(`Fetched ${allRows.length} expense categories.`);
    return allRows;
  } catch (error) {
    console.error("Error getting expense categories:", error);
    throw new Error("Failed to retrieve expense categories from the database.");
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
    const allRows = db.getAllSync("SELECT * FROM categories WHERE type = ?;", [
      "income",
    ]);
    console.log(`Fetched ${allRows.length} income categories.`);
    return allRows;
  } catch (error) {
    console.error("Error getting income categories:", error);
    throw new Error("Failed to retrieve income categories from the database.");
  }
};

export const getCategoriesByType = (type) => {
  try {
    const db = getDb();
    const allRows = db.getAllSync("SELECT * FROM categories WHERE type = ?;", [
      type,
    ]);
    console.log(`Fetched ${allRows.length} categories of type '${type}'.`);
    return allRows;
  } catch (error) {
    console.error(`Error fetching categories of type '${type}':`, error);
    throw new Error(
      `Failed to retrieve categories of type '${type}' from the database.`
    );
  }
};

/**
 * Adds a new category to the database.
 * @param {Object} categoryData - The category data.
 * @param {string} categoryData.name - The name of the category.
 * @param {'income' | 'expense'} categoryData.type - The type of the category.
 * @param {string} categoryData.icon_name - The icon name for the category.
 * @returns {number} The ID of the newly inserted row.
 */
export const saveNewCategory = ({ name, type, icon_name }) => {
  try {
    const db = getDb();
    const result = db.runSync(
      "INSERT INTO categories (name, type, icon_name) VALUES (?, ?, ?);",
      [name, type, icon_name]
    );
    console.log(
      `New category '${name}' saved with ID: ${result.lastInsertRowId}`
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error(`Error saving new category '${name}':`, error);
    // Throw a specific error if it's a unique constraint violation (category name already exists)
    if (error.message.includes("UNIQUE constraint failed: categories.name")) {
      throw new Error(`The category name '${name}' already exists.`);
    }
    throw new Error("Failed to save new category to the database.");
  }
};
