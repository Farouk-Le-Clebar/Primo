import React, { useState } from "react";
import { Users, Search, ChevronsUpDown, Plus } from "lucide-react";
import toast from "react-hot-toast";
import {
    useMembers,
    useUpdateMemberRole,
    useRemoveMember,
    useInviteMember,
    useMemberSearch,
    useMemberSort,
    useProcessedMembers,
} from "../../../../../hooks/useProjectMembers";
import { useCurrentMemberRole } from "../../../../../hooks/useCurrentMemberRole";
import type {
    MemberRole,
    MemberSortKey,
    MemberSortConfig,
} from "../../../../../types/member";
import MemberRow from "./MemberRow";
import InviteMemberModal from "./InviteMemberModal";

type MembersTabProps = {
    projectId?: string;
    projectOwnerId?: string;
};

const SortIcon: React.FC<{
    columnKey: MemberSortKey;
    sortConfig: MemberSortConfig;
}> = ({ columnKey, sortConfig }) => {
    if (sortConfig.key !== columnKey)
        return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />;
    return sortConfig.direction === "asc" ? (
        <ChevronsUpDown className="w-3.5 h-3.5 text-gray-600" />
    ) : (
        <ChevronsUpDown className="w-3.5 h-3.5 text-gray-600" />
    );
};

const SkeletonRow: React.FC = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="space-y-1.5">
                    <div className="h-3.5 w-28 bg-gray-200 rounded" />
                    <div className="h-3 w-36 bg-gray-200 rounded" />
                </div>
            </div>
        </td>
        <td className="px-6 py-4">
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </td>
        <td className="px-6 py-4">
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
        </td>
        <td className="px-6 py-4">
            <div className="flex justify-center">
                <div className="h-3.5 w-24 bg-gray-200 rounded" />
            </div>
        </td>
        <td className="px-6 py-4">
            <div className="h-6 w-16 bg-gray-200 rounded" />
        </td>
    </tr>
);

const MembersTab: React.FC<MembersTabProps> = ({
    projectId,
    projectOwnerId,
}) => {
    const { members, isLoading, error } = useMembers(projectId);
    const updateRole = useUpdateMemberRole(projectId);
    const removeMember = useRemoveMember(projectId);
    const invite = useInviteMember(projectId);
    const { canInvite, canManageMembers, currentUserId } = useCurrentMemberRole(
        projectId,
        projectOwnerId,
    );

    const { searchTerm, setSearchTerm, debouncedSearchTerm } =
        useMemberSearch();
    const { sortConfig, handleSort } = useMemberSort();
    const processedMembers = useProcessedMembers(
        members,
        debouncedSearchTerm,
        sortConfig,
    );

    const [isInviteOpen, setIsInviteOpen] = useState(false);

    const handleRoleChange = (memberId: string, role: MemberRole) => {
        updateRole.mutate({ memberId, role });
    };

    const handleRemove = (memberId: string) => {
        removeMember.mutate(memberId);
    };

    const handleInvite = (email: string, role?: MemberRole) => {
        invite.mutate(
            { email, role },
            { onSuccess: () => setIsInviteOpen(false) },
        );
    };

    const handleInviteClick = () => {
        console.log(
            "Invite click - canInvite:",
            canInvite,
            "currentUserId:",
            currentUserId,
        );
        if (!canInvite) {
            toast.error(
                "Vous n'avez pas les droits nécessaires pour inviter un membre",
            );
            return;
        }
        setIsInviteOpen(true);
    };

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <Users className="w-10 h-10 text-red-300 mx-auto mb-3" />
                    <p className="text-sm text-red-600">
                        Erreur lors du chargement des membres
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-gray-700">
                        Membres du projet
                    </h2>
                    {!isLoading && (
                        <span className="text-xs text-gray-400 font-medium">
                            ({processedMembers.length})
                        </span>
                    )}
                </div>

                {/* Search + Invite */}
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 pr-2.5 py-1.5 text-xs w-40 focus:w-50 border border-gray-300 rounded-[10px] focus:outline-none transition-[width] duration-300 ease-in-out"
                        />
                    </div>
                    <button
                        onClick={handleInviteClick}
                        className="flex items-center px-1.5 py-1.5 bg-[#388160] rounded-lg hover:bg-[#2d664c] text-white transition-colors cursor-pointer group"
                    >
                        <Plus className="w-4 h-4 transition-transform group-hover:rotate-10" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-lg">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="py-3 text-left w-full">
                                <button
                                    onClick={() => handleSort("name")}
                                    className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                >
                                    Membre
                                    <SortIcon
                                        columnKey="name"
                                        sortConfig={sortConfig}
                                    />
                                </button>
                            </th>
                            <th className="px-8 py-3 text-center whitespace-nowrap">
                                <button
                                    onClick={() => handleSort("role")}
                                    className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors mx-auto"
                                >
                                    Rôle
                                    <SortIcon
                                        columnKey="role"
                                        sortConfig={sortConfig}
                                    />
                                </button>
                            </th>
                            <th className="px-8 py-3 text-center whitespace-nowrap">
                                <button
                                    onClick={() => handleSort("status")}
                                    className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors mx-auto"
                                >
                                    Statut
                                    <SortIcon
                                        columnKey="status"
                                        sortConfig={sortConfig}
                                    />
                                </button>
                            </th>
                            <th className="px-8 py-3 text-center whitespace-nowrap">
                                <button
                                    onClick={() => handleSort("joinedAt")}
                                    className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors mx-auto"
                                >
                                    Rejoint le
                                    <SortIcon
                                        columnKey="joinedAt"
                                        sortConfig={sortConfig}
                                    />
                                </button>
                            </th>
                            <th className="px-8 py-3 text-center whitespace-nowrap">
                                <span className="text-sm font-medium text-gray-700">
                                    Actions
                                </span>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {isLoading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                  <SkeletonRow key={i} />
                              ))
                            : processedMembers.map((member) => (
                                  <MemberRow
                                      key={member.id}
                                      member={member}
                                      onRoleChange={handleRoleChange}
                                      onRemove={handleRemove}
                                      canManageMembers={canManageMembers}
                                      currentUserId={currentUserId}
                                  />
                              ))}
                    </tbody>
                </table>

                {/* Empty state */}
                {!isLoading && processedMembers.length === 0 && (
                    <div className="py-12 text-center text-gray-500 font-normal">
                        <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        {members.length === 0 ? (
                            <>
                                <p className="text-sm">
                                    Aucun membre dans ce projet
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Invitez des collaborateurs pour commencer
                                </p>
                            </>
                        ) : (
                            <p className="text-sm">
                                Aucun membre ne correspond à la recherche
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Invite modal */}
            <InviteMemberModal
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                onInvite={handleInvite}
                isLoading={invite.isPending}
            />
        </div>
    );
};

export default MembersTab;
