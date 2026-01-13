import { useParcelle } from "../../context/ParcelleContext";
import { useEffect, useState } from "react";
import { X, ChevronRight, MapPin } from "lucide-react";
import type { ParcelWidgetComponent } from "./types";
import { ParcelInfoCard } from "./ParcelleInfoCard";

// Liste des Composant Widget
import BuildingsWidget from "./widgets/buildings/BuildingsWidget";

const getWidgetsFromUserProfile = (): ParcelWidgetComponent[] => {
  return [
    BuildingsWidget,
    BuildingsWidget,
    BuildingsWidget,
    BuildingsWidget,
    BuildingsWidget,
    BuildingsWidget,
  ];
}

export default function ParcelInfoPanel() {
  const { selectedParcelle } = useParcelle();
  const [isVisible, setIsVisible] = useState(false);
  const [hasSelectedOnce, setHasSelectedOnce] = useState(false);

  useEffect(() => {
    if (selectedParcelle?.feature) {
      setIsVisible(true);
      setHasSelectedOnce(true);
    } else {
        setHasSelectedOnce(false);
        setIsVisible(false);
    }
  }, [selectedParcelle?.feature]);

  const widgets = getWidgetsFromUserProfile();

  const properties = selectedParcelle?.feature?.properties;
  const parcelId = properties?.idu || "Parcelle inconnue";

  if (!hasSelectedOnce && !selectedParcelle?.feature) return null;

  return (
    <>
      <div 
        className={`fixed top-4 left-4 z-[900] transition-all duration-500 ease-out ${
           !isVisible && selectedParcelle?.feature ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setIsVisible(true)}
          className="flex items-center gap-2 bg-white text-gray-800 px-4 py-1 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all border border-gray-100 font-medium text-sm group"
        >
          <span className="bg-green-100 text-green-700 p-1.5 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors">
            <ChevronRight size={16} />
          </span>
          <span>Afficher la parcelle</span>
        </button>
      </div>

      <div
        className={`fixed left-0 top-0 h-screen w-[450px] max-w-[90vw] bg-[#F8F9FB] shadow-2xl z-[1000] transform transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1) flex flex-col ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg text-white shadow-md shadow-green-200">
               <MapPin size={20} />
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-800 leading-tight">Détails Parcelle</h2>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{parcelId}</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {selectedParcelle?.feature ? (
            <>
              {/* --- AJOUT DE LA CARTE D'INFO ICI --- */}
              <ParcelInfoCard properties={properties} />

              {/* Titre de section pour les widgets */}
              <div className="flex items-center gap-4 mb-2">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] whitespace-nowrap">Categories d'informations woula</span>
                <div className="h-px w-full bg-gray-100"></div>
              </div>

              {/* Rendu des Widgets */}
              {widgets.map((Widget, index) => (
                <Widget key={index} feature={selectedParcelle.feature} />
              ))}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
               <p>Aucune donnée disponible</p>
            </div>
          )}
        </div>
      </div>
      
    </>
  );
}