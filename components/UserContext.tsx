import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  name: string;
  isFirstLaunch: boolean;
  shouldShowWelcome: boolean; // NEW: Controls the second modal
  saveUserName: (name: string) => Promise<void>;
  finishWelcome: () => void; // NEW: Closes the second modal
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [name, setName] = useState<string>("User");
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);
  const [shouldShowWelcome, setShouldShowWelcome] = useState<boolean>(false); // NEW
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedName = await AsyncStorage.getItem("user_name");
      const hasSeenIntro = await AsyncStorage.getItem("has_seen_intro");

      if (storedName) {
        setName(storedName);
      }

      // If "has_seen_intro" is null, it is the first launch
      setIsFirstLaunch(hasSeenIntro === null);
    } catch (error) {
      console.error("Failed to load user data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserName = async (newName: string) => {
    try {
      const finalName = newName.trim() || "User";

      // 1. Save to storage
      await AsyncStorage.setItem("user_name", finalName);
      await AsyncStorage.setItem("has_seen_intro", "true");

      // 2. Update state
      setName(finalName);
      setIsFirstLaunch(false); // Close Intro Modal
      setShouldShowWelcome(true); // Open Welcome Modal
    } catch (error) {
      console.error("Failed to save user name", error);
    }
  };

  // NEW: Function to close the second modal
  const finishWelcome = () => {
    setShouldShowWelcome(false);
  };

  if (isLoading) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        name,
        isFirstLaunch,
        shouldShowWelcome,
        saveUserName,
        finishWelcome,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
