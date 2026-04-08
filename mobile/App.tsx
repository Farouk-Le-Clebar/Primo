import "./global.css";
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { ActivityIndicator, View } from 'react-native';

import { queryClient } from './src/services/queryClient';
import AuthNavigator from './src/navigation/AuthNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { SnackbarProvider } from './src/context/SnackbarContext';
import MainNavigator from "./src/navigation/MainNavigator";

const RootNavigator = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#004526" />
            </View>
        );
    }

    return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
};

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                <AuthProvider>
                    <SnackbarProvider>
                        <NavigationContainer>
                            <StatusBar style="dark" />
                            <RootNavigator />
                        </NavigationContainer>
                    </SnackbarProvider>
                </AuthProvider>
            </SafeAreaProvider>
        </QueryClientProvider>
    );
}

