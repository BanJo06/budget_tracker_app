import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  name: string;
  isFirstLaunch: boolean;
  saveUserName: (name: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [name, setName] = useState<string>("User"); // Default name
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);
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

      // If "has_seen_intro" is null, it means it is the first launch
      setIsFirstLaunch(hasSeenIntro === null);
    } catch (error) {
      console.error("Failed to load user data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserName = async (newName: string) => {
    try {
      const finalName = newName.trim() || "User"; // Fallback if empty
      await AsyncStorage.setItem("user_name", finalName);
      await AsyncStorage.setItem("has_seen_intro", "true");

      setName(finalName);
      setIsFirstLaunch(false);
    } catch (error) {
      console.error("Failed to save user name", error);
    }
  };

  // Prevent rendering children until we check storage to avoid flickering
  if (isLoading) {
    return null;
  }

  return (
    <UserContext.Provider value={{ name, isFirstLaunch, saveUserName }}>
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
