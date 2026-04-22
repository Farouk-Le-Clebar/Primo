import { useQuery } from "@tanstack/react-query";
import React from "react";

// COMPONENTS
import { getDpeBan } from "../../../../../../../requests/dpe/information";
import { formatCurrency, formatDate, getDpeColorStyle } from "./utils";
import { DpeTooltip } from "./InfoTooltip";

// ICONS
import { Calendar, Maximize, Flame, ThermometerSnowflake } from "lucide-react";

interface DpeWidgetProps {
  selectedParcelle: any; 
}

export default function DpeWidget({ selectedParcelle }: DpeWidgetProps) {
  
  const addokFeatures = selectedParcelle?.addokData?.features;
  const identifiantBan = addokFeatures && addokFeatures.length > 0 
    ? addokFeatures[0].properties.id 
    : null;

  console.log("🔍 DpeWidget - Identifiant BAN extrait :", identifiantBan);
  console.log("SelectedParcelle:", selectedParcelle);

  const { data, isLoading } = useQuery({
    queryKey: ['dpe-ban', identifiantBan],
    queryFn: () => getDpeBan(String(identifiantBan)),
    enabled: !!identifiantBan,
    retry: false,
  });

  const isEmpty = !data || !data.historique || data.historique.length === 0;

  const InfoRow = ({ label, value, isLast = false, valueColor = "text-[#111111]" }: { label: string, value: string | React.ReactNode, isLast?: boolean, valueColor?: string }) => (
    <div className={`flex justify-between items-center py-3 ${!isLast ? 'border-b border-[#F0F0F0]' : ''}`}>
      <span className="text-[13px] font-medium text-[#878D96] shrink-0 pr-4">{label}</span>
      <span className={`text-[13px] font-medium ${valueColor} text-right truncate`}>{value}</span>
    </div>
  );

  return (
    <div className="font-inter">
      <div className="flex items-center gap-2 mb-3">
        {isLoading && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-medium text-[#878D96]">Analyse énergétique...</span>
          </div>
        )}
        <div className="ml-auto">
          <DpeTooltip />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {!isLoading && !isEmpty && data.dpePrincipal && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-row items-center justify-around">
            <div className="flex flex-col items-center">
               <p className="text-[11px] font-bold text-[#878D96] uppercase tracking-wider mb-2">DPE</p>
               <div className={`w-12 h-12 flex items-center justify-center rounded-lg text-2xl font-black ${getDpeColorStyle(data.dpePrincipal.etiquetteDpe)}`}>
                 {data.dpePrincipal.etiquetteDpe || '?'}
               </div>
            </div>
             <div className="flex flex-col items-center">
               <p className="text-[11px] font-bold text-[#878D96] uppercase tracking-wider mb-2">GES</p>
               <div className={`w-12 h-12 flex items-center justify-center rounded-lg text-2xl font-black ${getDpeColorStyle(data.dpePrincipal.etiquetteGes)}`}>
                 {data.dpePrincipal.etiquetteGes || '?'}
               </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {isEmpty && !isLoading ? (
            <div className="py-4 text-sm text-[#878D96] text-center bg-gray-50 rounded-lg border border-gray-100">
              Aucun DPE enregistré pour cette adresse depuis juillet 2021.
            </div>
          ) : (
            data?.historique.map((dpe: any, index: number) => {
              return (
                <div key={index} className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500">
                        <Flame size={14} />
                      </div>
                      <h4 className="text-[13px] font-semibold text-[#111111] capitalize">
                        {dpe.typeBatiment || "Logement"}
                      </h4>
                    </div>
                     <span className="text-[13px] font-medium text-[#878D96]">
                       N° {dpe.numeroDpe}
                     </span>
                  </div>

                  <div className="flex flex-col border-t border-[#F0F0F0]">
                    <InfoRow 
                      label="Établi le" 
                      value={<div className="flex items-center gap-1.5 justify-end"><Calendar size={12} className="text-[#878D96]" /> {formatDate(dpe.dateEtablissement)}</div>} 
                    />
                    {dpe.surface && (
                      <InfoRow 
                        label="Surface habitable" 
                        value={<div className="flex items-center gap-1.5 justify-end"><Maximize size={12} className="text-[#878D96]" /> {dpe.surface} m²</div>} 
                      />
                    )}
                    {dpe.consoM2 && (
                      <InfoRow 
                        label="Consommation" 
                        value={<div className="flex items-center gap-1.5 justify-end"><ThermometerSnowflake size={12} className="text-[#878D96]" /> {dpe.consoM2} kWh/m²/an</div>} 
                      />
                    )}
                     {dpe.energieChauffage && (
                      <InfoRow 
                        label="Chauffage principal" 
                        value={dpe.energieChauffage} 
                      />
                    )}
                    {dpe.coutTotal && (
                      <InfoRow 
                        label="Coût annuel estimé" 
                        value={<div className="flex items-center gap-1.5 justify-end text-emerald-600 font-bold">{formatCurrency(dpe.coutTotal)}</div>}
                        isLast={true}
                      />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}