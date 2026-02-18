import React, { useState, memo, useEffect } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';
import { Asset } from 'expo-asset';

// Map avatar names to their asset requires
const AVATAR_ASSETS: Record<string, number> = {
    'green.png': require('../../../assets/images/avatars/green.svg'),
    'cyan.png': require('../../../assets/images/avatars/cyan.svg'),
    'blue.png': require('../../../assets/images/avatars/blue.svg'),
    'orange.png': require('../../../assets/images/avatars/orange.svg'),
    'pink.png': require('../../../assets/images/avatars/pink.svg'),
    'white.png': require('../../../assets/images/avatars/white.svg'),
    'whitepink.png': require('../../../assets/images/avatars/whitepink.svg'),
    'yellow.png': require('../../../assets/images/avatars/yellow.svg'),
};

interface UserAvatarProps {
    avatarName?: string;
    size: number;
}

const UserAvatar = memo(({ avatarName = 'green.png', size }: UserAvatarProps) => {
    const [uri, setUri] = useState<string | null>(null);

    useEffect(() => {
        const loadAsset = async () => {
            try {
                const asset = Asset.fromModule(AVATAR_ASSETS[avatarName] || AVATAR_ASSETS['green.png']);
                await asset.downloadAsync();
                setUri(asset.localUri || asset.uri);
            } catch (error) {
                console.error('Error loading avatar:', error);
            }
        };
        loadAsset();
    }, [avatarName]);

    if (!uri) {
        return (
            <View 
                style={{ width: size, height: size }} 
                className="bg-primary rounded-full items-center justify-center"
            >
                <Ionicons name="person" size={size / 2} color="#fff" />
            </View>
        );
    }

    return (
        <View 
            style={{ width: size, height: size }} 
            className="rounded-full overflow-hidden items-center justify-center bg-gray-100"
        >
            <SvgUri
                width={size}
                height={size}
                uri={uri}
            />
        </View>
    );
});

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;
