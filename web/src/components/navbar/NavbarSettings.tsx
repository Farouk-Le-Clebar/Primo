import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// UTILS
import { checkAuth } from "../../utils/auth";

// COMPONENTS
import LoginButton from "./components/LoginButton";
import NotificationsDropdown from "./components/notificationDropdown/NotificationsDropdown";
import ProfileDropdown from "./components/profileDropdown/ProfileDropdown";

// ICONS / LOGOS
import PrimoLogo from "../../assets/logos/logoPrimoWhite.svg";

export default function NavbarSettings() {
  const [isUserConnected, setIsUserConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const verify = async () => {
      const isConnected = await checkAuth();
      setIsUserConnected(isConnected);
    };
    
    verify();
  }, []);
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
          Primo
        </span>
      </Link>

      {/* CENTRE : Breadcrumbs & Recherche */}
      <div className="flex h-full flex-1 items-center gap-20 px-8">
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