import type { MemberResponse, MemberSortConfig } from "../types/member";

const ROLE_ORDER: Record<string, number> = {
    owner: 0,
    admin: 1,
    "co-admin": 2,
    editor: 3,
    viewer: 4,
};

const STATUS_ORDER: Record<string, number> = {
    accepted: 0,
    pending: 1,
    declined: 2,
};

export const getMemberDisplayName = (member: MemberResponse): string =>
    member.firstName || member.surName
        ? `${member.firstName ?? ""} ${member.surName ?? ""}`.trim()
        : member.email;

export const filterMembersBySearch = (
    members: MemberResponse[],
    searchTerm: string,
): MemberResponse[] => {
    if (!searchTerm.trim()) return members;
    const lower = searchTerm.toLowerCase();
    return members.filter((m) => {
        const name = getMemberDisplayName(m).toLowerCase();
        return name.includes(lower) || m.email.toLowerCase().includes(lower);
    });
};

export const sortMembers = (
    members: MemberResponse[],
    sortConfig: MemberSortConfig,
): MemberResponse[] => {
    if (!sortConfig.key) return members;

    return [...members].sort((a, b) => {
        let cmp = 0;

        switch (sortConfig.key) {
            case "name": {
                const nameA = getMemberDisplayName(a).toLowerCase();
                const nameB = getMemberDisplayName(b).toLowerCase();
                cmp = nameA.localeCompare(nameB, "fr");
                break;
            }
            case "role": {
                cmp = (ROLE_ORDER[a.role] ?? 99) - (ROLE_ORDER[b.role] ?? 99);
                break;
            }
            case "status": {
                cmp =
                    (STATUS_ORDER[a.status] ?? 99) -
                    (STATUS_ORDER[b.status] ?? 99);
                break;
            }
            case "joinedAt": {
                const dateA = new Date(a.acceptedAt ?? a.invitedAt).getTime();
                const dateB = new Date(b.acceptedAt ?? b.invitedAt).getTime();
                cmp = dateA - dateB;
                break;
            }
        }

        return sortConfig.direction === "asc" ? cmp : -cmp;
    });
};

export const processMembers = (
    members: MemberResponse[],
    searchTerm: string,
    sortConfig: MemberSortConfig,
): MemberResponse[] => {
    const filtered = filterMembersBySearch(members, searchTerm);
    return sortMembers(filtered, sortConfig);
};
