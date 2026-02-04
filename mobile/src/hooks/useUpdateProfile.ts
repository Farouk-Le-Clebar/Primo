import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateUserProfile } from '../requests/UserRequests';
import { UpdateProfilePayload, User } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { parseApiError, ApiErrorResponse } from '../utils/errorHandler';

interface UseUpdateProfileOptions {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export const useUpdateProfile = ({ onSuccess, onError }: UseUpdateProfileOptions = {}) => {
    const { updateUser } = useAuth();

    return useMutation({
        mutationFn: (profileData: UpdateProfilePayload) => updateUserProfile(profileData),
        onSuccess: async (data) => {
            if (data.user) {
                await updateUser(data.user);
            }
            onSuccess?.();
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            onError?.(parseApiError(error));
        },
    });
};
