import { ThemeContext, ThemeProvider } from "@/assets/constants/theme-provider";
import { PurchaseProvider } from "@/components/PurchaseContext";
import { ToastProvider, useToast } from "@/components/ToastContext";
import { startAppUsageTimer } from "@/data/daily_quests_logic";
import { startWeeklyAppUsageTimer } from "@/data/weekly_quests_logic";
import { initDatabase } from "@/utils/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { StatusBar, Text, View } from "react-native";
import "../app/globals.css";

function AppSetupAndTimers() {
  const { showToast } = useToast();

  useEffect(() => {
    startAppUsageTimer(showToast);
    startWeeklyAppUsageTimer(showToast);
  }, []);

  return null;
}

// function LoadUIMode() {
//   const colorScheme = useColorScheme();

//   useEffect(() => {
//     const loadMode = async () => {
//       try {
//         const saved = await AsyncStorage.getItem("uiMode");

//         if (saved === null) {
//           // First launch → force light mode
//           colorScheme("light");
//           return;
//         }

//         colorScheme(saved === "dark" ? "dark" : "light");
//       } catch (err) {
//         console.log("Failed to load UI mode:", err);
//       }
//     };

//     loadMode();
//   }, []);

//   return null;
// }

export default function RootLayout() {
  const [isAppReady, setAppReady] = useState(false);
  const [dbError, setDbError] = useState(null);
  const { mode } = useContext(ThemeContext);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("Starting database initialization...");

        // 1. ✅ Wait for the database schema to be created/verified
        await initDatabase();

        // 2. Set ready state only AFTER DB is initialized
        setAppReady(true);
        console.log("UI MODE:", await AsyncStorage.getItem("uiMode"));
      } catch (error) {
        console.error("Critical error during app initialization:", error);
        setDbError("Failed to initialize database. Please restart the app.");
      }
    };

    initializeApp();
  }, []);

  // --- Loading/Error State ---
  if (!isAppReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <Text style={{ color: "#fff" }}>
          {dbError
            ? `Error: ${dbError}`
            : "Loading App and initializing database..."}
        </Text>
      </View>
    );
  }

  // --- App Ready State ---
  return (
    <ThemeProvider>
      <PurchaseProvider>
        <StatusBar
          // Set barStyle based on the theme 'mode' managed by ThemeProvider
          barStyle={mode === "dark" ? "light-content" : "dark-content"}
          translucent
          backgroundColor="transparent"
        />
        {/* LoadUIMode should run before the rest of the UI */}
        {/* <LoadUIMode /> */}
        <ToastProvider>
          {/* AppSetupAndTimers runs after ToastProvider is available */}
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
      </PurchaseProvider>
    </ThemeProvider>
  );
}
