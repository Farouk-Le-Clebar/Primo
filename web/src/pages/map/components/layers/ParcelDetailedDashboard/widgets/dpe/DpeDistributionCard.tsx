import { useMemo } from "react";
import { Card } from "@tremor/react";
import { AlertTriangle, Zap } from "lucide-react";
import { getDpeColors, ORDERED_LABELS } from "./utils";

export default function DpeDistributionCard({ dpeList }: { dpeList: any[] }) {
  const { dpeCounts, maxCount, badDpeCount } = useMemo(() => {
    const counts: Record<string, number> = {};
    let bad = 0;

    dpeList.forEach(d => {
      const dpe = (d.etiquette_dpe || "?").toUpperCase();
      counts[dpe] = (counts[dpe] || 0) + 1;
      if (["E", "F", "G"].includes(dpe)) bad++;
    });

    const max = Math.max(...Object.values(counts), 1);
    return { dpeCounts: counts, maxCount: max, badDpeCount: bad };
  }, [dpeList]);

  return (
    <Card className="border-gray-200 ring-0 shadow-sm p-6 font-inter">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Zap size={16} className="text-gray-400" />
          Répartition des classes énergétiques
        </h3>
        <span className="text-xs text-gray-400">{dpeList.length} DPE analysés</span>
      </div>

      <div className="flex flex-col gap-3">
        {ORDERED_LABELS.map(label => {
          const count = dpeCounts[label] || 0;
          const colors = getDpeColors(label);
          const widthPct = count === 0 ? 0 : Math.max((count / maxCount) * 100, 2); 

          return (
            <div key={label} className="flex items-center gap-4">
              <div className={`w-6 h-6 flex items-center justify-center rounded-sm text-[12px] font-black text-white ${colors.bg}`}>
                {label}
              </div>
              <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden relative">
                <div 
                  className="h-full rounded-sm transition-all duration-500" 
                  style={{ width: `${widthPct}%`, backgroundColor: colors.bar }} 
                />
              </div>
              <div className="w-4 text-right">
                <span className={`text-[13px] font-bold ${count > 0 ? 'text-gray-900' : 'text-gray-300'}`}>
                  {count > 0 ? count : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {badDpeCount > 0 && (
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
          <AlertTriangle size={18} className="text-orange-500 mt-0.5 shrink-0" />
          <p className="text-[12px] text-orange-800 leading-relaxed">
            <span className="font-bold text-orange-900">{badDpeCount} logement(s) classé(s) E, F ou G</span> — obligation de rénovation (Loi Climat & Résilience). Les passoires énergétiques (G) ont vu leur mise en location interdite à compter de 2025.
          </p>
        </div>
      )}
    </Card>
  );
}