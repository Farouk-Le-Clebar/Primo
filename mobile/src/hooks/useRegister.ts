import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { register } from '../requests/AuthRequests';
import { AuthResponse } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { parseApiError, ApiErrorResponse } from '../utils/errorHandler';

interface UseRegisterOptions {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export const useRegister = ({ onSuccess, onError }: UseRegisterOptions = {}) => {
    const { handleAuthSuccess } = useAuth();

    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            register(email, password),
        onSuccess: async (data: AuthResponse) => {
            await handleAuthSuccess(data);
            onSuccess?.();
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            onError?.(parseApiError(error));
        },
    });
};
