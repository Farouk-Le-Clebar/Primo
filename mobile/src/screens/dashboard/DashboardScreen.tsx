import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useComingSoon } from '../../hooks/useComingSoon';
import ScreenLayout from '../../components/ui/ScreenLayout';
import { useAuth } from '../../context/AuthContext';
import QuickAction from '../../components/dashboard/QuickAction';
import MenuItem from '../../components/dashboard/MenuItem';
import StatsCard from '../../components/dashboard/StatsCard';

// Configuration Data
const QUICK_ACTIONS = [
    { icon: 'search', label: 'Rechercher', color: 'bg-blue-500' },
    { icon: 'map', label: 'Carte', color: 'bg-green-500' },
    { icon: 'heart', label: 'Favoris', color: 'bg-red-400' },
];

const MENU_ITEMS = [
    { icon: 'home-outline', label: 'Dashboard', subtitle: "Vue d'ensemble" },
    { icon: 'folder-outline', label: 'Mes Projets', subtitle: '0 projets' },
    { icon: 'heart-outline', label: 'Mes Favoris', subtitle: '0 biens sauvegardés' },
    { icon: 'map-outline', label: 'Explorer la carte', subtitle: 'Recherche géographique' },
    { icon: 'sparkles-outline', label: 'IA Primo', subtitle: 'Assistant intelligent' },
    { icon: 'settings-outline', label: 'Paramètres', subtitle: 'Compte et préférences' },
];

const DashboardScreen = () => {
    const { showComingSoon } = useComingSoon();
    const { logout } = useAuth();

    // Optimisation: Une seule fonction de callback stable
    // Les composants enfants appellent onPress(label)
    const handleFeaturePress = showComingSoon;

    return (
        <ScreenLayout className="bg-gray-50" contentContainerClassName="px-5 py-6">
            <View className="flex-row items-center justify-between mb-8">
                <View>
                    <Text className="text-sm text-gray-500">Bonjour 👋</Text>
                    <Text className="text-2xl font-bold text-gray-900 mt-1">Mon Dashboard</Text>
                </View>
                <Pressable
                    onPress={() => handleFeaturePress('Mon profil')}
                    className="w-12 h-12 rounded-full bg-primary items-center justify-center active:opacity-70"
                >
                    <Ionicons name="person" size={22} color="#fff" />
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

            <View className="h-10" />
        </ScreenLayout>
    );
};

export default DashboardScreen;
