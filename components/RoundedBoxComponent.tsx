import React, { ReactNode, useImperativeHandle, useRef } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Ensure this is from react-native-safe-area-context

// 1. Define an interface for your component's props
interface RoundedBoxComponentProps {
  children: ReactNode;
  heightPercentage?: number;
  shadowEnabled?: boolean;
  elevation?: number;
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
    heightPercentage = 0.20,
    shadowEnabled = true,
    elevation = 15,
  }, ref) => {
    const boxHeight = Dimensions.get('window').height * heightPercentage;

    const shadowStyles = shadowEnabled && Platform.OS === 'android' ?
      { elevation: elevation } :
      {};

    const innerViewRef = useRef<View>(null);

    useImperativeHandle(ref, () => ({
      measure: (...args) => {
        innerViewRef.current?.measure(...args);
      },
      getNativeView: () => innerViewRef.current,
    }));

    return (
      // Use the 'edges' prop to control which safe area insets are applied
      <SafeAreaView className="w-full" edges={['left', 'right', 'top']}>
        <View
          ref={innerViewRef}
          className={`w-full bg-[#8938E9] rounded-b-[40]`}
          style={[
            { height: boxHeight },
            shadowStyles
          ]}
        >
          {/* Render children directly without assuming they are strings or wrapping in Text */}
          {children}
        </View>
      </SafeAreaView>
    );
  }
);

export default RoundedBoxComponent;