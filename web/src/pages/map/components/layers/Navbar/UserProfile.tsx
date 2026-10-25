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
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-expanded={isDropdownOpen}
        className={`flex h-10 max-w-56 items-center gap-2.5 rounded-lg pl-1 pr-2 transition-colors duration-150 cursor-pointer ${isDropdownOpen ? "glass-selected" : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"}`}
      >
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-md bg-white ring-1 ring-black/5 dark:ring-white/10">
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
          <span className="w-full truncate text-sm font-medium leading-tight text-gray-900 dark:text-white">
            {user.firstName || "Utilisateur"}
          </span>
          <span className="w-full truncate text-xs leading-tight text-gray-500 dark:text-gray-400">
            {user.email || "email@exemple.com"}
          </span>
        </div>
        <ChevronUpDownIcon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
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
