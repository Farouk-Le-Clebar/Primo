import React, { useState, memo, useEffect } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';
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

const PRESET_AVATARS = [
    'blue.png', 'cyan.png', 'green.png', 'orange.png',
    'pink.png', 'white.png', 'whitepink.png', 'yellow.png'
];

interface AvatarUploadProps {
    currentImage: string;
    onImageChange: (imageName: string) => void;
}

const AvatarImage = memo(({ avatarName, size }: { avatarName: string; size: number }) => {
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
                className="bg-gray-200 rounded-full items-center justify-center"
            >
                <Ionicons name="person" size={size / 2} color="#9CA3AF" />
            </View>
        );
    }

    return (
        <SvgUri
            width={size}
            height={size}
            uri={uri}
        />
    );
});

AvatarImage.displayName = 'AvatarImage';

const AvatarUpload = memo(({ currentImage, onImageChange }: AvatarUploadProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<string>(currentImage || 'green.png');

    const selectPreset = (avatarName: string) => {
        setSelectedAvatar(avatarName);
        onImageChange(avatarName);
        setIsModalOpen(false);
    };

    return (
        <>
            <Pressable
                onPress={() => setIsModalOpen(true)}
                className="items-center"
            >
                <View className="relative">
                    <View className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 items-center justify-center">
                        <AvatarImage avatarName={selectedAvatar} size={120} />
                    </View>
                    
                    <View className="absolute bottom-1 right-1 bg-white p-2.5 rounded-full shadow-md border border-gray-100">
                        <Ionicons name="pencil" size={16} color="#374151" />
                    </View>
                </View>
                
                <Text className="text-sm text-primary font-medium mt-3">
                    Changer l'avatar
                </Text>
            </Pressable>

            <Modal
                visible={isModalOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsModalOpen(false)}
            >
                <Pressable
                    className="flex-1 bg-black/40 justify-center items-center p-6"
                    onPress={() => setIsModalOpen(false)}
                >
                    <Pressable
                        className="bg-white w-full max-w-sm rounded-3xl overflow-hidden"
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View className="p-6 pb-4">
                            <View className="flex-row justify-between items-start">
                                <View className="flex-1 mr-4">
                                    <Text className="text-xl font-bold text-gray-800">
                                        Choisir un avatar
                                    </Text>
                                    <Text className="text-gray-500 text-sm mt-1">
                                        Sélectionnez l'image qui vous ressemble le plus.
                                    </Text>
                                </View>
                                <Pressable
                                    onPress={() => setIsModalOpen(false)}
                                    hitSlop={10}
                                    className="p-1"
                                >
                                    <Ionicons name="close" size={24} color="#9CA3AF" />
                                </Pressable>
                            </View>
                        </View>

                        <View className="px-6 pb-6">
                            <View className="flex-row flex-wrap justify-between">
                                {PRESET_AVATARS.map((avatar) => {
                                    const isSelected = avatar === selectedAvatar;
                                    return (
                                        <Pressable
                                            key={avatar}
                                            onPress={() => selectPreset(avatar)}
                                            className={`w-[22%] aspect-square rounded-full overflow-hidden mb-3 border-2 ${
                                                isSelected ? 'border-primary' : 'border-transparent'
                                            }`}
                                        >
                                            <View className="w-full h-full bg-gray-100 items-center justify-center">
                                                <AvatarImage avatarName={avatar} size={70} />
                                            </View>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
});

AvatarUpload.displayName = 'AvatarUpload';

export default AvatarUpload;
