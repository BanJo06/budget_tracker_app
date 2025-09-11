import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

// Use the synchronous API to open the database and create a shared reference.
const db = SQLite.openDatabaseSync('budget_tracker.db');

/**
 * Gets the full file path for the database.
 * @returns {string} The full path to the database file.
 */
export const getDatabaseFilePath = () => {
    // Expo.FileSystem stores SQLite databases in a specific directory.
    const dbName = 'budget_tracker.db';
    const dbPath = `${FileSystem.documentDirectory}SQLite/${dbName}`;
    return dbPath;
};

/**
 * Initializes the database tables and migrates schemas if necessary.
 */
export const initDatabase = async () => {
    try {
        console.log("Initializing database schema...");

        db.withTransactionSync(() => {
            // First, create the table if it doesn't exist.
            db.execSync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS accounts (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          balance REAL NOT NULL,
          icon_name TEXT
        );
        CREATE TABLE IF NOT EXISTS budgets (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          balance REAL NOT NULL
        );
        CREATE TABLE IF NOT EXISTS expense_categories (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL UNIQUE,
          icon_name TEXT
        );
        CREATE TABLE IF NOT EXISTS income_categories (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL UNIQUE,
          icon_name TEXT
        );
      `);

            // --- Database Migrations ---
            // We need to add a UNIQUE constraint to the 'name' column in both tables.
            // We check for the constraint first to avoid errors on a correct schema.

            // Migration for the 'accounts' table
            const accountTableInfo = db.getFirstSync("PRAGMA table_info(accounts);");
            if (accountTableInfo && !accountTableInfo.name.includes('UNIQUE')) {
                console.log("Migrating 'accounts' table: Adding UNIQUE constraint...");
                db.execSync(`
          CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_name ON accounts(name);
        `);
            }

            // Migration for the 'budgets' table
            const budgetTableInfo = db.getFirstSync("PRAGMA table_info(budgets);");
            if (budgetTableInfo && !budgetTableInfo.name.includes('UNIQUE')) {
                console.log("Migrating 'budgets' table: Adding UNIQUE constraint...");
                db.execSync(`
          CREATE UNIQUE INDEX IF NOT EXISTS idx_budgets_name ON budgets(name);
        `);
            };
        });

        console.log('Database tables created/migrated successfully.');
    } catch (error) {
        console.error('Error initializing database tables:', error);
    }
};

/**
 * Gets the singleton database instance.
 * @returns {SQLite.SQLiteDatabase} The database instance.
 */
export const getDb = () => db;


/**
 * Gets all budgets from the database.
 * @returns {Array<Object>} An array of budget objects.
 */
export const getBudgets = () => {
    try {
        const allRows = db.getAllSync('SELECT * FROM budgets;');
        return allRows;
    } catch (error) {
        console.error('Error getting budgets:', error);
        throw new Error('Failed to retrieve budgets from the database.');
    }
};

/**
 * Gets a single budget from the database by name.
 * @param {string} name The name of the budget to retrieve.
 * @returns {Object | undefined} The budget object, or undefined if not found.
 */
export const getBudget = (name) => {
    try {
        const row = db.getFirstSync('SELECT * FROM budgets WHERE name = ?;', [name]);
        // Return a default object if the row is not found
        if (!row) {
            return { name, balance: 0 };
        }
        return row;
    } catch (error) {
        console.error(`Error getting budget '${name}':`, error);
        throw new Error(`Failed to retrieve budget '${name}' from the database.`);
    }
};

/**
 * Saves a new budget or updates an existing one.
 * @param {string} name The name of the budget.
 * @param {string | number} balance The balance of the budget.
 * @returns {void}
 */
export const saveBudget = (name, balance) => {
    try {
        const balanceNum = parseFloat(balance);
        const finalBalance = isNaN(balanceNum) ? 0 : balanceNum;
        db.runSync(`
      INSERT INTO budgets (name, balance)
      VALUES (?, ?)
      ON CONFLICT(name) DO UPDATE SET balance = excluded.balance;
    `, [name, finalBalance]);
        console.log(`Budget '${name}' saved/updated successfully.`);
    } catch (error) {
        console.error(`Error saving budget '${name}':`, error);
        throw new Error(`Failed to save/update the budget '${name}': ${error.message}`);
    }
};
