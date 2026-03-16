import { useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";

// COMPONENTS
import { WidgetCard } from "../../WidgetCard";
import type { ParcelWidgetProps } from "../../../types";
import { extractDepartementForPrescription, getPrescriptionStyle,getPrescriptionDescription } from "./utils";
import { getPrescriptionsSurf, getPrescriptionsLin, getPrescriptionsPct } from "../../../../../../../../requests/geoserver/prescription"; 
import { InfoTooltip } from "./InfoTooltip";

// ICONS
import { BookOpen, Layers, Activity, MapPin } from "lucide-react";

export default function GpuPrescriptionsWidget({ feature }: ParcelWidgetProps) {
  const inseeCode = feature?.properties?.commune;

  const departement = useMemo(() => {
    if (!inseeCode) return extractDepartementForPrescription(String(feature?.id)) || "";
    return inseeCode.startsWith('97') ? inseeCode.substring(0, 3) : inseeCode.substring(0, 2);
  }, [inseeCode, feature?.id]);

  const { mutate, data, isPending } = useMutation({
    mutationFn: async ({ geometry, dept }: { geometry: any; dept: string }) => {
      const [surf, lin, pct] = await Promise.all([
        getPrescriptionsSurf(geometry, dept),
        getPrescriptionsLin(geometry, dept),
        getPrescriptionsPct(geometry, dept)
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

  const uniquePrescriptions = useMemo(() => {
    if (!data) return [];
    const seen = new Set();
    return data.filter((item: any) => {
      const key = `${item.properties.typepsc}-${item.properties.libelle}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data]);

  return (
    <WidgetCard
      title="Prescriptions"
      subtitle="Servitudes & Contraintes"
      icon={BookOpen}
      iconColorClass="bg-indigo-50 text-indigo-600"
      headerAction={<InfoTooltip />} 
      loading={isPending}
      loadingText="Analyse des règles d'urbanisme..."
      isEmpty={!data || uniquePrescriptions.length === 0}
      emptyText="Aucune servitude spécifique détectée sur cette parcelle."
    >
      <div className="space-y-3">
        {uniquePrescriptions.map((presc: any, index: number) => {
            const props = presc.properties;
            const style = getPrescriptionStyle(props.typepsc, props.libelle);
            const humanDescription = getPrescriptionDescription(props.typepsc, props.libelle);
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
                        {presc._kind === 'surface' && <Layers size={10} className="text-slate-400" />}
                        {presc._kind === 'lineaire' && <Activity size={10} className="text-slate-400" />}
                        {presc._kind === 'ponctuel' && <MapPin size={10} className="text-slate-400" />}
                        <span className="capitalize text-[10px] text-slate-400 font-medium">{presc._kind}</span>
                      </div>
                      <span className="text-[10px] text-slate-300 ml-auto font-mono">
                        Ref: {props.typepsc?.split('_')[0] || "AUTO"}
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