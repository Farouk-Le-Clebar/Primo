import { motion } from "framer-motion";
import { ShieldCheckIcon } from "@heroicons/react/20/solid";
import Avatar from "../../../../components/avatar/Avatar";
import type { ProfileDraft } from "../../../../hooks/useProfileForm";

type ProfileHeroProps = {
  draft: ProfileDraft;
  email: string;
  isAdmin: boolean;
};

export default function ProfileHero({ draft, email, isAdmin }: ProfileHeroProps) {
  const fullName = `${draft.firstName} ${draft.surName}`.trim() || "Votre nom";

  return (
    <div className="flex flex-col items-start">
      <p className="text-xs font-medium tracking-[0.12em] text-gray-400 uppercase">Mon profil</p>
      <motion.div key={draft.profilePicture} initial={{ scale: 0.9, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="mt-6">
        <Avatar profilePicture={draft.profilePicture} size="h-24 w-24" className="border-0 shadow-xl ring-4 ring-white/70 dark:ring-white/10" />
      </motion.div>
      <h2 className="mt-5 max-w-sm truncate text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{fullName}</h2>
      <p className="mt-1 max-w-sm truncate text-sm text-gray-500 dark:text-gray-400">{email}</p>
      {isAdmin && (
        <span className="mt-3 inline-flex items-center gap-1 rounded-full border border-black/[0.06] bg-black/[0.03] px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-300">
          <ShieldCheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Administrateur
        </span>
      )}
      <p className="mt-8 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        Les changements s'affichent en direct ici. Enregistrez-les avec la barre en bas de l'écran ou <kbd className="rounded border border-black/10 px-1 font-sans text-xs dark:border-white/15">⌘ S</kbd>.
      </p>
    </div>
  );
}
