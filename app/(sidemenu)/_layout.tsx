import { usePurchase } from "@/components/PurchaseContext";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { Alert, Pressable, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type DrawerParamList = {
  settings: undefined;
  categories: undefined;
  exportrecords: undefined;
  "(tabs)": undefined;
  addlaterecords: undefined;
};

const CustomDrawerContent = (props) => {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#E5E5E5" : "#1A1A1A";

  const insets = useSafeAreaInsets();
  const currentRouteName = props.state.routes[props.state.index].name;

  const { hasPurchasedExport } = usePurchase();

  const menuItems = [
    {
      label: "Main Dashboard",
      icon: <Feather name="home" size={24} color={iconColor} />,
      route: "(tabs)",
    },
    {
      label: "Settings",
      icon: <Feather name="settings" size={24} color={iconColor} />,
      route: "settings",
    },
    {
      label: "Categories",
      icon: <Entypo name="folder" size={24} color={iconColor} />,
      route: "categories",
    },
    {
      label: "Export Records",
      icon: hasPurchasedExport ? (
        <MaterialIcons name="file-download" size={24} color={iconColor} />
      ) : (
        // Optional: Change icon to a lock if not purchased
        <Feather name="lock" size={24} color={iconColor} />
      ),
      route: "exportrecords",
      // 2. Add a locked flag
      isLocked: !hasPurchasedExport,
    },
    {
      label: "Add Late Records",
      icon: <MaterialIcons name="post-add" size={24} color={iconColor} />,
      route: "addlaterecords",
    },
    {
      label: "Backup",
      icon: <MaterialIcons name="post-add" size={24} />,
      route: "backup",
    },
  ];

  return (
    <DrawerContentScrollView
      className="flex-1 p-0 bg-bgPrimary-light dark:bg-bgPrimary-dark"
      contentContainerStyle={{
        paddingTop: insets.top,
        flexGrow: 1,
      }}
    >
      <View className="flex-1 h-full bg-bgPrimary-light dark:bg-bgPrimary-dark">
        {/* Header */}
        <View className="bg-purple-700 p-6 rounded-3xl mb-6">
          <Text className="text-white text-2xl font-bold">Budget Tracker</Text>
          <Text className="text-purple-200 text-sm mt-1">
            Manage your expenses easily
          </Text>
        </View>

        {/* Menu Items */}
        <View className="px-4 space-y-2 gap-2">
          {menuItems.map((item, index) => {
            const isActive = currentRouteName === item.route;

            // 3. Check if the item is locked
            const isLocked = item.isLocked || false;

            return (
              <Pressable
                key={index}
                onPress={() => {
                  // 4. Block navigation if locked
                  if (isLocked) {
                    Alert.alert(
                      "Feature Locked",
                      "You need to purchase 'Export Records' in the Shop to use this feature.",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Go to Shop",
                          onPress: () => router.push("/shop"), // Ensure /shop route is correct
                        },
                      ]
                    );
                  } else {
                    // Only navigate if unlocked
                    router.push(`/${item.route}`);
                  }
                }}
                // 5. Visually dim the button if locked
                className={`flex-row items-center p-3 rounded-xl ${
                  isActive
                    ? "bg-purple-100 dark:bg-purple-900/40"
                    : "bg-bgPrimary-light dark:bg-bgPrimary-dark"
                } ${isLocked ? "opacity-50" : "opacity-100"}`}
              >
                <View className="mr-4">{item.icon}</View>
                <Text
                  className={`text-base font-medium ${
                    isActive
                      ? "text-purple-700 dark:text-purple-300"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

// This is the main layout for your (sidemenu) folder, defining the Drawer Navigator
export default function Layout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const headerStyle = {
    backgroundColor: isDark ? "#121212" : "#ffffff",
  };

  const headerTitleStyle = {
    color: isDark ? "#ffffff" : "#000000",
  };

  const backButtonColor = isDark ? "#ffffff" : "#000000";

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName="(tabs)"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 260,
          backgroundColor: colorScheme === "dark" ? "#121212" : "#ffffff", // DARK MODE BACKGROUND
        },
        drawerContentStyle: {
          backgroundColor: colorScheme === "dark" ? "#121212" : "#ffffff", // ensures no white gaps
        },
      }}
    >
      {/* This drawer.screen (tabs) will deleted automatically if there's a error in tabs */}
      <Drawer.Screen
        name="(tabs)" // This points to app/(sidemenu)/(tabs)/_layout.jsx
        options={{
          drawerLabel: "Main Dashboard",
          title: "App Dashboard",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="settings"
        options={({ navigation }) => ({
          drawerLabel: "Settings",
          title: "Settings",
          headerShown: true,
          headerStyle,
          headerTitleStyle,
          headerTintColor: backButtonColor, // Back button color
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 15 }}
            >
              <Text style={{ fontSize: 24, color: backButtonColor }}>←</Text>
            </Pressable>
          ),
        })}
      />
      <Drawer.Screen
        name="categories"
        options={({ navigation }) => ({
          drawerLabel: "Categories",
          title: "Categories",
          headerShown: true,
          headerStyle,
          headerTitleStyle,
          headerTintColor: backButtonColor,
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 15 }}
            >
              <Text style={{ fontSize: 24, color: backButtonColor }}>←</Text>
            </Pressable>
          ),
        })}
      />
      <Drawer.Screen
        name="exportrecords"
        options={({ navigation }) => ({
          drawerLabel: "Export Records",
          title: "Export Records",
          headerShown: true,
          headerStyle,
          headerTitleStyle,
          headerTintColor: backButtonColor,
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 15 }}
            >
              <Text style={{ fontSize: 24, color: backButtonColor }}>←</Text>
            </Pressable>
          ),
        })}
      />

      <Drawer.Screen
        name="backup"
        options={({ navigation }) => ({
          drawerLabel: "Backup",
          title: "Backup",
          headerShown: true, // Show header for this screen
          // Conditionally render the back button
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 15 }}
            >
              <Text style={{ fontSize: 24 }}>←</Text>
            </Pressable>
          ),
        })}
      />

      <Drawer.Screen
        name="addlaterecords"
        options={({ navigation }) => ({
          drawerLabel: "Add Late Records",
          title: "Add Late Records",
          headerShown: true,
          headerStyle,
          headerTitleStyle,
          headerTintColor: backButtonColor,
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 15 }}
            >
              <Text style={{ fontSize: 24, color: backButtonColor }}>←</Text>
            </Pressable>
          ),
        })}
      />
    </Drawer>
  );
}
