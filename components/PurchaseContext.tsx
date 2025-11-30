import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type PurchaseContextType = {
  hasPurchasedDarkMode: boolean;
  setHasPurchasedDarkMode: (value: boolean) => void;
  // 1. Add Export types here
  hasPurchasedExport: boolean;
  setHasPurchasedExport: (value: boolean) => void;
};

const PurchaseContext = createContext<PurchaseContextType>({
  hasPurchasedDarkMode: false,
  setHasPurchasedDarkMode: () => {},
  // 2. Add default values here
  hasPurchasedExport: false,
  setHasPurchasedExport: () => {},
});

export const PurchaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasPurchasedDarkMode, setHasPurchasedDarkMode] = useState(false);
  // 3. Create state for Export
  const [hasPurchasedExport, setHasPurchasedExport] = useState(false);

  useEffect(() => {
    const loadPurchases = async () => {
      // Load Dark Mode
      const purchasedDark = await AsyncStorage.getItem("purchasedDarkMode");
      setHasPurchasedDarkMode(purchasedDark === "true");

      // 4. Load Export Record purchase status
      const purchasedExport = await AsyncStorage.getItem(
        "purchasedExportRecords"
      );
      setHasPurchasedExport(purchasedExport === "true");
    };
    loadPurchases();
  }, []);

  return (
    <PurchaseContext.Provider
      value={{
        hasPurchasedDarkMode,
        setHasPurchasedDarkMode,
        // 5. Expose values to app
        hasPurchasedExport,
        setHasPurchasedExport,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = () => useContext(PurchaseContext);
