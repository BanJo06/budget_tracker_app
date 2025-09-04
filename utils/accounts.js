// import { getDb } from './database.js';

// /**
//  * Gets all accounts from the database.
//  * @returns {Array<Object>} An array of account objects.
//  */
// export const getAccounts = () => {
//     const db = getDb();
//     if (!db) {
//         // This case should ideally not be hit if initDatabase is called on app start
//         throw new Error('Database not initialized.');
//     }
//     try {
//         // Use the synchronous method
//         const allRows = db.getAllSync('SELECT * FROM accounts;');
//         return allRows;
//     } catch (error) {
//         console.error('Error getting accounts:', error);
//         throw new Error('Failed to retrieve accounts from the database.');
//     }
// };

// /**
//  * Saves or updates an account in the database.
//  * @param {string} accountName The name of the account.
//  * @param {string} accountType The type of the account.
//  * @param {string | number} initialBalance The initial balance of the account.
//  * @param {string} selectedIcon The name of the selected icon.
//  * @returns {void}
//  */
// export const saveAccount = (accountName, accountType, initialBalance, selectedIcon) => {
//     const db = getDb();
//     if (!db) {
//         throw new Error('Database not initialized.');
//     }
//     try {
//         const balanceNum = parseFloat(initialBalance);
//         // If the provided balance is not a valid number, default to 0.
//         const finalBalance = isNaN(balanceNum) ? 0 : balanceNum;

//         // Use the synchronous method
//         db.runSync(`
//       INSERT INTO accounts (name, type, balance, icon_name)
//       VALUES (?, ?, ?, ?)
//       ON CONFLICT(name) DO UPDATE SET type = excluded.type, balance = excluded.balance, icon_name = excluded.icon_name;
//     `, [accountName, accountType, finalBalance, selectedIcon]);
//         console.log(`Account '${accountName}' saved/updated successfully.`);

//     } catch (error) {
//         console.error(`Error saving account '${accountName}':`, error);
//         throw new Error(`Failed to save/update the account '${accountName}': ${error.message}`);
//     }
// };

import { getDb } from './database.js';

/**
 * Gets all accounts from the database.
 * @returns {Array<Object>} An array of account objects.
 */
export const getAccounts = () => {
    const db = getDb();
    if (!db) {
        throw new Error('Database not initialized.');
    }
    try {
        const allRows = db.getAllSync('SELECT * FROM accounts;');
        return allRows;
    } catch (error) {
        console.error('Error getting accounts:', error);
        throw new Error('Failed to retrieve accounts from the database.');
    }
};

/**
 * Adds a new account to the database.
 * @param {string} accountName The name of the account.
 * @param {string} accountType The type of the account.
 * @param {string | number} initialBalance The initial balance.
 * @param {string} selectedIcon The name of the selected icon.
 * @returns {void}
 */
export const addAccount = (accountName, accountType, initialBalance, selectedIcon) => {
    const db = getDb();
    if (!db) {
        throw new Error('Database not initialized.');
    }
    try {
        const balanceNum = parseFloat(initialBalance);
        const finalBalance = isNaN(balanceNum) ? 0 : balanceNum;

        db.runSync(`
            INSERT INTO accounts (name, type, balance, icon_name)
            VALUES (?, ?, ?, ?);
        `, [accountName, accountType, finalBalance, selectedIcon]);
        console.log(`Account '${accountName}' added successfully.`);

    } catch (error) {
        console.error(`Error adding account '${accountName}':`, error);
        throw new Error(`Failed to add the account '${accountName}': ${error.message}`);
    }
};

/**
 * Updates an existing account in the database.
 * @param {number} accountId The ID of the account to update.
 * @param {string} accountName The new name of the account.
 * @param {string} accountType The new type of the account.
 * @param {string | number} newBalance The new balance of the account.
 * @param {string} selectedIcon The new name of the selected icon.
 * @returns {void}
 */
export const updateAccount = (accountId, accountName, accountType, newBalance, selectedIcon) => {
    const db = getDb();
    if (!db) {
        throw new Error('Database not initialized.');
    }
    try {
        const balanceNum = parseFloat(newBalance);
        const finalBalance = isNaN(balanceNum) ? 0 : balanceNum;

        db.runSync(`
            UPDATE accounts
            SET name = ?, type = ?, balance = ?, icon_name = ?
            WHERE id = ?;
        `, [accountName, accountType, finalBalance, selectedIcon, accountId]);
        console.log(`Account with ID ${accountId} updated successfully.`);

    } catch (error) {
        console.error(`Error updating account with ID ${accountId}:`, error);
        throw new Error(`Failed to update account with ID ${accountId}: ${error.message}`);
    }
};

/**
 * Deletes an account from the database by its ID.
 * @param {number} accountId The ID of the account to delete.
 * @returns {void}
 */
export const deleteAccount = (accountId) => {
    const db = getDb();
    if (!db) {
        throw new Error('Database not initialized.');
    }
    try {
        db.runSync('DELETE FROM accounts WHERE id = ?;', [accountId]);
        console.log(`Account with ID ${accountId} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting account with ID ${accountId}:`, error);
        throw new Error(`Failed to delete account with ID ${accountId}: ${error.message}`);
    }
};