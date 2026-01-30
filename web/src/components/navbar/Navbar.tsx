import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// UTILS
import { checkAuth } from "../../utils/auth";

// COMPONENTS
import SearchingBar from "../search/SearchBar";
import LoginButton from "./components/LoginButton";
import NotificationsDropdown from "./components/notificationDropdown/NotificationsDropdown";
import ProfileDropdown from "./components/profileDropdown/ProfileDropdown";

// ICONS / LOGOS
import PrimoLogo from "../../assets/logos/logoPrimoWhite.svg";

export default function Navbar() {
  const location = useLocation();
  const [isUserConnected, setIsUserConnected] = useState<boolean | null>(null);

  useEffect(() => {   
    verify();
  }, []);

  const verify = async () => {
      const isConnected = await checkAuth();
      setIsUserConnected(isConnected);
  };

  const getPageName = (path: string) => {
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 0) return "Dashboard";
    const page = parts[parts.length - 1];
    return page.charAt(0).toUpperCase() + page.slice(1);
  };

  const pageName = getPageName(location.pathname);

  if (isUserConnected === null) {
    return <nav className="w-full h-[70px] bg-white border-b border-gray-100" />;
  }

  return (
    <nav className="flex w-full h-[70px] items-center bg-white font-UberMove">
      
      {/* GAUCHE : Logo Primo */}
      <Link 
        to="/dashboard" 
        className="flex h-full items-center min-w-[245px] cursor-pointer hover:opacity-80 transition-opacity duration-200"
      >
        <div className="p-2 ml-5">
          <img src={PrimoLogo} alt="Primo" className="w-9 h-9 invert" />
        </div>
        <span className="text-2xl font-UberMoveBold text-gray-900 tracking-tight">
          Primo.
        </span>
      </Link>

      {/* CENTRE : Breadcrumbs & Recherche */}
      <div className="flex h-full flex-1 items-center gap-20 px-8">
        <div className="flex flex-col min-w-[120px]">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest">
            Pages / {pageName}
          </span>
          <span className="text-sm font-UberMoveBold text-gray-800">{pageName}</span>
        </div>

        <div className="flex-1 max-w-xl">
          <SearchingBar onAddressSelect={(coords) => console.log(coords)}/>
        </div>
      </div>

      {/* DROITE : Actions Auth */}
      <div className="flex h-full min-w-[285px] gap-4">
        {!isUserConnected ? (
          <div className="flex h-full w-3/4 items-center justify-end"> 
            <LoginButton />
          </div>
        ) : (
          <div className="flex h-full w-3/4 items-center justify-end gap-3">
            <NotificationsDropdown />
            <ProfileDropdown />
          </div>
        )}
      </div>
    </nav>
  );
}