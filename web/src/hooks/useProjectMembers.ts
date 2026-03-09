import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import {
    getProjectMembers,
    inviteMember,
    updateMemberRole,
    removeMember,
} from "../requests/memberRequests";
import type { MemberResponse, MemberRole } from "../types/member";

function getErrorMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        if (typeof msg === "string") return msg;
        if (Array.isArray(msg)) return msg[0];
    }
    return fallback;
}


export function useMembers(projectId?: string) {
    const {
        data: members = [],
        isLoading,
        error,
    } = useQuery<MemberResponse[]>({
        queryKey: ["project-members", projectId],
        queryFn: () => getProjectMembers(projectId!),
        enabled: !!projectId,
        staleTime: 60_000,
    });

    return { members, isLoading, error };
}


export function useInviteMember(projectId?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ email, role }: { email: string; role?: MemberRole }) =>
            inviteMember(projectId!, email, role),
        onSuccess: () => {
            toast.success("Invitation envoyée avec succès");
            queryClient.invalidateQueries({
                queryKey: ["project-members", projectId],
            });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err, "Erreur lors de l'invitation"));
        },
    });
}


export function useUpdateMemberRole(projectId?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            memberId,
            role,
        }: {
            memberId: string;
            role: MemberRole;
        }) => updateMemberRole(projectId!, memberId, role),

        onMutate: async ({ memberId, role }) => {
            await queryClient.cancelQueries({
                queryKey: ["project-members", projectId],
            });
            const previous = queryClient.getQueryData<MemberResponse[]>([
                "project-members",
                projectId,
            ]);

            queryClient.setQueryData<MemberResponse[]>(
                ["project-members", projectId],
                (old = []) =>
                    old.map((m) => (m.id === memberId ? { ...m, role } : m)),
            );

            return { previous };
        },

        onError: (err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    ["project-members", projectId],
                    context.previous,
                );
            }
            toast.error(
                getErrorMessage(err, "Erreur lors du changement de rôle"),
            );
        },

        onSuccess: () => {
            toast.success("Rôle mis à jour");
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["project-members", projectId],
            });
        },
    });
}


export function useRemoveMember(projectId?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (memberId: string) => removeMember(projectId!, memberId),

        onMutate: async (memberId) => {
            await queryClient.cancelQueries({
                queryKey: ["project-members", projectId],
            });
            const previous = queryClient.getQueryData<MemberResponse[]>([
                "project-members",
                projectId,
            ]);

            queryClient.setQueryData<MemberResponse[]>(
                ["project-members", projectId],
                (old = []) => old.filter((m) => m.id !== memberId),
            );

            return { previous };
        },

        onError: (err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    ["project-members", projectId],
                    context.previous,
                );
            }
            toast.error(
                getErrorMessage(err, "Erreur lors de la suppression du membre"),
            );
        },

        onSuccess: () => {
            toast.success("Membre retiré du projet");
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["project-members", projectId],
            });
        },
    });
}
