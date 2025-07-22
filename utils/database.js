import * as FileSystem from 'expo-file-system';
import { openDatabaseAsync } from 'expo-sqlite';

// Private variable to hold the database instance
let _db = null;

// Define a constant ID for our single record in each budget table
const SINGLE_RECORD_ID = 1;

// Define the target database version for migrations
// Increment this if you make future schema changes that require data migration
const DATABASE_VERSION = 3; // Increased version to trigger migration for schema change (removing accounts)

/**
 * Initializes the SQLite database.
 * Opens the database connection and creates the necessary tables if they don't exist.
 * Also performs database migrations to ensure schema consistency and single-record logic.
 * @returns {Promise<void>} A promise that resolves when the database is initialized.
 */
export async function initDatabase() {
  try {
    // Open the database with the new name
    const openedDb = await openDatabaseAsync('general_budgets_db.db');
    _db = openedDb;
    console.log('Database instance after openDatabaseAsync:', _db);

    // Ensure all required tables exist (daily, weekly, monthly budgets)
    await _db.execAsync(
      `CREATE TABLE IF NOT EXISTS daily_budget (id INTEGER PRIMARY KEY, value TEXT);`
    );
    await _db.execAsync(
      `CREATE TABLE IF NOT EXISTS weekly_budget (id INTEGER PRIMARY KEY, value TEXT);`
    );
    await _db.execAsync(
      `CREATE TABLE IF NOT EXISTS monthly_budget (id INTEGER PRIMARY KEY, value TEXT);`
    );
    // Removed 'accounts' table creation
    console.log('Daily, Weekly, Monthly budget tables created successfully or already exist.');

    // --- Database Migration Logic ---
    // This ensures that the database schema is up-to-date and cleans up old data.
    const result = await _db.getFirstAsync('PRAGMA user_version;');
    const currentDbVersion = result ? result.user_version : 0;
    console.log('Current database user_version:', currentDbVersion);

    if (currentDbVersion < DATABASE_VERSION) {
      console.log('Performing database migration to version', DATABASE_VERSION);

      // For this migration (version 3), we'll ensure only the desired tables are clean.
      // If 'accounts' table existed from a previous version, this migration will effectively
      // ignore it for future operations, and new data will not be written to it.
      // To explicitly remove the table, you would use DROP TABLE IF EXISTS,
      // but for simplicity and to avoid potential data loss if you intended to keep it
      // but just not use it, we'll just remove it from the active schema.
      // If you want to permanently remove the table, you would add:
      // await _db.execAsync('DROP TABLE IF EXISTS accounts;');

      await _db.runAsync('DELETE FROM daily_budget;');
      await _db.runAsync('DELETE FROM weekly_budget;');
      await _db.runAsync('DELETE FROM monthly_budget;');
      // Removed DELETE FROM accounts;
      console.log('Cleared all existing rows from daily, weekly, monthly budget tables during migration.');

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
 * Saves or updates a single budget value in the specified table.
 * Uses INSERT OR REPLACE to ensure only one record (with ID 1) exists in that table.
 * @param {string} tableName The name of the table (e.g., 'daily_budget', 'weekly_budget', 'monthly_budget').
 * @param {string} value The budget value to save.
 * @returns {Promise<void>} A promise that resolves when the value is saved/updated.
 */
export async function saveBudgetValue(tableName, value) {
  if (!_db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  // Updated valid table names
  if (!['daily_budget', 'weekly_budget', 'monthly_budget'].includes(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  try {
    // INSERT OR REPLACE will insert if ID 1 doesn't exist, or replace the existing row with ID 1.
    const result = await _db.runAsync(
      `INSERT OR REPLACE INTO ${tableName} (id, value) VALUES (?, ?)`,
      [SINGLE_RECORD_ID, value] // Always use the constant ID for the single record
    );
    console.log(`Value saved/updated successfully in ${tableName}:`, value);
    console.log(`Insert/Update result for ${tableName}:`, result);
  } catch (error) {
    console.error(`Error saving/updating value in ${tableName}:`, error);
    throw new Error(`Failed to save/update the value in ${tableName}: ` + error.message);
  }
}

/**
 * Retrieves a single budget value from the specified table.
 * @param {string} tableName The name of the table (e.g., 'daily_budget', 'weekly_budget', 'monthly_budget').
 * @returns {Promise<string|null>} A promise that resolves with the value string or null if not found.
 */
export async function getBudgetValue(tableName) {
  if (!_db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  // Updated valid table names
  if (!['daily_budget', 'weekly_budget', 'monthly_budget'].includes(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  try {
    // Select the single record by its ID
    const result = await _db.getFirstAsync(`SELECT value FROM ${tableName} WHERE id = ?`, [SINGLE_RECORD_ID]);
    console.log(`Retrieved value result from ${tableName}:`, result);

    if (result && result.value !== undefined) {
      return result.value;
    }
    return null; // Return null if no record is found
  } catch (error) {
    console.error(`Error retrieving value from ${tableName}:`, error);
    throw new Error(`Failed to retrieve the value from ${tableName}: ` + error.message);
  }
}

/**
 * Returns the full local URI path to the SQLite database file.
 * This path is within the app's sandboxed document directory.
 * @returns {string} The URI path to the database file.
 */
export function getDatabaseFilePath() {
  // Ensure this matches the database name used in openDatabaseAsync
  const dbPath = `${FileSystem.documentDirectory}SQLite/general_budgets_db.db`;
  console.log('Calculated database file path for sharing:', dbPath);
  return dbPath;
}
