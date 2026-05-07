import { useState } from "react";
import { ChevronRight, Map as MapIcon } from "lucide-react";

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
};

export default function ParcelDetailedNavbar({
  parcelId,
  address,
  activeTab,
  setActiveTab,
  onClose,
}: ParcelDetailedNavbarProps) {
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between w-full h-[50px] px-6 bg-white border-b border-gray-200 shrink-0 font-inter z-10">
        <div className="flex items-center gap-2 text-[13px] w-1/4">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="font-semibold text-gray-900 truncate max-w-[120px]">
            {parcelId}
          </span>
          <ChevronRight size={14} className="text-gray-300 shrink-0" />
          <span className="font-medium text-gray-400 truncate max-w-[120px]">
            {address}
          </span>
        </div>

        <ParcelNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenSearch={() => setIsSearchOpen(true)} 
        />

        <div className="flex items-center justify-end w-1/4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <MapIcon size={14} />
            <span>Fermer</span>
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