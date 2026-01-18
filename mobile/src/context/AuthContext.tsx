import React, { createContext, useState, useContext, useEffect, useCallback, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/auth';
import { verifyToken } from '../requests/AuthRequests';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    token: string | null;
    setAuthData: (user: User, token: string) => void;
    logout: () => Promise<void>;
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
                    const verifiedData = await verifyToken(storedToken);
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

    const setAuthData = useCallback((newUser: User, newToken: string) => {
        setUser(newUser);
        setToken(newToken);
    }, []);

    const logout = useCallback(async () => {
        await AsyncStorage.multiRemove(['token', 'user']);
        setUser(null);
        setToken(null);
    }, []);

    const value = useMemo(() => ({
        isAuthenticated,
        isLoading,
        user,
        token,
        setAuthData,
        logout,
    }), [isAuthenticated, isLoading, user, token, setAuthData, logout]);

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
