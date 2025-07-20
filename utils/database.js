import * as FileSystem from 'expo-file-system';
import { openDatabaseAsync } from 'expo-sqlite';

// Private variable to hold the database instance
let _db = null;

// Define a constant ID for our single record
const SINGLE_RECORD_ID = 1;

// Define the target database version for migrations
const DATABASE_VERSION = 1; // Increment this if you make future schema changes

/**
 * Initializes the SQLite database.
 * Opens the database connection and creates the 'amounts' table if it doesn't exist.
 * Also performs a migration to ensure only a single record exists.
 * @returns {Promise<void>} A promise that resolves when the database is initialized.
 */
export async function initDatabase() {
  try {
    const openedDb = await openDatabaseAsync('general_budgets_db.db');
    _db = openedDb;
    console.log('Database instance after openDatabaseAsync:', _db);

    // Ensure the 'amounts' table exists
    await _db.execAsync(
      'CREATE TABLE IF NOT EXISTS amounts (id INTEGER PRIMARY KEY, value TEXT);'
    );
    console.log('Table "amounts" created successfully or already exists.');

    // --- Database Migration Logic ---
    // This part ensures that only one row (with ID 1) exists in the table.
    // It uses PRAGMA user_version to run the migration only once.

    const result = await _db.getFirstAsync('PRAGMA user_version;');
    const currentDbVersion = result ? result.user_version : 0;
    console.log('Current database user_version:', currentDbVersion);

    if (currentDbVersion < DATABASE_VERSION) {
      console.log('Performing database migration to version', DATABASE_VERSION);
      // Removed withTransactionAsync due to persistent 'tx is undefined' errors.
      // Executing commands directly on _db.
      await _db.runAsync('DELETE FROM amounts;'); // Use runAsync for DML (DELETE)
      console.log('Cleared all existing rows from "amounts" table during migration.');

      await _db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION};`); // Use execAsync for PRAGMA
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
 * Saves or updates the single amount in the 'amounts' table.
 * Uses INSERT OR REPLACE to ensure only one record (with ID 1) exists.
 * @param {string} amount The amount to save.
 * @returns {Promise<void>} A promise that resolves when the amount is saved/updated.
 */
export async function saveAmountToDb(amount) {
  if (!_db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }

  try {
    // INSERT OR REPLACE will insert if ID 1 doesn't exist, or replace the existing row with ID 1.
    const result = await _db.runAsync(
      'INSERT OR REPLACE INTO amounts (id, value) VALUES (?, ?)',
      [SINGLE_RECORD_ID, amount] // Always use the constant ID for the single record
    );
    console.log('Amount saved/updated successfully:', amount);
    console.log('Insert/Update result:', result);
  } catch (error) {
    console.error('Error saving/updating amount:', error);
    throw new Error('Failed to save/update the amount to the database: ' + error.message);
  }
}

/**
 * Retrieves the single amount from the 'amounts' table.
 * @returns {Promise<string|null>} A promise that resolves with the amount string or null if not found.
 */
export async function getAmountFromDb() {
  if (!_db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }

  try {
    // Select the single record by its ID
    const result = await _db.getFirstAsync('SELECT value FROM amounts WHERE id = ?', [SINGLE_RECORD_ID]);
    console.log('Retrieved amount result:', result);

    if (result && result.value !== undefined) {
      return result.value;
    }
    return null; // Return null if no record is found
  } catch (error) {
    console.error('Error retrieving amount:', error);
    throw new Error('Failed to retrieve the amount from the database: ' + error.message);
  }
}

/**
 * Returns the full local URI path to the SQLite database file.
 * This path is within the app's sandboxed document directory.
 * @returns {string} The URI path to the database file.
 */
export function getDatabaseFilePath() {
  const dbPath = `${FileSystem.documentDirectory}SQLite/general_budgets_db.db`;
  console.log('Calculated database file path for sharing:', dbPath);
  return dbPath;
}
