import api from '../services/api';
import { AuthResponse, CheckEmailResponse } from '../types/auth';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
};

export const register = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', { email, password });
    return response.data;
};

export const verifyToken = async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/auth/verify');
    return response.data;
};

export const checkUserByMail = async (email: string): Promise<CheckEmailResponse> => {
    const response = await api.post<CheckEmailResponse>('/user/check-email', { email });
    return response.data;
};
