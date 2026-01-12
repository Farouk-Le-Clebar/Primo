import "./global.css";
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AuthNavigator from './src/navigation/AuthNavigator';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const RootNavigator = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <DashboardScreen /> : <AuthNavigator />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
