import { useLocation, useNavigate } from "react-router-dom";

// COMPONENTS
import NotificationsDropdown from "./components/notificationDropdown/NotificationsDropdown";
import { startOnboarding } from "../../config/onboarding.service";

// ICONS
import PageIcons from "../../assets/icons/page.svg?react";
import ChevronIcons from "../../assets/icons/chevronRight.svg?react";

import HelpIcon from "../../assets/icons/help.svg?react";

const ROUTE_NAMES: Record<string, string> = {
  "/": "Vue d'ensemble",
  "/parcelles": "Gestion Parcellaire",
  "/cartographie": "Carte Interactive",
  "/settings": "Paramètres",
  "/dashboard": "Aperçu",
  "/search": "Carte",
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageName = () => {
    const path = location.pathname;
    if (ROUTE_NAMES[path]) return ROUTE_NAMES[path];

    const slug = path.split("/").filter(Boolean).pop();
    return slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ") : "";
  };

  const pageName = getPageName();

  const handleAddressSelect = (coords: [number, number]) => {
    navigate("/search", { 
      state: { centerOn: coords } 
    });
  };

  return (
    <nav className="flex w-full h-full items-center bg-white font-UberMove">
      
      <div className="flex h-full flex-1 items-center gap-3 px-4">
        <PageIcons className="w-4 h-4 text-green-500" />
        <div className="h-3 w-px bg-gray-300"></div>
        <div className="flex items-center gap-3 font-inter font-light text-sm text-[#999999] min-w-max">
          <span>Dashboard</span>
          {pageName && (
            <>
              <ChevronIcons className="w-3 h-3 text-gray-400" />
              <span className="text-gray-800 font-normal text-xs">{pageName}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex h-full items-center justify-end gap-2 pr-6">
          <button 
            onClick={() => startOnboarding(location.pathname)}
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
            title="Aide et tutoriel"
          >
            <HelpIcon className="w-4 h-4" />
          </button>
  
          <div id="notifications-tour">
            <NotificationsDropdown />
          </div>
      </div>
    </nav>
  );
}