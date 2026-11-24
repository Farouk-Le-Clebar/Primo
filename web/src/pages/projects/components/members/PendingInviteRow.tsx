import { Loader2, Mail } from "lucide-react";
import type { ProjectMember } from "../../../../types/project/members";
import Avatar from "../ui/Avatar";
import Tag from "../ui/Tag";

type PendingInviteRowProps = {
  member: ProjectMember;
  canManage: boolean;
  isResending: boolean;
  onResend: () => void;
  onCancel: () => void;
};

export default function PendingInviteRow({ member, canManage, isResending, onResend, onCancel }: PendingInviteRowProps) {
  const email = member.user?.email ?? "Invitation";
  const inviter = member.invite?.inviterName;

  return (
    <div className="animate-rise-in flex items-center gap-3 px-2 py-3">
      <Avatar name={email.replace(/[@.]/g, " ")} size="md" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{email}</p>
          <Tag tone="pink" size="sm">En attente</Tag>
        </div>
        <p className="text-xs text-[#82828c]">{inviter ? `Invitée par ${inviter}` : "Invitation envoyée"} · Éditeur</p>
      </div>
      {canManage && (
        <>
          <button
            onClick={onResend}
            disabled={isResending}
            className="group flex items-center gap-1.5 rounded-lg border border-[#1c1c1e]/14 px-3.5 py-2 text-[13px] font-semibold text-[#1c1c1e] transition-colors hover:bg-[#1c1c1e]/4 disabled:opacity-60 dark:border-white/16 dark:text-[#fafafa] dark:hover:bg-white/6"
          >
            {isResending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5 transition-transform group-hover:-rotate-12" />}
            Relancer
          </button>
          <button onClick={onCancel} className="px-1 text-xs font-semibold text-red-500 transition-opacity hover:opacity-70">
            Annuler
          </button>
        </>
      )}
    </div>
  );
}
