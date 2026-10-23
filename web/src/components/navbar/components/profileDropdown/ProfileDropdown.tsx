import { useState, useRef, useEffect } from "react";

// ASSETS
import { getAvatarComponent } from "../../../avatar/Avatar";

// COMPONENTs
import DropdownMenu from "./ProfileDropdownMenu.tsx";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fileName = currentUser?.profilePicture || "green.png";
  const AvatarComponent = getAvatarComponent(fileName);

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
          <AvatarComponent className="w-full h-full" />
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