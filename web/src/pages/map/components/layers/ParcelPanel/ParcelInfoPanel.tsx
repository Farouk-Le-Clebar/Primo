import { useRef } from "react";
import { MapPin, ExternalLink } from "lucide-react";

// COMPONENTS
import { useStopPropagation } from "../ParcelDetailedDashboard/hooks/useStopPropagation";
import { getDvfParcelle } from "../../../../../requests/dvf/information";
import { getBuildingsByGeometry } from "../../../../../requests/geoserver/bdTopo";
import { getZonesUrbaByGeometry } from "../../../../../requests/geoserver/urbanAreas";
import { extractDepartement } from "../ParcelDetailedDashboard/widgets/gpu/utils";
import { useQuery } from "@tanstack/react-query";

type ParcelInfoPanelProps = {
  selectedParcelle: any;
  onOpenDashboard: () => void;
};

export default function ParcelInfoPanel({ selectedParcelle, onOpenDashboard }: ParcelInfoPanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  useStopPropagation(panelRef);
  const feature = selectedParcelle?.feature;
  const properties = feature?.properties;
  const geometry = feature?.geometry;
  const parcelId = properties?.id || "Parcelle inconnue";
  const address = selectedParcelle?.addokData?.features?.[0]?.properties?.label || "Adresse non renseignée";
  const inseeCode = feature?.properties?.commune;
  const departement = (inseeCode ? (inseeCode.startsWith('97') ? inseeCode.substring(0, 3) : inseeCode.substring(0, 2)) : extractDepartement(String(feature?.id))) || "";

  const { data: dvfData, isLoading: isDvfLoading } = useQuery({
    queryKey: ['dvf-summary', parcelId],
    queryFn: () => getDvfParcelle(String(parcelId)),
    enabled: !!parcelId,
  });

  const { data: buildData, isLoading: isBuildLoading } = useQuery({
    queryKey: ['buildings-summary', parcelId],
    queryFn: () => getBuildingsByGeometry(geometry, departement),
    enabled: !!geometry,
  });

  const { data: urbanData, isLoading: isUrbaLoading } = useQuery({
    queryKey: ['urban-summary', parcelId],
    queryFn: () => getZonesUrbaByGeometry(geometry, departement),
    enabled: !!geometry,
  });

  if (!selectedParcelle?.feature) return null;

  return (
    <aside ref={panelRef} className="flex flex-col w-full h-full bg-white rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#F0F0F0] shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <h2 className="font-inter font-semibold text-lg text-[#111111] truncate">
              Parcelle {parcelId.replace('Parcelle ', '')}
            </h2>
          </div>
          <button 
            onClick={onOpenDashboard}
            className="h-[36px] px-4 bg-[#111111] hover:bg-gray-800 text-white rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <ExternalLink size={14} />
            <span className="font-inter font-medium text-xs">Analyse complète</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-[#6B7280] mt-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="shrink-0" />
            <span className="font-inter font-medium text-xs truncate">{address}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          {isBuildLoading ? (
            <span className="text-xs text-gray-400">Chargement...</span>
          ) : (
            <span className="font-inter font-medium text-xs">
              {buildData?.features?.length || 0} bâtiment{buildData?.features?.length !== 1 ? 's' : ''}
            </span>
          )}

          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          {isUrbaLoading ? (
            <span className="text-xs text-gray-400">Chargement...</span>
          ) : (
            <span className="font-inter font-medium text-xs text-gray-700">
              {urbanData?.features?.[0]?.properties?.typezone || 'Zone non renseignée'}
            </span>
          )}

          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          {isDvfLoading ? (
            <span className="text-xs text-gray-400">Chargement...</span>
          ) : (
            <span className="font-inter font-medium text-xs text-emerald-600">
              {dvfData?.stats?.prixMoyenM2 
                ? `${Math.round(dvfData.stats.prixMoyenM2).toLocaleString('fr-FR')} €/m²`
                : 'Pas de données DVF'
              }
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}