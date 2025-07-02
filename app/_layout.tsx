import { Stack } from "expo-router";
import '../app/globals.css';

export default function RootLayout() {
  return (
    <Stack>
      {/* This Stack.Screen manages the entire (tabs) group */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          animation: 'fade' 
        }}
      />

      {/* This Stack.Screen manages the 'add.tsx' route */}
      <Stack.Screen
        name="add"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}