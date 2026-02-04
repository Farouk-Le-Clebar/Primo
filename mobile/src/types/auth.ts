export interface User {
    id: string;
    firstName: string;
    surName: string;
    email: string;
    profilePicture?: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface CheckEmailResponse {
    exists: boolean;
}

export interface UpdateProfilePayload {
    firstName?: string;
    surName?: string;
    profilePicture?: string;
}

export interface UpdateProfileResponse {
    user: User;
}
