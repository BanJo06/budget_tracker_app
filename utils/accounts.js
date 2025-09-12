import { getDb } from '@/utils/database';

/**
 * Gets all accounts from the database.
 */
export const getAccounts = () => {
    try {
        const db = getDb();
        const allRows = db.getAllSync('SELECT * FROM accounts;');
        return allRows;
    } catch (error) {
        console.error("Error getting accounts:", error);
        throw new Error("Failed to retrieve accounts from the database.");
    }
};

/**
 * Adds a new account to the database.
 */
export const addAccount = (name, type, initialBalance, icon_name) => {
    try {
        const db = getDb();
        db.runSync(
            `INSERT INTO accounts (name, type, balance, icon_name) VALUES (?, ?, ?, ?);`,
            [name, type, initialBalance, icon_name]
        );
        console.log(`Account '${name}' added successfully.`);
    } catch (error) {
        console.error("Error adding account:", error);
        throw new Error("Failed to add new account.");
    }
};

/**
 * Updates an existing account in the database.
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
 */
export const deleteAccount = (accountId) => {
    try {
        const db = getDb();
        db.runSync(`DELETE FROM accounts WHERE id = ?;`, [accountId]);
        console.log(`Account ${accountId} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting account:", error);
        throw new Error("Failed to delete account.");
    }
};
/**
 * Updates the balance of a specific account.
 */
export const updateAccountBalance = (accountId, amount, transactionType) => {
    try {
        const db = getDb();
        const updateQuery =
            transactionType === 'income'
                ? `UPDATE accounts SET balance = balance + ? WHERE id = ?;`
                : `UPDATE accounts SET balance = balance - ? WHERE id = ?;`;

        db.runSync(updateQuery, [amount, accountId]);
        console.log(`Account ${accountId} balance updated successfully.`);
    } catch (error) {
        console.error("Error updating account balance:", error);
        throw new Error("Failed to update account balance.");
    }
};