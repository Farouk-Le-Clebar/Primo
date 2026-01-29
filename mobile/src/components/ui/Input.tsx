import React, { useState, useCallback, memo } from 'react';
import { TextInput, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    type?: 'text' | 'email' | 'password';
    label?: string;
    error?: string;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    keyboardType?: 'default' | 'email-address' | 'numeric';
}

const Input = memo(({
    value,
    onChangeText,
    placeholder = '',
    type = 'text',
    label,
    error,
    autoCapitalize = 'none',
    keyboardType = 'default',
}: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === 'password';

    const togglePassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);

    const borderStyle = error
        ? 'border-error'
        : isFocused
            ? 'border-primary border-2'
            : 'border-gray-200';

    return (
        <View>
            {label && (
                <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
            )}
            <View className={`flex-row items-center bg-gray-50 rounded-xl px-4 h-14 border ${borderStyle}`}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={isPassword && !showPassword}
                    autoCapitalize={autoCapitalize}
                    keyboardType={type === 'email' ? 'email-address' : keyboardType}
                    className="flex-1 text-base text-gray-900 py-0"
                    style={{ fontSize: 16, lineHeight: 20 }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                {isPassword && (
                    <Pressable onPress={togglePassword} hitSlop={10}>
                        <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={22}
                            color="#6B7280"
                        />
                    </Pressable>
                )}
            </View>
            {error && (
                <Text className="text-error text-sm mt-1.5">{error}</Text>
            )}
        </View>
    );
});

Input.displayName = 'Input';

export default Input;
