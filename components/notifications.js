import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// --- Configuration ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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

export async function requestNotificationPermission() {
  await createNotificationChannel();

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

export async function scheduleDailyNotification(hour = 24, minute = 0) {
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
      hour: hour,
      minute: minute,
      repeats: true,
    },
  });

  console.log(
    `Daily notification scheduled for ${hour}:${minute} with ID: ${notificationId}`
  );
}

// --- Utilities ---
export async function cancelAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log("All scheduled notifications cancelled.");
}

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
