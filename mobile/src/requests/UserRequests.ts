import axios from 'axios';
import { UpdateProfilePayload, UpdateProfileResponse, User } from '../types/auth';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export interface UserPublicInfo {
    profilePicture?: string;
}

export const getUserByEmail = async (email: string): Promise<UserPublicInfo> => {
    const response = await axios.get<UserPublicInfo>(`${apiUrl}/user/email/${encodeURIComponent(email)}`);
    return response.data;
};

export const updateUserProfile = async (
    token: string,
    profileData: UpdateProfilePayload
): Promise<UpdateProfileResponse> => {
    const response = await axios.put<UpdateProfileResponse>(`${apiUrl}/user/profile`, profileData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
