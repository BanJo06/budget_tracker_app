import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { router, Tabs } from "expo-router"; // Import 'router' here
import { useColorScheme } from "nativewind";
import React from "react";
import { Pressable, View } from "react-native";
import "../../../app/globals.css";
import { SVG_ICONS } from "../../../assets/constants/icons";

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
        justifyContent: "center",
        alignItems: "center",
        opacity: 1, // No dimming
        backgroundColor: "transparent", // No background flash
      }}
      android_ripple={null} // Disables ripple on Android
    >
      {/* This renders the actual icon and label provided by tabBarIcon/tabBarLabel */}
      {children}
    </Pressable>
  );
};

interface AddButtonProps extends BottomTabBarButtonProps {
  // children is not strictly needed if we fully control the rendering
  // but keeping it for type compatibility if props are spread
  children: React.ReactNode;
}

// Custom TabBarButton for the 'Add' tab
const AddTabBarButton: React.FC<AddButtonProps> = ({
  onPress,
  accessibilityState,
}) => {
  // `focused` indicates if this tab is currently selected, though for a navigation button, it might always be false
  const focused = accessibilityState?.selected;

  return (
    <Pressable
      // CRUCIAL: This onPress navigates to the actual add.tsx screen outside the tabs
      onPress={() => router.push("/add")} // Navigate to app/add.tsx
      android_ripple={null}
      // Tailwind classes for the Pressable itself, to position the floating button
      className="flex-1 justify-center items-center relative -mt-6" // -mt-6 lifts it up
    >
      {({ pressed }) => (
        <View
          // This View creates the circular background for the icon
          className="w-[52px] h-[52px] rounded-full justify-center items-center"
        >
          {/* Render the appropriate Add icon based on press state */}
          {pressed ? (
            <SVG_ICONS.AddActive size={52} /> // Adjust size/color as needed
          ) : (
            <SVG_ICONS.Add size={52} /> // Adjust size/color as needed
          )}
        </View>
      )}
    </Pressable>
  );
};

// --- Your Layout Component ---
const _Layout = () => {
  const { colorScheme } = useColorScheme();

  // Define tab colors dynamically
  const tabBarBackground = colorScheme === "dark" ? "#121212" : "#FFFFFF";
  const tabBarActiveTint = colorScheme === "dark" ? "#BB86FC" : "#8938E9";
  const tabBarInactiveTint = colorScheme === "dark" ? "#888" : "#000";
  const tabBarBorderTop = colorScheme === "dark" ? "#333" : "#EEEEEE";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabBarActiveTint,
        tabBarInactiveTintColor: tabBarInactiveTint,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 10 },
        tabBarStyle: {
          backgroundColor: tabBarBackground,
          borderTopWidth: 1,
          borderTopColor: tabBarBorderTop,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            const IconComponent = focused
              ? SVG_ICONS.DashboardActive
              : SVG_ICONS.Dashboard;
            return (
              <View>
                <IconComponent />
              </View>
            );
          },
          tabBarButton: (props) => <NoHighlightTabBarButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="graphs"
        options={{
          title: "Graphs",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            const IconComponent = focused
              ? SVG_ICONS.GraphsActive
              : SVG_ICONS.Graphs;
            return (
              <View>
                <IconComponent />
              </View>
            );
          },
          tabBarButton: (props) => <NoHighlightTabBarButton {...props} />,
        }}
      />
      {/* This is the entry for your custom Add Button in the tab bar */}
      <Tabs.Screen
        name="_add-button" // CRUCIAL: Use the name of your dummy file
        options={{
          title: "", // Hide default title
          tabBarLabel: "", // Hide default label
          headerShown: false,
          tabBarButton: (props: BottomTabBarButtonProps) => (
            <AddTabBarButton {...props} /> // Use your custom button component
          ),
          tabBarIcon: () => null, // Ensure no default icon is rendered by Tabs.Screen
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            const IconComponent = focused
              ? SVG_ICONS.ReportsActive
              : SVG_ICONS.Reports;
            return (
              <View className="items-center justify-center">
                <IconComponent />
              </View>
            );
          },
          tabBarButton: (props) => <NoHighlightTabBarButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: "Quests",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            const IconComponent = focused
              ? SVG_ICONS.QuestsActive
              : SVG_ICONS.Quests;
            return (
              <View className="items-center justify-center">
                <IconComponent />
              </View>
            );
          },
          tabBarButton: (props) => <NoHighlightTabBarButton {...props} />,
        }}
      />
    </Tabs>
  );
};

export default _Layout;
