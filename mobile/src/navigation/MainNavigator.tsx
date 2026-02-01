import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from '../screens/dashboard/DashboardScreen';
import MapScreen from '../screens/map/MapScreen';
import { MainStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => (
    <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
        }}
    >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
    </Stack.Navigator>
);

export default MainNavigator;