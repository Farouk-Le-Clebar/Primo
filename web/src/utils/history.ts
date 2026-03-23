import React from "react";
import type { ActivityEventResponse, EventStyle } from "../types/project/projectHistory";
import { ActivityEventType } from "../types/project/projectHistory";
import {
    History,
    FilePen,
    FileText,
    UserPlus,
    UserCheck,
    UserX,
    UserCog,
    UserMinus,
    Sparkles,
} from "lucide-react";

export const absoluteFormatter = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

export function formatAbsolute(iso: string): string {
    return absoluteFormatter.format(new Date(iso));
}

export function formatRelative(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "À l'instant";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Il y a ${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `Il y a ${diffD}j`;
    const diffW = Math.floor(diffD / 7);
    if (diffW < 5) return `Il y a ${diffW} sem.`;
    const diffMo = Math.floor(diffD / 30);
    if (diffMo < 12) return `Il y a ${diffMo} mois`;
    const diffY = Math.floor(diffD / 365);
    return `Il y a ${diffY} an${diffY > 1 ? "s" : ""}`;
}

const B = ({ children }: { children: React.ReactNode }) =>
    React.createElement(
        "strong",
        { className: "font-semibold text-gray-800" },
        children,
    );

export function getEventLabel(
    eventType: ActivityEventType,
    payload: ActivityEventResponse["payload"],
    actorDisplayName: string,
): React.ReactNode {
    const actor = actorDisplayName || "Quelqu'un";
    const p = payload as Record<string, string>;

    switch (eventType) {
        case ActivityEventType.PROJECT_CREATED:
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(B, null, actor),
                " a créé le projet",
            );

        case ActivityEventType.PROJECT_UPDATED:
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(B, null, actor),
                " a modifié le projet",
                p.changedFields ? ` (${p.changedFields})` : "",
            );

        case ActivityEventType.PROJECT_NOTES_UPDATED:
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(B, null, actor),
                " a mis à jour les notes",
            );

        case ActivityEventType.MEMBER_INVITED:
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(B, null, actor),
                " a invité ",
                React.createElement(B, null, p.invitedEmail),
                " en tant que ",
                p.role,
            );

        case ActivityEventType.MEMBER_ACCEPTED:
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(B, null, actor),
                " a rejoint le projet",
            );

        case ActivityEventType.MEMBER_DECLINED:
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(B, null, actor),
                " a décliné l'invitation",
            );

        case ActivityEventType.MEMBER_ROLE_UPDATED:
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(B, null, actor),
                " a changé le rôle de ",
                React.createElement(B, null, p.targetDisplayName),
                ` : ${p.previousRole} → ${p.newRole}`,
            );

        case ActivityEventType.MEMBER_REMOVED:
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(B, null, actor),
                " a retiré ",
                React.createElement(B, null, p.removedDisplayName),
                " du projet",
            );

        default:
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(B, null, actor),
                " a effectué une action",
            );
    }
}


export function getEventStyle(eventType: ActivityEventType): EventStyle {
    const size = "w-3.5 h-3.5";
    switch (eventType) {
        case ActivityEventType.PROJECT_CREATED:
            return {
                icon: React.createElement(Sparkles, { className: size }),
                bg: "bg-gray-50 group-hover:bg-green-50",
                color: "text-gray-400 group-hover:text-[#388160]",
            };
        case ActivityEventType.PROJECT_UPDATED:
            return {
                icon: React.createElement(FilePen, { className: size }),
                bg: "bg-gray-50 group-hover:bg-blue-50",
                color: "text-gray-400 group-hover:text-blue-500",
            };
        case ActivityEventType.PROJECT_NOTES_UPDATED:
            return {
                icon: React.createElement(FileText, { className: size }),
                bg: "bg-gray-50 group-hover:bg-sky-50",
                color: "text-gray-400 group-hover:text-sky-500",
            };
        case ActivityEventType.MEMBER_INVITED:
            return {
                icon: React.createElement(UserPlus, { className: size }),
                bg: "bg-gray-50 group-hover:bg-violet-50",
                color: "text-gray-400 group-hover:text-violet-500",
            };
        case ActivityEventType.MEMBER_ACCEPTED:
            return {
                icon: React.createElement(UserCheck, { className: size }),
                bg: "bg-gray-50 group-hover:bg-emerald-50",
                color: "text-gray-400 group-hover:text-emerald-500",
            };
        case ActivityEventType.MEMBER_DECLINED:
            return {
                icon: React.createElement(UserX, { className: size }),
                bg: "bg-gray-50 group-hover:bg-red-50",
                color: "text-gray-400 group-hover:text-red-400",
            };
        case ActivityEventType.MEMBER_ROLE_UPDATED:
            return {
                icon: React.createElement(UserCog, { className: size }),
                bg: "bg-gray-50 group-hover:bg-amber-50",
                color: "text-gray-400 group-hover:text-amber-500",
            };
        case ActivityEventType.MEMBER_REMOVED:
            return {
                icon: React.createElement(UserMinus, { className: size }),
                bg: "bg-gray-50 group-hover:bg-orange-50",
                color: "text-gray-400 group-hover:text-orange-400",
            };
        default:
            return {
                icon: React.createElement(History, { className: size }),
                bg: "bg-gray-50",
                color: "text-gray-400",
            };
    }
}
