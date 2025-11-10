import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Place this at the top of your file or in a global types file (e.g., types/navigation.ts)
export type DrawerParamList = {
  settings: undefined; // Example: A screen named 'settings'
  categories: undefined; // Example: A screen named 'categories'
  exportrecords: undefined; // Example: A screen named 'exportrecords'
  "(tabs)": undefined; // If you have a nested tab navigator within the drawer
  // Add other top-level drawer screens here
};

const CustomDrawerContent = (props) => {
  // Get the name of the currently focused route
  const currentRouteName = props.state.routes[props.state.index].name;

  // Define colors and styles that were previously in screenOptions
  const activeTintColor = "#8938E9"; // Example active label/icon color
  const inactiveTintColor = "#333"; // Example inactive label/icon color

  return (
    <DrawerContentScrollView {...props}>
      {/* Optional: Add a custom header or branding to your drawer */}
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerHeaderText}>Budget Tracker</Text>
      </View>

      {/* Custom Drawer Items */}
      {/* Settings */}
      <DrawerItem
        label={"Settings"}
        icon={({ size }) => (
          // Note: SVG_ICONS is not provided, this would need to be a component you've defined elsewhere
          // For demonstration purposes, this is a placeholder.
          <Text style={{ fontSize: size }}>⚙️</Text>
        )}
        onPress={() => {
          router.push("/settings");
        }}
      />

      {/* Categories */}
      <DrawerItem
        label={"Categories"}
        icon={({ size }) => (
          // Placeholder for SVG_ICONS.CategorySidemenu
          <Text style={{ fontSize: size }}>🗂️</Text>
        )}
        onPress={() => {
          router.push("/categories");
        }}
      />

      {/* Export Records */}
      <DrawerItem
        label={"Export Records"}
        icon={({ size }) => (
          // Placeholder for SVG_ICONS.ExportRecords
          <Text style={{ fontSize: size }}>📄</Text>
        )}
        onPress={() => {
          router.push("/exportrecords");
        }}
      />

      {/* Backup Records */}
      {/* <DrawerItem
        label={"Backup"}
        icon={({ size }) => (
          // Placeholder for SVG_ICONS.ExportRecords
          <Text style={{ fontSize: size }}>📄</Text>
        )}
        onPress={() => {
          router.push("/backup");
        }}
      /> */}

      {/* Add Late Records */}
      <DrawerItem
        label={"Add Late Records"}
        icon={({ size }) => (
          // Placeholder for SVG_ICONS.ExportRecords
          <Text style={{ fontSize: size }}>📄</Text>
        )}
        onPress={() => {
          router.push("/addlaterecords");
        }}
      />
      {/* Add more custom DrawerItems as needed */}
    </DrawerContentScrollView>
  );
};

// This is the main layout for your (sidemenu) folder, defining the Drawer Navigator
export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName="(tabs)"
      screenOptions={{
        headerShown: false,
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
          headerShown: true, // Show header for this screen
          // Conditionally render the back button
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 15 }}
            >
              <Text style={{ fontSize: 24 }}>⬅️</Text>
            </Pressable>
          ),
        })}
      />
      <Drawer.Screen
        name="categories"
        options={({ navigation }) => ({
          drawerLabel: "Categories",
          title: "Categories",
          headerShown: true, // Show header for this screen
          // Conditionally render the back button
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 15 }}
            >
              <Text style={{ fontSize: 24 }}>⬅️</Text>
            </Pressable>
          ),
        })}
      />
      <Drawer.Screen
        name="exportrecords"
        options={({ navigation }) => ({
          drawerLabel: "Export Records",
          title: "Export Records",
          headerShown: true, // Show header for this screen
          // Conditionally render the back button
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 15 }}
            >
              <Text style={{ fontSize: 24 }}>⬅️</Text>
            </Pressable>
          ),
        })}
      />

      {/* <Drawer.Screen
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
              <Text style={{ fontSize: 24 }}>⬅️</Text>
            </Pressable>
          ),
        })}
      /> */}

      <Drawer.Screen
        name="addlaterecords"
        options={({ navigation }) => ({
          drawerLabel: "Add Late Records",
          title: "Add Late Records",
          headerShown: true, // Show header for this screen
          // Conditionally render the back button
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 15 }}
            >
              <Text style={{ fontSize: 24 }}>⬅️</Text>
            </Pressable>
          ),
        })}
      />

      {/* Add any other screens you want to be part of your drawer navigator */}
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#eee",
    marginBottom: 10,
    backgroundColor: "white", // Light background for header
  },
  drawerHeaderText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
});
