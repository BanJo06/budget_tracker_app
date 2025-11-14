// import { useColorScheme } from "nativewind";
// import { PropsWithChildren } from "react";
// import { View } from "react-native";

// export default function ThemeProvider({ children }: PropsWithChildren) {
//   const { colorScheme } = useColorScheme();
//   return (
//     <View className={colorScheme === "dark" ? "dark flex-1" : "flex-1"}>
//       {children}
//     </View>
//   );
// }

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({
  mode: "light",
  setMode: (mode: "light" | "dark") => {},
});

export const ThemeProvider = ({ children }: any) => {
  const { setColorScheme } = useColorScheme();
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const loadUIMode = async () => {
      const savedMode = await AsyncStorage.getItem("uiMode");
      if (savedMode === "dark") {
        setMode("dark");
        setColorScheme("dark");
      } else {
        setMode("light");
        setColorScheme("light");
      }
    };
    loadUIMode();
  }, []);

  const changeMode = (newMode: "light" | "dark") => {
    setMode(newMode);
    setColorScheme(newMode);
    AsyncStorage.setItem("uiMode", newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode: changeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
