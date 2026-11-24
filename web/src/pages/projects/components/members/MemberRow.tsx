import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import type { ProjectMember } from "../../../../types/project/members";
import { formatRelativeTime } from "../../../../utils/relativeTime";
import { useOutsideClick } from "../../../../hooks/useOutsideClick";
import Avatar from "../ui/Avatar";
import Tag from "../ui/Tag";
import { memberName } from "./useMembers";

type MemberRowProps = { member: ProjectMember; index: number; canManage: boolean; onRemove: () => void };

const ONLINE_MS = 5 * 60_000;
const RECENT_JOIN_MS = 7 * 86_400_000;
const CELL = "flex h-6 shrink-0 items-center";

const roleLabel = (member: ProjectMember): string => (member.isAdmin ? "Propriétaire" : "Éditeur");

export default function MemberRow({ member, index, canManage, onRemove }: MemberRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useOutsideClick(() => setMenuOpen(false));
  const name = memberName(member);
  const lastSeen = member.user?.lastConnection;
  const isOnline = member.isCurrentUser || (!!lastSeen && Date.now() - new Date(lastSeen).getTime() < ONLINE_MS);
  const joinedRecently = !!member.joinedAt && !member.isAdmin && Date.now() - new Date(member.joinedAt).getTime() < RECENT_JOIN_MS;

  return (
    <div style={{ animationDelay: `${index * 40}ms` }} className={`animate-rise-in group flex items-center gap-3 rounded-lg px-2 py-3 transition-colors ${joinedRecently ? "bg-emerald-500/5" : "hover:bg-[#1c1c1e]/[0.025] dark:hover:bg-white/[0.03]"}`}>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110">
          <Avatar name={name} size="md" />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{name}</p>
            {joinedRecently && <Tag tone="emerald">A rejoint {formatRelativeTime(member.joinedAt!).toLowerCase()}</Tag>}
          </div>
          <p className="truncate text-xs text-[#82828c]">{member.user?.email}</p>
        </div>
      </div>
      <span className={`${CELL} w-[140px]`}>
        <span className="rounded-[7px] border border-[#1c1c1e]/13 px-2.5 py-[5px] text-xs font-semibold text-[#52525b] dark:border-white/14 dark:text-[#d4d4d8]">{roleLabel(member)}</span>
      </span>
      <span className={`${CELL} w-[160px] gap-1.5 text-[13px] font-medium text-[#52525b] dark:text-[#d4d4d8]`}>
        <span className={`h-[7px] w-[7px] rounded-full ${isOnline ? "animate-pulse bg-emerald-500" : "bg-[#82828c]"}`} />
        {isOnline ? "En ligne" : lastSeen ? formatRelativeTime(lastSeen) : "—"}
      </span>
      <span className={`${CELL} w-[160px] text-[13px] font-medium text-[#52525b] dark:text-[#d4d4d8]`}>
        {member.contributions} action{member.contributions > 1 ? "s" : ""}
      </span>
      <div ref={menuRef} className={`${CELL} relative w-[30px]`}>
        {canManage && !member.isCurrentUser && (
          <button onClick={() => setMenuOpen((open) => !open)} aria-label="Actions" className="rounded-md p-1 text-[#82828c] transition-colors hover:bg-[#1c1c1e]/6 hover:text-[#1c1c1e] dark:hover:bg-white/8 dark:hover:text-white">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        )}
        {menuOpen && (
          <div className="animate-fade-in absolute right-0 top-7 z-20 w-44 rounded-lg border border-[#1c1c1e]/8 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-[#2c2c2e]">
            <button onClick={onRemove} className="w-full rounded-md px-2.5 py-1.5 text-left text-xs font-semibold text-red-500 hover:bg-red-500/8">
              Retirer du projet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
