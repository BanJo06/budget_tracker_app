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

        db.execSync('PRAGMA journal_mode = WAL;');

        db.withTransactionSync(() => {
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
                  name TEXT NOT NULL,
                  balance REAL NOT NULL
                );
                CREATE TABLE IF NOT EXISTS categories (
                  id INTEGER PRIMARY KEY NOT NULL,
                  name TEXT NOT NULL UNIQUE,
                  type TEXT NOT NULL,
                  icon_name TEXT
                );
                -- NEW: Create the transactions table
                CREATE TABLE IF NOT EXISTS transactions (
                  id INTEGER PRIMARY KEY NOT NULL,
                  amount REAL NOT NULL,
                  type TEXT NOT NULL,
                  description TEXT,
                  date TEXT NOT NULL,
                  account_id INTEGER,
                  category_id INTEGER,
                  FOREIGN KEY (account_id) REFERENCES accounts(id),
                  FOREIGN KEY (category_id) REFERENCES categories(id)
                );
            `);

            // --- Database Migrations ---
            // We need to add a UNIQUE constraint to the 'name' column in both tables.
            // We check for the constraint by looking for an existing index.

            // Migration for the 'accounts' table
            const accountIndex = db.getFirstSync("SELECT name FROM sqlite_master WHERE type='index' AND name='idx_accounts_name';");
            if (!accountIndex) {
                console.log("Migrating 'accounts' table: Adding UNIQUE constraint...");
                db.execSync(`
                    CREATE UNIQUE INDEX idx_accounts_name ON accounts(name);
                `);
            }

            // Migration for the 'budgets' table
            const budgetIndex = db.getFirstSync("SELECT name FROM sqlite_master WHERE type='index' AND name='idx_budgets_name';");
            if (!budgetIndex) {
                console.log("Migrating 'budgets' table: Adding UNIQUE constraint...");
                db.execSync(`
                    CREATE UNIQUE INDEX idx_budgets_name ON budgets(name);
                `);
            }
        });

        console.log('Database tables created/migrated successfully.');
    } catch (error) {
        console.error('Error initializing database tables:', error);
        throw error; // Re-throw to propagate the error if needed
    }
};

/**
 * Gets the singleton database instance.
 * @returns {SQLite.SQLiteDatabase} The database instance.
 */
export const getDb = () => {
    if (!db) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }
    return db;
};


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