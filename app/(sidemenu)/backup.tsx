import { backupDatabaseAndShare, restoreDatabase } from "@/utils/backup";
import { initDatabase } from "@/utils/database";
import * as DocumentPicker from "expo-document-picker";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const BackupScreen = () => {
  const handleBackup = async () => {
    try {
      await backupDatabaseAndShare();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to backup database.");
    }
  };

  const handleRestore = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });

      if ("canceled" in result && result.canceled) return;

      const fileUri = result.assets?.[0]?.uri;

      if (!fileUri) {
        Alert.alert("Error", "No file selected.");
        return;
      }

      // Copy backup file to the database path
      await restoreDatabase(fileUri);

      // Re-initialize SQLite connection
      await initDatabase();

      Alert.alert(
        "Success",
        "Database restored! Please restart the app to see changes."
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to restore database.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backup & Restore</Text>

      <TouchableOpacity style={styles.button} onPress={handleBackup}>
        <Text style={styles.buttonText}>Backup Database</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.restoreButton]}
        onPress={handleRestore}
      >
        <Text style={styles.buttonText}>Restore Database</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BackupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 40, color: "#333" },
  button: {
    width: "80%",
    paddingVertical: 15,
    backgroundColor: "#4caf50",
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  restoreButton: { backgroundColor: "#2196f3" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
