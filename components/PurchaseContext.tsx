import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type PurchaseContextType = {
  hasPurchasedDarkMode: boolean;
  setHasPurchasedDarkMode: (value: boolean) => void;
};

const PurchaseContext = createContext<PurchaseContextType>({
  hasPurchasedDarkMode: false,
  setHasPurchasedDarkMode: () => {},
});

export const PurchaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasPurchasedDarkMode, setHasPurchasedDarkMode] = useState(false);

  useEffect(() => {
    const loadPurchases = async () => {
      const purchased = await AsyncStorage.getItem("purchasedDarkMode");
      setHasPurchasedDarkMode(purchased === "true");
    };
    loadPurchases();
  }, []);

  return (
    <PurchaseContext.Provider
      value={{ hasPurchasedDarkMode, setHasPurchasedDarkMode }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = () => useContext(PurchaseContext);
