import { useState, useEffect } from "react";
import CustomNavLink from "../../../../ui/Navlink";

// COMPONENTS
import UserProfileDropdown from "./userProfileDropdown";

// ICONS
import LogoutIcon from "../../../../assets/icons/logout.svg?react";
import SettingsIcon from "../../../../assets/icons/settings.svg?react";
import BillingIcon from "../../../../assets/icons/billing.svg?react";
import AccountIcon from "../../../../assets/icons/account.svg?react";
import UpgradeIcon from "../../../../assets/icons/upgrade.svg?react";
import ThemeIcon from "../../../../assets/icons/theme.svg?react";

interface DropdownMenuProps {
  onClose: () => void;
}

export default function DropdownMenu({ onClose }: DropdownMenuProps) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const renderIcon = (IconComponent: React.FC<React.SVGProps<SVGSVGElement>>) => (
    <div className={`w-4 h-4 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${IconComponent === ThemeIcon && isDarkMode ? 'rotate-180' : ''}`}>
      <IconComponent className="w-full h-full" />
    </div>
  );

  const dropdownBtnStyle = "w-full mx-auto h-8 py-2 border border-transparent bg-transparent";

  return (
    <div className="w-56 bg-white dark:bg-[#171717] dark:text-white rounded-xl shadow-lg border border-gray-100 dark:border-[#262626] py-2 px-0.5 flex flex-col gap-1 transition-colors duration-200">
      
      <div className="px-2 py-1">
        <UserProfileDropdown />
      </div>

      <div className=" border-t border-gray-100 dark:border-[#262626]" />

      <CustomNavLink
        to="/profile"
        label="Passer en Pro"
        BgColor="bg-transparent"
        hoverBgColor="hover:bg-gray-200/50 dark:hover:bg-[#262626]"
        textClass="font-inter font-medium text-xs"
        showChevronOnHover={true}
        textColor="text-black dark:text-white"
        rounded="rounded-lg"
        className={dropdownBtnStyle}
        icon={renderIcon(UpgradeIcon)} 
        onClick={onClose}
      />

      <div 
        onClickCapture={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleTheme();
        }} 
        className="cursor-pointer dark:hover:bg-[#262626] rounded-lg"
      >
        <CustomNavLink
          to=""
          label={isDarkMode ? "Mode Clair" : "Mode Sombre"}
          BgColor="bg-transparent"
          hoverBgColor="hover:bg-gray-200/50 dark:hover:bg-[#262626]"
          textClass="font-inter font-medium text-xs"
          showChevronOnHover={false} 
          textColor="text-black dark:text-white"
          rounded="rounded-lg"
          className={`${dropdownBtnStyle} pointer-events-none`}
          icon={renderIcon(ThemeIcon)}
        />
      </div>

      <div className=" border-t border-gray-100 dark:border-[#262626]" />

      <CustomNavLink
        to="/profile"
        label="Profil"
        BgColor="bg-transparent"
        hoverBgColor="hover:bg-gray-200/50 dark:hover:bg-[#262626]"
        textClass="font-inter font-medium text-xs"
        showChevronOnHover={true}
        textColor="text-black dark:text-white"
        rounded="rounded-lg"
        className={dropdownBtnStyle}
        icon={renderIcon(AccountIcon)} 
        onClick={onClose}
      />

      <CustomNavLink
        to="/settings/edit-profile"
        label="Paramètres"
        BgColor="bg-transparent"
        hoverBgColor="hover:bg-gray-200/50 dark:hover:bg-[#262626]"
        textClass="font-inter font-medium text-xs"
        showChevronOnHover={true}
        textColor="text-black dark:text-white"
        rounded="rounded-lg"
        className={dropdownBtnStyle}
        icon={renderIcon(SettingsIcon)} 
        onClick={onClose}
      />
  
      <CustomNavLink
        to="/settings/edit-profile"
        label="Factures"
        BgColor="bg-transparent"
        hoverBgColor="hover:bg-gray-200/50 dark:hover:bg-[#262626]"
        textClass="font-inter font-medium text-xs"
        showChevronOnHover={true}
        textColor="text-black dark:text-white"
        rounded="rounded-lg"
        className={dropdownBtnStyle}
        icon={renderIcon(BillingIcon)}
        onClick={onClose}
      />

      <div className=" border-t border-gray-100 dark:border-[#262626]" />

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