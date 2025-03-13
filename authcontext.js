import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for existing user session
    const checkUserSession = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          setUser(JSON.parse(userString));
        }
      } catch (error) {
        console.error('Failed to load user session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserSession();
  }, []);
  
  const login = async (email, password) => {
    // Implement actual authentication logic here
    setLoading(true);
    try {
      // Mock API call
      const response = await new Promise(resolve => 
        setTimeout(() => resolve({ 
          id: '123', 
          name: 'John Doe', 
          email,
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        }), 1000)
      );
      
      setUser(response);
      await AsyncStorage.setItem('user', JSON.stringify(response));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const verifyBiometrics = async () => {
    const biometrics = new ReactNativeBiometrics();
    const { available, biometryType } = await biometrics.isSensorAvailable();
    
    if (available) {
      const { success } = await biometrics.simplePrompt({
        promptMessage: 'Verify your identity',
      });
      return success;
    }
    
    return false;
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout,
      verifyBiometrics
    }}>
      {children}
    </AuthContext.Provider>
  );
};