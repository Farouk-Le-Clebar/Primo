import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    user: { email?: string } | null;
    login: (email?: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ email?: string } | null>(null);

    const login = useCallback((email?: string) => {
        setIsAuthenticated(true);
        if (email) setUser({ email });
    }, []);

    const logout = useCallback(() => {
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    const value = useMemo(() => ({
        isAuthenticated,
        user,
        login,
        logout
    }), [isAuthenticated, user, login, logout]);

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
