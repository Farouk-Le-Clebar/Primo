import React, { useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ScreenLayout from '../../components/ui/ScreenLayout';
import { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';

interface Props {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
    route: RouteProp<AuthStackParamList, 'Login'>;
}

const LoginScreen = ({ navigation, route }: Props) => {
    const { login } = useAuth();
    const { email } = route.params;
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = useCallback((text: string) => {
        setPassword(text);
        setError('');
    }, []);

    const handleLogin = useCallback(() => {
        if (!password) {
            setError('Veuillez entrer votre mot de passe');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            login(email);
        }, 500);
    }, [password, login, email]);

    const handleBack = useCallback(() => navigation.goBack(), [navigation]);

    const handleForgotPassword = useCallback(() => {
        navigation.navigate('ForgotPassword');
    }, [navigation]);

    return (
        <ScreenLayout>
            <Pressable
                onPress={handleBack}
                className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-6"
            >
                <Ionicons name="arrow-back" size={20} color="#374151" />
            </Pressable>

            <View className="mb-8">
                <Text className="text-4xl font-bold text-gray-900 mb-4">
                    Bon retour ! 👋
                </Text>
                <Text className="text-base text-gray-500 leading-relaxed">
                    Entrez votre mot de passe pour accéder à votre compte.
                </Text>
            </View>

            <View className="flex-row items-center bg-gray-50 p-4 rounded-2xl mb-8">
                <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                    <Ionicons name="person" size={24} color="#fff" />
                </View>
                <View className="ml-4 flex-1">
                    <Text className="text-xs text-gray-400 uppercase tracking-wide">Compte</Text>
                    <Text className="text-base font-medium text-gray-900 mt-0.5">{email}</Text>
                </View>
            </View>

            <View className="space-y-4">
                <Input
                    value={password}
                    onChangeText={handlePasswordChange}
                    placeholder="Votre mot de passe"
                    type="password"
                    label="Mot de passe"
                    error={error}
                />

                <View className="h-2" />

                <Button onPress={handleLogin} isLoading={loading} disabled={loading}>
                    Se connecter
                </Button>

                <Pressable onPress={handleForgotPassword} className="py-4 items-center">
                    <Text className="text-primary font-medium">Mot de passe oublié ?</Text>
                </Pressable>
            </View>

            <View className="h-20" />
        </ScreenLayout>
    );
};

export default LoginScreen;
