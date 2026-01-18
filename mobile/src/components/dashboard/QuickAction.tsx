import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconName } from '../../types/icons';

interface QuickActionProps {
    icon: IconName;
    label: string;
    color: string;
    onPress: (label: string) => void;
}

const QuickAction = memo(({ icon, label, color, onPress }: QuickActionProps) => (
    <Pressable
        onPress={() => onPress(label)}
        className="flex-1 bg-white rounded-2xl p-4 items-center shadow-sm border border-gray-100 active:opacity-70"
    >
        <View className={`w-12 h-12 rounded-full items-center justify-center mb-3 ${color}`}>
            <Ionicons name={icon} size={24} color="#fff" />
        </View>
        <Text className="text-sm font-medium text-gray-700 text-center">{label}</Text>
    </Pressable>
));

QuickAction.displayName = 'QuickAction';

export default QuickAction;
