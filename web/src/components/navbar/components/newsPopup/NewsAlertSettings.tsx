import { BellRing, Volume2, VolumeX } from "lucide-react";
import { playNotificationSound } from "../../../../utils/notificationSound";
import { setDesktopEnabled, setSoundEnabled, useAlertPreferences } from "./alertPreferences";

const CHIP = "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";
const ON = "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
const OFF = "border-[#1c1c1e]/10 text-[#82828c] hover:text-[#1c1c1e] dark:border-white/10 dark:hover:text-white";

export default function NewsAlertSettings() {
  const preferences = useAlertPreferences();
  const desktopActive = preferences.desktop && preferences.permission === "granted";
  const desktopLabel =
    preferences.permission === "denied" ? "Bloquées par le navigateur" : preferences.permission === "unsupported" ? "Non supportées" : "Notifications du navigateur";

  const handleSound = () => {
    setSoundEnabled(!preferences.sound);
    if (!preferences.sound) playNotificationSound();
  };

  const handleDesktop = () => void setDesktopEnabled(!desktopActive);

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-[#1c1c1e]/8 px-5 py-3 dark:border-white/8">
      <span className="text-[11px] font-medium text-[#82828c]">Alertes</span>
      <button onClick={handleSound} aria-pressed={preferences.sound} className={`${CHIP} ${preferences.sound ? ON : OFF}`}>
        {preferences.sound ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
        Son
      </button>
      <button
        onClick={handleDesktop}
        aria-pressed={desktopActive}
        disabled={preferences.permission === "denied" || preferences.permission === "unsupported"}
        title={preferences.permission === "denied" ? "Autorisez les notifications pour ce site dans les réglages du navigateur." : undefined}
        className={`${CHIP} ${desktopActive ? ON : OFF}`}
      >
        <BellRing className="h-3 w-3" />
        {desktopLabel}
      </button>
    </div>
  );
}
