import { useQuery } from "@tanstack/react-query";

// COMPONENTS
import { WidgetCard } from "../WidgetCard";
import type { ParcelWidgetProps } from "../../types";
import { getDvfParcelle } from "../../../../../../../requests/dvf/information";
import { formatCurrency, formatDate, getTypeLocalStyle } from "./utils";
import { DvfTooltip } from "./InfoTooltip";

// ICONS
import { TrendingUp, Calendar, Maximize, Coins } from "lucide-react";

export default function DvfWidget({ feature }: ParcelWidgetProps) {
  const idParcelle = feature?.properties?.id;

  const { data, isLoading } = useQuery({
    queryKey: ['dvf-parcelle', idParcelle],
    queryFn: () => getDvfParcelle(String(idParcelle)),
    enabled: !!idParcelle && String(idParcelle).length === 14,
    retry: false,
  });

  const isEmpty = !data || !data.historique || data.historique.length === 0;

  return (
    <WidgetCard
      title="Historique des Ventes"
      subtitle="Données DVF (5 dernières années)"
      icon={TrendingUp}
      iconColorClass="bg-emerald-50 text-emerald-600"
      loading={isLoading}
      loadingText="Analyse de l'historique financier..."
      headerAction={<DvfTooltip />}
      isEmpty={isEmpty}
      emptyText="Aucune transaction immobilière publique récente trouvée pour cette parcelle."
    >
      {!isEmpty && (
        <div className="space-y-4">
          
          {data.stats.prixMoyenM2 && (
            <div className="flex items-center justify-between p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
              <div>
                <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider mb-1">
                  Prix Moyen Estimé
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800">
                    {formatCurrency(data.stats.prixMoyenM2)}
                  </span>
                  <span className="text-sm font-bold text-slate-500">/ m²</span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center justify-center bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 shadow-sm border border-slate-100">
                  {data.stats.nombreTransactions} transaction{data.stats.nombreTransactions > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {data.historique.map((transaction: any, index: number) => {
              const style = getTypeLocalStyle(transaction.typeLocal);
              const Icon = style.icon;

              return (
                <div 
                  key={index} 
                  className="group relative flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-slate-200 transition-all duration-200 overflow-hidden"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.bar}`} />

                  <div className={`flex-shrink-0 mt-0.5 w-10 h-10 rounded-full ${style.bg} flex items-center justify-center border ${style.border}`}>
                    <Icon size={18} className={style.color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-bold text-slate-800 capitalize truncate">
                        {transaction.typeLocal || transaction.nature}
                      </h4>
                      <span className="flex-shrink-0 text-sm font-black text-slate-800">
                        {formatCurrency(transaction.prix)}
                      </span>
                    </div>

                    <div className="flex items-center flex-wrap gap-x-4 gap-y-2 pt-2 mt-2 border-t border-slate-50">
                      
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-500 font-medium">
                          {formatDate(transaction.date)}
                        </span>
                      </div>

                      {transaction.surface && (
                        <div className="flex items-center gap-1.5">
                          <Maximize size={12} className="text-slate-400" />
                          <span className="text-xs text-slate-500 font-medium">
                            {transaction.surface} m²
                          </span>
                        </div>
                      )}

                      {transaction.prixM2 && (
                        <div className="flex items-center gap-1.5 ml-auto">
                          <Coins size={12} className={style.color} />
                          <span className={`text-xs font-bold ${style.color}`}>
                            {formatCurrency(transaction.prixM2)} /m²
                          </span>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </WidgetCard>
  );
}