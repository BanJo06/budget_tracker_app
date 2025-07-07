// import { SVG_ICONS } from '@/assets/constants/icons';
// import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
// import { router } from 'expo-router';
// import { Drawer } from 'expo-router/drawer';
// import React from 'react';

// const CustomDrawerContent = (props) =>  {
//   return (
//   <DrawerContentScrollView {...props}>
//     <DrawerItem 
//     icon={({ size }) => (
//     <SVG_ICONS.Quests size={24} /> )}
//     label={'Settings'}
//     onPress={() => {
//           router.push('/settings');
//         }}
    
//     />
//     <DrawerItem 
//     icon={({ size }) => (
//     <SVG_ICONS.Quests size={24} /> )}
//     label={'Categories'}
//     onPress={() => {
//           router.push('/categories');
//         }}
    
//     />
//     <DrawerItem 
//     icon={({ size }) => (
//     <SVG_ICONS.Quests size={24} /> )}
//     label={'Export Records'}
//     onPress={() => {
//           router.push('/exportrecords');
//         }}
    
//     />
//   </DrawerContentScrollView>
//   );
// }

// export default function _layout() {
//   return (
//     <Drawer drawerContent={props => <CustomDrawerContent {...props} /> } />
//   )
// }

// app/(sidemenu)/_layout.tsx

import { SVG_ICONS } from '@/assets/constants/icons'; // Adjust this import path if necessary
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native'; // Import necessary components for custom header or styling

// Optional: Define types for your Drawer Navigator. This helps with TypeScript and auto-completion.
// Place this at the top of your file or in a global types file (e.g., types/navigation.ts)
export type DrawerParamList = {
  'settings': undefined; // Example: A screen named 'settings'
  'categories': undefined; // Example: A screen named 'categories'
  'exportrecords': undefined; // Example: A screen named 'exportrecords'
  '(tabs)': undefined; // If you have a nested tab navigator within the drawer
  // Add other top-level drawer screens here
};

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      {/* Optional: Add a custom header or branding to your drawer */}
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerHeaderText}>My App</Text>
      </View>

      {/* Optional: If you want to include the default Drawer.Screen items defined below
        (e.g., for 'settings', 'categories', 'exportrecords' as well as your custom ones),
        uncomment the line below. If you only want the custom items you've explicitly added, keep it commented.
      */}
      {/* <DrawerItemList {...props} /> */}

      {/* Custom Drawer Items */}
      <DrawerItem
        label={'Settings'}
        icon={({ color, size }) => (
          // Use the provided 'color' and 'size' for consistency with drawer theme
          <SVG_ICONS.Quests width={size} height={size} fill={color} />
        )}
        onPress={() => {
          // Navigate to the '/settings' route. Ensure you have app/(sidemenu)/settings.tsx
          router.push('/settings');
        }}
      />

      <DrawerItem
        label={'Categories'}
        icon={({ color, size }) => (
          // Use the provided 'color' and 'size' for consistency with drawer theme
          <SVG_ICONS.Quests width={size} height={size} fill={color} />
        )}
        onPress={() => {
          // Navigate to the '/categories' route. Ensure you have app/(sidemenu)/categories.tsx
          router.push('/categories');
        }}
      />

      <DrawerItem
        label={'Export Records'}
        icon={({ color, size }) => (
          // Use the provided 'color' and 'size' for consistency with drawer theme
          <SVG_ICONS.Quests width={size} height={size} fill={color} />
        )}
        onPress={() => {
          // Navigate to the '/exportrecords' route. Ensure you have app/(sidemenu)/exportrecords.tsx
          router.push('/exportrecords');
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
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        // Global options for all screens within this drawer navigator
        headerShown: true, // Show header for screens by default
        drawerActiveTintColor: '#673AB7', // Color for the active drawer item label and icon
        drawerInactiveTintColor: '#333',  // Color for inactive drawer items
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
        drawerItemStyle: {
          marginVertical: 5,
        },
      }}
    >
      {/* Define your drawer screens here. These correspond to files/folders
        within your app/(sidemenu) directory.
        These are necessary for Expo Router to know which screens belong to this navigator.
      */}

      {/* If you have a nested tab navigator, define it like this: */}
      <Drawer.Screen
        name="(tabs)" // This name should match the folder name: app/(sidemenu)/(tabs)
        options={{
          drawerLabel: 'Home', // Label shown in the drawer for this group
          title: 'My App Home', // Header title when this route is active
          // You can add a drawerIcon here as well if you uncomment DrawerItemList above
          // drawerIcon: ({ color, size }) => <SVG_ICONS.Home width={size} height={size} fill={color} />,
        }}
      />

      {/* Define the screens that your custom DrawerItems navigate to */}
      <Drawer.Screen
        name="settings" // Corresponds to app/(sidemenu)/settings.tsx
        options={{
          drawerLabel: 'Settings', // Label for this screen if using DrawerItemList
          title: 'App Settings', // Header title for this screen
        }}
      />
      <Drawer.Screen
        name="categories" // Corresponds to app/(sidemenu)/categories.tsx
        options={{
          drawerLabel: 'Categories',
          title: 'Categories',
        }}
      />
      <Drawer.Screen
        name="exportrecords" // Corresponds to app/(sidemenu)/exportrecords.tsx
        options={{
          drawerLabel: 'Export Records',
          title: 'Export Records',
        }}
      />

      {/* Add any other screens you want to be part of your drawer navigator */}

    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
    backgroundColor: '#f9f9f9', // Light background for header
  },
  drawerHeaderText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  // Add other styles for your drawer if needed
});