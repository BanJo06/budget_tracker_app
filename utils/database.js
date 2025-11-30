import * as FileSystem from "expo-file-system/legacy"; // 👈 Use the legacy import
import * as SQLite from "expo-sqlite";

// Database name and path
const dbName = "budget_tracker.db";
const sqliteDir = `${FileSystem.documentDirectory}SQLite`;

(async () => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(sqliteDir);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(sqliteDir, {
        intermediates: true,
      });
      console.log("📁 SQLite directory ensured.");
    } else {
      console.log("📁 SQLite directory already exists.");
    }
  } catch (err) {
    console.error("⚠️ Error ensuring SQLite directory:", err);
  }
})();

// ✅ Open database (sync for legacy SQLite API)
export const db = SQLite.openDatabaseSync(dbName);

// === Utility ===
export const getDatabaseFilePath = () => dbPath;

// === Initialize Database ===
export const initDatabase = async () => {
  try {
    console.log("Initializing database schema...");
    db.execSync("PRAGMA journal_mode = WAL;");

    db.withTransactionSync(() => {
      // === Keep existing tables and checks unchanged ===
      const existingTables = db.getAllSync(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='planned_budgets';`
      );

      if (existingTables.length > 0) {
        const columns = db.getAllSync(`PRAGMA table_info(planned_budgets);`);
        const hasNotNullDateColumns = columns.some(
          (col) =>
            (col.name === "start_date" && col.notnull === 1) ||
            (col.name === "end_date" && col.notnull === 1)
        );

        if (hasNotNullDateColumns) {
          console.log(
            "⚠️ Old planned_budgets schema detected (NOT NULL dates). Recreating table..."
          );
          db.execSync("DROP TABLE IF EXISTS planned_budgets;");
        }
      }

      // === All tables unchanged, existing code preserved ===
      db.execSync(`
        CREATE TABLE IF NOT EXISTS accounts (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          balance REAL NOT NULL,
          icon_name TEXT
        );

        CREATE TABLE IF NOT EXISTS budgets (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL UNIQUE,
          balance REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL UNIQUE,
          type TEXT NOT NULL,
          icon_name TEXT
        );

        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY NOT NULL,
          amount REAL NOT NULL,
          type TEXT NOT NULL,
          description TEXT,
          date TEXT NOT NULL,
          account_id INTEGER,
          account_name TEXT,
          category_id INTEGER,
          icon_name TEXT,
          to_account_id INTEGER,
          source TEXT,
          FOREIGN KEY (account_id) REFERENCES accounts(id),
          FOREIGN KEY (category_id) REFERENCES categories(id),
          FOREIGN KEY (to_account_id) REFERENCES accounts(id)
        );

        CREATE TABLE IF NOT EXISTS planned_budgets (
          id INTEGER PRIMARY KEY NOT NULL,
          budget_name TEXT NOT NULL,
          amount REAL NOT NULL,
          color_name TEXT,
          start_date TEXT NULL,
          end_date TEXT NULL,
          is_ongoing INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS planned_budget_transactions (
          id INTEGER PRIMARY KEY NOT NULL,
          planned_budget_id INTEGER NOT NULL,
          amount REAL NOT NULL,
          date TEXT NOT NULL,
          account_id INTEGER,
          FOREIGN KEY (planned_budget_id) REFERENCES planned_budgets(id),
          FOREIGN KEY (account_id) REFERENCES accounts(id)
        );

        CREATE TABLE IF NOT EXISTS user_streak (
          id INTEGER PRIMARY KEY NOT NULL,
          current_streak INTEGER DEFAULT 0,
          last_checked_date TEXT, -- Store as YYYY-MM-DD
          highest_streak INTEGER DEFAULT 0
        );
      `);

      db.runSync(
        `INSERT OR IGNORE INTO user_streak (id, current_streak, last_checked_date, highest_streak) 
         VALUES (1, 0, '', 0);`
      );

      // === Indexes unchanged ===
      if (
        !db.getFirstSync(
          "SELECT name FROM sqlite_master WHERE type='index' AND name='idx_accounts_name';"
        )
      ) {
        db.execSync("CREATE UNIQUE INDEX idx_accounts_name ON accounts(name);");
      }

      if (
        !db.getFirstSync(
          "SELECT name FROM sqlite_master WHERE type='index' AND name='idx_budgets_name';"
        )
      ) {
        db.execSync("CREATE UNIQUE INDEX idx_budgets_name ON budgets(name);");
      }
    });

    console.log("✅ Database initialized successfully.");
  } catch (error) {
    console.error("❌ Error initializing database tables:", error);
    throw error;
  }
};

// === Export DB reference ===
export const getDb = () => db;

// ✅ Optional: Async-safe helper to ensure DB initialized before any action
export const ensureDatabase = async () => {
  const exists = await checkIfDatabaseExists();
  if (!exists) {
    console.log("Database does not exist, initializing...");
    await initDatabase();
  }
};

export const getAccounts = () => {
  try {
    return db.getAllSync("SELECT * FROM accounts;");
  } catch (error) {
    console.error("Error getting accounts:", error);
    throw new Error("Failed to retrieve accounts from the database.");
  }
};

export const getAccountBalance = (accountId) => {
  try {
    const db = getDb();
    const account = db.getFirstSync(
      "SELECT balance FROM accounts WHERE id = ?;",
      [accountId]
    );
    if (!account) {
      console.warn(`Account ID ${accountId} not found for balance check.`);
      return 0; // Return 0 or throw an error based on your preference
    }
    return Number(account.balance);
  } catch (error) {
    console.error("Error fetching account balance:", error);
    throw new Error(`Failed to fetch account balance: ${error.message}`);
  }
};

// Budgets
export const getBudgets = () => {
  try {
    return db.getAllSync("SELECT * FROM budgets;");
  } catch (error) {
    console.error("Error getting budgets:", error);
    throw new Error("Failed to retrieve budgets.");
  }
};

// export const getBudget = (name) => {
//   try {
//     const row = db.getFirstSync("SELECT * FROM budgets WHERE name = ?;", [
//       name,
//     ]);
//     return row || { name, balance: 0 };
//   } catch (error) {
//     console.error(`Error getting budget '${name}':`, error);
//     throw new Error(`Failed to retrieve budget '${name}'.`);
//   }
// };

export const getBudget = (name) => {
  try {
    const row = db.getFirstSync("SELECT * FROM budgets WHERE name = ?;", [
      name,
    ]);
    console.log("Fetched budget row:", row);
    return row || { name, balance: 0 };
  } catch (error) {
    console.error(`Error getting budget '${name}':`, error);
    return { name, balance: 0 };
  }
};

export const saveBudget = (name, balance) => {
  try {
    const b = parseFloat(balance);
    db.runSync(
      `
      INSERT INTO budgets (name, balance)
      VALUES (?, ?)
      ON CONFLICT(name) DO UPDATE SET balance = excluded.balance;
      `,
      [name, isNaN(b) ? 0 : b]
    );
    console.log(`✅ Budget '${name}' saved/updated.`);
  } catch (error) {
    console.error(`Error saving budget '${name}':`, error);
    throw new Error(`Failed to save budget '${name}': ${error.message}`);
  }
};

export const getDailyBudget = () => {
  try {
    const result = db.getFirstSync(
      "SELECT balance FROM budgets WHERE name = 'Daily Budget' LIMIT 1;"
    );
    return result ? result.balance : 0;
  } catch (error) {
    console.error("Error getting daily budget:", error);
    return 0;
  }
};

// Planned Budgets
export const savePlannedBudget = (
  budgetName,
  amount,
  colorName,
  startDate,
  endDate,
  isOngoing
) => {
  try {
    const ongoingInt = isOngoing ? 1 : 0;
    const result = db.runSync(
      `
      INSERT INTO planned_budgets 
      (budget_name, amount, color_name, start_date, end_date, is_ongoing)
      VALUES (?, ?, ?, ?, ?, ?);
      `,
      [
        budgetName,
        parseFloat(amount),
        colorName,
        startDate || null,
        endDate || null,
        ongoingInt,
      ]
    );
    console.log(`✅ Planned budget saved.`);
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error saving planned budget:", error);
    throw new Error(`Failed to save planned budget: ${error.message}`);
  }
};

export const updatePlannedBudget = (
  id,
  budgetName,
  amount,
  colorName,
  startDate,
  endDate,
  isOngoing
) => {
  try {
    const ongoingInt = isOngoing ? 1 : 0;
    db.runSync(
      `
      UPDATE planned_budgets
      SET budget_name = ?,  
          amount = ?, 
          color_name = ?, 
          start_date = ?, 
          end_date = ?, 
          is_ongoing = ?
      WHERE id = ?;
      `,
      [
        budgetName,
        parseFloat(amount),
        colorName,
        startDate || null,
        endDate || null,
        ongoingInt,
        id,
      ]
    );
    console.log(`✏️ Planned budget ID ${id} updated.`);
  } catch (error) {
    console.error(`❌ Error updating planned budget ID ${id}:`, error);
    throw new Error(
      `Failed to update planned budget ID ${id}: ${error.message}`
    );
  }
};

export const getPlannedBudgets = () => {
  try {
    const allRows = db.getAllSync(
      `SELECT * FROM planned_budgets ORDER BY start_date DESC;`
    );
    return allRows.map((row) => ({ ...row, is_ongoing: row.is_ongoing === 1 }));
  } catch (error) {
    console.error("Error getting planned budgets:", error);
    throw new Error("Failed to retrieve planned budgets.");
  }
};

export const deletePlannedBudget = (id, shouldRestoreBalance = true) => {
  // 🚩 ADD FLAG
  try {
    db.withTransactionSync(() => {
      // 1️⃣ Get all transactions for this planned budget
      const transactions = db.getAllSync(
        "SELECT * FROM planned_budget_transactions WHERE planned_budget_id = ?;",
        [id]
      );

      // 2️⃣ Restore account balances (ONLY IF FLAG IS TRUE)
      if (shouldRestoreBalance) {
        // 🚩 CHECK FLAG
        transactions.forEach((tx) => {
          if (tx.account_id) {
            restoreAccountBalance(tx.account_id, tx.amount);
          }
        });
      }

      // 3️⃣ Delete transactions (Always needed for cleanup)
      db.runSync(
        "DELETE FROM planned_budget_transactions WHERE planned_budget_id = ?;",
        [id]
      );

      // 4️⃣ Delete the budget itself (Always needed for cleanup)
      db.runSync("DELETE FROM planned_budgets WHERE id = ?;", [id]);
    });

    console.log(
      `🗑️ Planned budget ID ${id} and its transactions deleted (balances ${
        shouldRestoreBalance ? "restored" : "not restored"
      }).`
    );
  } catch (error) {
    // ...
  }
};

// Planned Budget Transactions
export const savePlannedBudgetTransaction = (
  plannedBudgetId,
  amount,
  date,
  accountId
) => {
  try {
    db.runSync(
      `
      INSERT INTO planned_budget_transactions (planned_budget_id, amount, date, account_id)
      VALUES (?, ?, ?, ?);
      `,
      [plannedBudgetId, parseFloat(amount), date, accountId || null]
    );

    console.log(`💾 Transaction saved for planned budget ${plannedBudgetId}`);

    // ✅ Deduct from account if accountId is provided
    if (accountId) {
      updateAccountBalance(accountId, amount);
    }

    // 🔍 Debug check
    const verify = db.getAllSync(
      "SELECT * FROM planned_budget_transactions WHERE planned_budget_id = ?;",
      [plannedBudgetId]
    );
    console.log("🧾 [VERIFY] All transactions in DB after save:", verify);
  } catch (error) {
    console.error("Error saving planned budget transaction:", error);
    throw new Error(
      `Failed to save planned budget transaction: ${error.message}`
    );
  }
};

// Helper for updateAccount balance
export const updateAccountBalance = (accountId, amount) => {
  try {
    const account = db.getFirstSync("SELECT * FROM accounts WHERE id = ?;", [
      accountId,
    ]);
    if (!account) throw new Error("Account not found");

    const newBalance = Number(account.balance) - Number(amount);

    db.runSync("UPDATE accounts SET balance = ? WHERE id = ?;", [
      newBalance,
      accountId,
    ]);

    console.log(`💰 Account ${account.name} new balance: ₱${newBalance}`);
  } catch (error) {
    console.error("Error updating account balance:", error);
    throw new Error(`Failed to update account balance: ${error.message}`);
  }
};

// Restore Account Balance
export const restoreAccountBalance = (accountId, amount) => {
  try {
    const account = db.getFirstSync("SELECT * FROM accounts WHERE id = ?;", [
      accountId,
    ]);
    if (!account) throw new Error("Account not found");

    const newBalance = Number(account.balance) + Number(amount);

    db.runSync("UPDATE accounts SET balance = ? WHERE id = ?;", [
      newBalance,
      accountId,
    ]);

    console.log(`💰 Account ${account.name} restored balance: ₱${newBalance}`);
  } catch (error) {
    console.error("Error restoring account balance:", error);
    throw new Error(`Failed to restore account balance: ${error.message}`);
  }
};

export const getAllPlannedBudgetTransactions = (plannedBudgetId = null) => {
  try {
    let query = `
      SELECT 
        t.id, 
        t.amount, 
        t.date, 
        t.planned_budget_id, 
        a.name AS account_name
      FROM planned_budget_transactions t
      LEFT JOIN accounts a ON t.account_id = a.id
    `;

    const params = [];

    // If a specific budget is requested, filter by it
    if (plannedBudgetId) {
      query += " WHERE t.planned_budget_id = ?";
      params.push(plannedBudgetId);
    }

    query += " ORDER BY t.date DESC;";

    const results = db.getAllSync(query, params);
    return results;
  } catch (error) {
    console.error("Error fetching planned budget transactions:", error);
    throw new Error("Failed to fetch planned budget transactions.");
  }
};

export const getBudgetBalance = (name) => {
  try {
    const row = db.getFirstSync("SELECT balance FROM budgets WHERE name = ?;", [
      name,
    ]);
    console.log("Fetched balance:", row?.balance); // Debug
    return row?.balance ?? 0;
  } catch (error) {
    console.error(`Error getting balance for '${name}':`, error);
    return 0; // fallback
  }
};

/**
 * Updates the user's streak based on yesterday's spending.
 * Uses modern synchronous SQLite API.
 */
// export const updateStreak = (dailyBudgetLimit) => {
//   // Get reference to the database (assuming 'db' is exported from this file)
//   // If 'db' is passed as an argument, use that instead.
//   // const db = getDb();

//   const today = moment().format("YYYY-MM-DD");
//   const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

//   try {
//     let finalStreak = 0;

//     // Use synchronous transaction
//     db.withTransactionSync(() => {
//       // 1. Get current streak info
//       const streakData = db.getFirstSync(
//         `SELECT * FROM user_streak WHERE id = 1;`
//       );

//       // Safety check: if table is empty (shouldn't happen if init ran correctly)
//       if (!streakData) {
//         console.warn("User streak table empty, skipping check.");
//         return;
//       }

//       let { current_streak, last_checked_date } = streakData;

//       // 2. If we already checked today, do nothing, just return current value
//       if (last_checked_date === today) {
//         console.log("Streak already checked for today.");
//         finalStreak = current_streak;
//         return;
//       }

//       // 3. Check YESTERDAY'S spending
//       const result = db.getFirstSync(
//         `SELECT SUM(amount) as total_spent FROM transactions
//          WHERE type = 'Expense' AND date = ?`,
//         [yesterday]
//       );

//       const totalSpentYesterday = result?.total_spent || 0;
//       let newStreak = current_streak;

//       // 4. Logic Checks
//       if (totalSpentYesterday <= dailyBudgetLimit) {
//         // SUCCESS: Increment streak (Use <= so hitting exact budget keeps streak)
//         newStreak += 1;
//         console.log(
//           `🔥 Streak maintained! Yesterday spent: ${totalSpentYesterday} (Limit: ${dailyBudgetLimit})`
//         );
//       } else {
//         // FAIL: Reset streak
//         newStreak = 0;
//         console.log(
//           `💔 Overspent yesterday (${totalSpentYesterday} > ${dailyBudgetLimit}). Streak reset.`
//         );
//       }

//       // 5. Update the Database
//       db.runSync(
//         `UPDATE user_streak
//          SET current_streak = ?, last_checked_date = ?
//          WHERE id = 1;`,
//         [newStreak, today]
//       );

//       finalStreak = newStreak;
//     });

//     return finalStreak;
//   } catch (error) {
//     console.error("❌ Error updating streak:", error);
//     return 0; // Return 0 on error
//   }
// };

export const updateStreak = (dailyBudgetLimit) => {
  // 1. Helper to format YYYY-MM-DD in local time
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const now = new Date();
  const today = getFormattedDate(now);

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = getFormattedDate(yesterdayDate);

  try {
    let finalStreak = 0;

    // Use synchronous transaction
    db.withTransactionSync(() => {
      // 1. Get current streak info
      const streakData = db.getFirstSync(
        `SELECT * FROM user_streak WHERE id = 1;`
      );

      if (!streakData) return;

      let { current_streak, last_checked_date } = streakData;

      // 2. If we already checked today, do nothing
      if (last_checked_date === today) {
        finalStreak = current_streak;
        return;
      }

      // 3. Check YESTERDAY'S spending
      const result = db.getFirstSync(
        `SELECT SUM(amount) as total_spent FROM transactions 
         WHERE type = 'Expense' AND date = ?`,
        [yesterday]
      );

      const totalSpentYesterday = result?.total_spent || 0;
      let newStreak = current_streak;

      // 4. Logic Checks
      if (dailyBudgetLimit < 50) {
        newStreak = 0;
        console.log(`⚠️ Budget too low (< 50). Streak reset.`);
      } else if (totalSpentYesterday <= dailyBudgetLimit) {
        newStreak += 1;
        console.log(`🔥 Streak maintained!`);
      } else {
        newStreak = 0;
        console.log(`💔 Overspent yesterday. Streak reset.`);
      }

      // 5. Update the Database
      db.runSync(
        `UPDATE user_streak 
         SET current_streak = ?, last_checked_date = ? 
         WHERE id = 1;`,
        [newStreak, today]
      );

      finalStreak = newStreak;
    });

    return finalStreak;
  } catch (error) {
    console.error("❌ Error updating streak:", error);
    return 0;
  }
};

export const getUserStreak = () => {
  try {
    const row = db.getFirstSync(
      "SELECT current_streak FROM user_streak WHERE id = 1;"
    );
    return row ? row.current_streak : 0;
  } catch (error) {
    console.error("Error fetching user streak:", error);
    return 0;
  }
};

// ✅ Add (or ensure this is exported) to reset streak
export const resetStreakOnBudgetChange = () => {
  try {
    db.runSync("UPDATE user_streak SET current_streak = 0 WHERE id = 1;");
    console.log("⚠️ Budget limit changed. Streak reset to 0.");
  } catch (error) {
    console.error("Error resetting streak:", error);
  }
};
