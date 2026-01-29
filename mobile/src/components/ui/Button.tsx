import React, { memo } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'facebook' | 'google' | 'apple';

interface ButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    variant?: ButtonVariant;
    disabled?: boolean;
    isLoading?: boolean;
    icon?: React.ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, { bg: string; text: string }> = {
    primary: { bg: 'bg-primary justify-center', text: 'text-white' },
    secondary: { bg: 'bg-secondary justify-center', text: 'text-secondary-text' },
    facebook: { bg: 'bg-facebook', text: 'text-white' },
    google: { bg: 'bg-white border border-gray-200 shadow-sm', text: 'text-gray-800' },
    apple: { bg: 'bg-apple', text: 'text-white' },
};

const SOCIAL_VARIANTS = ['facebook', 'google', 'apple'];

const Button = memo(({
    children,
    onPress,
    variant = 'primary',
    disabled = false,
    isLoading = false,
    icon,
}: ButtonProps) => {
    const styles = VARIANT_STYLES[variant];
    const isSocial = SOCIAL_VARIANTS.includes(variant);
    const loaderColor = variant === 'google' ? '#000' : '#fff';

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.7}
            className={`h-14 rounded-2xl flex-row items-center px-4 ${styles.bg} ${disabled ? 'opacity-50' : ''}`}
        >
            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator color={loaderColor} size="small" />
                </View>
            ) : isSocial ? (
                <>
                    <View className="w-8 items-center">{icon}</View>
                    <Text className={`flex-1 text-center text-base font-semibold ${styles.text}`}>
                        {children}
                    </Text>
                    <View className="w-8" />
                </>
            ) : (
                <>
                    {icon && <View className="mr-3">{icon}</View>}
                    <Text className={`text-base font-semibold ${styles.text}`}>{children}</Text>
                </>
            )}
        </TouchableOpacity>
    );
});

Button.displayName = 'Button';

export default Button;
