import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { checkUserByMail } from '../requests/UserRequests';
import { CheckEmailResponse } from '../types/auth';

interface UseCheckEmailOptions {
    onSuccess?: (data: CheckEmailResponse) => void;
    onError?: (error: string) => void;
}

export const useCheckEmail = ({ onSuccess, onError }: UseCheckEmailOptions = {}) => {
    return useMutation({
        mutationFn: (email: string) => checkUserByMail(email),
        onSuccess: (data) => {
            onSuccess?.(data);
        },
        onError: (error: AxiosError) => {
            const message = error.response?.status === 404
                ? 'Service indisponible'
                : 'Une erreur est survenue';
            onError?.(message);
        },
    });
};
