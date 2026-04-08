import { useState, useRef, useEffect } from "react";

// ASSETS
import PPGreen from "../../../../assets/profilePictures/green.svg?react";
import PPCyan from "../../../../assets/profilePictures/cyan.svg?react";
import PPBlue from "../../../../assets/profilePictures/blue.svg?react";
import PPOrange from "../../../../assets/profilePictures/orange.svg?react";
import PPpink from "../../../../assets/profilePictures/pink.svg?react";
import PPRed from "../../../../assets/profilePictures/red.svg?react";
import PPWhite from "../../../../assets/profilePictures/white.svg?react";
import PPWhitePink from "../../../../assets/profilePictures/whitepink.svg?react";
import PPYellow from "../../../../assets/profilePictures/yellow.svg?react";

// COMPONENTs
import DropdownMenu from "./ProfileDropdownMenu.tsx";

// Dictionnaire des avatars
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

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fileName = currentUser?.profilePicture || "green.png";
  const AvatarComponent = AVATAR_COMPONENTS[fileName] || PPGreen;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 focus:outline-none group"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent group-hover:border-green-500 transition-all duration-200 shadow-sm">
          <AvatarComponent />
        </div>
      </button>

      {isOpen && (
        <DropdownMenu 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </div>
  );
}