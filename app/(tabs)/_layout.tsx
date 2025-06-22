import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import '../../app/globals.css';
import { SVG_ICONS } from '../../assets/constants/icons';

// A generic custom button to disable highlight/ripple for any tab
const NoHighlightTabBarButton: React.FC<BottomTabBarButtonProps> = (props) => {
  const { children, onPress } = props;

  return (
    <Pressable
      onPress={onPress}
      // --- IMPORTANT: Disable ripple for Android, no opacity change for iOS ---
      style={{
        flex: 1, // Ensures the button takes its full allocated space
        // These styles are crucial to allow its children (icon/label) to be centered
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1, // No dimming
        backgroundColor: 'transparent', // No background flash
      }}
      android_ripple={null} // Disables ripple on Android
    >
      {/* This renders the actual icon and label provided by tabBarIcon/tabBarLabel */}
      {children}
    </Pressable>
  );
};
  
interface AddButtonProps extends BottomTabBarButtonProps {
  children: React.ReactNode;
}

// Custom TabBarButton for the 'Add' tab
const AddTabBarButton: React.FC<AddButtonProps> = (props) => {
  const { onPress } = props;

  return (
    <Pressable
      onPress={onPress}
      android_ripple={null}
      className="flex-1 justify-center items-center relative -mt-6"
    >
      {({ pressed }) => (
        <View>
          {pressed ? (
            // Icon when pressed (e.g., active icon)
            <SVG_ICONS.AddActive width={52} height={52} />
          ) : (
            // Icon when not pressed (e.g., regular icon)
            <SVG_ICONS.Add width={52} height={52} /> // Or a different color if AddIcon is meant to be colored
          )}
        </View>
      )}
    </Pressable>
  );
};

// --- Your Layout Component ---
const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#8938E9', // Example: Tomato Red for active
        tabBarInactiveTintColor: '#000000', // Example: Gray for inactive
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // Example background for the tab bar itself
          borderTopWidth: 1,
          borderTopColor: '#EEEEEE',
        }
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Dashboard',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            const IconComponent = focused
              ? SVG_ICONS.DashboardActive
              : SVG_ICONS.Dashboard;
            return (
              <View>
                <IconComponent/>
              </View>
            );
          },
          tabBarButton: (props) => <NoHighlightTabBarButton {...props} />
        }}
      />
      <Tabs.Screen
        name='graphs'
        options={{
          title: 'Graphs',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            const IconComponent = focused
              ? SVG_ICONS.GraphsActive
              : SVG_ICONS.Graphs;
            return (
              <View>
                <IconComponent/>
              </View>
            );
          },
          tabBarButton: (props) => <NoHighlightTabBarButton {...props} />
        }}
      />
      <Tabs.Screen
        name='add'
        options={{
          title: 'Add',
          headerShown: false,
          tabBarButton: (props: BottomTabBarButtonProps) => (
            <AddTabBarButton {...props} />
          ),
          tabBarIcon: () => null, // Icon rendered inside AddTabBarButton
          tabBarLabel: () => null, // Hide the label for the 'Add' tab
        }}
      />
      <Tabs.Screen
        name='reports'
        options={{
          title: 'Reports',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            const IconComponent = focused
              ? SVG_ICONS.ReportsActive
              : SVG_ICONS.Reports;
            return (
              <View className="items-center justify-center">
                <IconComponent/>
              </View>
            );
          },
          tabBarButton: (props) => <NoHighlightTabBarButton {...props} />
        }}
      />
      <Tabs.Screen
        name='quests'
        options={{
          title: 'Quests',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            const IconComponent = focused
              ? SVG_ICONS.QuestsActive
              : SVG_ICONS.Quests;
            return (
              <View className="items-center justify-center">
                <IconComponent/>
              </View>
            );
          },
          tabBarButton: (props) => <NoHighlightTabBarButton {...props} />
        }}
      />
    </Tabs>
  );
};

export default _Layout;
