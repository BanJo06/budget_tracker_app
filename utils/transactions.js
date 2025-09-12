import { getDb } from '@/utils/database';

/**
 * Saves a new transaction record to the database.
 * @param {number} accountId The ID of the associated account.
 * @param {number} categoryId The ID of the associated category.
 * @param {number} amount The transaction amount.
 * @param {string} type The transaction type ('expense', 'income', 'transfer').
 * @param {string} notes The transaction description.
 */
export const saveTransaction = (accountId, categoryId, amount, type, notes) => {
    const db = getDb();
    const date = new Date().toISOString();

    try {
        // Log the data *just before* saving it
        console.log("Attempting to save transaction with these parameters:");
        console.log({ accountId, categoryId, amount, type, description: notes, date });

        db.runSync(
            `INSERT INTO transactions (account_id, category_id, amount, type, description, date) VALUES (?, ?, ?, ?, ?, ?);`,
            [accountId, categoryId, amount, type, notes, date]
        );
        console.log('Transaction saved successfully.');
    } catch (error) {
        console.error("Error saving transaction:", error);
        throw new Error("Failed to save transaction.");
    }
};

/**
 * Retrieves all transactions with associated category and account details.
 * @returns {Array<Object>} An array of transaction objects with joined data.
 */
export const getAllTransactions = () => {
    try {
        const db = getDb();
        const query = `
            SELECT 
                T.id, 
                T.amount, 
                T.type, 
                T.description, 
                T.date, 
                T.account_id, 
                T.category_id,
                C.name AS category_name, 
                C.icon_name AS category_icon_name,
                A.name AS account_name,
                A.icon_name AS account_icon_name
            FROM transactions AS T
            INNER JOIN categories AS C ON T.category_id = C.id
            LEFT JOIN accounts AS A ON T.account_id = A.id
            ORDER BY T.date DESC;
        `;
        const transactions = db.getAllSync(query);

        // This is the log we need. It shows what is actually in the database.
        console.log("Fetched transactions from database:");
        console.log(JSON.stringify(transactions, null, 2));

        console.log("Transactions fetched successfully with category details.");
        return transactions;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw new Error("Failed to fetch transactions.");
    }
};


/**
 * Retrieves a single transaction by its ID.
 * @param {number} id The ID of the transaction to retrieve.
 * @returns {Object} The transaction object with joined data.
 */
export const getTransactionById = (id) => {
    try {
        const db = getDb();
        const query = `
            SELECT 
                T.id, 
                T.amount, 
                T.type, 
                T.description, 
                T.date, 
                T.account_id, 
                T.category_id,
                C.name AS category_name, 
                C.icon_name AS category_icon_name,
                A.name AS account_name,
                A.icon_name AS account_icon_name
            FROM transactions AS T
            LEFT JOIN categories AS C ON T.category_id = C.id
            LEFT JOIN accounts AS A ON T.account_id = A.id
            WHERE T.id = ?;
        `;
        const transaction = db.getFirstSync(query, [id]);
        return transaction;
    } catch (error) {
        console.error(`Error fetching transaction with ID ${id}:`, error);
        throw new Error(`Failed to fetch transaction with ID ${id}.`);
    }
};

/**
 * Deletes a transaction by its ID.
 * @param {number} id The ID of the transaction to delete.
 */
export const deleteTransaction = (id) => {
    try {
        const db = getDb();
        db.runSync('DELETE FROM transactions WHERE id = ?;', [id]);
        console.log(`Transaction with ID ${id} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting transaction with ID ${id}:`, error);
        throw new Error(`Failed to delete transaction with ID ${id}.`);
    }
};

/**
 * Retrieves transactions for a specific account.
 * @param {number} accountId The ID of the account.
 * @returns {Array<Object>} An array of transaction objects.
 */
export const getTransactionsByAccount = (accountId) => {
    try {
        const db = getDb();
        const query = `
            SELECT 
                T.id, 
                T.amount, 
                T.type, 
                T.description, 
                T.date, 
                T.account_id, 
                T.category_id,
                C.name AS category_name, 
                C.icon_name AS category_icon_name,
                A.name AS account_name,
                A.icon_name AS account_icon_name
            FROM transactions AS T
            LEFT JOIN categories AS C ON T.category_id = C.id
            LEFT JOIN accounts AS A ON T.account_id = A.id
            WHERE T.account_id = ?
            ORDER BY T.date DESC;
        `;
        const transactions = db.getAllSync(query, [accountId]);
        return transactions;
    } catch (error) {
        console.error(`Error fetching transactions for account ${accountId}:`, error);
        throw new Error(`Failed to fetch transactions for account ${accountId}.`);
    }
};

export const addSampleTransactions = () => {
    const db = getDb();
    try {
        const foodCategory = db.getFirstSync('SELECT id FROM categories WHERE name = ?', ['Food']);
        const salaryCategory = db.getFirstSync('SELECT id FROM categories WHERE name = ?', ['Salary']);

        if (foodCategory && salaryCategory) {
            // Check if transactions already exist to prevent duplicates
            const count = db.getFirstSync('SELECT COUNT(*) AS count FROM transactions');
            if (count.count === 0) {
                db.runSync('INSERT INTO transactions (amount, type, description, date, category_id) VALUES (?, ?, ?, ?, ?);', [50.00, 'expense', 'Lunch', new Date().toISOString(), foodCategory.id]);
                db.runSync('INSERT INTO transactions (amount, type, description, date, category_id) VALUES (?, ?, ?, ?, ?);', [2500.00, 'income', 'Monthly Salary', new Date().toISOString(), salaryCategory.id]);
                console.log("Sample transactions added successfully.");
            }
        } else {
            console.log("Categories not found, cannot add sample transactions.");
        }
    } catch (error) {
        console.error("Error adding sample transactions:", error);
    }
};

export const saveTransferTransaction = (fromAccountId, toAccountId, amount, notes) => {
    const db = getDb();
    const date = new Date().toISOString();
    const type = 'transfer'; // Explicitly set the type for a transfer

    try {
        console.log("Attempting to save transfer transaction with these parameters:");
        console.log({ fromAccountId, toAccountId, amount, type, description: notes, date });

        // Add a new column 'to_account_id' in your transactions table to store the destination account ID
        db.runSync(
            `INSERT INTO transactions (account_id, to_account_id, amount, type, description, date) VALUES (?, ?, ?, ?, ?, ?);`,
            [fromAccountId, toAccountId, amount, type, notes, date]
        );
        console.log('Transfer transaction saved successfully.');
    } catch (error) {
        console.error("Error saving transfer transaction:", error);
        throw new Error("Failed to save transfer transaction.");
    }
};