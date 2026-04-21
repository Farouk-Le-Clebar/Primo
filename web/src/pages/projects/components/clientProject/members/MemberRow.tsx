import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import type { MemberRole, MemberResponse } from "../../../../../types/member";
import { formatDate } from "../../../../../utils/project";
import Avatar from "../../../../../components/avatar/Avatar";
import RoleDropdown from "./RoleDropdown";

type MemberRowProps = {
    member: MemberResponse;
    onRoleChange: (memberId: string, role: MemberRole) => void;
    onRemove: (memberId: string) => void;
    canManageMembers: boolean;
    currentUserId?: string;
};

const STATUS_CONFIG: Record<
    string,
    { label: string; color: string; bg: string }
> = {
    accepted: {
        label: "Accepté",
        color: "text-white",
        bg: "bg-[#388160]",
    },
    pending: {
        label: "En attente",
        color: "text-white",
        bg: "bg-[#F59E0B]/50 hover:bg-[#F59E0B]/70 cursor-default",
    },
    declined: {
        label: "Refusé",
        color: "text-white",
        bg: "bg-[#EF4444]",
    },
};

const MemberRow: React.FC<MemberRowProps> = ({
    member,
    onRoleChange,
    onRemove,
    canManageMembers,
    currentUserId,
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const status = STATUS_CONFIG[member.status] ?? STATUS_CONFIG.pending;
    const isOwner = member.role === "owner";
    const isSelf = currentUserId === member.userId;
    const joinedDate =
        member.status === "pending"
            ? "---"
            : formatDate(member.acceptedAt ?? member.invitedAt);

    const displayName =
        member.firstName || member.surName
            ? `${member.firstName ?? ""} ${member.surName ?? ""}`.trim()
            : member.email;

    return (
        <tr className="hover:bg-gray-50/50 transition-colors">
            {/* Member info */}
            <td className="py-4">
                <div className="flex items-center gap-3">
                    <Avatar
                        profilePicture={member.profilePicture}
                        size="w-8 h-8"
                    />
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                            {displayName}
                        </p>
                        {displayName !== member.email && (
                            <p className="text-xs text-gray-400 truncate max-w-[180px]">
                                {member.email}
                            </p>
                        )}
                    </div>
                </div>
            </td>

            {/* Role */}
            <td className="px-18 py-4 whitespace-nowrap">
                <div className="flex justify-center">
                    <RoleDropdown
                        currentRole={member.role}
                        onChange={(role) => onRoleChange(member.id, role)}
                        disabled={isOwner || !canManageMembers || isSelf}
                    />
                </div>
            </td>

            {/* Status */}
            <td className="px-18 py-4 whitespace-nowrap">
                <div className="flex justify-center">
                    <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${status.color} ${status.bg}`}
                    >
                        {status.label}
                    </span>
                </div>
            </td>

            {/* Joined date */}
            <td className="px-18 py-4 whitespace-nowrap text-center">
                <span className="text-sm text-gray-600">{joinedDate}</span>
            </td>

            {/* Actions */}
            <td
                className="px-8 py-4 whitespace-nowrap relative"
                style={{ minWidth: 120 }}
            >
                {!isOwner && canManageMembers && !isSelf && (
                    <div className="flex items-center justify-center">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteConfirm(true);
                            }}
                            className="p-1.5 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            aria-label="Retirer le membre"
                        >
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                    </div>
                )}

                {/* delete confirmation */}
                {showDeleteConfirm && (
                    <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-30"
                        style={{ minWidth: 20, maxWidth: 320, height: 64 }}
                    >
                        <div className="bg-[#F9FAFB] py-2 flex flex-col items-start w-full h-full justify-center">
                            <div className="flex gap-2 self-end">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDeleteConfirm(false);
                                    }}
                                    className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors border border-gray-300 cursor-pointer"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDeleteConfirm(false);
                                        onRemove(member.id);
                                    }}
                                    className="px-3 py-1 text-xs bg-red-500 text-white hover:bg-red-600 rounded transition-colors cursor-pointer"
                                >
                                    Retirer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </td>
        </tr>
    );
};

export default MemberRow;
