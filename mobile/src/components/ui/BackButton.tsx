import React, { memo } from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BackButtonProps {
    onPress: () => void;
}

const BackButton = memo(({ onPress }: BackButtonProps) => (
    <Pressable
        onPress={onPress}
        className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-6 active:opacity-70"
    >
        <Ionicons name="arrow-back" size={20} color="#374151" />
    </Pressable>
));

BackButton.displayName = 'BackButton';

export default BackButton;
