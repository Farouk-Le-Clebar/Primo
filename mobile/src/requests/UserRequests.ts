import api from '../services/api';
import { UpdateProfilePayload, UpdateProfileResponse, User } from '../types/auth';

export interface UserPublicInfo {
    profilePicture?: string;
}

export const getUserByEmail = async (email: string): Promise<UserPublicInfo> => {
    const response = await api.get<UserPublicInfo>(`/user/email/${encodeURIComponent(email)}`);
    return response.data;
};

export const updateUserProfile = async (
    profileData: UpdateProfilePayload
): Promise<UpdateProfileResponse> => {
    const response = await api.put<UpdateProfileResponse>('/user/profile', profileData);
    return response.data;
};
