// types/navigation.d.ts

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'; // If you're using bottom tabs
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { CompositeNavigationProp } from '@react-navigation/native';

// 1. Define the parameter list for your main Drawer Navigator.
//    This should list all routes that are *direct children* of your Drawer.
//    '(tabs)' is a route group in Expo Router, which acts as a single "screen" in the drawer.
export type RootDrawerParamList = {
  '(tabs)': undefined; // This matches your app/(sidemenu)/(tabs) folder
  'settings': undefined; // This matches app/(sidemenu)/settings.tsx
  'categories': undefined; // This matches app/(sidemenu)/categories.tsx
  'exportrecords': undefined; // This matches app/(sidemenu)/exportrecords.tsx
  // Add any other top-level screens or route groups directly under app/(sidemenu) here
};

// 2. (Optional but good practice) Define the parameter list for your Tab Navigator
export type TabParamList = {
  'index': undefined; // Matches app/(sidemenu)/(tabs)/index.tsx
  'feed': undefined;  // Matches app/(sidemenu)/(tabs)/feed.tsx
  // Add other tab screens here
};

// 3. Define the specific navigation prop type for the screen where you are trying to open the drawer.
//    In your case, it's a screen inside the tabs navigator, which is nested in the drawer.
export type TabHomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'index'>, // The navigation prop for the current tab screen
  DrawerNavigationProp<RootDrawerParamList>       // The navigation prop for the parent Drawer navigator
>;

// This magic line globally augments React Navigation's RootParamList
// so that TypeScript knows about your root navigator's routes.
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootDrawerParamList {}
  }
}