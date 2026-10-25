import { useNavigate } from "react-router-dom";
import { ArrowRightStartOnRectangleIcon, ChatBubbleLeftEllipsisIcon, LifebuoyIcon, SunIcon } from "@heroicons/react/20/solid";
import { useTheme } from "../../../../../../context/ThemeProvider";
import type { Theme } from "../../../../../../context/ThemeProvider";
import SegmentedControl from "../../../../../../ui/SegmentedControl";
import UserMenuHeader from "./UserMenuHeader";
import UserMenuItem from "./UserMenuItem";
import { ROUTES } from "../../../../../../constants/routes";

interface UserMenuProps {
  onClose: () => void;
}

const SUPPORT_URL = "https://chat.whatsapp.com/FKq0VLrFo4u33nFyFWhaRn";

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" },
  { value: "system", label: "Auto" },
];

const SEPARATOR = "my-1 border-t border-black/5 dark:border-white/10";

export default function UserMenu({ onClose }: UserMenuProps) {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleSupport = () => {
    window.open(SUPPORT_URL, "_blank", "noopener,noreferrer");
    onClose();
  };

  const handleLogout = () => {
    onClose();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div role="menu" aria-label="Menu du compte" className="glass flex w-64 flex-col rounded-xl border border-black/5 py-1.5 shadow-xl dark:border-white/10 dark:text-white">
      <UserMenuHeader onOpenProfile={() => handleNavigate(ROUTES.profile)} />
      <div className={SEPARATOR} />
      <div className="flex items-center gap-2 px-3.5 py-1.5">
        <SunIcon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
        <SegmentedControl id="dropdown-theme" label="Apparence" value={theme} options={THEME_OPTIONS} onChange={setTheme} className="flex-1" size="sm" />
      </div>
      <div className={SEPARATOR} />
      <UserMenuItem icon={ChatBubbleLeftEllipsisIcon} label="Retours et suggestions" onClick={() => handleNavigate(ROUTES.feedback)} />
      <UserMenuItem icon={LifebuoyIcon} label="Support" onClick={handleSupport} isExternal />
      <div className={SEPARATOR} />
      <UserMenuItem icon={ArrowRightStartOnRectangleIcon} label="Se déconnecter" onClick={handleLogout} isDanger />
    </div>
  );
}
