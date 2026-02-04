import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useSnackbar } from '../../context/SnackbarContext';
import ScreenLayout from '../../components/ui/ScreenLayout';
import Spacer from '../../components/ui/Spacer';
import UserAvatar from '../../components/ui/UserAvatar';
import { useAuth } from '../../context/AuthContext';
import QuickAction from '../../components/dashboard/QuickAction';
import MenuItem from '../../components/dashboard/MenuItem';
import StatsCard from '../../components/dashboard/StatsCard';
import { IconName } from '../../types/icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../types/navigation';

interface QuickActionConfig {
    icon: IconName;
    label: string;
    color: string;
}

interface MenuItemConfig {
    icon: IconName;
    label: string;
    subtitle: string;
}

const QUICK_ACTIONS: readonly QuickActionConfig[] = [
    { icon: 'search', label: 'Rechercher', color: 'bg-blue-500' },
    { icon: 'map', label: 'Carte', color: 'bg-green-500' },
    { icon: 'heart', label: 'Favoris', color: 'bg-red-400' },
];

const MENU_ITEMS: readonly MenuItemConfig[] = [
    { icon: 'home-outline', label: 'Dashboard', subtitle: "Vue d'ensemble" },
    { icon: 'folder-outline', label: 'Mes Projets', subtitle: '0 projets' },
    { icon: 'heart-outline', label: 'Mes Favoris', subtitle: '0 biens sauvegardés' },
    { icon: 'map-outline', label: 'Explorer la carte', subtitle: 'Recherche géographique' },
    { icon: 'sparkles-outline', label: 'IA Primo', subtitle: 'Assistant intelligent' },
    { icon: 'settings-outline', label: 'Paramètres', subtitle: 'Compte et préférences' },
];

const DashboardScreen = memo(() => {
    const { showComingSoon } = useSnackbar();
    const { logout, user } = useAuth();
    const navigation = useNavigation<NavigationProp>();

    const handleFeaturePress = (feature: string) => {
        if (feature === 'Carte' || feature === 'Explorer la carte') {
            navigation.navigate('Map');
        } else if (feature === 'Mon profil' || feature === 'Paramètres') {
            navigation.navigate('Settings');
        } else {
            showComingSoon(feature);
        }
    }

    return (
        <ScreenLayout className="bg-gray-50" contentContainerClassName="px-5 py-6">
            <View className="flex-row items-center justify-between mb-8">
                <View>
                    <Text className="text-sm text-gray-500">Bonjour 👋</Text>
                    <Text className="text-2xl font-bold text-gray-900 mt-1">Mon Dashboard</Text>
                </View>
                <Pressable
                    onPress={() => navigation.navigate('Settings')}
                    className="active:opacity-70"
                >
                    <UserAvatar avatarName={user?.profilePicture} size={48} />
                </Pressable>
            </View>

            <StatsCard
                activeProjects={0}
                favorites={0}
                searches={0}
                alerts={0}
                onPress={() => handleFeaturePress('Statistiques')}
            />

            <Text className="text-lg font-bold text-gray-900 mb-4">Actions rapides</Text>
            <View className="flex-row gap-3 mb-8">
                {QUICK_ACTIONS.map((action) => (
                    <QuickAction
                        key={action.label}
                        {...action}
                        onPress={handleFeaturePress}
                    />
                ))}
            </View>

            <Text className="text-lg font-bold text-gray-900 mb-4">Menu</Text>
            <View>
                {MENU_ITEMS.map((item) => (
                    <MenuItem
                        key={item.label}
                        {...item}
                        onPress={handleFeaturePress}
                    />
                ))}
            </View>

            <Pressable
                onPress={logout}
                className="flex-row items-center justify-center py-4 mt-4 active:opacity-70"
            >
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                <Text className="text-error font-medium ml-2">Se déconnecter</Text>
            </Pressable>

            <Spacer size="lg" />
        </ScreenLayout>
    );
});

DashboardScreen.displayName = 'DashboardScreen';

export default DashboardScreen;
