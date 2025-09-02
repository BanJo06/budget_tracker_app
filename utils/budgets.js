import { getBudget, saveBudget } from './database.js';

/**
 * Gets a single budget value from the database.
 * @param {string} budgetName The name of budget to retrieve (e.g., 'daily_budget', 'monthly_budget').
 * @returns {number} The budget value.
 */
export const getBudgetValue = (budgetName) => {
    try {
        const budget = getBudget(budgetName);
        // The getBudget function now returns a default object if the budget doesn't exist,
        // so we can safely return the balance directly.
        return budget.balance;
    } catch (error) {
        console.error(`Error getting value for ${budgetName}:`, error);
        throw new Error(`Failed to retrieve budget for ${budgetName}.`);
    }
};

/**
 * Saves or updates a budget value in the database.
 * @param {string} budgetName The name of the budget.
 * @param {string | number} value The new budget value.
 * @returns {void}
 */
export const saveBudgetValue = (budgetName, value) => {
    try {
        // saveBudget is a synchronous function, so await is not needed.
        saveBudget(budgetName, value);
        console.log(`Budget for ${budgetName} saved/updated successfully.`);
    } catch (error) {
        console.error(`Error saving budget for ${budgetName}:`, error);
        throw new Error(`Failed to save/update the value for type '${budgetName}': ${error.message}`);
    }
};

