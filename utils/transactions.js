import { getDb } from "@/utils/database";

/**
 * Saves a new transaction record to the database.
 * @param {number} accountId The ID of the associated account.
 * @param {number} categoryId The ID of the associated category.
 * @param {number} amount The transaction amount.
 * @param {string} type The transaction type ('expense', 'income', 'transfer').
 * @param {string} notes The transaction description.
 */

// export const saveTransaction = (
//   accountId,
//   accountName,
//   categoryId,
//   amount,
//   type,
//   notes,
//   date,
//   isLateRecord = false // ✅ NEW optional parameter
// ) => {
//   const db = getDb();

//   db.runSync(
//     `INSERT INTO transactions (account_id, account_name, category_id, amount, type, description, date, source)
//      VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
//     [
//       accountId,
//       accountName,
//       categoryId,
//       amount,
//       type,
//       notes,
//       date,
//       isLateRecord ? "late_record" : null,
//     ]
//   );

//   console.log("Transaction saved:", {
//     accountId,
//     accountName,
//     categoryId,
//     amount,
//     type,
//     description: notes,
//     date,
//     source: isLateRecord ? "late_record" : null,
//   });
// };

export const saveTransaction = (
  accountId,
  accountName,
  categoryId,
  amount,
  type,
  notes,
  date,
  isLateRecord = false
) => {
  const db = getDb();

  db.runSync(
    `INSERT INTO transactions (account_id, account_name, category_id, amount, type, description, date, source)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      accountId,
      accountName,
      categoryId,
      amount,
      type,
      notes,
      date,
      isLateRecord ? "late_record" : null,
    ]
  );

  console.log("Transaction saved:", {
    accountId,
    accountName,
    categoryId,
    amount,
    type,
    description: notes,
    date,
    source: isLateRecord ? "late_record" : null,
  });

  // 🔥 NEW: Return the newly created transaction ID
  const result = db.getFirstSync("SELECT last_insert_rowid() AS id;");
  return result.id;
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
                T.source,
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
                T.source,
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

// export const saveTransferTransaction = (
//   fromAccountId,
//   toAccountId,
//   amount,
//   notes,
//   date
// ) => {
//   const db = getDb();
//   const type = "transfer";

//   try {
//     db.withTransactionSync(() => {
//       // 1. Withdraw from the source account
//       const fromAcc = db.getFirstSync(
//         "SELECT balance FROM accounts WHERE id = ?",
//         [fromAccountId]
//       );
//       if (!fromAcc) throw new Error("Source account not found");
//       if (Number(fromAcc.balance) < amount) {
//         throw new Error("Insufficient funds");
//       }

//       db.runSync("UPDATE accounts SET balance = balance - ? WHERE id = ?", [
//         amount,
//         fromAccountId,
//       ]);

//       // 2. Deposit into the destination account
//       const toAcc = db.getFirstSync(
//         "SELECT balance FROM accounts WHERE id = ?",
//         [toAccountId]
//       );
//       if (!toAcc) throw new Error("Destination account not found");

//       db.runSync("UPDATE accounts SET balance = balance + ? WHERE id = ?", [
//         amount,
//         toAccountId,
//       ]);

//       // 3. Save transaction record
//       db.runSync(
//         `INSERT INTO transactions
//           (account_id, to_account_id, amount, type, description, date)
//          VALUES (?, ?, ?, ?, ?, ?)`,
//         [fromAccountId, toAccountId, amount, type, notes, date]
//       );
//     });

//     console.log("✅ Atomic transfer successfully committed");
//   } catch (error) {
//     console.error("❌ Error saving transfer (rolled back):", error);
//     throw new Error(`Failed to perform transfer: ${error.message}`);
//   }
// };

export const saveTransferTransaction = (
  fromAccountId,
  toAccountId,
  amount,
  notes,
  date
) => {
  const db = getDb();
  const type = "transfer";

  try {
    db.withTransactionSync(() => {
      const fromAcc = db.getFirstSync(
        "SELECT balance FROM accounts WHERE id = ?",
        [fromAccountId]
      );
      if (!fromAcc) throw new Error("Source account not found");
      if (Number(fromAcc.balance) < amount) {
        throw new Error("Insufficient funds");
      }

      db.runSync("UPDATE accounts SET balance = balance - ? WHERE id = ?", [
        amount,
        fromAccountId,
      ]);

      const toAcc = db.getFirstSync(
        "SELECT balance FROM accounts WHERE id = ?",
        [toAccountId]
      );
      if (!toAcc) throw new Error("Destination account not found");

      db.runSync("UPDATE accounts SET balance = balance + ? WHERE id = ?", [
        amount,
        toAccountId,
      ]);

      db.runSync(
        `INSERT INTO transactions 
          (account_id, to_account_id, amount, type, description, date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [fromAccountId, toAccountId, amount, type, notes, date]
      );
    });

    console.log("✅ Atomic transfer successfully committed");

    // 🔥 NEW: Return newly created transfer transaction ID
    const result = db.getFirstSync("SELECT last_insert_rowid() AS id;");
    return result.id;
  } catch (error) {
    console.error("❌ Error saving transfer (rolled back):", error);
    throw new Error(`Failed to perform transfer: ${error.message}`);
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

/**
 * Saves a planned budget transaction into the transactions table.
 * This is separate from regular transactions to avoid conflicts.
 * @param {number} accountId The ID of the associated account
 * @param {number} plannedBudgetId The ID of the planned budget
 * @param {number} amount The transaction amount
 * @param {string} budgetName The name of the planned budget (used as description)
 * @param {string} date The transaction date
 */

// export const savePlannedBudgetAsTransaction = (
//   accountId,
//   plannedBudgetId,
//   amount,
//   budgetName,
//   date
// ) => {
//   const db = getDb();

//   try {
//     console.log("Saving planned budget as a transaction:", {
//       accountId,
//       plannedBudgetId,
//       amount,
//       budgetName,
//       date,
//     });

//     // ✅ Mark this transaction as "planned_budget"
//     db.runSync(
//       `INSERT INTO transactions (account_id, category_id, amount, type, description, date, source)
//        VALUES (?, ?, ?, ?, ?, ?, ?);`,
//       [accountId, null, amount, "expense", budgetName, date, "planned_budget"]
//     );

//     console.log("Planned budget transaction saved successfully.");
//   } catch (error) {
//     console.error("Error saving planned budget transaction:", error);
//   }
// };

export const savePlannedBudgetAsTransaction = (
  accountId,
  plannedBudgetId,
  amount,
  budgetName,
  date
) => {
  const db = getDb();

  try {
    console.log("Saving planned budget as a transaction:", {
      accountId,
      plannedBudgetId,
      amount,
      budgetName,
      date,
    });

    // ✅ Insert planned budget transaction
    db.runSync(
      `INSERT INTO transactions (account_id, category_id, amount, type, description, date, source)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [accountId, null, amount, "expense", budgetName, date, "planned_budget"]
    );

    console.log("Planned budget transaction saved successfully.");

    // 🔥 NEW: Return the newly created transaction ID
    const result = db.getFirstSync("SELECT last_insert_rowid() AS id;");
    return result.id;
  } catch (error) {
    console.error("Error saving planned budget transaction:", error);
    return null;
  }
};

// export const updateExistingTransaction = async ({
//   transactionId,
//   accountId,
//   categoryId,
//   amount,
//   type,
//   description,
//   date,
//   toAccountId, // Accept this argument
// }) => {
//   const db = await getDb();
//   await db.runAsync(
//     `UPDATE transactions
//       SET account_id = ?, category_id = ?, amount = ?, type = ?, description = ?, date = ?, to_account_id = ?
//       WHERE id = ?`,
//     [
//       accountId,
//       categoryId,
//       amount,
//       type,
//       description,
//       date,
//       toAccountId || null, // <--- CRITICAL: If it's undefined (Expense/Income), send NULL to DB
//       transactionId,
//     ]
//   );
// };

// transactions.js

export const updateExistingTransaction = async ({
  transactionId,
  accountId,
  categoryId,
  amount,
  type,
  description,
  date,
  toAccountId,
}) => {
  const db = await getDb();

  try {
    // 1. FETCH THE OLD TRANSACTION
    // We need to know what the values were BEFORE this edit to revert the balance correctly.
    const oldTransaction = await db.getFirstAsync(
      "SELECT * FROM transactions WHERE id = ?",
      [transactionId]
    );

    if (!oldTransaction) {
      throw new Error("Transaction not found");
    }

    // 2. REVERT THE OLD BALANCE
    // "Undo" what the previous version of this transaction did.
    if (oldTransaction.type === "expense") {
      // Expense removed money, so we ADD it back to the OLD account
      await db.runAsync(
        "UPDATE accounts SET balance = balance + ? WHERE id = ?",
        [oldTransaction.amount, oldTransaction.account_id]
      );
    } else if (oldTransaction.type === "income") {
      // Income added money, so we SUBTRACT it from the OLD account
      await db.runAsync(
        "UPDATE accounts SET balance = balance - ? WHERE id = ?",
        [oldTransaction.amount, oldTransaction.account_id]
      );
    } else if (oldTransaction.type === "transfer") {
      // Transfer removed from Source and added to Destination.
      // REVERSE: Add to Source, Subtract from Destination.
      await db.runAsync(
        "UPDATE accounts SET balance = balance + ? WHERE id = ?",
        [oldTransaction.amount, oldTransaction.account_id]
      );
      if (oldTransaction.to_account_id) {
        await db.runAsync(
          "UPDATE accounts SET balance = balance - ? WHERE id = ?",
          [oldTransaction.amount, oldTransaction.to_account_id]
        );
      }
    }

    // 3. APPLY THE NEW BALANCE
    // Now apply the logic for the NEW values (New Amount, New Type, New Account).
    if (type === "expense") {
      // New Expense: Subtract from NEW account
      await db.runAsync(
        "UPDATE accounts SET balance = balance - ? WHERE id = ?",
        [amount, accountId]
      );
    } else if (type === "income") {
      // New Income: Add to NEW account
      await db.runAsync(
        "UPDATE accounts SET balance = balance + ? WHERE id = ?",
        [amount, accountId]
      );
    } else if (type === "transfer") {
      // New Transfer: Subtract from Source, Add to Destination
      await db.runAsync(
        "UPDATE accounts SET balance = balance - ? WHERE id = ?",
        [amount, accountId]
      );
      if (toAccountId) {
        await db.runAsync(
          "UPDATE accounts SET balance = balance + ? WHERE id = ?",
          [amount, toAccountId]
        );
      }
    }

    // 4. UPDATE THE TRANSACTION RECORD
    // Finally, update the transaction details in the database
    await db.runAsync(
      `UPDATE transactions
       SET account_id = ?, category_id = ?, amount = ?, type = ?, description = ?, date = ?, to_account_id = ?
       WHERE id = ?`,
      [
        accountId,
        categoryId,
        amount,
        type,
        description,
        date,
        toAccountId || null, // Ensure null if undefined
        transactionId,
      ]
    );

    console.log(
      `Transaction ${transactionId} and Account Balances updated successfully.`
    );
  } catch (error) {
    console.error("Error updating transaction and balances:", error);
    throw new Error("Failed to update transaction.");
  }
};
