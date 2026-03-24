import { useState, useRef, useEffect } from "react";
import DropdownMenu from "./settingsDropdownMenu.tsx";

// ICONS
import SettingsIcons from "../../../../assets/icons/settings.svg?react";

export default function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        className="flex items-center justify-center p-1 focus:outline-none group hover:bg-gray-100 rounded-full transition-colors"
      >
          <SettingsIcons className="w-5 h-5 text-gray-800" />
      </button>

      {isOpen && (
        <DropdownMenu 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </div>
  );
}