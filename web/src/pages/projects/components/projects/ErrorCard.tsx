import React from "react";
import {
    LogIn,
    ShieldOff,
    ServerCrash,
    WifiOff,
    Clock,
    SearchX,
    AlertTriangle,
    RefreshCw,
} from "lucide-react";
import type {
    ProjectError,
    ProjectErrorCode,
    ErrorVariant,
} from "../../../../types/projectError";
import { PROJECT_ERROR_CODES } from "../../../../types/projectError";


type ErrorCardProps = {
    error: ProjectError;
    onRetry?: () => void;
    onLogin?: () => void;
    className?: string;
};


const ERROR_VARIANTS: Record<ProjectErrorCode, ErrorVariant> = {
    [PROJECT_ERROR_CODES.UNAUTHORIZED]: {
        icon: <LogIn className="w-6 h-6" />,
        iconColor: "text-[#388160]",
        accentBg: "bg-[#388160]/7",
        accentText: "text-[#388160]",
    },
    [PROJECT_ERROR_CODES.FORBIDDEN]: {
        icon: <ShieldOff className="w-6 h-6" />,
        iconColor: "text-red-500",
        accentBg: "bg-red-50",
        accentText: "text-red-700",
    },
    [PROJECT_ERROR_CODES.NOT_FOUND]: {
        icon: <SearchX className="w-6 h-6" />,
        iconColor: "text-gray-500",
        accentBg: "bg-gray-100",
        accentText: "text-gray-600",
    },
    [PROJECT_ERROR_CODES.SERVER_ERROR]: {
        icon: <ServerCrash className="w-6 h-6" />,
        iconColor: "text-red-500",
        accentBg: "bg-red-50",
        accentText: "text-red-600",
    },
    [PROJECT_ERROR_CODES.NETWORK_ERROR]: {
        icon: <WifiOff className="w-6 h-6" />,
        iconColor: "text-orange-500",
        accentBg: "bg-orange-50",
        accentText: "text-orange-700",
    },
    [PROJECT_ERROR_CODES.TIMEOUT]: {
        icon: <Clock className="w-6 h-6" />,
        iconColor: "text-yellow-600",
        accentBg: "bg-yellow-50",
        accentText: "text-yellow-700",
    },
    [PROJECT_ERROR_CODES.UNKNOWN]: {
        icon: <AlertTriangle className="w-6 h-6" />,
        iconColor: "text-gray-500",
        accentBg: "bg-gray-100",
        accentText: "text-gray-600",
    },
};


const ErrorCard: React.FC<ErrorCardProps> = ({
    error,
    onRetry,
    onLogin,
    className,
}) => {
    const variant = ERROR_VARIANTS[error.code] ?? ERROR_VARIANTS.UNKNOWN;

    const RETRYABLE_CODES: readonly ProjectErrorCode[] = [
        PROJECT_ERROR_CODES.SERVER_ERROR,
        PROJECT_ERROR_CODES.NETWORK_ERROR,
        PROJECT_ERROR_CODES.TIMEOUT,
        PROJECT_ERROR_CODES.UNKNOWN,
    ] as const;

    const showRetry = onRetry && RETRYABLE_CODES.includes(error.code);

    const showLogin =
        onLogin && error.code === PROJECT_ERROR_CODES.UNAUTHORIZED;

    return (
        <div
            className={`max-w-md mx-auto mt-20 bg-white rounded-2xl border border-gray-200 p-7 ${className ?? ""}`}
        >
            {/* Header */}
            <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${variant.iconColor}`}>
                    {variant.icon}
                </div>
                <div className="text-gray-900 font-semibold text-lg leading-snug">
                    {error.message}
                </div>
            </div>

            {/* Detail block */}
            {error.detail && (
                <div
                    className={`mt-5 rounded-lg px-4 py-3 text-sm ${variant.accentBg} ${variant.accentText}`}
                >
                    {error.detail}
                </div>
            )}

            {/* Action buttons */}
            {(showRetry || showLogin) && (
                <div className="mt-5 flex items-center gap-3">
                    {showRetry && (
                        <button
                            onClick={onRetry}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Réessayer
                        </button>
                    )}
                    {showLogin && (
                        <button
                            onClick={onLogin}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#388160] hover:bg-[#2d664c] rounded-lg transition-colors cursor-pointer"
                        >
                            <LogIn className="w-4 h-4" />
                            Se connecter
                        </button>
                    )}
                </div>
            )}

            {/* HTTP status hint (subtle, for power users) */}
            {error.httpStatus && (
                <p className="mt-4 text-xs text-gray-400">
                    Code HTTP {error.httpStatus}
                </p>
            )}
        </div>
    );
};

export default ErrorCard;
