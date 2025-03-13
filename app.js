import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import CreateScreen from './screens/CreateScreen';
import CollectionScreen from './screens/CollectionScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import ProfileScreen from './screens/ProfileScreen';

import { MomentsProvider } from './context/MomentsContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <MomentsProvider>
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={{
                  tabBarActiveTintColor: '#6c63ff',
                  tabBarInactiveTintColor: '#666',
                  headerStyle: {
                    backgroundColor: '#6c63ff',
                  },
                  headerTintColor: '#fff',
                }}
              >
                <Tab.Screen 
                  name="Home" 
                  component={HomeScreen} 
                  options={{
                    title: 'Moments',
                  }}
                />
                <Tab.Screen 
                  name="Create" 
                  component={CreateScreen} 
                />
                <Tab.Screen 
                  name="Collection" 
                  component={CollectionScreen} 
                />
                <Tab.Screen 
                  name="Discover" 
                  component={DiscoverScreen} 
                />
                <Tab.Screen 
                  name="Profile" 
                  component={ProfileScreen} 
                />
              </Tab.Navigator>
            </NavigationContainer>
          </MomentsProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;