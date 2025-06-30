import React, { ReactNode, useImperativeHandle, useRef } from 'react';
import { Dimensions, Platform, StatusBar, StyleSheet, View } from 'react-native'; // Import StyleSheet
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 1. Define an interface for your component's props
interface RoundedBoxComponentProps {
  children: ReactNode;
  heightPercentage?: number; // This will define the *content* height below status bar
  shadowEnabled?: boolean;
  elevation?: number;
  statusBarBackgroundColor?: string; // Prop for status bar background color
  statusBarStyle?: 'default' | 'light-content' | 'dark-content'; // Prop for status bar text color
}

// 2. Define the interface for the custom ref handle
interface RoundedBoxHandle {
  measure: (...args: Parameters<View['measure']>) => void;
  getNativeView: () => View | null;
}

// 3. Apply the custom handle interface to forwardRef and useImperativeHandle
const RoundedBoxComponent = React.forwardRef<RoundedBoxHandle, RoundedBoxComponentProps>(
  ({
    children,
    heightPercentage = 0.20, // Default desired *content* height percentage
    shadowEnabled = true,
    elevation = 15,
    statusBarBackgroundColor = 'white', // Default to your header color for status bar
    statusBarStyle = 'dark-content', // Default for dark header background
  }, ref) => {
    // Get insets. For iOS, use insets.top. For Android, StatusBar.currentHeight
    const insets = useSafeAreaInsets();
    // Calculate the status bar height dynamically based on the platform.
    const statusBarHeight = Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0; // Fallback to 0

    // Calculate the desired height for the main content area *below* the status bar.
    const desiredContentHeight = Dimensions.get('window').height * heightPercentage;

    // The total height of the blue box will be the desired content height
    // PLUS the status bar height. This makes the blue background
    // visually extend behind the status bar on both iOS and Android.
    const totalBoxHeightIncludingStatusBar = desiredContentHeight + statusBarHeight;

    // Define shadow styles conditionally based on 'shadowEnabled' and platform.
    // 'elevation' is an Android-specific shadow property. iOS uses 'shadow' properties.
    // These are kept as StyleSheet or inline styles because NativeWind's shadow utilities
    // don't directly map to arbitrary elevation values or iOS specific shadow properties.
    const shadowStyles = shadowEnabled ?
      StyleSheet.create({
        platformShadow: Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: elevation / 5 }, // Adjust shadow based on elevation
            shadowOpacity: 0.25,
            shadowRadius: elevation / 2, // Adjust radius based on elevation
          },
          android: {
            elevation: elevation, // Android's elevation property
          },
          default: {}, // Fallback for other platforms if any
        }),
      }).platformShadow : {};

    const outerViewRef = useRef<View>(null); // Ref for the main container View

    // Expose `measure` and `getNativeView` methods via the ref.
    useImperativeHandle(ref, () => ({
      measure: (...args) => {
        outerViewRef.current?.measure(...args);
      },
      getNativeView: () => outerViewRef.current,
    }));

    return (
      // This is the outer container for the rounded purple box.
      // Its height is set to include the status bar space, making the background extend up.
      <View
        ref={outerViewRef} // Apply ref to this outer View
        className={`
          w-full bg-[#8938E9] rounded-bl-[40px] rounded-br-[40px]
          overflow-hidden items-center justify-start
        `}
        style={[
          { height: totalBoxHeightIncludingStatusBar }, // Dynamic height must be inline style
          shadowStyles // Apply shadow styles using StyleSheet or inline
        ]}
      >
        {/*
          Control the StatusBar appearance here.
          'translucent' is crucial for Android to allow the header background
          to extend behind the status bar.
          'backgroundColor' sets the status bar color (relevant for Android).
          'barStyle' sets the text/icon color of the status bar.
        */}
        <StatusBar
          backgroundColor={statusBarBackgroundColor}
          barStyle={statusBarStyle}
          translucent={true} // Essential for the background to show behind the status bar on Android
        />

        {/*
          This inner View applies paddingTop explicitly based on statusBarHeight.
          This ensures the 'children' (your menu and text) always start visually
          below the status bar, preventing overlap.
        */}
        <View style={{ paddingTop: statusBarHeight, flex: 1, width: '100%' }}>
          {children}
        </View>
      </View>
    );
  }
);

export default RoundedBoxComponent;