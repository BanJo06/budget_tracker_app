import { Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind'; // For Dark-mode
import React from 'react';
import '../../app/globals.css';
import { AppIcons, IconName } from '../../assets/constants/icons';

interface TabBarIconProps {
  name: IconName;
  color: string; // This color will be a hex string from the tab navigator
  size: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ name, color, size }) => {
  const IconComponent = AppIcons[name];
  // Render the SVG component with dynamic color and size
  return IconComponent ? <IconComponent width={size} height={size} fill={color} /> : null;
};

const _Layout = () => {
  const { colorScheme } = useColorScheme(); // 'light' or 'dark'

  // Define your colors. You can map these to Tailwind classes or get them from a theme.
  // For `tabBarActiveTintColor` and `tabBarInactiveTintColor`, you need direct color strings.
  // These examples use hardcoded hex values corresponding to common Tailwind colors.
  const activeTabColor = colorScheme === 'dark' ? '#38BDF8' : '#2563EB'; // blue-400 or blue-700
  const inactiveTabColor = colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'; // gray-400 or gray-500
  const tabBarBgColor = colorScheme === 'dark' ? '#1F2937' : '#F9FAFB'; // gray-800 or gray-50

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTabColor,
        tabBarInactiveTintColor: inactiveTabColor,
        headerShown: false, // You've set this for all screens, which is common for tabs
        tabBarStyle: {
          backgroundColor: tabBarBgColor,
          // You can also add more styles here, e.g., borders, shadows.
          // Note: Tailwind classes like `className="bg-gray-800"` don't directly apply here.
          // For `tabBarStyle`, you use standard React Native style objects.
          // If you need Tailwind utility styles, consider using `tailwind-rn` or similar.
          // Or, for simple cases, define colors from your Tailwind config as shown above.
        },
        // Optionally, apply header styles globally if headerShown: true for some screens
        headerStyle: {
          backgroundColor: tabBarBgColor,
        },
        headerTitleStyle: {
          color: colorScheme === 'dark' ? '#F9FAFB' : '#1F2937', // Text color for header title
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="dashboard_normal" color={color} size={size} /> // Assuming 'Home' is defined in AppIcons
          ),
        }}
      />
      <Tabs.Screen
        name='graphs'
        options={{
          title: 'Graphs',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="graphs_normal" color={color} size={size} /> // Assuming 'Explore' is defined in AppIcons
          ),
        }}
      />
      <Tabs.Screen
        name='add'
        options={{
          title: 'Add',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="add" color={color} size={size} /> // Assuming 'Add' is defined in AppIcons
          ),
        }}
      />
      <Tabs.Screen
        name='reports'
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="reports_normal" color={color} size={size} /> // Assuming 'Reports' is defined in AppIcons
          ),
        }}
      />
      <Tabs.Screen
        name='quests'
        options={{
          title: 'Quests',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="quests_normal" color={color} size={size} /> // Assuming 'Quests' is defined in AppIcons
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;