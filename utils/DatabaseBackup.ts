import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

// Assuming db is imported from "./database" and is an instance of SQLiteDatabase.
import { db } from "./database";

// Database name constant
const DB_NAME = "budget_tracker.db";

/**
 * Executes a checkpoint to commit all WAL data, copies the database file
 * to the cache, and opens the system share dialog.
 */
export const backupDatabase = async () => {
  try {
    // 1. CRITICAL: FORCE SAVE
    // This merges all recent changes from the WAL file into the main .db file.
    db.execSync("PRAGMA wal_checkpoint(FULL);");
    console.log("✅ Database Checkpoint successful");

    // 2. Define paths
    const dbPath = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;
    const backupPath = `${FileSystem.cacheDirectory}budget_backup.db`;

    // 3. Copy to cache for sharing
    await FileSystem.copyAsync({
      from: dbPath,
      to: backupPath,
    });

    // 4. Open Share Dialog
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(backupPath, {
        dialogTitle: "Save your Budget Backup",
        UTI: "public.database", // iOS specific
        mimeType: "application/x-sqlite3", // Android specific
      });
    } else {
      Alert.alert("Error", "Sharing is not available on this device.");
    }
  } catch (error) {
    console.error("❌ Backup failed:", error);
    Alert.alert("Error", `Failed to create backup: ${error.message}`);
  }
};

/**
 * Prompts the user to select a backup file, deletes the existing database
 * and its temp files, installs the backup, and prompts the user to reload the app.
 */
export const restoreDatabase = async () => {
  try {
    // 1. Pick the file (Handles file picking internally)
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: "*/*",
    });

    if (result.canceled || !result.assets || result.assets.length === 0) return;

    const sourceUri = result.assets[0].uri;

    // 2. Define internal paths
    const dbDir = `${FileSystem.documentDirectory}SQLite/`;
    const dbPath = `${dbDir}${DB_NAME}`;

    // 3. DELETE OLD DATA
    console.log("🗑️ Deleting old database files...");

    // Delete main DB file and WAL/SHM files to prevent corruption
    await FileSystem.deleteAsync(dbPath, { idempotent: true });
    await FileSystem.deleteAsync(dbPath + "-wal", { idempotent: true });
    await FileSystem.deleteAsync(dbPath + "-shm", { idempotent: true });

    // 4. Install the new Backup
    console.log("📥 Copying new database...");
    await FileSystem.copyAsync({
      from: sourceUri,
      to: dbPath,
    });

    // 5. FINAL ACTION: Manual Restart Prompt (RELIABLE FIX)
    // The manual prompt is the most stable method across all Expo environments.
    Alert.alert(
      "Success",
      "Database restored! To load the new data, you MUST manually close and reopen the app now."
    );
  } catch (error) {
    console.error("❌ Restore failed:", error);
    Alert.alert(
      "Error",
      "Failed to restore backup. Is this a valid database file?"
    );
  }
};
