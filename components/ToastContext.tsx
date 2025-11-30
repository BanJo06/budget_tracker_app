import React, { createContext, useCallback, useContext, useState } from "react";
import { Animated, Text } from "react-native";

const ToastContext = createContext({
  showToast: (message: string) => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [message, setMessage] = useState<string | null>(null);
  const [opacity] = useState(new Animated.Value(0));

  const showToast = useCallback((msg: string) => {
    console.log("🔥 Toast triggered inside ToastProvider:", msg);
    setMessage(msg);

    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setMessage(null));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {message && (
        <Animated.View
          style={{
            position: "absolute",
            bottom: 80,
            alignSelf: "center",
            backgroundColor: "#333",
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 10,
            opacity,
            zIndex: 9999,
          }}
        >
          <Text style={{ color: "white" }}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
