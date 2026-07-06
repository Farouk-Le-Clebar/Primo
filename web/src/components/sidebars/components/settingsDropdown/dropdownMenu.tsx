import React from "react";
import { useNavigate } from "react-router-dom";
import CustomNavLink from "../../../../ui/Navlink";
import { useTheme } from "../../../../context/ThemeProvider";

import UserProfileDropdown from "./userProfileDropdown";

import LogoutIcon from "../../../../assets/icons/logout.svg?react";
import ThemeIcon from "../../../../assets/icons/theme.svg?react";

interface DropdownMenuProps {
  onClose: () => void;
}

export default function DropdownMenu({ onClose }: DropdownMenuProps) {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    onClose();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleProfileRedirect = () => {
    navigate("/profile");
    onClose();
  };

  const renderIcon = (IconComponent: React.FC<React.SVGProps<SVGSVGElement>>) => (
    <div className={`w-4 h-4 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${IconComponent === ThemeIcon && theme === 'dark' ? 'rotate-180' : ''}`}>
      <IconComponent className="w-full h-full" />
    </div>
  );

  const dropdownBtnStyle = "w-full mx-auto h-8 py-2 border border-transparent bg-transparent cursor-pointer";

  return (
    <div className="w-56 bg-white dark:bg-[#171717] dark:text-white rounded-xl shadow-lg border border-gray-100 dark:border-[#262626] py-2 px-0.5 flex flex-col gap-1 transition-colors duration-200">
      
      <div 
        onClick={handleProfileRedirect}
        className="mx-1 px-2 py-1 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-[#262626]"
      >
        <UserProfileDropdown />
      </div>

      <div className="border-t border-gray-100 dark:border-[#262626]" />

      <div className="px-3 py-2 flex items-center gap-1">
        <ThemeIcon className="w-4 h-4 text-gray-500 mr-1 dark:invert" />
        <div className="flex-1 flex bg-gray-100 dark:bg-[#0A0A0A] rounded-lg p-0.5 border border-gray-200 dark:border-[#262626]">
          <button 
            type="button"
            onClick={() => setTheme('light')} 
            className={`flex-1 text-[10px] cursor-pointer font-medium py-1 rounded-md transition-colors ${theme === 'light' ? 'bg-white dark:bg-[#262626] shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
          >
            Clair
          </button>
          <button 
            type="button"
            onClick={() => setTheme('dark')} 
            className={`flex-1 text-[10px] cursor-pointer font-medium py-1 rounded-md transition-colors ${theme === 'dark' ? 'bg-white dark:bg-[#262626] shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
          >
            Sombre
          </button>
          <button 
            type="button"
            onClick={() => setTheme('system')} 
            className={`flex-1 text-[10px] cursor-pointer font-medium py-1 rounded-md transition-colors ${theme === 'system' ? 'bg-white dark:bg-[#262626] shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
          >
            Auto
          </button>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-[#262626]" />

      <CustomNavLink
        label="Déconnexion"
        BgColor="bg-transparent"
        hoverBgColor="hover:bg-gray-200/50 dark:hover:bg-[#262626]"
        textClass="font-inter font-medium text-xs"
        showChevronOnHover={true}
        textColor="text-black dark:text-white"
        rounded="rounded-lg"
        icon={renderIcon(LogoutIcon)} 
        className={dropdownBtnStyle}
        onClick={handleLogout}
      />
    </div>
  );
  
}