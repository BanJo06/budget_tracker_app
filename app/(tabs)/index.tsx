import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RoundedBoxComponent = () =>  {
  return  (
    <SafeAreaView style={roundedBoxStyles.safeArea}>
      <View style={roundedBoxStyles.roundedBox}>
        <Text style={roundedBoxStyles.boxText}>This is the rounded Box!</Text>
      </View>
    </SafeAreaView>
  )
}

const roundedBoxStyles = StyleSheet.create({
  safeArea: {
    width: '100%'
  },
  roundedBox: {
    width: '100%',
    height: Dimensions.get('window').height * 0.20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: '#8938E9', // Crucial for elevation to work
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Adds a shadow on Android
  },
  boxText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

// Styles for your main Index component
const mainStyles = StyleSheet.create({
  container: {
    flex: 1, // Make the main container fill the entire screen
    justifyContent: 'flex-start', // Center content vertically
    alignItems: 'center',   // Center content horizontally
    backgroundColor: '#f0f0f0',
  },
  welcomeText: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#555',
  },
  mainContent:  {
    flex: 1,
    alignItems:'center'
  }
});

export default function Index() {
  return (
    <View style={mainStyles.container}>
      <RoundedBoxComponent />
      <Text style={mainStyles.welcomeText}>
        Welcome to the App!
      </Text>
        <Text style={mainStyles.mainContent}>The content goes here.</Text>
      </View>
  );
}