import { getDb } from './database.js';

/**
 * Gets all transactions from the database.
 * @returns {Array<Object>} An array of transaction objects.
 */
export const getTransactions = () => {
    const db = getDb();
    if (!db) {
        throw new Error('Database not initialized.');
    }
    try {
        // Use the synchronous method
        const allTransactions = db.getAllSync('SELECT * FROM transactions;');
        return allTransactions;
    } catch (error) {
        console.error('Error getting transactions:', error);
        throw new Error('Failed to retrieve transactions from the database.');
    }
};

/**
 * Saves a new transaction in the database.
 * @param {number} accountId The ID of the associated account.
 * @param {string} description The description of the transaction.
 * @param {string | number} amount The amount of the transaction.
 * @param {string} type The type of the transaction ('income' or 'expense').
 * @returns {void}
 */
export const saveTransaction = (accountId, description, amount, type) => {
    const db = getDb();
    if (!db) {
        throw new Error('Database not initialized.');
    }
    try {
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum)) {
            throw new Error('Invalid amount provided. Must be a number.');
        }
        const transactionDate = new Date().toISOString();

        // Use the synchronous method
        db.runSync(`
      INSERT INTO transactions (account_id, description, amount, type, date)
      VALUES (?, ?, ?, ?, ?);
    `, [accountId, description, amountNum, type, transactionDate]);
        console.log(`Transaction saved successfully.`);

    } catch (error) {
        console.error(`Error saving transaction:`, error);
        throw new Error(`Failed to save the transaction: ${error.message}`);
    }
};
