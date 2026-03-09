import { useMemo } from "react";
import { useMembers } from "./useProjectMembers";
import type { MemberRole } from "../types/member";

/**
 * Détermine le rôle de l'utilisateur courant sur un projet donné.
 *
 * - Si l'utilisateur est le propriétaire du projet (project.userId === currentUserId) → "owner"
 * - Sinon, cherche dans la liste des membres → rôle trouvé ou null
 *
 * Retourne { role, canEdit, canManageMembers, isLoading }
 */
export function useCurrentMemberRole(
    projectId?: string,
    projectOwnerId?: string,
) {
    const currentUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "{}");
        } catch {
            return {};
        }
    }, []);

    const { members, isLoading } = useMembers(projectId);

    const role: MemberRole | null = useMemo(() => {
        if (!currentUser.id) return null;

        // Le propriétaire du projet est toujours "owner"
        if (projectOwnerId && currentUser.id === projectOwnerId) {
            return "owner";
        }

        // Chercher dans la liste des membres
        const membership = members.find((m) => m.userId === currentUser.id);
        return membership?.role ?? null;
    }, [currentUser.id, projectOwnerId, members]);

    return {
        role,
        currentUserId: currentUser.id as string | undefined,
        isLoading,
        /** owner / admin / editor peuvent modifier (notes, paramètres, etc.) */
        canEdit: role === "owner" || role === "admin" || role === "editor",
        /** owner / admin peuvent inviter, changer les rôles, supprimer des membres */
        canManageMembers: role === "owner" || role === "admin",
    };
}
