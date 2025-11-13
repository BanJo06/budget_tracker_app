import ThemeProvider from "@/assets/constants/theme-provider";
import { ToastProvider, useToast } from "@/components/ToastContext";
import { startAppUsageTimer } from "@/data/daily_quests_logic";
import { startWeeklyAppUsageTimer } from "@/data/weekly_quests_logic";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native"; // Needed for a simple loading view
import "../app/globals.css";

// 1. Helper component to run timers and use context
function AppSetupAndTimers() {
  const { showToast } = useToast();

  // Run the timer logic using the context
  useEffect(() => {
    // Start your app usage timers here
    console.log("⏱️ Started app usage tracking at");
    startAppUsageTimer(showToast);

    console.log("⏱️ Started weekly app usage tracking at");
    startWeeklyAppUsageTimer(showToast);

    // IMPORTANT: Return a cleanup function if your timer functions return one
    // return () => {
    //   // stop timers here if needed
    // }
  }, []);

  return null; // This component just handles side effects
}

export default function RootLayout() {
  const [isAppReady, setAppReady] = useState(false);

  useEffect(() => {
    // In a real app, this would be where you load fonts, check auth, etc.
    // For now, we use a simple timeout to simulate the app being ready.
    // A small delay often fixes race conditions on native builds.
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 500); // 500ms delay to ensure native bridge/initial render is settled

    return () => clearTimeout(timer);
  }, []);

  if (!isAppReady) {
    // 2. Render a simple loading screen *before* mounting the Stack
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading App...</Text>
      </View>
    );
  }

  // 3. Once ready, render the ToastProvider and the main Stack navigator
  // This ensures the Stack is only mounted when the root component is stable.
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppSetupAndTimers />
        <Stack>
          <Stack.Screen
            name="(sidemenu)"
            options={{ headerShown: false, animation: "fade" }}
          />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="add" options={{ headerShown: false }} />
          <Stack.Screen name="shop" options={{ headerShown: false }} />
        </Stack>
      </ToastProvider>
    </ThemeProvider>
  );
}
