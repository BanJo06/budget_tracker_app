import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RoundedBoxComponent = ({
    children,
    borderBottomLeftRadius = 40,
    borderBottomRightRadius = 40,
    heightPercentage = 0.20,
    backgroundColor = '#8938E9',
    shadowEnabled = true,
    shadowColor = '#000',
    boxStyle = {},
    textStyle = {},
    elevation = 5, // Adds a shadow on Android
}) => {
    const boxHeight = Dimensions.get('window').height * heightPercentage;

    const shadowStyles = shadowEnabled && Platform.OS === 'android' ?
    { elevation: elevation}:
    {}

   return (
    <SafeAreaView style={roundedBoxStyles.safeArea}>
      <View style={[
        roundedBoxStyles.roundedBox,
        {
          backgroundColor: backgroundColor,
          height: boxHeight,
          borderBottomLeftRadius: borderBottomLeftRadius,
          borderBottomRightRadius: borderBottomRightRadius,
        },
        shadowStyles, // Apply dynamic shadow styles (now Android-only)
        boxStyle,
      ]}>
        {typeof children === 'string' ? ( // @ts-ignore
            <Text style={[roundedBoxStyles.boxText, textStyle]}>{children}</Text>
        ) : (
            children
        )}
      </View>
    </SafeAreaView>
  );
};
        
const roundedBoxStyles = StyleSheet.create({
  safeArea: {
    width: '100%'
  },
  roundedBox: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    fontSize: 16,
    color: 'white',
  },
});

export default RoundedBoxComponent;