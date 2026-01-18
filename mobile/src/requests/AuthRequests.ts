import axios from 'axios';
import { AuthResponse } from '../types/auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
};

export const register = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/register`, { email, password });
    return response.data;
};

export const verifyToken = async (token: string): Promise<AuthResponse> => {
    const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
