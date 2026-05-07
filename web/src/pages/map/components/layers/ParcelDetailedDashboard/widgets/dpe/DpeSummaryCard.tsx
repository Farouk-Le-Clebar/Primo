import { useMemo } from "react";
import { Card } from "@tremor/react";
import { Home, Store } from "lucide-react";
import { getDpeColors, formatEuro, DPE_LABELS_FR } from "./utils";

export default function DpeSummaryCard({ dpeList }: { dpeList: any[] }) {
  const stats = useMemo(() => {
    const countsDpe: Record<string, number> = {};
    const countsGes: Record<string, number> = {};
    
    let validConsoSum = 0, validConsoCount = 0;
    let totalCost = 0, validCostCount = 0;
    let validSurfaceSum = 0, validSurfaceCount = 0;

    dpeList.forEach(d => {
      const dpe = (d.etiquette_dpe || "?").toUpperCase();
      const ges = (d.etiquette_ges || "?").toUpperCase();
      countsDpe[dpe] = (countsDpe[dpe] || 0) + 1;
      countsGes[ges] = (countsGes[ges] || 0) + 1;

      if (d.conso_5_usages_ep_m2_an) { validConsoSum += parseFloat(d.conso_5_usages_ep_m2_an); validConsoCount++; }
      if (d.cout_total_5_usages) { totalCost += parseFloat(d.cout_total_5_usages); validCostCount++; }
      if (d.surface_habitable_logement) { validSurfaceSum += parseFloat(d.surface_habitable_logement); validSurfaceCount++; }
    });

    const dominantDpe = Object.entries(countsDpe).sort((a, b) => b[1] - a[1])[0]?.[0] || "?";
    const dominantGes = Object.entries(countsGes).sort((a, b) => b[1] - a[1])[0]?.[0] || "?";

    const byType = dpeList.reduce((acc, d) => {
      const type = d.type_batiment || "Autre";
      const label = type.charAt(0).toUpperCase() + type.slice(1);
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      dominantDpe,
      dominantGes,
      avgConso: validConsoCount ? Math.round(validConsoSum / validConsoCount) : 0,
      avgCost: validCostCount ? Math.round(totalCost / validCostCount) : 0,
      avgSurface: validSurfaceCount ? Math.round(validSurfaceSum / validSurfaceCount) : 0,
      count: dpeList.length,
      byType
    };
  }, [dpeList]);

  const domColors = getDpeColors(stats.dominantDpe);
  const gesColors = getDpeColors(stats.dominantGes);

  return (
    <Card className="border-gray-200 ring-0 shadow-sm p-6 h-full flex flex-col font-inter">
      <div className="mb-6">
        <h3 className="text-[11px] font-bold text-[#878D96] uppercase tracking-wider mb-1">Performance Globale</h3>
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-black ${domColors.text}`}>{stats.dominantDpe}</span>
          <span className="text-sm font-bold text-[#878D96]">
            ({DPE_LABELS_FR[stats.dominantDpe] || "Inconnu"})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8 border-t border-b border-gray-100 pt-4 pb-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100 flex flex-col justify-center items-center">
          <span className="block text-sm font-bold text-gray-900">{stats.avgConso} <span className="text-[10px] font-normal">kWh/m²</span></span>
          <span className="block text-[10px] text-gray-500 uppercase mt-0.5">Conso. Moy.</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100 flex flex-col justify-center items-center">
          <span className="block text-sm font-bold text-gray-900">{formatEuro(stats.avgCost)}</span>
          <span className="block text-[10px] text-gray-500 uppercase mt-0.5">Coût Moy./an</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100 flex flex-col justify-center items-center">
          <span className="block text-sm font-bold text-gray-900">{stats.avgSurface} <span className="text-[10px] font-normal">m²</span></span>
          <span className="block text-[10px] text-gray-500 uppercase mt-0.5">Surface Moy.</span>
        </div>
      </div>

      <div className="pt-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[11px] font-bold text-[#878D96] uppercase tracking-wider">Volume</h3>
          <span className="text-sm font-bold text-gray-900">{stats.count} DPE</span>
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
        <h3 className="text-[11px] font-bold text-[#878D96] uppercase tracking-wider mb-1">Émissions GES dominantes</h3>
        <div className="flex items-center gap-2">
           <span className={`w-8 h-8 flex items-center justify-center rounded text-lg font-black ${gesColors.bg} text-white`}>
             {stats.dominantGes}
           </span>
           <span className="text-sm font-medium text-gray-500">Gaz à effet de serre</span>
        </div>
      </div>
    </Card>
  );
}