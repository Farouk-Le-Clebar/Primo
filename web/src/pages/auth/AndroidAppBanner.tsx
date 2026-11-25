import { DevicePhoneMobileIcon } from "@heroicons/react/20/solid";
import { ANDROID_APK_URL } from "../../constants/androidApp";
import { canInstallAndroidApp } from "../../utils/displayMode";

export default function AndroidAppBanner() {
  if (!canInstallAndroidApp()) return null;

  return (
    <div className="mt-8 flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 dark:border-[#262626]">
      <DevicePhoneMobileIcon className="h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="font-inter text-sm font-medium text-gray-900 dark:text-white">Primo sur Android</p>
        <p className="font-inter text-xs text-gray-500 dark:text-gray-400">Installez l'application pour un accès plein écran.</p>
      </div>
      <a
        href={ANDROID_APK_URL}
        className="shrink-0 rounded-lg bg-black px-3 py-2 font-inter text-xs font-medium text-white transition-colors hover:bg-gray-800 dark:bg-[#171717] dark:hover:bg-[#262626]"
      >
        Télécharger
      </a>
    </div>
  );
}
