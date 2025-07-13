import { Stack } from "expo-router";
import '../app/globals.css'; // Keep this if it's essential for styling to avoid other errors

export default function RootLayout() {
  return (
    <Stack>

      <Stack.Screen
        name="(sidemenu)"
        options={{ headerShown: false, animation: 'fade' }}
      />
      
      <Stack.Screen
        name="index"
        options={{ headerShown: false}}
      />

      <Stack.Screen
        name="add" // Try with just 'add' first
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="shop" // Or try with just 'shop'
        options={{ headerShown: false }}
      />
    </Stack>
  );
}