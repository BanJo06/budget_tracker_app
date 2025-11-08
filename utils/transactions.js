import { getDb } from "@/utils/database";

/**
 * Saves a new transaction record to the database.
 * @param {number} accountId The ID of the associated account.
 * @param {number} categoryId The ID of the associated category.
 * @param {number} amount The transaction amount.
 * @param {string} type The transaction type ('expense', 'income', 'transfer').
 * @param {string} notes The transaction description.
 */

export const saveTransaction = (
  accountId,
  categoryId,
  amount,
  type,
  notes,
  date
) => {
  const db = getDb();

  try {
    console.log("Attempting to save transaction with these parameters:");
    console.log({
      accountId,
      categoryId,
      amount,
      type,
      description: notes,
      date,
    });

    db.runSync(
      `INSERT INTO transactions (account_id, category_id, amount, type, description, date) VALUES (?, ?, ?, ?, ?, ?);`,
      [accountId, categoryId, amount, type, notes, date]
    );
    console.log("Transaction saved successfully.");
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
                T.to_account_id, -- NEW: Include the 'to' account ID
                C.name AS category_name, 
                C.icon_name AS category_icon_name,
                A.name AS account_name,
                A.icon_name AS account_icon_name,
                AT.name AS to_account_name, -- NEW: Alias for the destination account's name
                AT.icon_name AS to_account_icon_name -- NEW: Alias for the destination account's icon
            FROM transactions AS T
            LEFT JOIN categories AS C ON T.category_id = C.id
            LEFT JOIN accounts AS A ON T.account_id = A.id
            LEFT JOIN accounts AS AT ON T.to_account_id = AT.id -- NEW: Join accounts a second time for the destination account
            ORDER BY T.date DESC;
        `;
    const transactions = db.getAllSync(query);

    console.log("Fetched transactions from database:");
    console.log(JSON.stringify(transactions, null, 2));

    console.log(
      "Transactions fetched successfully with category and transfer details."
    );
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
                T.to_account_id, -- NEW: Include the 'to' account ID
                C.name AS category_name, 
                C.icon_name AS category_icon_name,
                A.name AS account_name,
                A.icon_name AS account_icon_name,
                AT.name AS to_account_name, -- NEW: Alias for the destination account's name
                AT.icon_name AS to_account_icon_name -- NEW: Alias for the destination account's icon
            FROM transactions AS T
            LEFT JOIN categories AS C ON T.category_id = C.id
            LEFT JOIN accounts AS A ON T.account_id = A.id
            LEFT JOIN accounts AS AT ON T.to_account_id = AT.id -- NEW: Join accounts a second time
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
    db.runSync("DELETE FROM transactions WHERE id = ?;", [id]);
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
    console.error(
      `Error fetching transactions for account ${accountId}:`,
      error
    );
    throw new Error(`Failed to fetch transactions for account ${accountId}.`);
  }
};

export const saveTransferTransaction = (
  fromAccountId,
  toAccountId,
  amount,
  notes,
  date
) => {
  const db = getDb();
  const type = "transfer"; // Explicitly set the type for a transfer

  try {
    console.log(
      "Attempting to save transfer transaction with these parameters:"
    );
    console.log({
      fromAccountId,
      toAccountId,
      amount,
      type,
      description: notes,
      date,
    });

    // Add a new column 'to_account_id' in your transactions table to store the destination account ID
    db.runSync(
      `INSERT INTO transactions (account_id, to_account_id, amount, type, description, date) VALUES (?, ?, ?, ?, ?, ?);`,
      [fromAccountId, toAccountId, amount, type, notes, date]
    );
    console.log("Transfer transaction saved successfully.");
  } catch (error) {
    console.error("Error saving transfer transaction:", error);
    throw new Error("Failed to save transfer transaction.");
  }
};

/**
 * Calculates the date from N days ago in 'YYYY-MM-DD' format.
 * @param {number} days The number of days to go back (e.g., 7 for one week).
 * @returns {string} The date string N days ago.
 */
const getDateNDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  // Format as YYYY-MM-DD
  return date.toISOString().split("T")[0];
};

/**
 * Retrieves transactions from the last N days with associated details.
 * @param {number} days The number of days to look back (e.g., 7).
 * @returns {Array<Object>} An array of transaction objects with joined data.
 */
export const getTransactionsForLastNDays = (days) => {
  try {
    const db = getDb();
    const startDate = getDateNDaysAgo(days);

    const query = `
            SELECT 
                T.id, 
                T.amount, 
                T.type, 
                T.description, 
                T.date, 
                T.account_id, 
                T.category_id,
                T.to_account_id,
                C.name AS category_name, 
                A.name AS account_name,
                AT.name AS to_account_name
            FROM transactions AS T
            LEFT JOIN categories AS C ON T.category_id = C.id
            LEFT JOIN accounts AS A ON T.account_id = A.id
            LEFT JOIN accounts AS AT ON T.to_account_id = AT.id
            WHERE T.date >= ? -- Filter by date from N days ago
            ORDER BY T.date DESC;
        `;
    const transactions = db.getAllSync(query, [startDate]);

    console.log(`Transactions fetched successfully for the last ${days} days.`);
    return transactions;
  } catch (error) {
    console.error(`Error fetching transactions for last ${days} days:`, error);
    throw new Error(`Failed to fetch transactions for last ${days} days.`);
  }
};
