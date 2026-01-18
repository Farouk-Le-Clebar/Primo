import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../requests/AuthRequests';
import { AuthResponse } from '../types/auth';
import { useAuth } from '../context/AuthContext';

interface UseLoginOptions {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export const useLogin = ({ onSuccess, onError }: UseLoginOptions = {}) => {
    const { setAuthData } = useAuth();

    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            login(email, password),
        onSuccess: async (data: AuthResponse) => {
            await AsyncStorage.setItem('token', data.access_token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            setAuthData(data.user, data.access_token);
            onSuccess?.();
        },
        onError: (error: AxiosError) => {
            const message =
                error.response?.status === 401
                    ? 'Le mot de passe est incorrect'
                    : 'Une erreur est survenue';
            onError?.(message);
        },
    });
};
