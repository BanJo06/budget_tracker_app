import React, { ReactNode, useImperativeHandle, useRef } from "react";
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RoundedBoxComponentProps {
  children: ReactNode;
  heightPercentage?: number;
  shadowEnabled?: boolean;
  style?: StyleProp<ViewStyle>;
  elevation?: number;
  statusBarBackgroundColor?: string;
  statusBarStyle?: "default" | "light-content" | "dark-content";
}

interface RoundedBoxHandle {
  measure: (...args: Parameters<View["measure"]>) => void;
  getNativeView: () => View | null;
}

const RoundedBoxComponent = React.forwardRef<
  RoundedBoxHandle,
  RoundedBoxComponentProps
>(
  (
    {
      children,
      heightPercentage = 0.2,
      shadowEnabled = true,
      elevation = 15,
      statusBarBackgroundColor = "white",
      statusBarStyle = "dark-content",
      style,
    },
    ref
  ) => {
    const insets = useSafeAreaInsets();
    const statusBarHeight =
      Platform.OS === "ios" ? insets.top : StatusBar.currentHeight || 0;

    const desiredContentHeight =
      Dimensions.get("window").height * heightPercentage;
    const totalBoxHeightIncludingStatusBar =
      desiredContentHeight + statusBarHeight;

    const outerViewRef = useRef<View>(null);

    useImperativeHandle(ref, () => ({
      measure: (...args) => {
        outerViewRef.current?.measure(...args);
      },
      getNativeView: () => outerViewRef.current,
    }));

    const styles = StyleSheet.create({
      outerContainer: {
        width: "100%",
        ...Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: elevation / 5 },
            shadowOpacity: 0.25,
            shadowRadius: elevation / 2,
          },
          android: {
            elevation: elevation,
          },
        }),
      },
      innerContent: {
        width: "100%",
        height: "100%",
        backgroundColor: "#8938E9",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "flex-start",
      },
      contentWrapper: {
        paddingTop: statusBarHeight,
        flex: 1,
        width: "100%",
      },
    });

    return (
      <View
        ref={outerViewRef}
        style={[
          styles.outerContainer,
          { height: totalBoxHeightIncludingStatusBar },
          style,
        ]}
      >
        <StatusBar
          backgroundColor={statusBarBackgroundColor}
          barStyle={statusBarStyle}
          translucent={true}
        />
        <View style={styles.innerContent}>
          <View style={styles.contentWrapper}>{children}</View>
        </View>
      </View>
    );
  }
);

export default RoundedBoxComponent;
