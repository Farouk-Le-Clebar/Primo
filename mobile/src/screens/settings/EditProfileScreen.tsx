import React, { useState, memo, useCallback } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ScreenLayout from '../../components/ui/ScreenLayout';
import BackButton from '../../components/ui/BackButton';
import Input from '../../components/ui/Input';
import AvatarUpload from '../../components/settings/AvatarUpload';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';
import { UpdateProfilePayload } from '../../types/auth';

const EditProfileScreen = memo(() => {
    const { user } = useAuth();
    const { showSuccess, showError } = useSnackbar();

    const [formData, setFormData] = useState(() => ({
        firstName: user?.firstName || '',
        lastName: user?.surName || '',
        email: user?.email || '',
        profilePicture: user?.profilePicture || 'green.png'
    }));

    const { mutate, isPending } = useUpdateProfile({
        onSuccess: () => showSuccess('Profil mis à jour avec succès !'),
        onError: (error) => showError(error),
    });

    const handleFieldChange = useCallback((fieldName: string, value: string) => {
        setFormData((prev) => ({ ...prev, [fieldName]: value }));
    }, []);

    const handleImageUpdate = useCallback((imageName: string) => {
        setFormData((prev) => ({
            ...prev,
            profilePicture: imageName
        }));
    }, []);

    const saveProfile = useCallback(() => {
        const payload: UpdateProfilePayload = {
            firstName: formData.firstName,
            surName: formData.lastName,
            profilePicture: formData.profilePicture
        };
        mutate(payload);
    }, [formData, mutate]);

    return (
        <ScreenLayout className="bg-gray-50" contentContainerClassName="px-5 py-6">
            <View className="flex-row items-center justify-between mb-8">
                <View className="flex-row items-center">
                    <BackButton />
                    <Text className="text-2xl font-bold text-gray-900 ml-3">
                        Mes informations
                    </Text>
                </View>
                
                <Pressable
                    onPress={saveProfile}
                    disabled={isPending}
                    className={`px-5 py-2.5 rounded-xl ${
                        isPending ? 'bg-gray-400' : 'bg-primary active:opacity-80'
                    }`}
                >
                    {isPending ? (
                        <View className="flex-row items-center">
                            <ActivityIndicator size="small" color="#fff" />
                            <Text className="text-white font-medium ml-2">
                                Enregistrement...
                            </Text>
                        </View>
                    ) : (
                        <Text className="text-white font-medium">
                            Enregistrer
                        </Text>
                    )}
                </Pressable>
            </View>

            <View className="items-center mb-8">
                <AvatarUpload
                    currentImage={formData.profilePicture}
                    onImageChange={handleImageUpdate}
                />
            </View>

            <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <View className="mb-5">
                    <Input
                        label="Prénom"
                        value={formData.firstName}
                        onChangeText={(val) => handleFieldChange('firstName', val)}
                        placeholder="Votre prénom"
                    />
                </View>

                <View className="mb-5">
                    <Input
                        label="Nom de famille"
                        value={formData.lastName}
                        onChangeText={(val) => handleFieldChange('lastName', val)}
                        placeholder="Votre nom"
                    />
                </View>

                <View>
                    <Text className="text-sm font-medium text-gray-400 mb-2 italic">
                        Adresse e-mail (non modifiable)
                    </Text>
                    <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-14 border border-gray-200">
                        <Text className="flex-1 text-base text-gray-400">
                            {formData.email}
                        </Text>
                        <Ionicons name="lock-closed" size={18} color="#9CA3AF" />
                    </View>
                </View>
            </View>
        </ScreenLayout>
    );
});

EditProfileScreen.displayName = 'EditProfileScreen';

export default EditProfileScreen;
