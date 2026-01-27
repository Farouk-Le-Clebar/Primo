import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import Snackbar from '../components/ui/Snackbar';
import { IconName } from '../types/icons';

type SnackbarType = 'info' | 'success' | 'warning' | 'error';

interface SnackbarOptions {
    duration?: number;
    icon?: IconName;
    type?: SnackbarType;
}

interface SnackbarContextType {
    showSnackbar: (message: string, options?: SnackbarOptions) => void;
    showComingSoon: (feature: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

interface SnackbarProviderProps {
    children: ReactNode;
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [options, setOptions] = useState<SnackbarOptions>({});

    const showSnackbar = useCallback((msg: string, opts: SnackbarOptions = {}) => {
        setMessage(msg);
        setOptions(opts);
        setVisible(true);
    }, []);

    const showComingSoon = useCallback((feature: string) => {
        showSnackbar(`🚧 "${feature}" arrive bientôt !`, { type: 'info', duration: 2500 });
    }, [showSnackbar]);

    const handleDismiss = useCallback(() => {
        setVisible(false);
    }, []);

    const contextValue = useMemo(() => ({
        showSnackbar,
        showComingSoon,
    }), [showSnackbar, showComingSoon]);

    return (
        <SnackbarContext.Provider value={contextValue}>
            {children}
            <Snackbar
                message={message}
                visible={visible}
                onDismiss={handleDismiss}
                duration={options.duration}
                icon={options.icon}
                type={options.type}
            />
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = (): SnackbarContextType => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};
