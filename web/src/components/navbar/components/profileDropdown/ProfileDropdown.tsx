import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import type { RootState } from "../../../../store/store.ts";
import profilePlaceholder from "../../../../assets/images/profile.png";
import DropdownMenu from "./ProfileDropdownMenu.tsx";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const userData = useSelector((state: RootState) => state.user.userInfo);

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
          <img
            src={userData?.profilePicture || profilePlaceholder}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </button>

      {isOpen && (
        <DropdownMenu 
          user={userData.user} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </div>
  );
}