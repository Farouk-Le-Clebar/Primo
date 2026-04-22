import { ChevronRight, Map as MapIcon } from "lucide-react";

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
  
  const tabs = [
    { id: "general", label: "Synthèse" },
    { id: "batiments", label: "Bâtiments" },
    { id: "urbanisme", label: "PLU" },
    { id: "dvf", label: "DVF" },
    { id: "dpe", label: "DPE" },
  ];

  return (
    <header className="flex items-center justify-between w-full h-[50px] px-6 bg-white border-b border-gray-200 shrink-0 font-inter z-10">
      
      <div className="flex items-center gap-2 text-[13px] w-1/3">
        <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <span className="font-semibold text-gray-900 truncate max-w-[150px]">
          {parcelId}
        </span>
        <ChevronRight size={14} className="text-gray-300 shrink-0" />
        <span className="font-medium text-gray-400 truncate">
          {address}
        </span>
      </div>

      <div className="flex items-center bg-gray-100 p-0.5 rounded-lg justify-center shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 rounded-md text-[12px] font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-end w-1/3">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <MapIcon size={14} />
          <span>Retour à la carte</span>
        </button>
      </div>
      
    </header>
  );
}