import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native'; // Import Image from react-native
import '../../app/globals.css';
import { ICONS } from '../../assets/constants/icons';

// --- Your Layout Component ---
const _Layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Dashboard',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              source={ICONS.dashboard} // Assuming ICONS.dashboard holds your image source
              style={{ tintColor: color, width: size, height: size }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='graphs'
        options={{
          title: 'Graphs',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={ICONS.graphs}
              style={{
                tintColor: color,
                width: 24,
                height: 24,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='add'
        options={{
          title: 'Add',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              source={ICONS.add} // Assuming ICONS.add holds your image source
              style={{ tintColor: color, width: 52, height: 52, resizeMode: 'cover' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='reports'
        options={{
          title: 'Reports',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={ICONS.reports}
              style={{
                tintColor: color,
                resizeMode: 'cover'
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='quests'
        options={{
          title: 'Quests',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              source={ICONS.quests} // Assuming ICONS.quests holds your image source
              style={{ tintColor: color, width: size, height: size, resizeMode: 'cover' }}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;
