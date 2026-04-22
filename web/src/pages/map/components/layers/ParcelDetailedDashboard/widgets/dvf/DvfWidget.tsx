import { useQuery } from "@tanstack/react-query";

// COMPONENTS
import type { ParcelWidgetProps } from "../../types";
import { getDvfParcelle } from "../../../../../../../requests/dvf/information";
import { formatCurrency, formatDate, getTypeLocalStyle } from "./utils";
import { DvfTooltip } from "./InfoTooltip";

// ICONS
import { Calendar, Maximize, Coins } from "lucide-react";

export default function DvfWidget({ feature }: ParcelWidgetProps) {
  const idParcelle = feature?.properties?.id;

  const { data, isLoading } = useQuery({
    queryKey: ['dvf-parcelle', idParcelle],
    queryFn: () => getDvfParcelle(String(idParcelle)),
    enabled: !!idParcelle && String(idParcelle).length === 14,
    retry: false,
  });

  console.log("DATA DVF PARCELLE:", data);

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
            <span className="text-[11px] font-medium text-[#878D96]">Analyse de l'historique...</span>
          </div>
        )}
        <div className="ml-auto">
          <DvfTooltip />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {!isLoading && !isEmpty && data.stats.prixMoyenM2 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
            <p className="text-[11px] font-bold text-[#878D96] uppercase tracking-wider mb-2">
              Prix Moyen Estimé
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-[#111111]">
                {formatCurrency(data.stats.prixMoyenM2)}
              </span>
              <span className="text-sm font-bold text-[#878D96]">/ m²</span>
            </div>
            <div className="mt-4 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full">
              <span className="text-[11px] font-semibold text-[#878D96]">
                Basé sur {data.stats.nombreTransactions} transaction{data.stats.nombreTransactions > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-6">
          {isEmpty && !isLoading ? (
            <div className="py-4 text-sm text-[#878D96] text-center bg-gray-50 rounded-lg border border-gray-100">
              Aucune transaction immobilière publique récente trouvée.
            </div>
          ) : (
            data?.historique.map((transaction: any, index: number) => {
              const style = getTypeLocalStyle(transaction.typeLocal);
              const Icon = style.icon;

              return (
                <div key={index} className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[#878D96]">
                        <Icon size={14} />
                      </div>
                      <h4 className="text-[13px] font-semibold text-[#111111] capitalize">
                        {transaction.typeLocal || transaction.nature}
                      </h4>
                    </div>
                    <span className="text-[15px] font-bold text-[#111111]">
                      {formatCurrency(transaction.prix)}
                    </span>
                  </div>

                  <div className="flex flex-col border-t border-[#F0F0F0]">
                    <InfoRow 
                      label="Date de mutation" 
                      value={<div className="flex items-center gap-1.5 justify-end"><Calendar size={12} className="text-[#878D96]" /> {formatDate(transaction.date)}</div>} 
                    />
                    {transaction.surface && (
                      <InfoRow 
                        label="Surface réelle" 
                        value={<div className="flex items-center gap-1.5 justify-end"><Maximize size={12} className="text-[#878D96]" /> {transaction.surface} m²</div>} 
                      />
                    )}
                    {transaction.prixM2 && (
                      <InfoRow 
                        label="Prix au m²" 
                        value={<div className="flex items-center gap-1.5 justify-end text-emerald-600 font-bold"><Coins size={12} /> {formatCurrency(transaction.prixM2)} /m²</div>}
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