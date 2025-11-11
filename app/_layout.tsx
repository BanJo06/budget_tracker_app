import { ToastProvider, useToast } from "@/components/ToastContext";
import { startAppUsageTimer } from "@/data/daily_quests_logic";
import { startWeeklyAppUsageTimer } from "@/data/weekly_quests_logic";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "../app/globals.css"; // Keep if needed for global styles

// 🧩 Helper component that runs inside ToastProvider
// function AppTimers() {
//   const { showToast } = useToast();

//   useEffect(() => {
//     // Daily quest timer
//     startAppUsageTimer(showToast);

//     // Weekly quest timer (e.g., 40-minute usage quest)
//     startWeeklyAppUsageTimer(showToast);
//   }, []);

//   return null;
// }

function AppTimers() {
  const { showToast } = useToast();

  useEffect(() => {
    // Start daily quest timer
    startAppUsageTimer(showToast);

    // Start weekly 40-minute quest timer
    startWeeklyAppUsageTimer(showToast);
  }, []);

  return null;
}

export default function RootLayout() {
  return (
    <ToastProvider>
      {/* The tracker is now inside ToastProvider context ✅ */}
      <AppTimers />

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
  );
}
