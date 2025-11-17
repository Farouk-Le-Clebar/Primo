import { useEffect, useState } from "react";
import { verifyToken } from "../../requests/AuthRequests";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

// COMPONENTS primo 
import CustomNavLink from "../../ui/Navlink";
import Button from "../../ui/Button";
import ButtonPrimoPlus from "./components/ButtonPrimoPlus";
import { useAuthModal } from "../../hooks/useAuthModal";
import { logout } from "../../utils/logout";
import UserProfile from "../user/UserProfile";

// IMAGES/ICONS imports
import { Home, FolderKanban, HeartPlus, Map, CornerDownRight, Bot, LogOut } from "lucide-react";
import PrimoLogo from "../../assets/logos/logoPrimoWhite.svg";
import {BackgroundColors, TextColors}  from "../../utils/colors";

export default function Sidebar() {
  const { openAuthModal } = useAuthModal();

  const user = useSelector((state: RootState) => state.user);

  const [isUserConnected, setIsUserConnected] = useState<boolean>(false);

  useEffect(() => {
    const checkUserConnection = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await verifyToken(token);
        if (res?.valid) {
          setIsUserConnected(true);
        } else {
          setIsUserConnected(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du token :", error);
        setIsUserConnected(false);
      }
    };
  
    checkUserConnection();
  }, []);

  const handleLogout = () => {
    logout(); 
    setIsUserConnected(false);
  };

  return (
    <aside className="flex left-0 bottom-0 w-full h-full flex-col items-center justify-center gap-6">
      <nav className="flex w-50 h-[77%] flex-col items-center justify-start bg-white rounded-xl shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
        <div className="flex w-full h-20 items-center justify-center">
          {/* IF Not connected  */}
          {!isUserConnected ? (
            <Button
              onClick={openAuthModal}
              textSize="text-xs font-medium"
              className="gap-2"
              width="w-[85%]"
              height="h-10"
              rounded="rounded-sm"
            >
              <img
                src={PrimoLogo}
                alt="Primo"
                className="w-5 h-5 object-contain mr-2"
              />
              <p>Se connecter</p>
              <CornerDownRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <div className="flex w-[80%] h-10">
              <UserProfile user={user.data} />
            </div>
          )}
        </div>

        <hr className="flex w-[85%] border-gray-200" />

        {/* Main Nav */}
        <div className="flex w-full flex-col items-center justify-start space-y-3 mt-4">
          <h1 className="flex w-[85%] text-xs text-[#757575]">Principale</h1>
          <CustomNavLink to="/dashboard" label="Dashboard" icon={<Home size={18} />} />
          <CustomNavLink to="/projects" label="Projets" icon={<FolderKanban size={18} />} />
          <CustomNavLink to="/favorites" label="Favoris" icon={<HeartPlus size={18} />} />
          <CustomNavLink to="/map" label="Carte" icon={<Map size={18} />} />
        </div>

        {/* Research Nav */}
        <div className="flex w-full flex-col items-center justify-start space-y-3 mt-4">
          <h1 className="flex w-[85%] text-xs text-[#757575]">Recherche</h1>
          <CustomNavLink to="/map" label="IA Primo" icon={<Bot size={18} />} />
          <CustomNavLink to="/map" label="IA Primo" icon={<Bot size={18} />} />
        </div>

        {/* Settings Nav (collé en bas) */}
        <div className="flex w-full flex-col items-center justify-start space-y-3 mt-auto mb-4">
          <CustomNavLink to="/help" label="Aide" icon={<Bot size={18} />} />
          <Button
              onClick={handleLogout}
              textSize="text-xs font-medium"
              textColor={TextColors.red}
              className="gap-2 justify-start"
              width="w-[85%]"
              height="h-10"
              rounded="rounded-sm"
              shadowHover=""
              textHoverColor={TextColors.whiteHover}
              backgroundColor={BackgroundColors.white}
              backgroundHoverColor={BackgroundColors.redHover}
          >
            <LogOut className="w-4 h-4 ml-3.5" />
            <p>Déconnexion</p>
          </Button>
        </div>
      </nav>

      {/* BUTTON primo+ */}
      <ButtonPrimoPlus />
    </aside>
  );
}
