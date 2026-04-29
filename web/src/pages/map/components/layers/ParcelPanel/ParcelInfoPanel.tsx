import { useEffect, useState, useRef, useMemo } from "react";
import { ChevronRight, MapPin, ExternalLink, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// COMPONENTS
import { useStopPropagation } from "../ParcelDetailedDashboard/hooks/useStopPropagation";
import { ParcelInfoCard } from "./ParcelleInfoCard";
import { getDvfParcelle } from "../../../../../requests/dvf/information";
import { getBuildingsByGeometry } from "../../../../../requests/geoserver/bdTopo";
import { getZonesUrbaByGeometry } from "../../../../../requests/geoserver/urbanAreas";
import { extractDepartement } from "../ParcelDetailedDashboard/widgets/gpu/utils";
import AddPlotToProjectModal from "./AddPlotToProjectModal";


type ParcelInfoPanelProps = {
  selectedParcelle: any;
  onOpenDashboard: () => void;
};

export default function ParcelInfoPanel({ selectedParcelle, onOpenDashboard }: ParcelInfoPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const [addPlotToProjectOpen, setAddPlotToProjectOpen] = useState(false);

  useStopPropagation(panelRef);


  const feature = selectedParcelle?.feature;
  const properties = feature?.properties;
  const geometry = feature?.geometry;
  const parcelId = properties?.id || "Parcelle inconnue";
  const address = selectedParcelle?.addokData?.features?.[0]?.properties?.label || "Adresse non renseignée";
  const inseeCode = feature?.properties?.commune;

  const departement = useMemo(() => {
    if (!inseeCode) return extractDepartement(String(feature?.id)) || "";
    return inseeCode.startsWith('97') ? inseeCode.substring(0, 3) : inseeCode.substring(0, 2);
  }, [inseeCode, feature?.id]);

  const { data: dvfData, isLoading: isDvfLoading } = useQuery({
    queryKey: ['dvf-summary', parcelId],
    queryFn: () => getDvfParcelle(String(parcelId)),
    enabled: !!parcelId && isVisible,
  });

  const { data: buildData, isLoading: isBuildLoading } = useQuery({
    queryKey: ['buildings-summary', parcelId],
    queryFn: () => getBuildingsByGeometry(geometry, departement),
    enabled: !!geometry && !!departement && isVisible,
  });

  const { data: urbanData, isLoading: isUrbaLoading } = useQuery({
    queryKey: ['urban-summary', parcelId],
    queryFn: () => getZonesUrbaByGeometry(geometry, departement),
    enabled: !!geometry && !!departement && isVisible,
  });

  useEffect(() => {
    setIsVisible(!!selectedParcelle?.feature);
  }, [selectedParcelle?.feature]);

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
              <span className="font-inter font-medium text-sm">Ouvrir l'analyse complète</span>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden px-9 py-6 flex flex-col overflow-y-auto">
          <ParcelInfoCard
            properties={properties}
            buildingCount={buildData?.features?.length}
            pluZone={urbanData?.features?.[0]?.properties?.typezone}
            avgPriceM2={dvfData?.stats?.prixMoyenM2}
            isLoadingStats={isDvfLoading || isBuildLoading || isUrbaLoading}
          />
          <div className="flex items-center justify-center">
            <button
              onClick={() => setAddPlotToProjectOpen(true)}
              className="w-full h-[40px] bg-[#111111] hover:bg-gray-800 text-white rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={15} />
              <span className="font-inter font-medium text-sm">Ajouter au projet</span>
            </button>
          </div>
        </div>
      </aside>
      {addPlotToProjectOpen && (
        <AddPlotToProjectModal
          onClose={() => setAddPlotToProjectOpen(false)}
          plotData={{
            plotBanId: selectedParcelle?.feature?.properties?.ban,
            plotId: selectedParcelle?.feature?.properties?.id,
            adress: selectedParcelle?.feature?.properties?.addok_label,
          }}
        />
      )}
    </div>
  );
}