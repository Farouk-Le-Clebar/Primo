import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { login } from '../requests/AuthRequests';
import { AuthResponse } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { parseApiError, ApiErrorResponse } from '../utils/errorHandler';

interface UseLoginOptions {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export const useLogin = ({ onSuccess, onError }: UseLoginOptions = {}) => {
    const { handleAuthSuccess } = useAuth();

    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            login(email, password),
        onSuccess: async (data: AuthResponse) => {
            await handleAuthSuccess(data);
            onSuccess?.();
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            onError?.(parseApiError(error));
        },
    });
};
