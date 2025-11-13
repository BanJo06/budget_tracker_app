import { useColorScheme } from "nativewind";
import { PropsWithChildren } from "react";
import { View } from "react-native";

export default function ThemeProvider({ children }: PropsWithChildren) {
  const { colorScheme } = useColorScheme();
  return (
    <View className={colorScheme === "dark" ? "dark flex-1" : "flex-1"}>
      {children}
    </View>
  );
}
