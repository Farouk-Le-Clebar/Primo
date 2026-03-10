import React, { useState } from "react";
import { Users, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import {
    useMembers,
    useUpdateMemberRole,
    useRemoveMember,
    useInviteMember,
} from "../../../../../hooks/useProjectMembers";
import { useCurrentMemberRole } from "../../../../../hooks/useCurrentMemberRole";
import type { MemberRole } from "../../../../../types/member";
import MemberRow from "./MemberRow";
import InviteMemberModal from "./InviteMemberModal";

type MembersTabProps = {
    projectId?: string;
    projectOwnerId?: string;
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
                        Membres
                    </h2>
                    {!isLoading && (
                        <span className="text-xs text-gray-400 font-medium">
                            ({members.length})
                        </span>
                    )}
                </div>

                <button
                    onClick={handleInviteClick}
                    className="flex items-center gap-2 px-3.5 py-1.5  bg-[#388160] rounded-lg hover:bg-[#2d664c] text-white text-[12px] transition-colors border border-transparent relative group cursor-pointer"
                    // style={{
                    //     background: "#fff",
                    //     position: "relative",
                    //     zIndex: 1,
                    // }}
                >
                    <UserPlus className="w-4 h-4 transition-transform group-hover:rotate-6" />
                    <span className="font-semibold">Inviter</span>
                    {/* <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-[7px]"
                        style={{
                            padding: 1,
                            zIndex: -1,
                            background:
                                "linear-gradient(60deg, #E1E1E1 0%, #737373 50%, #E1E1E1 100%)",
                            WebkitMask:
                                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            WebkitMaskComposite: "xor",
                            maskComposite: "exclude",
                        }}
                    /> */}
                </button>
            </div>

            {/* Table */}
            <div className="rounded-lg">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left w-full">
                                <span className="text-sm font-medium text-gray-700">
                                    Membre
                                </span>
                            </th>
                            <th className="px-8 py-3 text-center whitespace-nowrap">
                                <span className="text-sm font-medium text-gray-700">
                                    Rôle
                                </span>
                            </th>
                            <th className="px-8 py-3 text-center whitespace-nowrap">
                                <span className="text-sm font-medium text-gray-700">
                                    Statut
                                </span>
                            </th>
                            <th className="px-8 py-3 text-center whitespace-nowrap">
                                <span className="text-sm font-medium text-gray-700">
                                    Rejoint le
                                </span>
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
                            : members.map((member) => (
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
                {!isLoading && members.length === 0 && (
                    <div className="py-12 text-center text-gray-500 font-normal">
                        <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm">Aucun membre dans ce projet</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Invitez des collaborateurs pour commencer
                        </p>
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
