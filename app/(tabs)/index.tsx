import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import ProgressRing from '../../components/ProgressRing';
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
  
  const [currentProgress, setCurrentProgress] = useState(0.25); // State to manage progress

  const increaseProgress = () => {
    setCurrentProgress((prev) => Math.min(prev + 0.1, 1));
  };

  const decreaseProgress = () => {
    setCurrentProgress((prev) => Math.max(prev - 0.1, 0));
  };
  return (
    <View style={mainStyles.container}>
            <ReusableRoundedBoxComponent>
              Dashboard
            </ReusableRoundedBoxComponent>

            <View className='w-[330] h-[220] p-[20] bg-white rounded-2xl'
            style={[
                    { elevation: 5 },
                  ]}>
              <View className='pb-[20] flex-row justify-between'>
                <Text>Overview</Text>
                <Text>This Week</Text>
              </View>

              <ProgressRing 
                progress={currentProgress} // THIS IS THE FIX
                radius={70}
                strokeWidth={15}
                progressColor="#8938E9" // Green
                backgroundColor="#EDE1FB"
                duration={500}
                showPercentage={true}
              />

              <View className='bg-[#EDE1FB]'><Text>Insight</Text></View>

              {/* <Text className='pl-20'>The content goes here.</Text> */}

            </View>
            
            <Text style={mainStyles.welcomeText}>
                Welcome to the App!
            </Text>

            <View style={mainStyles.mainContent}>
                <Text>The content goes here.</Text>
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 50, gap: 10 }}>
              <Button title="Increase" onPress={increaseProgress} />
              <Button title="Decrease" onPress={decreaseProgress} />
            </View>
        </View>
  );
}