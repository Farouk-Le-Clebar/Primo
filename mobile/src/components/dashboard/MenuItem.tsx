import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MenuItemProps {
    icon: string;
    label: string;
    subtitle?: string;
    onPress: (label: string) => void;
}

const MenuItem = memo(({ icon, label, subtitle, onPress }: MenuItemProps) => (
    <Pressable
        onPress={() => onPress(label)}
        className="flex-row items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-3 active:opacity-70"
    >
        <View className="w-12 h-12 rounded-xl bg-gray-100 items-center justify-center mr-4">
            <Ionicons name={icon as any} size={22} color="#004526" />
        </View>
        <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900">{label}</Text>
            {subtitle && <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>}
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </Pressable>
));

MenuItem.displayName = 'MenuItem';

export default MenuItem;
