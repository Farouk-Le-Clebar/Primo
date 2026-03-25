import { useLocation } from "react-router-dom";
import NotificationsDropdown from "./components/notificationDropdown/NotificationsDropdown";
import SettingsDropdown from "../sidebars/components/settingsDropdown/SettingsDropdown";

// ICONS
import PageIcons from "../../assets/icons/page.svg?react";

const ROUTE_NAMES: Record<string, string> = {
  "/": "Vue d'ensemble",
  "/parcelles": "Gestion Parcellaire",
  "/cartographie": "Carte Interactive",
  "/settings": "Paramètres",
  "/dashboard": "Aperçu",
};

export default function Navbar() {
  const location = useLocation();

  const getPageName = () => {
    const path = location.pathname;
    if (ROUTE_NAMES[path]) return ROUTE_NAMES[path];

    const slug = path.split("/").filter(Boolean).pop();
    return slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ") : "";
  };

  const pageName = getPageName();

  return (
    <nav className="flex w-full h-full items-center bg-white font-UberMove border-b border-gray-100">
      <div className="flex h-full flex-1 items-center gap-2 px-4">
        <PageIcons className="w-5 h-5 text-gray-800" />
        <div className="flex items-center gap-1 font-inter font-medium text-xs text-[#999999]">
          <span>Dashboard</span>
          {pageName && (
            <>
              <span>/</span>
              <span className="text-gray-800 font-semibold">{pageName}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex h-full min-w-[285px] items-center justify-end gap-4 pr-6">
          <NotificationsDropdown />
      </div>
    </nav>
  );
}