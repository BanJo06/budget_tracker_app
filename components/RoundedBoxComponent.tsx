import React, { ReactNode, useImperativeHandle, useRef } from 'react';
import { Dimensions, Platform, StatusBar, View } from 'react-native'; // Import StatusBar
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Still useful for iOS safe area

// 1. Define an interface for your component's props
interface RoundedBoxComponentProps {
  children: ReactNode;
  heightPercentage?: number; // This will define the *content* height below status bar
  shadowEnabled?: boolean;
  elevation?: number;
  statusBarBackgroundColor?: string; // New prop for status bar background
  statusBarStyle?: 'default' | 'light-content' | 'dark-content'; // New prop for status bar text color
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
    statusBarBackgroundColor = '#f0f0f0', // Default to your header color
    statusBarStyle = 'dark-content', // Default for dark backgrounds
  }, ref) => {
    // Get insets. For iOS, use insets.top. For Android, StatusBar.currentHeight
    const insets = useSafeAreaInsets();
    const statusBarHeight = Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0; // Fallback to 0

    // Calculate the desired height for the main content area *below* the status bar.
    const desiredContentHeight = Dimensions.get('window').height * heightPercentage;

    // The total height of the blue box will be the desired content height
    // PLUS the status bar height (statusBarHeight). This makes the blue background
    // visually extend behind the status bar.
    const totalBoxHeightIncludingStatusBar = desiredContentHeight + statusBarHeight;

    const shadowStyles = shadowEnabled && Platform.OS === 'android' ?
      { elevation: elevation } :
      {};

    const outerViewRef = useRef<View>(null); // Ref for the main container View

    useImperativeHandle(ref, () => ({
      measure: (...args) => {
        outerViewRef.current?.measure(...args);
      },
      getNativeView: () => outerViewRef.current,
    }));

    return (
      // This is the outer container for the rounded blue box.
      // It will now extend up behind the status bar.
      <View
        ref={outerViewRef} // Apply ref to this outer View
        className={`w-full bg-[#8938E9] rounded-b-[40]`} // Apply background and rounding here
        style={[
          {
            height: totalBoxHeightIncludingStatusBar, // Set the total height to include status bar space
          },
          shadowStyles
        ]}
      >
        {/*
          Control the StatusBar appearance here.
          'translucent' ensures content can go behind the status bar on Android,
          which is necessary if you want the header background to extend up.
        */}
        <StatusBar
          backgroundColor={statusBarBackgroundColor}
          barStyle={statusBarStyle}
          translucent={true} // Crucial for Android to allow background to show behind
        />

        {/*
          This inner View now applies the paddingTop explicitly based on statusBarHeight.
          This ensures the 'children' (your menu and text) always start below the status bar.
        */}
        <View style={{ paddingTop: statusBarHeight, flex: 1, width: '100%' }}>
          {children}
        </View>
      </View>
    );
  }
);

export default RoundedBoxComponent;


