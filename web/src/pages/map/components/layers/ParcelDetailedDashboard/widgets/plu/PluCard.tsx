import { useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@tremor/react";
import { AlertTriangle } from "lucide-react";

// COMPONENTS
import type { ParcelWidgetProps } from "../../types";
import { ZONE_DESCRIPTIONS, getMainZoneType, extractDepartement, formatDate, getDocumentAction } from "./utils";
import { getZonesUrbaByGeometry } from "../../../../../../../requests/geoserver/urbanAreas";
import LoadingPrimoLogo from "../../../../../../../components/animations/LoadingPrimoLogo";

export default function PluCard({ feature }: ParcelWidgetProps) {
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

  const InfoRow = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0 last:pb-0">
      <span className="text-[13px] font-medium text-[#878D96] shrink-0 pr-4">{label}</span>
      <span className="text-[13px] font-medium text-[#111111] dark:text-white text-right truncate">{value}</span>
    </div>
  );

  if (isPending) {
    return (
      <Card className="flex flex-col items-center justify-center min-h-48 border-gray-200 ring-0 shadow-sm">
        <LoadingPrimoLogo className="w-8 h-8 text-blue-500 mb-4" />
        <span className="text-[13px] font-medium text-[#878D96]">Analyse du zonage...</span>
      </Card>
    );
  }

  if (isEmpty) {
    return (
      <Card className="border-gray-200 ring-0 shadow-sm">
        <div className="py-8 text-sm text-[#878D96] text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
          {isError ? "Service PLU indisponible" : "Aucun zonage numérique trouvé. Le régime applicable reste à vérifier."}
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 ring-0 shadow-sm p-4 flex flex-col font-inter">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Zone {zoneInfo.rawType || "—"}</h2>
          <p className="text-sm text-gray-500 mt-1 ">{zoneInfo.label}</p>
        </div>
      </div>

      {hasMultipleZones && (
        <div className="flex items-start gap-2 p-3 mt-3 mb-2 bg-amber-50 dark:bg-[#232323] border border-amber-200 dark:border-[#232323] rounded-lg">
          <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-[12px] font-medium text-amber-800 leading-tight">
            Parcelle multi-zonée : {uniqueZones.map((z: any) => z.properties.typezone).join(', ')}
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 dark:bg-[#232323] dark:border-[#232323]">
        <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
          {zoneInfo.desc}
        </p>
      </div>

      <div className="mt-5">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Caractéristiques</h3>
        <div className="flex flex-col">
          <InfoRow label="Libellé complet" value={props.libelong || props.libelle || "Non renseigné"} />
          <InfoRow label="Approbation" value={formatDate(props.datvalid)} />
          <InfoRow label="Destination" value={props.destdomi || "Mixte / Indéfinie"} />
        </div>
      </div>

      {docAction && (
        <div className="mt-3">
          <a
            href={docAction.url}
            target="_blank"
            rel="noopener noreferrer"
            download={docAction.type === 'zip'}
            className="flex items-center justify-center gap-2 w-full h-[40px] bg-black hover:bg-gray-800 rounded-lg text-[13px] font-medium text-white transition-colors shadow-sm cursor-pointer dark:bg-white dark:hover:bg-white/80"
          >
            <docAction.icon className="text-white dark:text-black" size={15} />
            <span className="font-inter font-medium text-sm text-white dark:text-black">{docAction.label}</span>
          </a>
        </div>
      )}
    </Card>
  );
}