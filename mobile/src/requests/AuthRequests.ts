import axios from 'axios';
import { AuthResponse, CheckEmailResponse } from '../types/auth';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(apiUrl + '/auth/login', { email, password });
    return response.data;
};

export const register = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(apiUrl + '/auth/register', { email, password });
    return response.data;
};

export const verifyToken = async (token: string): Promise<AuthResponse> => {
    const response = await axios.get<AuthResponse>(apiUrl + '/auth/verify', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const checkUserByMail = async (email: string): Promise<CheckEmailResponse> => {
    const response = await axios.post<CheckEmailResponse>(apiUrl + '/user/check-email', { email });
    return response.data;
};
