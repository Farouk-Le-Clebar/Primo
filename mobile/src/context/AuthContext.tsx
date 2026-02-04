import React, { createContext, useState, useContext, useEffect, useCallback, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthResponse } from '../types/auth';
import { verifyToken } from '../requests/AuthRequests';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    token: string | null;
    handleAuthSuccess: (data: AuthResponse) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const isAuthenticated = !!token && !!user;

    useEffect(() => {
        const loadStoredAuth = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                const storedUser = await AsyncStorage.getItem('user');

                if (storedToken && storedUser) {
                    const verifiedData = await verifyToken();
                    setToken(storedToken);
                    setUser(verifiedData.user);
                }
            } catch {
                await AsyncStorage.multiRemove(['token', 'user']);
            } finally {
                setIsLoading(false);
            }
        };
        loadStoredAuth();
    }, []);

    const handleAuthSuccess = useCallback(async (data: AuthResponse) => {
        await AsyncStorage.setItem('token', data.access_token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setToken(data.access_token);
    }, []);

    const logout = useCallback(async () => {
        await AsyncStorage.multiRemove(['token', 'user']);
        setUser(null);
        setToken(null);
    }, []);

    const updateUser = useCallback(async (updatedUser: User) => {
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    }, []);

    const value = useMemo(() => ({
        isAuthenticated,
        isLoading,
        user,
        token,
        handleAuthSuccess,
        logout,
        updateUser,
    }), [isAuthenticated, isLoading, user, token, handleAuthSuccess, logout, updateUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
