import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ScreenLayout from '../../components/ui/ScreenLayout';
import { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import { validateEmail } from '../../utils/validation';

interface Props {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'AuthEntry'>;
}

const SOCIAL_BUTTONS = [
    { variant: 'facebook', icon: 'logo-facebook', label: 'Continuer avec Facebook', color: '#fff' },
    { variant: 'google', icon: 'logo-google', label: 'Continuer avec Google', color: '#EA4335' },
    { variant: 'apple', icon: 'logo-apple', label: 'Continuer avec Apple', color: '#fff' },
] as const;

const AuthEntryScreen = ({ navigation }: Props) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigation.navigate('Register', { email: email.trim() });
        }, 300);
    }, [email, navigation]);

    return (
        <ScreenLayout>
            <View className="mb-10">
                <Text className="text-4xl font-bold text-gray-900 mb-4">
                    Bienvenue sur{'\n'}Primo.
                </Text>
                <Text className="text-base text-gray-500 leading-relaxed">
                    Connectez-vous avec votre réseau social préféré ou entrez votre e-mail pour continuer.
                </Text>
            </View>

            <View className="mb-10 space-y-3">
                {SOCIAL_BUTTONS.map((btn) => (
                    <React.Fragment key={btn.variant}>
                        <Button
                            variant={btn.variant}
                            onPress={() => login(email)}
                            icon={<Ionicons name={btn.icon as any} size={22} color={btn.color} />}
                        >
                            {btn.label}
                        </Button>
                        {btn.variant !== 'apple' && <View className="h-3" />}
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

                <View className="h-2" />

                <Button onPress={handleContinue} isLoading={loading} disabled={loading}>
                    Continuer
                </Button>
            </View>

            <View className="h-20" />
        </ScreenLayout>
    );
};

export default AuthEntryScreen;
