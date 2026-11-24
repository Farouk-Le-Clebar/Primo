import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Mail, UserPlus } from "lucide-react";
import type { ProjectMember } from "../../../../types/project/members";
import SectionCard from "../ui/SectionCard";
import { TONES, toneFor } from "../ui/palette";
import { memberName } from "./useMembers";

type MembersSidebarProps = {
  members: ProjectMember[];
  isInviting: boolean;
  onInvite: (email: string, onDone: () => void) => void;
};

const ROLES = [
  { label: "Propriétaire", detail: "Gère les membres et supprime le projet" },
  { label: "Éditeur", detail: "Ajoute parcelles, notes et documents" },
];

export default function MembersSidebar({ members, isInviting, onInvite }: MembersSidebarProps) {
  const [email, setEmail] = useState("");
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const maxContributions = Math.max(1, ...members.map((member) => member.contributions));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isValid) onInvite(email.trim(), () => setEmail(""));
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Inviter un membre" subtitle="Il verra les nouveautés du projet dès sa connexion">
        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2.5">
          <label className="flex h-9 items-center gap-2 rounded-lg border border-[#1c1c1e]/12 px-3 text-[#82828c] transition-shadow focus-within:ring-2 focus-within:ring-[#1c1c1e]/10 dark:border-white/12">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="adresse@email.fr" className="min-w-0 flex-1 bg-transparent text-[13px] text-[#1c1c1e] outline-none placeholder:text-[#82828c] dark:text-white" />
          </label>
          <button type="submit" disabled={!isValid || isInviting} className="group flex w-fit items-center gap-1.5 rounded-lg bg-[#1c1c1e] px-3.5 py-2 text-[13px] font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 dark:bg-white dark:text-[#1c1c1e]">
            {isInviting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />}
            Envoyer l’invitation
          </button>
        </form>
      </SectionCard>
      <SectionCard title="Activité de l’équipe" subtitle="Parcelles, notes et documents ajoutés">
        <div className="mt-3 flex flex-col gap-3">
          {members.map((member) => (
            <div key={member.id} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{memberName(member)}</span>
                <span className="text-[#82828c]">{member.contributions} action{member.contributions > 1 ? "s" : ""}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#1c1c1e]/6 dark:bg-white/8">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(member.contributions / maxContributions) * 100}%` }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full rounded-full ${TONES[toneFor(memberName(member))].dot}`}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Rôles">
        <dl className="mt-3 flex flex-col gap-2.5">
          {ROLES.map(({ label, detail }) => (
            <div key={label} className="flex gap-4 text-xs">
              <dt className="w-[70px] shrink-0 font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{label}</dt>
              <dd className="text-[#82828c]">{detail}</dd>
            </div>
          ))}
        </dl>
      </SectionCard>
    </div>
  );
}
