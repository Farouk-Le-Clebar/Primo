import { useState } from "react";
import { useParams } from "react-router-dom";
import { UsersRound } from "lucide-react";
import EmptyState from "../../../../ui/EmptyState";
import InviteMembersModal from "../InviteMembersModal";
import SectionCard from "../ui/SectionCard";
import MemberRow from "./MemberRow";
import MembersSidebar from "./MembersSidebar";
import PendingInviteRow from "./PendingInviteRow";
import { useMembers } from "./useMembers";

const HEAD = "text-[11px] font-semibold text-[#82828c]";

export default function MembersTab() {
  const { projectId } = useParams<{ projectId: string }>();
  const { active, pending, isPending, canManage, invite, remove } = useMembers(projectId);
  const [inviting, setInviting] = useState(false);
  const isAlone = active.length <= 1 && pending.length === 0;
  const subtitle = [`${active.length} membre${active.length > 1 ? "s" : ""}`, pending.length ? `${pending.length} invitation${pending.length > 1 ? "s" : ""} en attente` : null].filter(Boolean).join(" · ");

  const handleInvite = (email: string, onDone: () => void) => invite.mutate(email, { onSuccess: onDone });

  if (isPending) return <div className="primo-card h-[390px] animate-pulse motion-reduce:animate-none" />;

  return (
    <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_440px]">
      <SectionCard title="Membres du projet" subtitle={subtitle}>
        <div className="overflow-x-auto">
        <div className="min-w-[680px]">
        <div className="mt-1 flex gap-3 px-2 py-2.5">
          <span className={`flex-1 ${HEAD}`}>Membre</span>
          <span className={`w-[140px] ${HEAD}`}>Rôle</span>
          <span className={`w-[160px] ${HEAD}`}>Dernière activité</span>
          <span className={`w-[160px] ${HEAD}`}>Contributions</span>
          <span className="w-[30px]" />
        </div>
        <div className="flex flex-col divide-y divide-[#1c1c1e]/8 border-t border-[#1c1c1e]/8 dark:divide-white/8 dark:border-white/8">
          {active.map((member, index) => (
            <MemberRow key={member.id} member={member} index={index} canManage={canManage} onRemove={() => remove.mutate(member.id)} />
          ))}
          {pending.map((member) => (
            <PendingInviteRow
              key={member.id}
              member={member}
              canManage={canManage}
              isResending={invite.isPending && invite.variables === member.user?.email}
              onResend={() => member.user?.email && invite.mutate(member.user.email)}
              onCancel={() => remove.mutate(member.id)}
            />
          ))}
        </div>
        </div>
        </div>
        {isAlone && (
          <div className="mt-3">
            <EmptyState icon={UsersRound} title="Vous êtes seul sur ce projet" description="Invitez un collègue, un notaire ou un client : chacun verra les nouveautés dès sa connexion." action={{ label: "Inviter un membre", onClick: () => setInviting(true) }} size="sm" />
          </div>
        )}
      </SectionCard>
      <MembersSidebar members={active} isInviting={invite.isPending} onInvite={handleInvite} />
      {inviting && projectId && <InviteMembersModal projectId={projectId} onClose={() => setInviting(false)} />}
    </div>
  );
}
