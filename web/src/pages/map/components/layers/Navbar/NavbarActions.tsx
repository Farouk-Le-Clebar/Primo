import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../../../../context/ThemeProvider";
import NotificationsDropdown from "../../../../../components/navbar/components/notificationDropdown/NotificationsDropdown";
import UserProfile from "./UserProfile";

export default function NavbarActions() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={isDark ? "Passer en thème clair" : "Passer en thème sombre"}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-900 transition-colors duration-150 hover:bg-black/[0.04] dark:text-white dark:hover:bg-white/10 cursor-pointer"
      >
        {isDark ? <SunIcon className="h-5 w-5" aria-hidden="true" /> : <MoonIcon className="h-5 w-5" aria-hidden="true" />}
      </button>
      <NotificationsDropdown />
      <div className="mx-1 h-5 w-px bg-black/10 dark:bg-white/10" />
      <UserProfile />
    </div>
  );
}
