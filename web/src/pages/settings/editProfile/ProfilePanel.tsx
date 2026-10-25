import { useCallback } from "react";
import { ROUTES } from "../../../constants/routes";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MapPanel from "../../map/components/layers/Navbar/MapPanel";
import { PROFILE_PANEL_ID } from "../../map/components/layers/Navbar/panelIds";
import { useProfileForm } from "../../../hooks/useProfileForm";
import { useAccountSettings } from "../../../hooks/useAccountSettings";
import { readStoredUser } from "../../../hooks/useStoredUser";
import ProfileHero from "./components/ProfileHero";
import IdentitySection from "./components/IdentitySection";
import PreferencesSection from "./components/PreferencesSection";
import SecuritySection from "./components/SecuritySection";
import UnsavedChangesBar from "./components/UnsavedChangesBar";

const ENTER = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

export default function ProfilePanel() {
  const navigate = useNavigate();
  const handleClose = useCallback(() => navigate(ROUTES.map), [navigate]);
  const profile = useProfileForm();
  const account = useAccountSettings();
  const isAdmin = readStoredUser().isAdmin ?? false;

  return (
    <MapPanel id={PROFILE_PANEL_ID} label="Mon profil" onClose={handleClose}>
      <div className="scrollbar-glass @container min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pt-10 pb-28 @4xl:grid-cols-[2fr_3fr] @4xl:px-12">
          <motion.aside {...ENTER} transition={{ duration: 0.3, ease: "easeOut" }} className="@4xl:sticky @4xl:top-10 @4xl:self-start">
            <ProfileHero draft={profile.draft} email={account.email} isAdmin={isAdmin} />
          </motion.aside>
          <motion.div {...ENTER} transition={{ duration: 0.3, delay: 0.08, ease: "easeOut" }} className="flex flex-col gap-4">
            <IdentitySection draft={profile.draft} email={account.email} onFieldChange={profile.updateField} />
            <PreferencesSection mapPreference={account.mapPreference} onMapChange={account.changeMap} />
            <SecuritySection
              email={account.email}
              isResetPending={account.isResetPending}
              isResetSent={account.isResetSent}
              onSendResetLink={account.sendResetLink}
              onLogout={account.logout}
            />
          </motion.div>
        </div>
      </div>
      <UnsavedChangesBar isVisible={profile.isDirty} isPending={profile.isPending} onDiscard={profile.discard} onSave={profile.save} />
    </MapPanel>
  );
}
