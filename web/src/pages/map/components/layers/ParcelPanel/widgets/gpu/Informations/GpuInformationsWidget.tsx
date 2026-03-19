import { useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";

// COMPONENTS
import { WidgetCard } from "../../WidgetCard";
import type { ParcelWidgetProps } from "../../../types";
import { extractDepartementForInformation, getInformationStyle, getInformationDescription } from "./utils";
import { getInformationsSurf, getInformationsLin, getInformationsPct } from "../../../../../../../../requests/geoserver/information"; 
import { InfoTooltip } from "./InfoTooltip";

// ICONS  
import { Info, Layers, Activity, MapPin } from "lucide-react";

export default function GpuInformationsWidget({ feature }: ParcelWidgetProps) {
  const inseeCode = feature?.properties?.commune;

  const departement = useMemo(() => {
    if (!inseeCode) return extractDepartementForInformation(String(feature?.id)) || "";
    return inseeCode.startsWith('97') ? inseeCode.substring(0, 3) : inseeCode.substring(0, 2);
  }, [inseeCode, feature?.id]);

  const { mutate, data, isPending } = useMutation({
    mutationFn: async ({ geometry, dept }: { geometry: any; dept: string }) => {
      const [surf, lin, pct] = await Promise.all([
        getInformationsSurf(geometry, dept),
        getInformationsLin(geometry, dept),
        getInformationsPct(geometry, dept)
      ]);

      const allFeatures = [
        ...surf.map((f: any) => ({ ...f, _kind: 'surface' })),
        ...lin.map((f: any) => ({ ...f, _kind: 'lineaire' })),
        ...pct.map((f: any) => ({ ...f, _kind: 'ponctuel' }))
      ];
      return allFeatures;
    }
  });

  useEffect(() => {
    if (!feature?.geometry || !departement) return;
    mutate({ geometry: feature.geometry, dept: departement });
  }, [feature, departement, mutate]);

  const uniqueInformations = useMemo(() => {
    if (!data) return [];
    const seen = new Set();
    return data.filter((item: any) => {
      const key = `${item.properties.typeinf}-${item.properties.libelle}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data]);

  return (
    <WidgetCard
      title="Informations"
      subtitle="Contextes & Procédures"
      icon={Info}
      iconColorClass="bg-sky-50 text-sky-600"
      headerAction={<InfoTooltip />} 
      loading={isPending}
      loadingText="Recherche d'informations annexes..."
      isEmpty={!data || uniqueInformations.length === 0}
      emptyText="Aucune information annexe détectée sur cette parcelle."
    >
      <div className="space-y-3">
        {uniqueInformations.map((info: any, index: number) => {
            const props = info.properties;
            const style = getInformationStyle(props.typeinf, props.libelle);
            const humanDescription = getInformationDescription(props.typeinf, props.libelle);
            const Icon = style.icon;
            return (
              <div 
                key={index} 
                className="group relative flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-slate-200 transition-all duration-200 overflow-hidden"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.bar}`} />

                <div className={`flex-shrink-0 mt-0.5 w-9 h-9 rounded-full ${style.bg} flex items-center justify-center border ${style.border}`}>
                  <Icon size={16} className={style.color} />
                </div>

                <div className="flex-1 min-w-0">
                   <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                      <h4 className="text-sm font-bold text-slate-800 leading-snug break-words">
                        {props.libelle}
                      </h4>
                      {props.txt && (
                        <span className="flex-shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 tracking-wide">
                           {props.txt}
                        </span>
                      )}
                   </div>

                   <p className="text-xs text-slate-500 mb-2.5 leading-relaxed font-medium">
                     {humanDescription}
                   </p>
                   
                   <div className="flex items-center gap-3 pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-1.5">
                        {info._kind === 'surface' && <Layers size={10} className="text-slate-400" />}
                        {info._kind === 'lineaire' && <Activity size={10} className="text-slate-400" />}
                        {info._kind === 'ponctuel' && <MapPin size={10} className="text-slate-400" />}
                        <span className="capitalize text-[10px] text-slate-400 font-medium">{info._kind}</span>
                      </div>
                      
                      <span className="text-[10px] text-slate-300 ml-auto font-mono">
                        Ref: {props.typeinf?.split('_')[0] || "AUTO"}
                      </span>
                   </div>
                </div>
              </div>
            );
        })}
      </div>
    </WidgetCard>
  );
}