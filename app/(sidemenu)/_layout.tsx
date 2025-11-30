import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { Alert, Pressable, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import IntroModal from "@/components/IntroModal"; // Adjust path as needed
import { usePurchase } from "@/components/PurchaseContext";
import { UserProvider, useUser } from "@/components/UserContext"; // Adjust path as needed
import WelcomeModal from "@/components/WelcomeModal";

// ----------------------------------------
// 1. Modified Custom Drawer Content
// ----------------------------------------
const CustomDrawerContent = (props: any) => {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#E5E5E5" : "#1A1A1A";
  const insets = useSafeAreaInsets();
  const currentRouteName = props.state.routes[props.state.index].name;

  const { hasPurchasedExport } = usePurchase();

  // GET NAME FROM CONTEXT
  const { name } = useUser();

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
        <Feather name="lock" size={24} color={iconColor} />
      ),
      route: "exportrecords",
      isLocked: !hasPurchasedExport,
    },
    {
      label: "Add Late Records",
      icon: <MaterialIcons name="post-add" size={24} color={iconColor} />,
      route: "addlaterecords",
    },
    {
      label: "Backup/Restore",
      icon: <MaterialIcons name="backup" size={24} color={iconColor} />,
      route: "backup",
    },
    {
      label: "About",
      icon: <MaterialIcons name="info" size={24} color={iconColor} />,
      route: "about",
    },
  ];

  return (
    <DrawerContentScrollView
      className="flex-1 p-0 bg-bgPrimary-light dark:bg-bgPrimary-dark"
      contentContainerStyle={{
        paddingTop: insets.top,
        flexGrow: 1,
      }}
      {...props}
    >
      <View className="flex-1 h-full bg-bgPrimary-light dark:bg-bgPrimary-dark">
        {/* Header with Dynamic Name */}
        <View className="bg-purple-700 p-6 rounded-3xl mb-6 mx-2 mt-2">
          <Text className="text-white text-2xl font-bold">Hello, {name}!</Text>
        </View>

        {/* Menu Items */}
        <View className="px-4 space-y-2 gap-2">
          {menuItems.map((item, index) => {
            const isActive = currentRouteName === item.route;
            const isLocked = item.isLocked || false;

            return (
              <Pressable
                key={index}
                onPress={() => {
                  if (isLocked) {
                    Alert.alert(
                      "Feature Locked",
                      "You need to purchase 'Export Records' in the Shop to use this feature.",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Go to Shop",
                          onPress: () => router.push("/shop"),
                        },
                      ]
                    );
                  } else {
                    router.push(`/${item.route}`);
                  }
                }}
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

// ----------------------------------------
// 2. Main Layout Component
// ----------------------------------------
function DrawerLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const {
    isFirstLaunch,
    saveUserName,
    shouldShowWelcome,
    finishWelcome,
    name,
  } = useUser();

  const headerStyle = {
    backgroundColor: isDark ? "#121212" : "#ffffff",
  };
  const headerTitleStyle = {
    color: isDark ? "#ffffff" : "#000000",
  };
  const backButtonColor = isDark ? "#ffffff" : "#000000";

  return (
    <>
      {/* The Modal is rendered here so it sits on top of everything */}
      <IntroModal
        visible={isFirstLaunch}
        onSave={(name) => saveUserName(name)}
      />

      <WelcomeModal
        visible={shouldShowWelcome}
        name={name}
        onClose={finishWelcome}
      />

      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        initialRouteName="(tabs)"
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: 260,
            backgroundColor: colorScheme === "dark" ? "#121212" : "#ffffff",
          },
          drawerContentStyle: {
            backgroundColor: colorScheme === "dark" ? "#121212" : "#ffffff",
          },
        }}
      >
        <Drawer.Screen
          name="(tabs)"
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
        <Drawer.Screen
          name="about"
          options={({ navigation }) => ({
            drawerLabel: "About",
            title: "About",
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
    </>
  );
}

// ----------------------------------------
// 3. Export wrapped in Provider
// ----------------------------------------
export default function Layout() {
  return (
    <UserProvider>
      <DrawerLayout />
    </UserProvider>
  );
}
