import React, { ReactNode, useImperativeHandle, useRef } from 'react';
import { Dimensions, Platform, Text, View } from 'react-native'; // Import NativeMethods
import { SafeAreaView } from 'react-native-safe-area-context';

// 1. Define an interface for your component's props
interface RoundedBoxComponentProps {
    children: ReactNode;
    heightPercentage?: number;
    shadowEnabled?: boolean;
    elevation?: number;
}

// 2. Define the interface for the custom ref handle
// This describes what methods/properties the parent will access via the ref
interface RoundedBoxHandle {
    measure: (...args: Parameters<View['measure']>) => void;
    getNativeView: () => View | null; // It's safer to allow null here as ref.current can be null
    // Add any other methods you want to expose to the parent here
    // Example: You could also expose some native methods directly if needed,
    // though getNativeView often suffices for more complex interactions.
    // focus?: () => void; // If you had an inner TextInput you wanted to focus
}

// 3. Apply the custom handle interface to forwardRef and useImperativeHandle
const RoundedBoxComponent = React.forwardRef<RoundedBoxHandle, RoundedBoxComponentProps>(
  ({
    children,
    heightPercentage = 0.25,
    shadowEnabled = true,
    elevation = 15,
  }, ref) => {
    const boxHeight = Dimensions.get('window').height * heightPercentage;

    const shadowStyles = shadowEnabled && Platform.OS === 'android' ?
      { elevation: elevation } :
      {};

    const innerViewRef = useRef<View>(null); // Type the ref for a View component

    useImperativeHandle(ref, () => ({
      // Implement the methods defined in RoundedBoxHandle
      measure: (...args) => {
        innerViewRef.current?.measure(...args);
      },
      getNativeView: () => innerViewRef.current,
    }));

    return (
      <SafeAreaView className="w-full">
        <View
          ref={innerViewRef}
          className={`w-full justify-center items-center bg-[#8938E9] rounded-b-[40]`}
          style={[
            { height: boxHeight },
            shadowStyles
          ]}
        >
          {typeof children === 'string' ? (
            <Text className="text-base text-white">
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      </SafeAreaView>
    );
  }
);

export default RoundedBoxComponent;