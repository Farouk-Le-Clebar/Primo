import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { register } from '../requests/AuthRequests';
import { AuthResponse } from '../types/auth';
import { useAuth } from '../context/AuthContext';

interface UseRegisterOptions {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export const useRegister = ({ onSuccess, onError }: UseRegisterOptions = {}) => {
    const { setAuthData } = useAuth();

    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            register(email, password),
        onSuccess: async (data: AuthResponse) => {
            await AsyncStorage.setItem('token', data.access_token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            setAuthData(data.user, data.access_token);
            onSuccess?.();
        },
        onError: (error: AxiosError) => {
            const message =
                error.response?.status === 409
                    ? 'Cet email est déjà utilisé'
                    : 'Une erreur est survenue';
            onError?.(message);
        },
    });
};
