import React, { memo } from 'react';
import { View } from 'react-native';

interface SpacerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const SIZES = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 32,
} as const;

const Spacer = memo(({ size = 'md' }: SpacerProps) => (
    <View style={{ height: SIZES[size] }} />
));

Spacer.displayName = 'Spacer';

export default Spacer;
