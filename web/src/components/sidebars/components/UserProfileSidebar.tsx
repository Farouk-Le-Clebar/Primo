import React from "react";

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

interface UserProfileSidebarProps {
  isExpanded: boolean;
}

// Dictionnaire des avatars (typé pour TypeScript)
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
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const truncate = (str: string, max: number) => {
    if (!str) return "";
    return str.length > max ? str.slice(0, max) + "..." : str;
  };

  const fileName = user?.profilePicture || "green.png";
  const AvatarComponent = AVATAR_COMPONENTS[fileName] || PPGreen;

  return (
      <div className={`flex h-10 w-full items-center justify-center transition-all duration-300 ${isExpanded ? "gap-3 px-2" : "gap-0 px-0"}`}>
        <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-100 shadow-sm flex-shrink-0 transition-transform duration-300">
          <AvatarComponent className="w-full h-full" />
        </div>
        <div 
          className={`flex flex-col min-w-0 justify-center transition-all duration-300 ease-in-out ${
            isExpanded 
              ? "opacity-100 translate-x-0 w-full" 
              : "opacity-0 -translate-x-2 w-0 overflow-hidden"
          }`}
        >
          <div className="font-inter font-bold text-sm text-gray-800 truncate leading-tight whitespace-nowrap">
            {user.firstName || "Utilisateur"}
          </div>
          <div className="font-inter font-normal text-[11px] text-gray-500 truncate leading-none mt-1 whitespace-nowrap">
            {user.email ? truncate(user.email, 20) : "Compte Primo"}
          </div>
        </div>
      </div>
  );
}