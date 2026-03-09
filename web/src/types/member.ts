export type MemberRole = "owner" | "admin" | "editor" | "viewer";
export type MemberStatus = "pending" | "accepted" | "declined";

export interface MemberResponse {
    id: string;
    projectId: string;
    userId: string;
    email: string;
    firstName: string;
    surName: string;
    profilePicture: string | null;
    role: MemberRole;
    status: MemberStatus;
    invitedBy: string | null;
    invitedAt: string;
    acceptedAt: string | null;
}