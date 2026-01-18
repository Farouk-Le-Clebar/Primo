import React, { useState, useCallback, useMemo, memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ScreenLayout from '../../components/ui/ScreenLayout';
import BackButton from '../../components/ui/BackButton';
import Spacer from '../../components/ui/Spacer';
import { AuthStackParamList } from '../../types/navigation';
import { getPasswordStrength } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';

interface Props {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
    route: RouteProp<AuthStackParamList, 'Register'>;
}

const STRENGTH_CONFIG = [
    { color: 'bg-gray-200', label: '', textColor: '' },
    { color: 'bg-error', label: 'Faible', textColor: 'text-error' },
    { color: 'bg-warning', label: 'Moyen', textColor: 'text-warning' },
    { color: 'bg-success', label: 'Fort', textColor: 'text-success' },
];

interface CriterionProps {
    met: boolean;
    label: string;
}

const Criterion = memo(({ met, label }: CriterionProps) => (
    <View className="flex-row items-center py-1">
        <View className={`w-5 h-5 rounded-full items-center justify-center mr-3 ${met ? 'bg-success' : 'bg-gray-200'}`}>
            {met && <Ionicons name="checkmark" size={12} color="#fff" />}
        </View>
        <Text className={`text-sm ${met ? 'text-gray-700' : 'text-gray-400'}`}>{label}</Text>
    </View>
));

Criterion.displayName = 'Criterion';

const RegisterScreen = memo(({ navigation, route }: Props) => {
    const { login } = useAuth();
    const { email: initialEmail } = route.params;
    const [email, setEmail] = useState(initialEmail || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const strength = useMemo(() => getPasswordStrength(password), [password]);
    const strengthStyle = STRENGTH_CONFIG[strength.score];

    const handleEmailChange = useCallback((text: string) => {
        setEmail(text);
        setError('');
    }, []);

    const handlePasswordChange = useCallback((text: string) => {
        setPassword(text);
        setError('');
    }, []);

    const handleRegister = useCallback(() => {
        if (!email.trim()) {
            setError('Veuillez entrer votre e-mail');
            return;
        }
        if (!password) {
            setError('Veuillez entrer un mot de passe');
            return;
        }
        if (strength.score < 3) {
            setError('Votre mot de passe doit respecter tous les critères');
            return;
        }

        setLoading(true);
        login(email);
        setLoading(false);
    }, [email, password, strength.score, login]);

    const handleBack = useCallback(() => navigation.goBack(), [navigation]);

    const handleGoToLogin = useCallback(() => {
        navigation.navigate('Login', { email });
    }, [navigation, email]);

    return (
        <ScreenLayout>
            <BackButton onPress={handleBack} />

            <View className="mb-8">
                <Text className="text-4xl font-bold text-gray-900 mb-4">
                    Créer votre{'\n'}compte 🌱
                </Text>
                <Text className="text-base text-gray-500 leading-relaxed">
                    Rejoignez Primo et commencez votre aventure immobilière.
                </Text>
            </View>

            <View className="space-y-5">
                <Input
                    value={email}
                    onChangeText={handleEmailChange}
                    placeholder="votre@email.com"
                    type="email"
                    label="Adresse e-mail"
                    keyboardType="email-address"
                />

                <Spacer size="xs" />

                <Input
                    value={password}
                    onChangeText={handlePasswordChange}
                    placeholder="Créez un mot de passe"
                    type="password"
                    label="Mot de passe"
                />

                {password.length > 0 && (
                    <View className="mt-3">
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-row flex-1 h-2 bg-gray-100 rounded-full overflow-hidden mr-3">
                                <View
                                    className={`h-full rounded-full ${strengthStyle.color}`}
                                    style={{ width: `${(strength.score / 3) * 100}%` }}
                                />
                            </View>
                            <Text className={`text-xs font-semibold ${strengthStyle.textColor}`}>
                                {strengthStyle.label}
                            </Text>
                        </View>

                        <View className="bg-gray-50 rounded-xl p-4">
                            <Criterion met={strength.hasMinLength} label="Au moins 8 caractères" />
                            <Criterion met={strength.hasUppercase} label="Une majuscule" />
                            <Criterion met={strength.hasSpecial} label="Un caractère spécial (!@#...)" />
                        </View>
                    </View>
                )}

                {error && <Text className="text-error text-sm">{error}</Text>}

                <Spacer size="lg" />

                <Button onPress={handleRegister} isLoading={loading} disabled={loading}>
                    Créer mon compte
                </Button>

                <View className="flex-row justify-center py-4">
                    <Text className="text-gray-500">Déjà un compte ? </Text>
                    <Pressable onPress={handleGoToLogin}>
                        <Text className="text-primary font-semibold">Se connecter</Text>
                    </Pressable>
                </View>
            </View>

            <Spacer size="xxl" />
        </ScreenLayout>
    );
});

RegisterScreen.displayName = 'RegisterScreen';

export default RegisterScreen;
