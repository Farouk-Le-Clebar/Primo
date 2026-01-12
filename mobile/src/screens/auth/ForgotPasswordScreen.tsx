import React, { useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ScreenLayout from '../../components/ui/ScreenLayout';
import { AuthStackParamList } from '../../types/navigation';
import { validateEmail } from '../../utils/validation';

interface Props {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
}

const ForgotPasswordScreen = ({ navigation }: Props) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

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

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 500);
    }, [email]);

    const handleBack = useCallback(() => navigation.goBack(), [navigation]);
    const handleBackToAuth = useCallback(() => navigation.navigate('AuthEntry'), [navigation]);

    return (
        <ScreenLayout>
            <Pressable
                onPress={handleBack}
                className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-6"
            >
                <Ionicons name="arrow-back" size={20} color="#374151" />
            </Pressable>

            {sent ? (
                <View className="flex-1 items-center justify-center py-20">
                    <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-6">
                        <Ionicons name="mail" size={40} color="#22C55E" />
                    </View>
                    <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
                        Email envoyé !
                    </Text>
                    <Text className="text-base text-gray-500 text-center leading-relaxed mb-8">
                        Nous avons envoyé un lien de réinitialisation à{'\n'}
                        <Text className="font-semibold text-gray-700">{email}</Text>
                    </Text>
                    <Button onPress={handleBackToAuth}>Retour à la connexion</Button>
                </View>
            ) : (
                <>
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

                        <View className="h-4" />

                        <Button onPress={handleReset} isLoading={loading} disabled={loading}>
                            Envoyer le lien
                        </Button>

                        <Pressable onPress={handleBack} className="py-4 items-center">
                            <Text className="text-gray-500">
                                Retour à la <Text className="text-primary font-semibold">connexion</Text>
                            </Text>
                        </Pressable>
                    </View>
                </>
            )}
        </ScreenLayout>
    );
};

export default ForgotPasswordScreen;
