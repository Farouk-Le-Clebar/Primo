import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';

interface StatsCardProps {
    activeProjects: number;
    favorites: number;
    searches: number;
    alerts: number;
    onPress: () => void;
}

const StatsCard = memo(({
    activeProjects,
    favorites,
    searches,
    alerts,
    onPress
}: StatsCardProps) => (
    <Pressable
        onPress={onPress}
        className="bg-primary rounded-3xl p-6 mb-6 active:opacity-90"
    >
        <Text className="text-white/70 text-sm mb-2">Votre activité</Text>
        <Text className="text-white text-3xl font-bold mb-4">{activeProjects} projets actifs</Text>
        <View className="flex-row justify-between">
            <View>
                <Text className="text-white/60 text-xs">Favoris</Text>
                <Text className="text-white text-lg font-semibold">{favorites}</Text>
            </View>
            <View>
                <Text className="text-white/60 text-xs">Recherches</Text>
                <Text className="text-white text-lg font-semibold">{searches}</Text>
            </View>
            <View>
                <Text className="text-white/60 text-xs">Alertes</Text>
                <Text className="text-white text-lg font-semibold">{alerts}</Text>
            </View>
        </View>
    </Pressable>
));

StatsCard.displayName = 'StatsCard';

export default StatsCard;
