import React, { useState, useCallback, memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ScreenLayout from '../../components/ui/ScreenLayout';
import BackButton from '../../components/ui/BackButton';
import Spacer from '../../components/ui/Spacer';
import UserAvatar from '../../components/ui/UserAvatar';
import { AuthStackParamList } from '../../types/navigation';
import { useLogin } from '../../hooks/useLogin';
import { getUserByEmail } from '../../requests/UserRequests';

interface Props {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
    route: RouteProp<AuthStackParamList, 'Login'>;
}

const LoginScreen = memo(({ navigation, route }: Props) => {
    const { email } = route.params;
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { data: userInfo } = useQuery({
        queryKey: ['userPublicInfo', email],
        queryFn: () => getUserByEmail(email),
        staleTime: 5 * 60 * 1000,
    });

    const { mutate: loginUser, isPending } = useLogin({
        onError: (message) => setError(message),
    });

    const handlePasswordChange = useCallback((text: string) => {
        setPassword(text);
        setError('');
    }, []);

    const handleLogin = useCallback(() => {
        if (!password) {
            setError('Veuillez entrer votre mot de passe');
            return;
        }
        loginUser({ email, password });
    }, [password, email, loginUser]);

    const handleBack = useCallback(() => navigation.goBack(), [navigation]);

    const handleForgotPassword = useCallback(() => {
        navigation.navigate('ForgotPassword');
    }, [navigation]);

    return (
        <ScreenLayout>
            <BackButton onPress={handleBack} />

            <View className="mb-8">
                <Text className="text-4xl font-bold text-gray-900 mb-4">
                    Bon retour ! 👋
                </Text>
                <Text className="text-base text-gray-500 leading-relaxed">
                    Entrez votre mot de passe pour accéder à votre compte.
                </Text>
            </View>

            <View className="flex-row items-center bg-gray-50 p-4 rounded-2xl mb-8">
                <UserAvatar avatarName={userInfo?.profilePicture} size={48} />
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

                <Spacer size="sm" />

                <Button onPress={handleLogin} isLoading={isPending} disabled={isPending}>
                    Se connecter
                </Button>

                <Pressable onPress={handleForgotPassword} className="py-4 items-center">
                    <Text className="text-primary font-medium">Mot de passe oublié ?</Text>
                </Pressable>
            </View>

            <Spacer size="xxl" />
        </ScreenLayout>
    );
});

LoginScreen.displayName = 'LoginScreen';

export default LoginScreen;
