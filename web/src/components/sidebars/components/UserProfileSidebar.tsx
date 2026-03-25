import React, { useState } from "react";
import DropdownMenu from "./settingsDropdown/settingsDropdownMenu";
import { useOutsideClick } from "../../../hooks/useOutsideClick";

// ASSETS
import PPGreen from "../../../assets/profilePictures/green.svg?react";
import PPCyan from "../../../assets/profilePictures/cyan.svg?react";
import PPBlue from "../../../assets/profilePictures/blue.svg?react";
import PPOrange from "../../../assets/profilePictures/orange.svg?react";
import PPpink from "../../../assets/profilePictures/pink.svg?react";
import PPRed from "../../../assets/profilePictures/red.svg?react";
import PPWhite from "../../../assets/profilePictures/white.svg?react";
import PPWhitePink from "../../../assets/profilePictures/whitepink.svg?react";
import PPYellow from "../../../assets/profilePictures/yellow.svg?react";

// ICONS
import ChevronDownIcon from "../../../assets/icons/chevronDownIcon.svg?react";

interface UserProfileSidebarProps {
  isExpanded: boolean;
}

const AVATAR_COMPONENTS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  "green.png": PPGreen,
  "cyan.png": PPCyan,
  "blue.png": PPBlue,
  "orange.png": PPOrange,
  "pink.png": PPpink,
  "red.png": PPRed,
  "white.png": PPWhite,
  "whitepink.png": PPWhitePink,
  "yellow.png": PPYellow,
};

export default function UserProfileSidebar({ isExpanded }: UserProfileSidebarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const dropdownRef = useOutsideClick(() => setIsDropdownOpen(false));

  const fileName = user?.profilePicture || "green.png";
  const AvatarComponent = AVATAR_COMPONENTS[fileName] || PPGreen;

  return (
    <div 
      className="relative w-full" 
      ref={dropdownRef}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`flex h-10 w-full items-center transition-all duration-300 rounded-xl hover:bg-gray-100 active:scale-95 group ${
          isExpanded ? "px-3 gap-3" : "px-0 justify-center"
        } ${isDropdownOpen ? "bg-gray-100" : ""}`}
      >
        <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-100 shadow-sm flex-shrink-0 transition-transform duration-300 group-hover:border-gray-300">
          <AvatarComponent className="w-full h-full" />
        </div>

        <div 
          className={`items-center justify-between min-w-0 transition-all duration-300 ease-in-out ${
            isExpanded 
              ? "flex flex-1 opacity-100 translate-x-0" 
              : "hidden opacity-0 -translate-x-2 w-0"
          }`}
        >
          <div className="font-UberMove font-bold text-sm text-gray-800 truncate leading-tight whitespace-nowrap">
            {user.firstName || "Utilisateur"}
          </div>

          <ChevronDownIcon 
            className={`w-4 h-4 text-gray-400 transition-all duration-300 flex-shrink-0 ${
              isDropdownOpen ? "rotate-180 text-black" : "rotate-0"
            }`} 
          />
        </div>
      </button>

      {isDropdownOpen && (
        <div className={`absolute z-[100] transition-all duration-200 ${
          isExpanded 
            ? "left-0 top-full mt-2 w-full min-w-[240px]" 
            : "left-[calc(100%+12px)] top-0 w-64"
        }`}>
          <div className="absolute -top-2 left-0 w-full h-2 bg-transparent" />
          <DropdownMenu onClose={() => setIsDropdownOpen(false)} />
        </div>
      )}
    </div>
  );
}