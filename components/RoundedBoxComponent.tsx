import { Dimensions, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RoundedBoxComponent = ({
    children,
    heightPercentage = 0.25,
    shadowEnabled = true,
    elevation = 15, // Adds a shadow on Android
}) => {
    const boxHeight = Dimensions.get('window').height * heightPercentage;

    const shadowStyles = shadowEnabled && Platform.OS === 'android' ?
    { elevation: elevation }:
    {}

    return (
        <SafeAreaView className="w-full">
            <View
                className={`w-full justify-center items-center bg-[#8938E9] rounded-b-[40]`}
                style={[
                    { height: boxHeight },
                    shadowStyles
                ]}
            >
                {/* Render children. If children is a string, wrap it in a Text component and apply styles. */}
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
};

export default RoundedBoxComponent;