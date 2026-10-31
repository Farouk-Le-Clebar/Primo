import { ROUTES } from "../../../constants/routes";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import MapPanel from "../../map/components/layers/Navbar/MapPanel";
import { PROFILE_PANEL_ID } from "../../map/components/layers/Navbar/panelIds";
import { useProfileForm } from "../../../hooks/useProfileForm";
import { useAccountSettings } from "../../../hooks/useAccountSettings";
import { useMapColorsDraft } from "../../../hooks/useMapColorsDraft";
import { useMapColorsSection } from "../../../hooks/useMapColorsSection";
import { readStoredUser } from "../../../hooks/useStoredUser";
import MapColorsPanel from "./components/mapColors/MapColorsPanel";
import ProfileHero from "./components/ProfileHero";
import IdentitySection from "./components/IdentitySection";
import PreferencesSection from "./components/PreferencesSection";
import SecuritySection from "./components/SecuritySection";
import UnsavedChangesBar from "./components/UnsavedChangesBar";

const ENTER = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };
const SLIDE_TRANSITION = { duration: 0.2, ease: "easeOut" } as const;
const SLIDE_OFFSET = 48;
const VISIBLE = { opacity: 1, x: 0, y: 0 };
const MENU_HIDDEN = { opacity: 0, x: -SLIDE_OFFSET };
const MODULE_HIDDEN = { opacity: 0, x: SLIDE_OFFSET };

export default function ProfilePanel() {
  const navigate = useNavigate();
  const profile = useProfileForm();
  const account = useAccountSettings();
  const mapColors = useMapColorsDraft();
  const section = useMapColorsSection(mapColors.isDirty, mapColors.exit);
  const isAdmin = readStoredUser().isAdmin ?? false;

  const handleClose = () => {
    if (section.isOpen) section.requestClose();
    else navigate(ROUTES.map);
  };

  return (
    <MapPanel id={PROFILE_PANEL_ID} label="Mon profil" onClose={handleClose} isOpaque={section.hasOpened}>
      <MotionConfig reducedMotion="user">
        <div className="scrollbar-glass @container min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pt-10 pb-28 @4xl:grid-cols-[2fr_3fr] @4xl:px-12">
            <motion.aside {...ENTER} transition={{ duration: 0.3, ease: "easeOut" }} className={`@4xl:sticky @4xl:top-10 @4xl:self-start ${section.isOpen ? "hidden @4xl:block" : ""}`}>
              <ProfileHero draft={profile.draft} email={account.email} isAdmin={isAdmin} />
            </motion.aside>
            <div className="min-w-0 overflow-x-clip">
              <AnimatePresence mode="wait">
                {section.isOpen ? (
                  <motion.div key="map-colors" initial={MODULE_HIDDEN} animate={VISIBLE} exit={MODULE_HIDDEN} transition={SLIDE_TRANSITION} className="will-change-transform">
                    <MapColorsPanel
                      editor={mapColors}
                      isLeaveWarningVisible={section.isLeaveWarningVisible}
                      onBack={section.requestClose}
                      onConfirmLeave={section.confirmLeave}
                      onCancelLeave={section.cancelLeave}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={section.hasOpened ? MENU_HIDDEN : ENTER.initial}
                    animate={VISIBLE}
                    exit={{ ...MENU_HIDDEN, transition: SLIDE_TRANSITION }}
                    transition={section.hasOpened ? SLIDE_TRANSITION : { duration: 0.3, delay: 0.08, ease: "easeOut" }}
                    className="flex flex-col gap-4 will-change-transform"
                  >
                    <IdentitySection draft={profile.draft} email={account.email} onFieldChange={profile.updateField} />
                    <PreferencesSection
                      mapPreference={account.mapPreference}
                      onMapChange={account.changeMap}
                      onOpenMapColors={section.open}
                      shouldFocusMapColors={section.hasOpened}
                    />
                    <SecuritySection
                      email={account.email}
                      isResetPending={account.isResetPending}
                      isResetSent={account.isResetSent}
                      onSendResetLink={account.sendResetLink}
                      onLogout={account.logout}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <UnsavedChangesBar isVisible={profile.isDirty && !section.isOpen} isPending={profile.isPending} onDiscard={profile.discard} onSave={profile.save} />
      </MotionConfig>
    </MapPanel>
  );
}
