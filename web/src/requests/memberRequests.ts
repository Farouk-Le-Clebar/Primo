import axios from "axios";
import { getAuthHeaders } from "../utils/auth";
import type { MemberRole, MemberResponse } from "../types/member";


const apiUrl = window?._env_?.API_URL;


export function getProjectMembers(
    projectId: string,
): Promise<MemberResponse[]> {
    return axios
        .get(`${apiUrl}/projects/${projectId}/members`, {
            headers: getAuthHeaders(),
        })
        .then((res) => res.data);
}

export function inviteMember(
    projectId: string,
    email: string,
    role?: MemberRole,
): Promise<MemberResponse> {
    return axios
        .post(
            `${apiUrl}/projects/${projectId}/members/invite`,
            { email, ...(role && { role }) },
            { headers: getAuthHeaders() },
        )
        .then((res) => res.data);
}

export function updateMemberRole(
    projectId: string,
    memberId: string,
    role: MemberRole,
): Promise<MemberResponse> {
    return axios
        .patch(
            `${apiUrl}/projects/${projectId}/members/${memberId}/role`,
            { role },
            { headers: getAuthHeaders() },
        )
        .then((res) => res.data);
}

export function removeMember(
    projectId: string,
    memberId: string,
): Promise<void> {
    return axios
        .delete(`${apiUrl}/projects/${projectId}/members/${memberId}`, {
            headers: getAuthHeaders(),
        })
        .then(() => undefined);
}

export function respondToInvitation(
    projectId: string,
    memberId: string,
    accept: boolean,
): Promise<MemberResponse> {
    return axios
        .patch(
            `${apiUrl}/projects/${projectId}/members/${memberId}/respond`,
            { accept },
            { headers: getAuthHeaders() },
        )
        .then((res) => res.data);
}
