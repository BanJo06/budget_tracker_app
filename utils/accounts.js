import { getDb } from './database.js';

/**
 * Gets all accounts from the database.
 * @returns {Array<Object>} An array of account objects.
 */
export const getAccounts = () => {
    const db = getDb();
    if (!db) {
        // This case should ideally not be hit if initDatabase is called on app start
        throw new Error('Database not initialized.');
    }
    try {
        // Use the synchronous method
        const allRows = db.getAllSync('SELECT * FROM accounts;');
        return allRows;
    } catch (error) {
        console.error('Error getting accounts:', error);
        throw new Error('Failed to retrieve accounts from the database.');
    }
};

/**
 * Saves or updates an account in the database.
 * @param {string} accountName The name of the account.
 * @param {string} accountType The type of the account.
 * @param {string | number} initialBalance The initial balance of the account.
 * @param {string} selectedIcon The name of the selected icon.
 * @returns {void}
 */
export const saveAccount = (accountName, accountType, initialBalance, selectedIcon) => {
    const db = getDb();
    if (!db) {
        throw new Error('Database not initialized.');
    }
    try {
        const balanceNum = parseFloat(initialBalance);
        // If the provided balance is not a valid number, default to 0.
        const finalBalance = isNaN(balanceNum) ? 0 : balanceNum;

        // Use the synchronous method
        db.runSync(`
      INSERT INTO accounts (name, type, balance, icon_name)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(name) DO UPDATE SET type = excluded.type, balance = excluded.balance, icon_name = excluded.icon_name;
    `, [accountName, accountType, finalBalance, selectedIcon]);
        console.log(`Account '${accountName}' saved/updated successfully.`);

    } catch (error) {
        console.error(`Error saving account '${accountName}':`, error);
        throw new Error(`Failed to save/update the account '${accountName}': ${error.message}`);
    }
};