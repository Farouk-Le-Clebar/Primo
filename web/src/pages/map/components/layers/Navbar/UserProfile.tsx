import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../../../../../hooks/useOutsideClick";
import UserMenu from "./userMenu/UserMenu";

// ASSETS
import { getAvatarComponent } from "../../../../../components/avatar/Avatar";

// ICONS
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function UserProfileS() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const dropdownRef = useOutsideClick(() => setIsDropdownOpen(false));
  const profilePictureValue = user?.profilePicture || "green.png";
  const isExternalUrl = profilePictureValue.startsWith("http");
  const AvatarComponent = getAvatarComponent(profilePictureValue);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        data-tour="user-menu"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-expanded={isDropdownOpen}
        className={`group flex h-10 max-w-56 items-center gap-2.5 rounded-lg pl-1 pr-2 transition-colors duration-150 cursor-pointer ${isDropdownOpen ? "glass-selected" : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"}`}
      >
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-emerald-400/60 bg-emerald-500/28 shadow-[0_0_0_1px_rgba(255,255,255,0.1)] transition-transform duration-200 group-hover:scale-105">
          {isExternalUrl ? (
            <img
              src={profilePictureValue}
              alt={`Profil de ${user.firstName || "utilisateur"}`}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <AvatarComponent className="h-full w-full" />
          )}
        </div>
        <div className="hidden min-w-0 flex-col items-start text-left lg:flex">
          <span className="w-full truncate text-sm font-medium leading-[17.5px] text-[#1c1c1e] dark:text-white">
            {user.firstName || "Utilisateur"}
          </span>
          <span className="w-full truncate text-xs leading-[15px] text-[#99a1af]">
            {user.email || "email@exemple.com"}
          </span>
        </div>
        <ChevronUpDownIcon className="h-4 w-4 shrink-0 text-[#99a1af]" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed top-20 right-22 z-[1020]"
          >
            <UserMenu onClose={() => setIsDropdownOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
