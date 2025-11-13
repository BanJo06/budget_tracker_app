import AsyncStorage from "@react-native-async-storage/async-storage";

const COINS_KEY = "userCoins";

export const getCoins = async (): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(COINS_KEY);
    return value ? parseInt(value, 10) : 0;
  } catch {
    return 0;
  }
};

export const addCoins = async (amount: number): Promise<number> => {
  try {
    const current = await getCoins();
    const newTotal = current + amount;
    await AsyncStorage.setItem(COINS_KEY, newTotal.toString());
    return newTotal;
  } catch {
    return 0;
  }
};

export const setCoins = async (amount: number) => {
  await AsyncStorage.setItem(COINS_KEY, amount.toString());
};
