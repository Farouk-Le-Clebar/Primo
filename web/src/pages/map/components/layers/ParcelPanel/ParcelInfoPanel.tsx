import { useEffect, useState, useRef } from "react";
import { ChevronRight } from "lucide-react";

// COMPONENTS
import { useStopPropagation } from "./hooks/useStopPropagation";
import { getWidgetsFromUserProfile } from "./config/widgets.config";
import { ParcelInfoCard } from "./ParcelleInfoCard";
import { ParcelPanelHeader } from "./ParcelPanelHeader";

type ParcelInfoPanelProps = {
  selectedParcelle: {
    bounds: L.LatLngBounds;
    feature: any;
    layer: L.Path;
  } | null;
};

export default function ParcelInfoPanel({ selectedParcelle }: ParcelInfoPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSelectedOnce, setHasSelectedOnce] = useState(false);
  const panelRef = useRef<HTMLElement>(null);

  useStopPropagation(panelRef);

  useEffect(() => {
    if (selectedParcelle?.feature) {
      setIsVisible(true);
      setHasSelectedOnce(true);
    } else {
      setHasSelectedOnce(false);
      setIsVisible(false);
    }
  }, [selectedParcelle?.feature]);

  const properties = selectedParcelle?.feature?.properties;
  const parcelId = properties?.id || "Parcelle inconnue";

  if (!hasSelectedOnce && !selectedParcelle?.feature) return null;

  return (
    <div className="relative h-full w-full pointer-events-none">
      <div
        className={`absolute top-4 left-4 z-[500] transition-all duration-500 ease-out pointer-events-auto ${!isVisible && selectedParcelle?.feature ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"
          }`}
      >
        <button
          onClick={() => setIsVisible(true)}
          className="flex items-center gap-2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all border border-gray-100 font-medium text-sm group"
        >
          <span className="bg-green-100 text-green-700 p-1.5 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors">
            <ChevronRight size={16} />
          </span>
          <span>Afficher la parcelle</span>
        </button>
      </div>

      <aside
        ref={panelRef}
        className={`absolute inset-y-0 left-0 w-full sm:w-[350px] lg:w-[400px] bg-[#F8F9FB] shadow-[20px_0_25px_-5px_rgba(0,0,0,0.1)] z-[500] transform transition-transform duration-500 ease-in-out flex flex-col pointer-events-auto ${isVisible ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <ParcelPanelHeader parcelId={parcelId} onClose={() => setIsVisible(false)} />

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {selectedParcelle?.feature ? (
            <>
              <ParcelInfoCard properties={properties} />

              <div className="flex items-center gap-4 mb-2">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] whitespace-nowrap">
                  Catégories d'informations
                </span>
                <div className="h-px w-full bg-gray-100"></div>
              </div>

              {getWidgetsFromUserProfile().map((Widget, index) => (
                <Widget key={index} feature={selectedParcelle.feature} />
              ))}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
              <p>Aucune donnée disponible</p>
            </div>
          )}
        </div>
      </aside>

    </div>
  );
}