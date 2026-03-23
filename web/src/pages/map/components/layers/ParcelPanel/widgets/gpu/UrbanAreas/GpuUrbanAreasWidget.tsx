import { useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";

// COMPONENTS
import { WidgetCard } from "../../WidgetCard";
import { MetricItem, IconStat } from "../../WiddgetItems";
import type { ParcelWidgetProps } from "../../../types";
import { ZONE_DESCRIPTIONS, getMainZoneType, extractDepartement, formatDate, getDocumentAction } from "./utils";
import { getZonesUrbaByGeometry } from "../../../../../../../../requests/geoserver/urbanAreas";
import { PluTooltip } from "./InfoTooltip";

// ICONS
import { Map, FileText, Info, Calendar, AlertTriangle } from "lucide-react";

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

  return (
    <WidgetCard
      title="Zonage PLU"
      subtitle="Urbanisme et constructibilité"
      icon={Map}
      iconColorClass="bg-indigo-50 text-indigo-600"
      headerAction={<PluTooltip />}
      loading={isPending}
      loadingText="Recherche des documents d'urbanisme..."
      isEmpty={!data || uniqueZones.length === 0}
      emptyText={isError ? "Service indisponible" : "Aucun zonage numérique trouvé (RNU probable)"}
    >
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">
                  {zoneInfo.rawType || "—"}
                </span>
                <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wide bg-indigo-50 px-2 py-1 rounded-md">
                  {zoneInfo.label}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {zoneInfo.desc}
              </p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex-shrink-0">
              <Info size={18} className="text-slate-400" />
            </div>
          </div>
        </div>
        
        {hasMultipleZones && (
          <div className="flex items-start gap-3 p-3 bg-amber-50/50 border border-amber-200/60 rounded-lg">
            <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-900">Parcelle multi-zonée</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                {uniqueZones.length} zones distinctes : {uniqueZones.map((z: any) => z.properties.typezone).join(', ')}
              </p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
          <MetricItem 
            icon={<Map size={14} className="text-slate-500" />} 
            label="Libellé complet" 
            value={props.libelong || props.libelle || "Non renseigné"} 
          />
          <MetricItem 
            icon={<Calendar size={14} className="text-slate-500" />} 
            label="Approuvé le" 
            value={formatDate(props.datvalid)} 
          />
        </div>
        
        <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <IconStat 
              icon={<Info size={14} className="text-slate-500" />} 
              label="Destination" 
              value={props.destdomi || "Mixte / Indéfinie"} 
            />
            <IconStat 
              icon={<FileText size={14} className="text-slate-500" />} 
              label="Document" 
              value={props.idurba?.split('_')[0] || "—"} 
            />
          </div>
        </div>
        
        {docAction ? (
          <a
            href={docAction.url}
            target="_blank"
            rel="noopener noreferrer"
            download={docAction.type === 'zip'}
            className="group flex items-center justify-center gap-2.5 w-full py-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 transition-all shadow-sm hover:shadow"
          >
            <docAction.icon size={16} className="text-slate-500 group-hover:text-slate-700 group-hover:-translate-y-0.5 transition-all" />
            {docAction.label}
          </a>
        ) : (
          <div className="flex items-center justify-center gap-2 py-3 bg-slate-50 border border-slate-200 rounded-lg">
            <FileText size={16} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Document indisponible
            </span>
          </div>
        )}
      </div>
    </WidgetCard>
  );
}