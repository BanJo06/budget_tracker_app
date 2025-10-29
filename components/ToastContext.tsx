import React, { createContext, useCallback, useContext, useState } from "react";
import { Animated, Text } from "react-native";

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const opacity = React.useRef(new Animated.Value(0)).current;

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);

    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.delay(1800),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {visible && (
        <Animated.View
          style={{
            position: "absolute",
            bottom: 80,
            alignSelf: "center",
            backgroundColor: "#7a44cf",
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 20,
            opacity,
            zIndex: 9999,
            elevation: 10,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};
