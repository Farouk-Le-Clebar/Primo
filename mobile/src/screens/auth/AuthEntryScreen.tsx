import React, { useState, useCallback, memo } from 'react';
import { View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ScreenLayout from '../../components/ui/ScreenLayout';
import Spacer from '../../components/ui/Spacer';
import { AuthStackParamList } from '../../types/navigation';
import { validateEmail } from '../../utils/validation';
import { useCheckEmail } from '../../hooks/useCheckEmail';
import { useSnackbar } from '../../context/SnackbarContext';
import { IconName } from '../../types/icons';

interface Props {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'AuthEntry'>;
}

interface SocialButton {
    variant: 'facebook' | 'google' | 'apple';
    icon: IconName;
    label: string;
    color: string;
    name: string;
}

const SOCIAL_BUTTONS: readonly SocialButton[] = [
    { variant: 'facebook', icon: 'logo-facebook', label: 'Continuer avec Facebook', color: '#fff', name: 'Facebook' },
    { variant: 'google', icon: 'logo-google', label: 'Continuer avec Google', color: '#EA4335', name: 'Google' },
    { variant: 'apple', icon: 'logo-apple', label: 'Continuer avec Apple', color: '#fff', name: 'Apple' },
];

const AuthEntryScreen = memo(({ navigation }: Props) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { showComingSoon } = useSnackbar();

    const { mutate: checkEmail, isPending } = useCheckEmail({
        onSuccess: (data) => {
            const route = data.exists ? 'Login' : 'Register';
            navigation.navigate(route, { email: email.trim() });
        },
        onError: (message) => setError(message),
    });

    const handleEmailChange = useCallback((text: string) => {
        setEmail(text);
        setError('');
    }, []);

    const handleContinue = useCallback(() => {
        if (!email.trim()) {
            setError('Veuillez entrer votre adresse e-mail');
            return;
        }
        if (!validateEmail(email)) {
            setError('Veuillez entrer une adresse e-mail valide');
            return;
        }
        checkEmail(email.trim());
    }, [email, checkEmail]);

    const handleSocialPress = useCallback((name: string) => {
        showComingSoon(`Connexion ${name}`);
    }, [showComingSoon]);

    return (
        <ScreenLayout>
            <View className="mb-10">
                <Text className="text-4xl font-bold text-gray-900 mb-4">
                    Bienvenue sur{'\n'}Primo
                </Text>
                <Text className="text-base text-gray-500 leading-relaxed">
                    Connectez-vous avec votre réseau social préféré ou entrez votre e-mail pour continuer.
                </Text>
            </View>

            <View className="mb-10 space-y-3">
                {SOCIAL_BUTTONS.map((btn, index) => (
                    <React.Fragment key={btn.variant}>
                        <Button
                            variant={btn.variant}
                            onPress={() => handleSocialPress(btn.name)}
                            icon={<Ionicons name={btn.icon} size={22} color={btn.color} />}
                        >
                            {btn.label}
                        </Button>
                        {index < SOCIAL_BUTTONS.length - 1 && <Spacer size="sm" />}
                    </React.Fragment>
                ))}
            </View>

            <View className="flex-row items-center mb-8">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className="mx-4 text-gray-400 text-sm">ou</Text>
                <View className="flex-1 h-px bg-gray-200" />
            </View>

            <View className="space-y-4">
                <Input
                    value={email}
                    onChangeText={handleEmailChange}
                    placeholder="votre@email.com"
                    type="email"
                    label="Adresse e-mail"
                    error={error}
                    keyboardType="email-address"
                />

                <Spacer size="sm" />

                <Button onPress={handleContinue} isLoading={isPending} disabled={isPending}>
                    Continuer
                </Button>
            </View>

            <Spacer size="xxl" />
        </ScreenLayout>
    );
});

AuthEntryScreen.displayName = 'AuthEntryScreen';

export default AuthEntryScreen;
