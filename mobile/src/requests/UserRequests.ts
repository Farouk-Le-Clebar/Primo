import axios from 'axios';
import { CheckEmailResponse } from '../types/auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const checkUserByMail = async (email: string): Promise<CheckEmailResponse> => {
    const response = await axios.post(`${API_URL}/user/check-email`, { email });
    return response.data;
};
