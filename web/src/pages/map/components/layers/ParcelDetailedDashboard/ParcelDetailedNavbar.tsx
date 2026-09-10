import { useState } from "react";
import { ChevronRight, Map as MapIcon, Plus } from "lucide-react";

// COMPONENTS
import ParcelNavigation from "./ParcelNavigation";
import ParcelSearchModal from "./ParcelSearchModal";
import { NAVIGATION } from "./navigationConfig";

type ParcelDetailedNavbarProps = {
  parcelId: string;
  address: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onClose: () => void;
  onAddToProject: () => void;
};

export default function ParcelDetailedNavbar({
  parcelId,
  address,
  activeTab,
  setActiveTab,
  onClose,
  onAddToProject,
}: ParcelDetailedNavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between w-full min-h-[58px] flex-wrap gap-y-3 px-2 py-3 sm:px-3 bg-white dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-[#262626] shrink-0 font-inter z-10">
        <div className="flex items-center gap-2 text-[13px] min-w-0 flex-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">
            {parcelId}
          </span>
          <ChevronRight
            size={14}
            className="hidden text-gray-300 shrink-0 sm:block"
          />
          <span className="hidden font-medium text-gray-400 truncate sm:block max-w-[180px]">
            {address}
          </span>
        </div>

        <ParcelNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        <div className="flex items-center justify-end gap-2 flex-1">
          <button
            onClick={onAddToProject}
            aria-label="Ajouter à un projet"
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:bg-white dark:text-black dark:hover:bg-gray-200 shrink-0"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Ajouter à un projet</span>
          </button>
          <button
            onClick={onClose}
            aria-label="Retour à la carte"
            className="flex shrink-0 items-center gap-2 px-3 py-1.5 border border-emerald-200 dark:border-[#262626] rounded-lg text-xs font-semibold text-emerald-800 dark:text-white bg-[#F8F9FB] dark:bg-[#262626] hover:bg-emerald-100 dark:hover:bg-[#0A0A0A] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <MapIcon size={14} />
            <span>Retour à la carte</span>
          </button>
        </div>
      </header>

      <ParcelSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        navigationData={NAVIGATION}
        onNavigate={(tabId) => setActiveTab(tabId)}
      />
    </>
  );
}
