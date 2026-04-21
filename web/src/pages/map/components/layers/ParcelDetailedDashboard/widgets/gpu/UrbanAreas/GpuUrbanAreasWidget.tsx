import { useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";

// COMPONENTS
import type { ParcelWidgetProps } from "../../../types";
import { InfoTooltip } from "./InfoTooltip";
import { ZONE_DESCRIPTIONS, getMainZoneType, extractDepartement, formatDate, getDocumentAction } from "./utils";
import { getZonesUrbaByGeometry } from "../../../../../../../../requests/geoserver/urbanAreas";

export default function GpuUrbanAreasWidget({ feature }: ParcelWidgetProps) {
  const inseeCode = feature?.properties?.commune;

  const departement = useMemo(() => {
    if (!inseeCode) return extractDepartement(String(feature?.id)) || "";
    return inseeCode.startsWith('97') ? inseeCode.substring(0, 3) : inseeCode.substring(0, 2);
  }, [inseeCode, feature?.id]);

  const { mutate, data, isPending, isError } = useMutation({
    mutationFn: async ({ geometry, dept }: { geometry: any; dept: string }) => {
      const response = await getZonesUrbaByGeometry(geometry, dept);
      return response?.features || [];
    }
  });

  useEffect(() => {
    if (!feature?.geometry || !departement) return;
    mutate({ geometry: feature.geometry, dept: departement });
  }, [feature, departement, mutate]);

  const { mainZone, zoneInfo, docAction, uniqueZones, hasMultipleZones } = useMemo(() => {
    const zones = data?.reduce((acc: any[], zone: any) => {
      const key = zone.properties.typezone;
      if (!acc.find((z: any) => z.properties.typezone === key)) acc.push(zone);
      return acc;
    }, []) || [];
    
    const firstZone = zones[0];
    const props = firstZone?.properties || {};
    const rawType = props.libelle;
    const info = ZONE_DESCRIPTIONS[rawType] || ZONE_DESCRIPTIONS[getMainZoneType(rawType)] || ZONE_DESCRIPTIONS.DEFAULT;
    const action = getDocumentAction(props, inseeCode);
    return {
      uniqueZones: zones,
      mainZone: firstZone,
      zoneInfo: { ...info, rawType },
      docAction: action,
      hasMultipleZones: zones.length > 1
    };
  }, [data, inseeCode, departement]);

  const props = mainZone?.properties || {};
  const isEmpty = !data || uniqueZones.length === 0;

  const InfoRow = ({ label, value, isLast = false }: { label: string, value: string | React.ReactNode, isLast?: boolean }) => (
    <div className={`flex justify-between items-center py-3 ${!isLast ? 'border-b border-[#F0F0F0]' : ''}`}>
      <span className="text-[13px] font-medium text-[#878D96] shrink-0 pr-4">{label}</span>
      <span className="text-[13px] font-medium text-[#111111] text-right truncate">{value}</span>
    </div>
  );

  return (
    <div className="font-inter">
      <div className="flex items-center gap-2 mb-3">
        {isPending && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-medium text-[#878D96]">Recherche...</span>
          </div>
        )}
        <div className="ml-auto">
          <InfoTooltip />
        </div>
      </div>

      <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="overflow-hidden">
          
          {!isPending && isEmpty ? (
            <div className="py-4 text-sm text-[#878D96] text-center bg-gray-50 rounded-lg border border-gray-100 mt-2">
               {isError ? "Service indisponible" : "Aucun zonage numérique trouvé (RNU probable)"}
            </div>
          ) : (
            <div className="flex flex-col">
              
              {hasMultipleZones && (
                <div className="flex items-start gap-2 p-3 mb-4 bg-amber-50 border border-amber-200 rounded-lg mt-2">
                  <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-[12px] font-medium text-amber-800 leading-tight">
                    Parcelle multi-zonée : {uniqueZones.map((z: any) => z.properties.typezone).join(', ')}
                  </p>
                </div>
              )}

              <InfoRow 
                label="Zone" 
                value={<span className="font-bold">{zoneInfo.rawType || "—"}</span>} 
              />
              
              <InfoRow 
                label="Type" 
                value={zoneInfo.label} 
              />

              <div className="py-3 border-b border-[#F0F0F0]">
                <span className="block text-[13px] font-medium text-[#878D96] mb-1">Description</span>
                <span className="block text-[13px] font-medium text-[#111111] leading-relaxed">
                  {zoneInfo.desc}
                </span>
              </div>

              <InfoRow 
                label="Libellé complet" 
                value={props.libelong || props.libelle || "Non renseigné"} 
              />
              <InfoRow 
                label="Approuvé le" 
                value={formatDate(props.datvalid)} 
              />
              <InfoRow 
                label="Destination" 
                value={props.destdomi || "Mixte / Indéfinie"} 
                isLast={!docAction}
              />
              {docAction && (
                <div className="pt-5 pb-2">
                  <a
                    href={docAction.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={docAction.type === 'zip'}
                    className="flex items-center justify-center gap-2 w-full h-[40px] bg-black hover:bg-gray-800 rounded-lg text-[13px] font-medium text-[#ffffff] transition-colors shadow-sm cursor-pointer"
                  >
                    <docAction.icon size={15} className="text-white" />
                    <span className="font-inter font-medium text-sm text-white">{docAction.label}</span>
                  </a>
                </div>
              )}

            </div>
          )}

        </div>
      </div>

    </div>
  );
}