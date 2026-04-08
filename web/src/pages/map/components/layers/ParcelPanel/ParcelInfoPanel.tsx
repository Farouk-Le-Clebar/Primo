import { useEffect, useState, useRef } from "react";
import { ChevronRight, MapPin, ExternalLink } from "lucide-react";
import { useStopPropagation } from "../ParcelDetailedDashboard/hooks/useStopPropagation";
import { ParcelInfoCard } from "./ParcelleInfoCard";

type ParcelInfoPanelProps = {
  selectedParcelle: any;
  onOpenDashboard: () => void;
};

export default function ParcelInfoPanel({ selectedParcelle, onOpenDashboard }: ParcelInfoPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const panelRef = useRef<HTMLElement>(null);

  useStopPropagation(panelRef);

  useEffect(() => {
    setIsVisible(!!selectedParcelle?.feature);
  }, [selectedParcelle?.feature]);

  const properties = selectedParcelle?.feature?.properties;
  const parcelId = properties?.id || "Parcelle inconnue";
  const address = properties?.address || "14 Rue des Lilas, 75020 Paris";
  
  if (!selectedParcelle?.feature) return null;

  return (
    <div className="relative h-full w-full pointer-events-none">
      
      <div className={`absolute top-4 left-4 z-[500] transition-all duration-500 ease-out pointer-events-auto ${!isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"}`}>
        <button onClick={() => setIsVisible(true)} className="flex items-center gap-2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all border border-gray-100 font-medium text-sm group">
          <span className="bg-green-100 text-green-700 p-1.5 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors">
            <ChevronRight size={16} />
          </span>
          <span>Afficher la parcelle</span>
        </button>
      </div>
      <aside ref={panelRef} className={`absolute inset-y-0 left-0 w-full bg-white shadow-[20px_0_25px_-5px_rgba(0,0,0,0.1)] z-[500] transform transition-transform duration-500 ease-in-out pointer-events-auto flex flex-col ${isVisible ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-9 pt-9 pb-6 border-b border-[#F0F0F0] shrink-0">
          <div className="flex items-center justify-between gap-4 mb-2">
            <h2 className="font-inter font-semibold text-lg text-[#111111] truncate">
              Parcelle {parcelId.replace('Parcelle ', '')}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-[#6B7280] mb-6">
            <MapPin size={14} className="shrink-0" />
            <span className="font-inter font-medium text-xs truncate">{address}</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenDashboard}
              className="flex-1 h-[40px] bg-[#111111] hover:bg-gray-800 text-white rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <ExternalLink size={15} />
              <span className="font-inter font-medium text-sm">Ouvrir dans le SIG</span>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden px-9 py-6 flex flex-col">
          <ParcelInfoCard properties={properties} />
        </div>
      </aside>
    </div>
  );
}