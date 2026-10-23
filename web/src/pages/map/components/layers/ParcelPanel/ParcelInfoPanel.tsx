import { MapPin, ExternalLink, Plus } from "lucide-react";
import { lazy, Suspense, useState } from "react";

import { Tooltip } from "../../../../../ui/Tooltip";

const AddPlotToProjectModal = lazy(() => import("./AddPlotToProjectModal"));

type ParcelInfoPanelProps = {
  selectedParcelle: any;
  onOpenDashboard: () => void;
};

export default function ParcelInfoPanel({ selectedParcelle, onOpenDashboard }: ParcelInfoPanelProps) {
  const [addPlotModalOpen, setAddPlotModalOpen] = useState(false);
  const feature = selectedParcelle?.feature;
  const properties = feature?.properties;
  const geometry = feature?.geometry;
  const parcelId = properties?.id || "Parcelle inconnue";
  const address = selectedParcelle?.addokData?.features?.[0]?.properties?.label || "Adresse non renseignée";
  if (!selectedParcelle?.feature) return null;

  return (
    <aside className="flex flex-col w-full h-full rounded-xl overflow-hidden pointer-events-auto">
      <div className="px-6 py-4  shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <h2 className="font-inter font-semibold text-lg text-[#111111] dark:text-white truncate">
              Parcelle {parcelId.replace('Parcelle ', '')}
            </h2>
          </div>
          <div className="flex flex-row gap-2">
            <Tooltip content="Ajouter au projet">
              <button
                onClick={() => setAddPlotModalOpen(true)}
                className="h-[36px] px-3 bg-[#111111] dark:bg-white hover:bg-gray-800 dark:hover:bg-[#e8e8e8] text-white dark:text-black rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                >
                <Plus size={14} />
              </button>
            </Tooltip>
            <button
              onClick={onOpenDashboard}
              className="h-[36px] px-4 bg-[#111111] dark:bg-white hover:bg-gray-800 dark:hover:bg-[#e8e8e8] text-white dark:text-black rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <ExternalLink size={14} />
              <span className="font-inter font-medium text-xs">Analyse complète</span>
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <MapPin size={13} className="shrink-0" />
          <span className="font-inter font-medium text-xs truncate">{address}</span>
        </div>
      </div>
      {addPlotModalOpen && (
        <Suspense fallback={null}>
        <AddPlotToProjectModal
          onClose={() => setAddPlotModalOpen(false)}
          plotData={{
            plotId: parcelId,
            plotBanId: selectedParcelle?.addokData?.features?.[0]?.properties?.id,
            adress: address,
            coordinates: `${selectedParcelle?.addokData?.features?.[0]?.geometry?.coordinates[0]},${selectedParcelle?.addokData?.features?.[0]?.geometry?.coordinates[1]}`,
            geometry,
          }}
        />
        </Suspense>
      )}
    </aside>
  );
}