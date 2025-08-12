import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

// Define the correct, new database filename
const DB_NAME = 'budget_tracker_db.db';

// Private variable to hold the database instance
let _db = null;

// Define the target database version for migrations
// We are increasing this to 1 to signify our first version of this new schema.
const DATABASE_VERSION = 1;

/**
 * Initializes the SQLite database.
 * Opens the database connection and creates the necessary table if it doesn't exist.
 * Also performs database migrations to ensure schema consistency.
 * @returns {Promise<void>} A promise that resolves when the database is initialized.
 */
export async function initDatabase() {
  try {
    // Check and create the SQLite directory if it doesn't exist
    const dbDir = FileSystem.documentDirectory + 'SQLite/';
    if (!(await FileSystem.getInfoAsync(dbDir)).exists) {
      await FileSystem.makeDirectoryAsync(dbDir);
    }
    
    // Open the database with the new name
    _db = await SQLite.openDatabaseAsync(DB_NAME);
    console.log('Database instance after openDatabaseAsync:', _db);

    // --- Database Migration Logic ---
    // This ensures that the database schema is up-to-date.
    const result = await _db.getFirstAsync('PRAGMA user_version;');
    const currentDbVersion = result ? result.user_version : 0;
    console.log('Current database user_version:', currentDbVersion);

    if (currentDbVersion < DATABASE_VERSION) {
      console.log('Performing database migration to version', DATABASE_VERSION);

      // Drop any old tables to ensure a clean slate for the new schema.
      await _db.execAsync(`
        DROP TABLE IF EXISTS daily_budget;
        DROP TABLE IF EXISTS weekly_budget;
        DROP TABLE IF EXISTS monthly_budget;
      `);
      console.log('Dropped old budget tables during migration.');

      // Create the single general_budgets table
      await _db.execAsync(
        `CREATE TABLE IF NOT EXISTS general_budgets (
          id INTEGER PRIMARY KEY NOT NULL,
          type TEXT NOT NULL,
          value REAL NOT NULL,
          timestamp TEXT NOT NULL
        );`
      );
      console.log('general_budgets table created successfully.');
      
      // Update the user_version to mark migration as complete
      await _db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION};`);
      console.log('Database user_version updated to', DATABASE_VERSION);
      console.log('Database migration completed successfully.');
    } else {
      console.log('No database migration needed. Current version is up to date.');
    }
  } catch (error) {
    console.error('Error initializing database or during migration:', error);
    throw new Error('Failed to initialize the database: ' + error.message);
  }
}

/**
 * Saves or updates a budget value for a specific type (e.g., 'daily_budget').
 * Uses a single table to store all budget types.
 * @param {string} type The type of budget to save ('daily_budget', 'weekly_budget', 'monthly_budget').
 * @param {string} value The budget value as a string.
 * @returns {Promise<void>} A promise that resolves when the value is saved/updated.
 */
export async function saveBudgetValue(type, value) {
  if (!_db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }

  try {
    const timestamp = new Date().toISOString();
    // Use INSERT OR REPLACE to handle both new insertions and updates for a given type.
    await _db.runAsync(
      `INSERT OR REPLACE INTO general_budgets (id, type, value, timestamp)
       VALUES ((SELECT id FROM general_budgets WHERE type = ?), ?, ?, ?);`,
      [type, type, parseFloat(value), timestamp]
    );
    console.log(`Value saved/updated successfully for type '${type}':`, value);
  } catch (error) {
    console.error(`Error saving/updating value for type '${type}':`, error);
    throw new Error(`Failed to save/update the value for type '${type}': ` + error.message);
  }
}

/**
 * Retrieves a budget value for a given type.
 * @param {string} type The type of budget to retrieve.
 * @returns {Promise<string|null>} A promise that resolves with the value string or null if not found.
 */
export async function getBudgetValue(type) {
  if (!_db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }

  try {
    const result = await _db.getFirstAsync('SELECT value FROM general_budgets WHERE type = ?', [type]);
    console.log(`Retrieved value result for type '${type}':`, result);

    if (result && result.value !== undefined) {
      return result.value.toFixed(2); // Ensure two decimal places for currency display
    }
    return null;
  } catch (error) {
    console.error(`Error retrieving value for type '${type}':`, error);
    throw new Error(`Failed to retrieve the value for type '${type}': ` + error.message);
  }
}

/**
 * Returns the full local URI path to the SQLite database file.
 * @returns {string} The URI path to the database file.
 */
export function getDatabaseFilePath() {
  const dbPath = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;
  console.log('Calculated database file path for sharing:', dbPath);
  return dbPath;
}
