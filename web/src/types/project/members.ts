export type ProjectMember = {
    id: string;
    isAdmin: boolean;
    role: string;
    isPending: boolean;
    joinedAt: string | null;
    isCurrentUser: boolean;
    contributions: number;
    invite: { inviterName: string | null; expiresAt: string | null } | null;
    user?: {
        firstName: string;
        surName: string;
        email: string;
        profilePicture: string | null;
        lastConnection: string | null;
    };
};
