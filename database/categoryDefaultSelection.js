import { getDb } from "@/utils/database";

// Define the default categories for expenses and income
const defaultExpenseCategories = [
  { name: "Transportation", icon_name: "Transportation" },
  { name: "Clothing", icon_name: "Clothing" },
  { name: "Foods", icon_name: "Foods" },
  { name: "Shopping", icon_name: "Shopping" },
  { name: "Entertainment", icon_name: "Entertainment" },
  { name: "Other Expenses", icon_name: "OtherExpenses" },
];

const defaultIncomeCategories = [
  { name: "Allowance", icon_name: "Allowance" },
  { name: "Lottery", icon_name: "Lottery" },
  { name: "Refunds", icon_name: "Refunds" },
  { name: "Salary", icon_name: "Salary" },
  { name: "Sideline", icon_name: "Sideline" },
  { name: "Other Income", icon_name: "OtherIncome" },
];

/**
 * Seeds the database with default expense and income categories.
 */
export const seedDefaultCategories = () => {
  try {
    const db = getDb();
    console.log("Seeding default categories...");

    // Start a transaction for efficiency
    db.withTransactionSync(() => {
      // Insert default expense categories
      defaultExpenseCategories.forEach((category) => {
        db.runSync(
          "INSERT INTO categories (name, type, icon_name) VALUES (?, ?, ?) ON CONFLICT(name) DO NOTHING;",
          [category.name, "expense", category.icon_name]
        );
      });

      // Insert default income categories
      defaultIncomeCategories.forEach((category) => {
        db.runSync(
          "INSERT INTO categories (name, type, icon_name) VALUES (?, ?, ?) ON CONFLICT(name) DO NOTHING;",
          [category.name, "income", category.icon_name]
        );
      });
    });

    console.log("Default categories seeded successfully.");
  } catch (error) {
    console.error("Error seeding default categories:", error);
  }
};

/**
 * Fetches all categories of a specific type.
 * @param {string} type The category type ('expense' or 'income').
 * @returns {Array<Object>} An array of category objects.
 */
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
