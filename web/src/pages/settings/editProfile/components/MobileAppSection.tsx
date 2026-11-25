import { DevicePhoneMobileIcon } from "@heroicons/react/20/solid";
import { canInstallAndroidApp } from "../../../../utils/displayMode";
import { downloadAndroidApp } from "../../../../utils/androidApp";
import ProfileSection from "./ProfileSection";
import ProfileNavRow from "./ProfileNavRow";

export default function MobileAppSection() {
  if (!canInstallAndroidApp()) return null;

  return (
    <ProfileSection title="Application mobile" description="Primo en plein écran sur votre téléphone.">
      <ProfileNavRow label="Télécharger l'app Android" hint="Fichier APK · Android 7.0 ou plus récent" onClick={downloadAndroidApp}>
        <DevicePhoneMobileIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
      </ProfileNavRow>
    </ProfileSection>
  );
}
