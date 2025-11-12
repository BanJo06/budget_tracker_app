// import * as Notifications from "expo-notifications";
// import { Platform } from "react-native";

// // Request notification permission
// export async function requestNotificationPermission() {
//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;

//   if (existingStatus !== "granted") {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }

//   return finalStatus === "granted";
// }

// // Schedule a daily local notification
// // Correct implementation using the Calendar Trigger
// export async function scheduleDailyNotification(hour = 20, minute = 0) {
//   // Clear previous notifications to avoid duplicates
//   await Notifications.cancelAllScheduledNotificationsAsync();

//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Add your expenses 💰",
//       body: "Don't forget to log your expenses today!",
//       sound: true,
//     },
//     trigger: {
//       // ✅ Use date/calendar components for fixed time of day
//       hour: hour,
//       minute: minute,
//       repeats: true, // This makes it repeat every day at the specified time
//     },
//   });
// }

// // Cancel all local notifications
// export async function cancelDailyNotification() {
//   await Notifications.cancelAllScheduledNotificationsAsync();
// }

// /**
//  * Ensures the default notification channel is created for Android 8.0+ devices.
//  */
// export async function createNotificationChannel() {
//   if (Platform.OS === "android") {
//     // Only create the channel if it hasn't been created yet
//     const channels = await Notifications.getNotificationChannelsAsync();
//     if (!channels.some((channel) => channel.id === "default")) {
//       await Notifications.setNotificationChannelAsync("default", {
//         name: "Default Channel", // A user-friendly name
//         importance: Notifications.AndroidImportance.MAX,
//         sound: "default",
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: "#FF231F7C",
//       });
//       console.log('Android Notification Channel "default" created.');
//     }
//   }
// }

// /**
//  * Schedules a test notification to fire in 5 seconds.
//  * Includes necessary permission and channel checks.
//  */
// export async function sendTestNotification() {
//   console.log("--- Attempting to schedule Test Notification ---");

//   // 1. Ensure permission is granted
//   const { status } = await Notifications.requestPermissionsAsync();
//   if (status !== "granted") {
//     console.warn("Notification permission was not granted.");
//     return false;
//   }

//   // 2. Ensure Android channel exists (required for Android 8.0+)
//   await createNotificationChannel();

//   // 3. Schedule the notification
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Test Notification 🚀",
//       body: "This is a 5-second test from your app!",
//       sound: true,
//       // Link the content to the channel created above for Android
//       android: { channelId: "default" },
//     },
//     trigger: {
//       seconds: 5,
//       repeats: false,
//     },
//   });

//   console.log(
//     "Test notification scheduled successfully! It should appear in 5 seconds."
//   );
//   console.log(
//     "Remember to send the app to the background (or lock the screen) to see it in Expo Go."
//   );

//   return true;
// }

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// --- Configuration ---

// Set the handler for when a notification is shown while the app is foregrounded
// This allows notifications to appear even if the app is open (less restrictive than default)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Ensures the default notification channel is created for Android 8.0+ devices.
 * This must be called before scheduling any notification on Android.
 */
export async function createNotificationChannel() {
  if (Platform.OS === "android") {
    // Check if the channel already exists to avoid unnecessary calls
    const channels = await Notifications.getNotificationChannelsAsync();
    if (!channels.some((channel) => channel.id === "default")) {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default Channel",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
      console.log('Android Notification Channel "default" created.');
    }
  }
}

// --- Permissions ---

/**
 * Requests notification permission from the user.
 * @returns {Promise<boolean>} True if permission is granted, false otherwise.
 */
export async function requestNotificationPermission() {
  await createNotificationChannel(); // Ensure channel exists before requesting permission (best practice)

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  const granted = finalStatus === "granted";
  console.log(
    `Notification Permission Status: ${granted ? "Granted" : "Denied"}`
  );
  return granted;
}

// --- Scheduling ---

/**
 * Schedules a daily local notification for logging expenses at a specific time.
 * Uses the Calendar Trigger for accurate daily recurrence.
 * @param {number} hour - The hour (0-23) to fire the notification. Default: 20 (8 PM).
 * @param {number} minute - The minute (0-59) to fire the notification. Default: 0.
 */
export async function scheduleDailyNotification(hour = 20, minute = 0) {
  const permissionGranted = await requestNotificationPermission();
  if (!permissionGranted) {
    console.warn("Cannot schedule notification: Permission denied.");
    return;
  }

  // Clear any previously scheduled instances of this notification
  await Notifications.cancelAllScheduledNotificationsAsync();

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Add your expenses 💰",
      body: "Don't forget to log your expenses today!",
      sound: true,
      android: { channelId: "default" },
      data: { action: "open_tracker" },
    },
    trigger: {
      // Use the Calendar Trigger for a fixed time of day
      hour: hour,
      minute: minute,
      repeats: true, // This makes it repeat every day at the specified time
    },
  });

  console.log(
    `Daily notification scheduled for ${hour}:${minute} with ID: ${notificationId}`
  );
}

// --- Utilities ---

/**
 * Cancels all currently scheduled local notifications.
 */
export async function cancelAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log("All scheduled notifications cancelled.");
}

/**
 * Schedules a test notification to fire in 5 seconds.
 * @returns {Promise<boolean>} True if scheduled, false if permission denied.
 */
export async function sendTestNotification() {
  console.log("--- Attempting to schedule Test Notification ---");

  const permissionGranted = await requestNotificationPermission();
  if (!permissionGranted) {
    console.warn("Cannot schedule test notification: Permission denied.");
    return false;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Test Notification 🚀",
      body: "This is a 5-second test from your app!",
      sound: true,
      android: { channelId: "default" },
    },
    trigger: {
      seconds: 5,
      repeats: false,
    },
  });

  console.log(
    "Test notification scheduled successfully! It should appear in 5 seconds."
  );
  console.log(
    "Ensure the app is minimized (backgrounded) to see it in a development build."
  );

  return true;
}
