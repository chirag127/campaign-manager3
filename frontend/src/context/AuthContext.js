import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config/api';

// Create the Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Initialize auth state from storage
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Load token from storage
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');

        if (token && userData) {
          setUserToken(token);
          setUser(JSON.parse(userData));

          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Failed to load auth state from storage', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Register a new user
  const register = async (name, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password
      });

      const { token, user } = response.data;

      // Store token and user data
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      // Set auth state
      setUserToken(token);
      setUser(user);

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;

      // Store token and user data
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      // Set auth state
      setUserToken(token);
      setUser(user);

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setIsLoading(true);

    try {
      // Remove token and user data from storage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');

      // Clear auth state
      setUserToken(null);
      setUser(null);

      // Remove axios default header
      delete axios.defaults.headers.common['Authorization'];

      return { success: true };
    } catch (error) {
      console.error('Logout error', error);
      return { success: false, message: 'Failed to logout' };
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${API_URL}/api/auth/profile`, userData);

      const updatedUser = response.data.user;

      // Update user data in storage
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));

      // Update user state
      setUser(updatedUser);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // Connect platform account
  const connectPlatform = async (platform, authCode) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/platforms/connect/${platform}`, {
        authCode
      });

      // Update user data with connected platform
      const updatedUser = {
        ...user,
        connectedPlatforms: {
          ...user.connectedPlatforms,
          [platform]: true
        }
      };

      // Update user data in storage
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));

      // Update user state
      setUser(updatedUser);

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || `Failed to connect ${platform}`;
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect platform account
  const disconnectPlatform = async (platform) => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.post(`${API_URL}/api/platforms/disconnect/${platform}`);

      // Update user data with disconnected platform
      const updatedUser = {
        ...user,
        connectedPlatforms: {
          ...user.connectedPlatforms,
          [platform]: false
        }
      };

      // Update user data in storage
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));

      // Update user state
      setUser(updatedUser);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || `Failed to disconnect ${platform}`;
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        user,
        error,
        register,
        login,
        logout,
        updateProfile,
        connectPlatform,
        disconnectPlatform
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
