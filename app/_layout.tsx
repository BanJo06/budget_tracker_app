import { ToastProvider, useToast } from "@/components/ToastContext";
import { startAppUsageTimer } from "@/data/daily_quests_logic";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "../app/globals.css"; // Keep if needed for global styles

// 🧩 Helper component that runs inside ToastProvider
function AppUsageTracker() {
  const { showToast } = useToast();

  useEffect(() => {
    startAppUsageTimer(showToast);
  }, []);

  return null; // nothing to render
}

export default function RootLayout() {
  return (
    <ToastProvider>
      {/* The tracker is now inside ToastProvider context ✅ */}
      <AppUsageTracker />

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
