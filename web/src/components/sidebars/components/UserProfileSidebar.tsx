import { useState } from "react";
import DropdownMenu from "./settingsDropdown/dropdownMenu";
import { useOutsideClick } from "../../../hooks/useOutsideClick";

// ASSETS
import { getAvatarComponent } from "../../avatar/Avatar";

// ICONS
import DoubleChevron from "../../../assets/icons/doubleChevron.svg?react";

export default function UserProfileSidebar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const dropdownRef = useOutsideClick(() => setIsDropdownOpen(false));
  const profilePictureValue = user?.profilePicture || "green.png";
  const isExternalUrl = profilePictureValue.startsWith("http");
  const AvatarComponent = getAvatarComponent(profilePictureValue);

  return (
    <div 
      className="relative w-full" 
      ref={dropdownRef}
    >
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex h-12 w-full items-center px-2 gap-1 transition-all duration-300 rounded-xl hover:bg-gray-200/50 dark:hover:bg-[#262626] active:scale-95 group"
      >
        <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 dark:border-[#0A0A0A] shadow-sm flex-shrink-0 transition-transform duration-300 group-hover:border-gray-300 bg-white">
          {isExternalUrl ? (
            <img 
              src={profilePictureValue} 
              alt={`Profil de ${user.firstName || 'utilisateur'}`} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <AvatarComponent className="w-full h-full" />
          )}

        </div>

        <div className="flex items-center justify-between flex-1 min-w-0 ml-1">
          <div className="flex flex-col items-start text-left min-w-0 w-full">
            <div className="font-inter font-medium text-sm text-gray-800 truncate leading-tight w-full dark:text-white">
              {user.firstName || "Utilisateur"}
            </div>
            <div className="font-inter font-normal text-xs text-gray-500 truncate leading-none w-full mt-0.5 dark:text-gray-400">
              {user.email || "email@exemple.com"}
            </div>
          </div>

          <DoubleChevron 
            className={`w-4 h-4 text-gray-400 dark:invert transition-all duration-300 flex-shrink-0 ml-2 ${
              isDropdownOpen ? "rotate-180 text-black " : "rotate-0"
            }`} 
          />
        </div>
      </button>

      {isDropdownOpen && (
        <div className="absolute left-full bottom-0 ml-4 z-[99999] transition-all duration-200">
          <DropdownMenu onClose={() => setIsDropdownOpen(false)} />
        </div>
      )}
    </div>
  );
}