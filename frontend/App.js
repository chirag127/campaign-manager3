import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';

// Context Providers
import { AuthProvider } from './src/context/AuthContext';

// Navigation
import AppNavigator from './src/navigation/AppNavigator';

// Test Component
import DatePickerTest from './DatePickerTest';

export default function App() {
  // Uncomment this to test the date picker
  // return <DatePickerTest />;

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
