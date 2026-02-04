import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ScreenLayout from '../../components/ui/ScreenLayout';
import BackButton from '../../components/ui/BackButton';
import UserAvatar from '../../components/ui/UserAvatar';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { IconName } from '../../types/icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface SettingsMenuItem {
    icon: IconName;
    label: string;
    subtitle: string;
    route?: keyof MainStackParamList;
    comingSoon?: boolean;
}

const SETTINGS_ITEMS: readonly SettingsMenuItem[] = [
    { 
        icon: 'person-outline', 
        label: 'Modifier le profil', 
        subtitle: 'Prénom, nom, avatar',
        route: 'EditProfile'
    },
    { 
        icon: 'document-text-outline', 
        label: 'Données et confidentialité', 
        subtitle: 'Gérer vos données',
        comingSoon: true
    },
    { 
        icon: 'calendar-outline', 
        label: 'Abonnements', 
        subtitle: 'Gérer votre abonnement',
        comingSoon: true
    },
    { 
        icon: 'card-outline', 
        label: 'Facturation', 
        subtitle: 'Moyens de paiement',
        comingSoon: true
    },
    { 
        icon: 'shield-outline', 
        label: 'Sécurité', 
        subtitle: 'Mot de passe, 2FA',
        comingSoon: true
    },
    { 
        icon: 'notifications-outline', 
        label: 'Notifications', 
        subtitle: 'Préférences de notifications',
        comingSoon: true
    },
];

const SettingsScreen = memo(() => {
    const navigation = useNavigation<NavigationProp>();
    const { logout, user } = useAuth();
    const { showComingSoon } = useSnackbar();

    const handleItemPress = (item: SettingsMenuItem) => {
        if (item.comingSoon) {
            showComingSoon(item.label);
        } else if (item.route) {
            navigation.navigate(item.route);
        }
    };

    return (
        <ScreenLayout className="bg-gray-50" contentContainerClassName="px-5 py-6">
            <View className="flex-row items-center mb-6">
                <BackButton />
                <Text className="text-2xl font-bold text-gray-900 ml-3">
                    Paramètres
                </Text>
            </View>

            <Pressable
                onPress={() => navigation.navigate('EditProfile')}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex-row items-center active:opacity-70"
            >
                <View className="mr-4">
                    <UserAvatar avatarName={user?.profilePicture} size={56} />
                </View>
                <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                        {user?.firstName} {user?.surName}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-0.5">
                        {user?.email}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>

            <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 ml-1">
                Paramètres
            </Text>
            
            <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {SETTINGS_ITEMS.map((item, index) => (
                    <Pressable
                        key={item.label}
                        onPress={() => handleItemPress(item)}
                        className={`flex-row items-center p-4 active:bg-gray-50 ${
                            index < SETTINGS_ITEMS.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                    >
                        <View className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center mr-3">
                            <Ionicons name={item.icon} size={20} color="#004526" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-medium text-gray-900">
                                {item.label}
                            </Text>
                            <Text className="text-sm text-gray-500 mt-0.5">
                                {item.subtitle}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </Pressable>
                ))}
            </View>

            <Pressable
                onPress={logout}
                className="flex-row items-center justify-center py-4 mt-8 active:opacity-70"
            >
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                <Text className="text-red-500 font-medium ml-2">
                    Se déconnecter
                </Text>
            </Pressable>
        </ScreenLayout>
    );
});

SettingsScreen.displayName = 'SettingsScreen';

export default SettingsScreen;
