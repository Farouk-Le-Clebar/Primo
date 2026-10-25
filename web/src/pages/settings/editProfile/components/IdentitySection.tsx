import { DocumentDuplicateIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import ProfileSection from "./ProfileSection";
import ProfileRow from "./ProfileRow";
import AvatarPicker from "./AvatarPicker";
import type { ProfileDraft } from "../../../../hooks/useProfileForm";

type IdentitySectionProps = {
  draft: ProfileDraft;
  email: string;
  onFieldChange: <Key extends keyof ProfileDraft>(key: Key, value: ProfileDraft[Key]) => void;
};

const FIELD = "h-9 w-full rounded-lg bg-black/[0.04] px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-black/20 sm:w-64 dark:bg-white/[0.06] dark:text-white dark:focus:ring-white/20";

export default function IdentitySection({ draft, email, onFieldChange }: IdentitySectionProps) {
  const handleCopyEmail = () => {
    void navigator.clipboard.writeText(email);
    toast.success("Adresse copiée.");
  };

  return (
    <ProfileSection title="Identité" description="Ce que voient les membres de vos projets.">
      <AvatarPicker value={draft.profilePicture} onChange={(avatar) => onFieldChange("profilePicture", avatar)} />
      <ProfileRow label="Prénom" htmlFor="profile-first-name">
        <input id="profile-first-name" value={draft.firstName} onChange={(event) => onFieldChange("firstName", event.target.value)} placeholder="Prénom" className={FIELD} />
      </ProfileRow>
      <ProfileRow label="Nom" htmlFor="profile-sur-name">
        <input id="profile-sur-name" value={draft.surName} onChange={(event) => onFieldChange("surName", event.target.value)} placeholder="Nom" className={FIELD} />
      </ProfileRow>
      <ProfileRow label="Adresse e-mail" hint="Identifiant de connexion, non modifiable.">
        <button
          type="button"
          onClick={handleCopyEmail}
          className="group flex h-9 w-full items-center justify-between gap-2 rounded-lg px-3 text-sm text-gray-500 transition-colors hover:bg-black/[0.04] cursor-pointer sm:w-64 dark:text-gray-400 dark:hover:bg-white/[0.06]"
        >
          <span className="truncate">{email}</span>
          <DocumentDuplicateIcon className="h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
        </button>
      </ProfileRow>
    </ProfileSection>
  );
}
