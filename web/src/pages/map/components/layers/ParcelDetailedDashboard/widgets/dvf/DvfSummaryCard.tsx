import { useMemo } from "react";
import { Card } from "@tremor/react";
import { Home, Store } from "lucide-react";

export default function DvfSummaryCard({ transactions }: { transactions: any[] }) {
  const stats = useMemo(() => {
    const validTxs = transactions.filter(t => t.valeur_fonciere && t.surface_reelle_bati > 0);
    const pricesM2 = validTxs.map(t => parseFloat(t.valeur_fonciere) / t.surface_reelle_bati).sort((a, b) => a - b);
    const totalValue = validTxs.reduce((sum, t) => sum + parseFloat(t.valeur_fonciere), 0);
    const min = pricesM2.length ? Math.round(pricesM2[0]) : 0;
    const max = pricesM2.length ? Math.round(pricesM2[pricesM2.length - 1]) : 0;
    const avg = pricesM2.length ? Math.round(pricesM2.reduce((a, b) => a + b, 0) / pricesM2.length) : 0;
    const median = pricesM2.length ? Math.round(pricesM2[Math.floor(pricesM2.length / 2)]) : 0;
    const byType = validTxs.reduce((acc, t) => {
      const type = t.type_local || "Autre";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { min, max, avg, median, totalValue, count: validTxs.length, byType };
  }, [transactions]);

  const formatEuro = (val: number) => 
    new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR', 
      maximumFractionDigits: 0 
    }).format(val).replace(/\s/g, '.');

  const formatTotalValue = (val: number) => {
    return val.toLocaleString('de-DE') + " €";
  };

  return (
    <Card className="border-gray-200 ring-0 shadow-sm p-6 h-full flex flex-col font-inter ">
      <div className="mb-6">
        <h3 className="text-[11px] font-bold text-[#878D96] uppercase tracking-wider mb-1">Prix Moyen au m²</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-[#111111]">{formatEuro(stats.avg)}</span>
          <span className="text-sm font-bold text-[#878D96]">/m²</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8 border-t border-b border-gray-100 pt-4 pb-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
          <span className="block text-sm font-bold text-gray-900">{formatEuro(stats.median)}</span>
          <span className="block text-[10px] text-gray-500 uppercase mt-0.5">Médiane</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
          <span className="block text-sm font-bold text-gray-900">{formatEuro(stats.min)}</span>
          <span className="block text-[10px] text-gray-500 uppercase mt-0.5">Minimum</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
          <span className="block text-sm font-bold text-gray-900">{formatEuro(stats.max)}</span>
          <span className="block text-[10px] text-gray-500 uppercase mt-0.5">Maximum</span>
        </div>
      </div>

      <div className=" pt-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[11px] font-bold text-[#878D96] uppercase tracking-wider">Volume</h3>
          <span className="text-sm font-bold text-gray-900">{stats.count} Ventes</span>
        </div>
        <div className="flex flex-col gap-3">
          {Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {type.toLowerCase().includes('appart') ? <Home size={14} className="text-indigo-500" /> : <Store size={14} className="text-amber-500" />}
                <span className="text-[13px] text-gray-700">{type}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold">{String(count)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-gray-100 pt-6">
        <h3 className="text-[11px] font-bold text-[#878D96] uppercase tracking-wider mb-1">Valeur Totale des transactions</h3>
        <span className="text-xl font-bold text-[#111111]">{formatTotalValue(stats.totalValue)}</span>
      </div>
    </Card>
  );
}