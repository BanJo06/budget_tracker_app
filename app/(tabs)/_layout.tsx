import { Tabs } from 'expo-router';
import React from 'react';
import { ImageBackground } from 'react-native';
import '../../app/globals.css';
import Dashboard from "../../icons/dashboard_normal.svg";

const _Layout = () => {
  return (
      <Tabs>
        <Tabs.Screen
          name = 'index'
          options = {{ 
            title: 'Dashboard',
            headerShown: false,
            tabBarIcon: ({ focused }) =>  (
              <>
              <ImageBackground>
                <Dashboard></Dashboard>
              </ImageBackground>
              </>
            )
          }}
        />
        <Tabs.Screen
          name = 'graphs'
          options = {{ 
            title: 'Graphs',
            headerShown: false
          }}
        />
        <Tabs.Screen
          name = 'add'
          options = {{ 
            title: 'Add',
            headerShown: false
          }}
        />
        <Tabs.Screen
          name = 'reports'
          options = {{ 
            title: 'Reports',
            headerShown: false
          }}
        />
        <Tabs.Screen
          name = 'quests'
          options = {{ 
            title: 'Quests',
            headerShown: false
          }}
        />
      </Tabs>
  )
}

export default _Layout