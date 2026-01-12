import { useCallback } from 'react';
import { Alert } from 'react-native';

export const useComingSoon = () => {
    const showComingSoon = useCallback((feature: string) => {
        Alert.alert(
            '🚧 Bientôt disponible',
            `La fonctionnalité "${feature}" est en cours de développement.\n\nElle sera disponible dans une prochaine mise à jour !`,
            [{ text: 'OK', style: 'default' }]
        );
    }, []);

    return { showComingSoon };
};
