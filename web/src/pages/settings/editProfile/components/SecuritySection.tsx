import { ArrowRightStartOnRectangleIcon, CheckIcon, KeyIcon } from "@heroicons/react/20/solid";
import ProfileSection from "./ProfileSection";
import ProfileRow from "./ProfileRow";

type SecuritySectionProps = {
  email: string;
  isResetPending: boolean;
  isResetSent: boolean;
  onSendResetLink: () => void;
  onLogout: () => void;
};

const ACTION = "flex h-8 items-center gap-2 rounded-lg px-3 text-xs font-medium transition-colors cursor-pointer disabled:cursor-default";

export default function SecuritySection({ email, isResetPending, isResetSent, onSendResetLink, onLogout }: SecuritySectionProps) {
  const resetHint = isResetSent ? `Lien envoyé à ${email}. Pensez à vérifier vos spams.` : "Recevez un lien sécurisé par e-mail.";

  return (
    <ProfileSection title="Sécurité" description="Accès à votre compte.">
      <ProfileRow label="Mot de passe" hint={resetHint}>
        <button
          type="button"
          onClick={onSendResetLink}
          disabled={isResetPending || isResetSent}
          className={`${ACTION} ${isResetSent ? "text-emerald-600 dark:text-emerald-400" : "bg-black/[0.04] text-gray-900 hover:bg-black/[0.07] dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.1]"}`}
        >
          {isResetSent ? <CheckIcon className="h-4 w-4" aria-hidden="true" /> : <KeyIcon className="h-4 w-4" aria-hidden="true" />}
          {isResetSent ? "Lien envoyé" : isResetPending ? "Envoi..." : "Changer le mot de passe"}
        </button>
      </ProfileRow>
      <ProfileRow label="Session" hint="Déconnecte ce navigateur.">
        <button type="button" onClick={onLogout} className={`${ACTION} text-red-600 hover:bg-red-500/10 dark:text-red-400`}>
          <ArrowRightStartOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
          Se déconnecter
        </button>
      </ProfileRow>
    </ProfileSection>
  );
}
