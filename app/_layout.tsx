// import { ThemeProvider } from "@/assets/constants/theme-provider";
// import { ToastProvider, useToast } from "@/components/ToastContext";
// import { startAppUsageTimer } from "@/data/daily_quests_logic";
// import { startWeeklyAppUsageTimer } from "@/data/weekly_quests_logic";
// import { Stack } from "expo-router";
// import { useEffect, useState } from "react";
// import { Text, View } from "react-native"; // Needed for a simple loading view
// import "../app/globals.css";

// // 1. Helper component to run timers and use context
// function AppSetupAndTimers() {
//   const { showToast } = useToast();

//   // Run the timer logic using the context
//   useEffect(() => {
//     // Start your app usage timers here
//     console.log("⏱️ Started app usage tracking at");
//     startAppUsageTimer(showToast);

//     console.log("⏱️ Started weekly app usage tracking at");
//     startWeeklyAppUsageTimer(showToast);

//     // IMPORTANT: Return a cleanup function if your timer functions return one
//     // return () => {
//     //   // stop timers here if needed
//     // }
//   }, []);

//   return null; // This component just handles side effects
// }

// export default function RootLayout() {
//   const [isAppReady, setAppReady] = useState(false);

//   useEffect(() => {
//     // In a real app, this would be where you load fonts, check auth, etc.
//     // For now, we use a simple timeout to simulate the app being ready.
//     // A small delay often fixes race conditions on native builds.
//     const timer = setTimeout(() => {
//       setAppReady(true);
//     }, 500); // 500ms delay to ensure native bridge/initial render is settled

//     return () => clearTimeout(timer);
//   }, []);

//   if (!isAppReady) {
//     // 2. Render a simple loading screen *before* mounting the Stack
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Text>Loading App...</Text>
//       </View>
//     );
//   }

//   // 3. Once ready, render the ToastProvider and the main Stack navigator
//   // This ensures the Stack is only mounted when the root component is stable.
//   return (
//     <ThemeProvider>
//       <ToastProvider>
//         <AppSetupAndTimers />
//         <Stack>
//           <Stack.Screen
//             name="(sidemenu)"
//             options={{ headerShown: false, animation: "fade" }}
//           />
//           <Stack.Screen name="index" options={{ headerShown: false }} />
//           <Stack.Screen name="add" options={{ headerShown: false }} />
//           <Stack.Screen name="shop" options={{ headerShown: false }} />
//         </Stack>
//       </ToastProvider>
//     </ThemeProvider>
//   );
// }

// import { ThemeProvider } from "@/assets/constants/theme-provider";
// import { PurchaseProvider } from "@/components/PurchaseContext";
// import { ToastProvider, useToast } from "@/components/ToastContext";
// import { startAppUsageTimer } from "@/data/daily_quests_logic";
// import { startWeeklyAppUsageTimer } from "@/data/weekly_quests_logic";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Stack } from "expo-router";
// import { useColorScheme } from "nativewind"; // 👈 nativewind hook
// import { useEffect, useState } from "react";
// import { Text, View } from "react-native";
// import "../app/globals.css";

// function AppSetupAndTimers() {
//   const { showToast } = useToast();

//   useEffect(() => {
//     startAppUsageTimer(showToast);
//     startWeeklyAppUsageTimer(showToast);
//   }, []);

//   return null;
// }

// function LoadUIMode() {
//   const { colorScheme, setColorScheme } = useColorScheme();

//   useEffect(() => {
//     const loadMode = async () => {
//       try {
//         const savedMode = await AsyncStorage.getItem("uiMode");
//         if (savedMode === "dark") setColorScheme("dark");
//         else setColorScheme("light");
//       } catch (error) {
//         console.log("Failed to load UI mode:", error);
//       }
//     };
//     loadMode();
//   }, []);

//   return null;
// }

// export default function RootLayout() {
//   const [isAppReady, setAppReady] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setAppReady(true), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   if (!isAppReady) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Text>Loading App...</Text>
//       </View>
//     );
//   }

//   return (
//     <ThemeProvider>
//       <PurchaseProvider>
//         <LoadUIMode />
//         <ToastProvider>
//           <AppSetupAndTimers />
//           <Stack>
//             <Stack.Screen
//               name="(sidemenu)"
//               options={{ headerShown: false, animation: "fade" }}
//             />
//             <Stack.Screen name="index" options={{ headerShown: false }} />
//             <Stack.Screen name="add" options={{ headerShown: false }} />
//             <Stack.Screen name="shop" options={{ headerShown: false }} />
//           </Stack>
//         </ToastProvider>
//       </PurchaseProvider>
//     </ThemeProvider>
//   );
// }

import { ThemeProvider } from "@/assets/constants/theme-provider";
import { PurchaseProvider } from "@/components/PurchaseContext";
import { ToastProvider, useToast } from "@/components/ToastContext";
import { startAppUsageTimer } from "@/data/daily_quests_logic";
import { startWeeklyAppUsageTimer } from "@/data/weekly_quests_logic";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import "../app/globals.css";

// ⚠️ IMPORTANT: Import your database initialization function
import { initDatabase } from "@/utils/database"; // 👈 Update path as needed

// ... (AppSetupAndTimers and LoadUIMode components remain the same) ...

function AppSetupAndTimers() {
  const { showToast } = useToast();

  useEffect(() => {
    // These timers rely on useToast(), so they must be inside ToastProvider
    startAppUsageTimer(showToast);
    startWeeklyAppUsageTimer(showToast);
  }, []);

  return null;
}

function LoadUIMode() {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    const loadMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem("uiMode");
        if (savedMode === "dark") setColorScheme("dark");
        else setColorScheme("light");
      } catch (error) {
        console.log("Failed to load UI mode:", error);
      }
    };
    loadMode();
  }, []);

  return null;
}

export default function RootLayout() {
  const [isAppReady, setAppReady] = useState(false);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("Starting database initialization...");

        // 1. ✅ Wait for the database schema to be created/verified
        await initDatabase();

        // 2. Set ready state only AFTER DB is initialized
        setAppReady(true);
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
        {/* LoadUIMode should run before the rest of the UI */}
        <LoadUIMode />
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
