import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ReusableRoundedBoxComponent from '../../components/RoundedBoxComponent';

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
            <ReusableRoundedBoxComponent>
                Dashboard
            </ReusableRoundedBoxComponent>

            <Text style={mainStyles.welcomeText}>
                Welcome to the App!
            </Text>

            <View style={mainStyles.mainContent}>
                <Text>The content goes here.</Text>
            </View>
        </View>
  );
}