import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";

// const db = SQLite.openDatabaseSync("budget_tracker.db");

export const db = SQLite.openDatabaseSync("budget_tracker.db");

// Get database file path
export const getDatabaseFilePath = () => {
  const dbName = "budget_tracker.db";
  return `${FileSystem.documentDirectory}SQLite/${dbName}`;
};

// Initialize database
export const initDatabase = async () => {
  try {
    console.log("Initializing database schema...");
    db.execSync("PRAGMA journal_mode = WAL;");

    db.withTransactionSync(() => {
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

      // Create all tables
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
          category_id INTEGER,
          icon_name TEXT,
          to_account_id INTEGER,
          FOREIGN KEY (account_id) REFERENCES accounts(id),
          FOREIGN KEY (category_id) REFERENCES categories(id),
          FOREIGN KEY (to_account_id) REFERENCES accounts(id)
        );

        -- Remove category_id only from planned budgets and transactions
        CREATE TABLE IF NOT EXISTS planned_budgets (
          id INTEGER PRIMARY KEY NOT NULL,
          budget_name TEXT NOT NULL,
          budget_type TEXT NOT NULL,
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
      `);

      // Ensure indexes exist
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

// Get database reference
export const getDb = () => db;

// Budgets
export const getBudgets = () => {
  try {
    return db.getAllSync("SELECT * FROM budgets;");
  } catch (error) {
    console.error("Error getting budgets:", error);
    throw new Error("Failed to retrieve budgets.");
  }
};

export const getBudget = (name) => {
  try {
    const row = db.getFirstSync("SELECT * FROM budgets WHERE name = ?;", [
      name,
    ]);
    return row || { name, balance: 0 };
  } catch (error) {
    console.error(`Error getting budget '${name}':`, error);
    throw new Error(`Failed to retrieve budget '${name}'.`);
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

// Planned Budgets
export const savePlannedBudget = (
  budgetName,
  budgetType,
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
      (budget_name, budget_type, amount, color_name, start_date, end_date, is_ongoing)
      VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
      [
        budgetName,
        budgetType,
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
  budgetType,
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
          budget_type = ?, 
          amount = ?, 
          color_name = ?, 
          start_date = ?, 
          end_date = ?, 
          is_ongoing = ?
      WHERE id = ?;
      `,
      [
        budgetName,
        budgetType,
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

export const deletePlannedBudget = (id) => {
  try {
    db.withTransactionSync(() => {
      db.runSync(
        "DELETE FROM planned_budget_transactions WHERE planned_budget_id = ?;",
        [id]
      );
      db.runSync("DELETE FROM planned_budgets WHERE id = ?;", [id]);
    });
    console.log(`🗑️ Planned budget ID ${id} and its transactions deleted.`);
  } catch (error) {
    console.error(`Error deleting planned budget ID ${id}:`, error);
    throw new Error(`Failed to delete planned budget ID ${id}.`);
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
