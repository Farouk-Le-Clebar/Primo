import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { checkUserByMail } from '../requests/AuthRequests';
import { CheckEmailResponse } from '../types/auth';
import { parseApiError, ApiErrorResponse } from '../utils/errorHandler';

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
        onError: (error: AxiosError<ApiErrorResponse>) => {
            onError?.(parseApiError(error));
        },
    });
};
