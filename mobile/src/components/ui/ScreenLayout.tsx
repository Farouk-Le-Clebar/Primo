import React, { memo } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView, Edges } from 'react-native-safe-area-context';

interface ScreenLayoutProps {
    children: React.ReactNode;
    edges?: Edges;
    className?: string;
    withScroll?: boolean;
    contentContainerClassName?: string;
    keyboardOffset?: number;
}

const ScreenLayout = memo(({
    children,
    edges = ['top'],
    className = 'bg-white',
    withScroll = true,
    contentContainerClassName = 'px-6 py-8',
    keyboardOffset = 0,
}: ScreenLayoutProps) => {

    const content = withScroll ? (
        <ScrollView
            className="flex-1"
            contentContainerClassName={contentContainerClassName}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            {children}
        </ScrollView>
    ) : (
        children
    );

    return (
        <SafeAreaView className={`flex-1 ${className}`} edges={edges}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? keyboardOffset : 20}
            >
                {content}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
});

ScreenLayout.displayName = 'ScreenLayout';

export default ScreenLayout;
