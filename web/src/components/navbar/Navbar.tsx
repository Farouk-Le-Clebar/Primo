import { useLocation, useNavigate } from "react-router-dom";
import NotificationsDropdown from "./components/notificationDropdown/NotificationsDropdown";
import SearchingBar from "../../components/search/SearchBar";

// ICONS
import PageIcons from "../../assets/icons/page.svg?react";
import { HelpCircle } from "lucide-react";
import { startOnboarding } from "../../config/onboarding.service";

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
    <nav className="flex w-full h-full items-center bg-white font-UberMove border-b border-gray-100">
      
      <div className="flex h-full flex-1 items-center gap-2 px-4">
        <PageIcons className="w-5 h-5 text-gray-800" />
        <div className="flex items-center gap-1 font-inter font-medium text-xs text-[#999999] min-w-max">
          <span>Dashboard</span>
          {pageName && (
            <>
              <span>/</span>
              <span className="text-gray-800 font-semibold">{pageName}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex h-full items-center justify-end gap-2 pr-6">
          <div id="search-bar-tour" className="w-[400px]">
            <SearchingBar onAdressSelect={handleAddressSelect} />
          </div>
          
          <button 
            onClick={() => startOnboarding(location.pathname)}
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
            title="Aide et tutoriel"
          >
            <HelpCircle size={18} />
          </button>
  
          <div id="notifications-tour">
            <NotificationsDropdown />
          </div>
      </div>
    </nav>
  );
}