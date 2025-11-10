import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { getDatabaseFilePath } from "./database";

// Backup database file
export const backupDatabase = async () => {
  try {
    const dbPath = `${FileSystem.documentDirectory}SQLite/budget_tracker.db`;
    const dbInfo = await FileSystem.getInfoAsync(dbPath);

    if (!dbInfo.exists) {
      console.log("❌ No database found to back up.");
      return;
    }

    // Create backup inside cache directory
    const fileName = `budget_backup_${Date.now()}.db`;
    const backupPath = `${FileSystem.cacheDirectory}${fileName}`;

    await FileSystem.copyAsync({ from: dbPath, to: backupPath });

    const backupInfo = await FileSystem.getInfoAsync(backupPath);
    if (!backupInfo.exists) {
      console.log("❌ Backup file not created.");
      return;
    }

    // Use the URI Expo reports
    const fileUri = backupInfo.uri;
    console.log("✅ Ready to share:", fileUri);

    // Ensure Sharing API is available
    const available = await Sharing.isAvailableAsync();
    console.log(await Sharing.isAvailableAsync());
    if (!available) {
      console.log("⚠️ Sharing is not available on this device.");
      return;
    }

    // Share the file
    await Sharing.shareAsync(fileUri);
    console.log("📤 Share sheet opened.");
  } catch (error) {
    console.error("❌ Backup failed:", error);
  }
};

export const backupDatabaseAndShare = async () => {
  try {
    const dbPath = `${FileSystem.documentDirectory}SQLite/budget_tracker.db`;
    const backupPath = `${
      FileSystem.cacheDirectory
    }budget_backup_${Date.now()}.db`;

    // Copy DB into a shareable path
    await FileSystem.copyAsync({ from: dbPath, to: backupPath });

    const info = await FileSystem.getInfoAsync(backupPath);
    console.log("✅ Backup ready:", info);

    // Ensure sharing is supported
    const canShare = await Sharing.isAvailableAsync();
    console.log("Sharing available:", canShare);

    if (!canShare) {
      console.log("❌ Sharing not supported on this platform.");
      return;
    }

    // Wait a tick to ensure file system updates are done
    setTimeout(async () => {
      try {
        await Sharing.shareAsync(info.uri);
        console.log("📤 Share sheet opened.");
      } catch (err) {
        console.error("❌ Failed to share database backup:", err);
      }
    }, 500);
  } catch (error) {
    console.error("❌ Error during backup:", error);
  }
};

// Share backup
export const shareBackupDatabase = async () => {
  try {
    const backupFile = await backupDatabase();

    if (!(await Sharing.isAvailableAsync())) {
      alert("Sharing is not available on this device");
      return;
    }

    await Sharing.shareAsync(backupFile);
    console.log("📤 Backup shared successfully");
  } catch (error) {
    console.error("❌ Failed to share database backup:", error);
    throw error;
  }
};

// Restore database
export const restoreDatabase = async (backupFilePath) => {
  const dbFilePath = getDatabaseFilePath();

  try {
    // Ensure SQLite folder exists
    const folder = dbFilePath.replace(/\/[^\/]+$/, "");
    const folderInfo = await FileSystem.getInfoAsync(folder);
    if (!folderInfo.exists) {
      await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
    }

    // Overwrite the existing database
    await FileSystem.copyAsync({ from: backupFilePath, to: dbFilePath });
    console.log("✅ Database restored:", dbFilePath);
  } catch (error) {
    console.error("❌ Restore failed:", error);
    throw error;
  }
};

export const pickAndRestoreDatabase = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      console.log("Restore cancelled by user.");
      return;
    }

    const file = result.assets?.[0];
    if (!file || !file.uri) {
      console.error("❌ No valid file selected.");
      return;
    }

    console.log("📂 Selected backup file:", file.uri);

    await restoreDatabase(file.uri);
    alert("✅ Database restored successfully! Please restart the app.");
  } catch (error) {
    console.error("❌ Error during restore:", error);
    alert("❌ Failed to restore database.");
  }
};

export const backupExistingDatabase = async () => {
  const dbPath = `${FileSystem.documentDirectory}SQLite/budget_tracker.db`;
  const backupPath = `${
    FileSystem.documentDirectory
  }budget_backup_${Date.now()}.db`;

  try {
    await FileSystem.copyAsync({ from: dbPath, to: backupPath });
    console.log("Backup created:", backupPath);
  } catch (error) {
    console.error("Failed to backup existing DB:", error);
  }
};
