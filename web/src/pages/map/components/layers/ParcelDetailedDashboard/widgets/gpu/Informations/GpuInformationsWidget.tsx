import { useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";

// COMPONENTS
import type { ParcelWidgetProps } from "../../../types";
import { extractDepartementForInformation, getInformationStyle, getInformationDescription } from "./utils";
import { getInformationsSurf, getInformationsLin, getInformationsPct } from "../../../../../../../../requests/geoserver/information"; 
import { InfoTooltip } from "./InfoTooltip";

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

  const isEmpty = !data || uniqueInformations.length === 0;

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

      <div className="flex flex-col">
        <div className="overflow-hidden">
          {!isPending && isEmpty ? (
            <div className="py-4 text-sm text-[#878D96] text-center bg-gray-50 rounded-lg border border-gray-100 mt-2">
               Aucune information annexe détectée sur cette parcelle.
            </div>
          ) : (
            <div className="flex flex-col gap-9">
              {uniqueInformations.map((info: any, index: number) => {
                const props = info.properties;
                const style = getInformationStyle(props.typeinf, props.libelle);
                const humanDescription = getInformationDescription(props.typeinf, props.libelle);
                const Icon = style.icon;

                return (
                  <div key={index} className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center`}>
                        <Icon size={14} className="text-[#878D96]" />
                      </div>
                      <h4 className="text-[13px] font-semibold text-[#111111] leading-snug">
                        {props.libelle}
                      </h4>
                    </div>

                    <div className="flex flex-col border-t border-[#F0F0F0]">
                      <div className="py-3 border-b border-[#F0F0F0]">
                        <span className="block text-[13px] font-medium text-[#878D96] mb-1">Description</span>
                        <span className="block text-[13px] font-medium text-[#111111] leading-relaxed">
                          {humanDescription}
                        </span>
                      </div>

                      {props.txt && (
                         <InfoRow 
                           label="Texte complémentaire" 
                           value={props.txt} 
                         />
                      )}

                      <InfoRow 
                        label="Type de géométrie" 
                        value={<span className="capitalize">{info._kind}</span>} 
                      />

                      <InfoRow 
                        label="Référence (Code)" 
                        value={<span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{props.typeinf?.split('_')[0] || "AUTO"}</span>} 
                        isLast={true}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}