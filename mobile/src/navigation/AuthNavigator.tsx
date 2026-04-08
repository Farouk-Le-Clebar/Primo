import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthEntryScreen from '../screens/auth/AuthEntryScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import MapScreen from '../screens/map/MapScreen';
import { AuthStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => (
    <Stack.Navigator
        initialRouteName="AuthEntry"
        screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
        }}
    >
        <Stack.Screen name="AuthEntry" component={AuthEntryScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
);

export default AuthNavigator;
