export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePhoto?: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface CheckEmailResponse {
    exists: boolean;
}
