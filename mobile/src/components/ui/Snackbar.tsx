import React, { useEffect, memo } from 'react';
import { Text, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconName } from '../../types/icons';

export interface SnackbarProps {
    message: string;
    visible: boolean;
    onDismiss: () => void;
    duration?: number;
    icon?: IconName;
    type?: 'info' | 'success' | 'warning' | 'error';
}

const TYPE_CONFIG = {
    info: { icon: 'information-circle' as IconName, color: '#3B82F6', bg: 'bg-blue-50' },
    success: { icon: 'checkmark-circle' as IconName, color: '#22C55E', bg: 'bg-green-50' },
    warning: { icon: 'warning' as IconName, color: '#F59E0B', bg: 'bg-amber-50' },
    error: { icon: 'close-circle' as IconName, color: '#EF4444', bg: 'bg-red-50' },
};

const Snackbar = memo(({ message, visible, onDismiss, duration = 3000, icon, type = 'info' }: SnackbarProps) => {
    const insets = useSafeAreaInsets();
    const opacity = React.useRef(new Animated.Value(0)).current;
    const translateY = React.useRef(new Animated.Value(20)).current;

    const config = TYPE_CONFIG[type];
    const displayIcon = icon || config.icon;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
            ]).start();

            const timer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
                    Animated.timing(translateY, { toValue: 20, duration: 200, useNativeDriver: true }),
                ]).start(() => onDismiss());
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [visible, duration, onDismiss, opacity, translateY]);

    if (!visible) return null;

    return (
        <Animated.View
            style={{
                position: 'absolute',
                bottom: insets.bottom + 20,
                left: 20,
                right: 20,
                opacity,
                transform: [{ translateY }],
            }}
            className={`flex-row items-center px-4 py-3 rounded-2xl shadow-lg ${config.bg}`}
        >
            <Ionicons name={displayIcon} size={20} color={config.color} />
            <Text className="flex-1 text-gray-800 font-medium ml-3 text-sm">{message}</Text>
            <Pressable onPress={onDismiss} hitSlop={10}>
                <Ionicons name="close" size={18} color="#9CA3AF" />
            </Pressable>
        </Animated.View>
    );
});

Snackbar.displayName = 'Snackbar';

export default Snackbar;
