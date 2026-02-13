export type ErrorVariant = {
    icon: React.ReactNode;
    iconColor: string;
    accentBg: string;
    accentText: string;
}


export const PROJECT_ERROR_CODES = {
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    NOT_FOUND: "NOT_FOUND",
    SERVER_ERROR: "SERVER_ERROR",
    NETWORK_ERROR: "NETWORK_ERROR",
    TIMEOUT: "TIMEOUT",
    UNKNOWN: "UNKNOWN",
} as const;


export type ProjectErrorCode =
    (typeof PROJECT_ERROR_CODES)[keyof typeof PROJECT_ERROR_CODES];


export type ProjectError = {
    code: ProjectErrorCode;
    message: string;
    detail?: string;
    httpStatus?: number;
}

/**
 * Custom error class that wraps `ProjectError` so it can be thrown &
 * caught like a normal `Error` while preserving structured metadata.
 */
export class ApiError extends Error {
    public readonly code: ProjectErrorCode;
    public readonly detail?: string;
    public readonly httpStatus?: number;

    constructor(info: ProjectError) {
        super(info.message);
        this.name = "ApiError";
        this.code = info.code;
        this.detail = info.detail;
        this.httpStatus = info.httpStatus;
    }

    /** Convenience getter that returns the structured object. */
    toProjectError(): ProjectError {
        return {
            code: this.code,
            message: this.message,
            detail: this.detail,
            httpStatus: this.httpStatus,
        };
    }
}
