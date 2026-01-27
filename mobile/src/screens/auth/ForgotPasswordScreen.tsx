import React, { useState, useCallback, memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ScreenLayout from '../../components/ui/ScreenLayout';
import BackButton from '../../components/ui/BackButton';
import Spacer from '../../components/ui/Spacer';
import { AuthStackParamList } from '../../types/navigation';
import { validateEmail } from '../../utils/validation';
import { useSnackbar } from '../../context/SnackbarContext';

interface Props {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
}

const ForgotPasswordScreen = memo(({ navigation }: Props) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { showComingSoon } = useSnackbar();

    const handleEmailChange = useCallback((text: string) => {
        setEmail(text);
        setError('');
    }, []);

    const handleReset = useCallback(() => {
        if (!email.trim()) {
            setError('Veuillez entrer votre adresse e-mail');
            return;
        }
        if (!validateEmail(email)) {
            setError('Veuillez entrer une adresse e-mail valide');
            return;
        }

        showComingSoon('Réinitialisation du mot de passe');
    }, [email, showComingSoon]);

    const handleBack = useCallback(() => navigation.goBack(), [navigation]);

    return (
        <ScreenLayout>
            <BackButton onPress={handleBack} />

            <View className="mb-8">
                <Text className="text-4xl font-bold text-gray-900 mb-4">
                    Mot de passe{'\n'}oublié ? 🔑
                </Text>
                <Text className="text-base text-gray-500 leading-relaxed">
                    Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </Text>
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

                <Spacer size="lg" />

                <Button onPress={handleReset}>
                    Envoyer le lien
                </Button>

                <Pressable onPress={handleBack} className="py-4 items-center">
                    <Text className="text-gray-500">
                        Retour à la <Text className="text-primary font-semibold">connexion</Text>
                    </Text>
                </Pressable>
            </View>
        </ScreenLayout>
    );
});

ForgotPasswordScreen.displayName = 'ForgotPasswordScreen';

export default ForgotPasswordScreen;
