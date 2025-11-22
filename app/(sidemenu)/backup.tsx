import { backupDatabase, restoreDatabase } from "@/utils/DatabaseBackup";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const BackupScreen = () => {
  // The handleBackup logic is correct
  const handleBackup = async () => {
    try {
      // Calls the utility function which handles checkpointing and sharing
      await backupDatabase();
    } catch (error) {
      console.error(error);
      // Removed alert() since we should use the React Native Alert API
      Alert.alert("Error", "Failed to create database backup.");
    }
  };

  // The handleRestore is simplified to just call the utility function
  const handleRestore = async () => {
    try {
      // restoreDatabase now handles DocumentPicker, file copy, file cleanup,
      // and the app restart. No arguments are needed.
      await restoreDatabase();

      // The utility function handles the success Alert and the app reload.
    } catch (error) {
      console.error(error);
      // The utility already shows a failure alert, but we can add a fallback here.
      Alert.alert("Error", "Restore process failed.");
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
    // Tailwind classes for aesthetics
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    backgroundColor: "#4caf50",
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    // Button styling for a better look
    shadowColor: "#4caf50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    // Note: React Native's StyleSheet doesn't support 'transitionDuration' like CSS,
    // but leaving it as a comment for conceptual intent.
    // transitionDuration: '0.2s'
  },
  restoreButton: {
    backgroundColor: "#2196f3",
    shadowColor: "#2196f3", // Match shadow color to button color
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});
