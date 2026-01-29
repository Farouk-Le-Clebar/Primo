import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";

// COMPONENTs
import type { RootState } from "../../../../store/store.ts";
import DropdownMenu from "./ProfileDropdownMenu.tsx";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userData = useSelector((state: RootState) => state.user.userInfo);

  const userContainer = userData as any;
  const currentUser = userContainer?.user ? userContainer.user : userContainer;

  const getAvatarUrl = (name: string | undefined) => {
    const fileName = name || "green.png";
    try {
      return new URL(`../../../../assets/profilePictures/${fileName}`, import.meta.url).href;
    } catch (e) {
      return new URL(`../../../../assets/profilePictures/green.png`, import.meta.url).href;
    }
  };

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
            src={getAvatarUrl(currentUser?.profilePicture)}
            alt="Profile"
            className="w-full h-full object-cover"
          />
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