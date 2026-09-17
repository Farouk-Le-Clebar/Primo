import type { DvfRecord } from "./data";
import { useMemo } from "react";
import { Card, DonutChart, Legend, Grid, Col } from "@tremor/react";

export default function DvfDistributionCards({
  transactions,
}: {
  transactions: DvfRecord[];
}) {
  const donutData = useMemo(() => {
    const counts: Record<string, number> = {};
    transactions.forEach((t) => {
      const type = t.type_local || "Non renseigné";
      counts[type] = (counts[type] || 0) + t.occurrences;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const surfaceStats = useMemo(() => {
    const bins = { "< 40 m²": 0, "40-60 m²": 0, "> 60–90 m²": 0, "> 90 m²": 0 };
    transactions.forEach((t) => {
      const s = t.surface_reelle_bati;
      if (s === null) return;
      if (s < 40) bins["< 40 m²"] += t.occurrences;
      else if (s <= 60) bins["40-60 m²"] += t.occurrences;
      else if (s <= 90) bins["> 60–90 m²"] += t.occurrences;
      else bins["> 90 m²"] += t.occurrences;
    });
    return Object.entries(bins).filter(([, count]) => count > 0);
  }, [transactions]);

  return (
    <Grid numItems={1} numItemsSm={2} className="gap-6">
      <Col>
        <Card className="border-gray-200 ring-0 shadow-sm p-6 h-full font-inter">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-6">
            Surfaces bâties renseignées
          </h3>
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-[#232323] pb-2">
            <span>Surface</span>
            <span>Lignes sources</span>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            {!surfaceStats.length && (
              <p className="text-xs text-gray-500">
                Aucune surface bâtie renseignée.
              </p>
            )}
            {surfaceStats.map(([label, count]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[13px] text-gray-700 dark:text-gray-300 w-20 shrink-0">
                  {label}
                </span>
                <div className="flex-1 px-4">
                  <div
                    className="h-5 bg-emerald-100 dark:bg-emerald-500/20 rounded flex items-center px-2"
                    style={{
                      width: `${(count / surfaceStats.reduce((sum, [, value]) => sum + value, 0)) * 100}%`,
                      minWidth: "30px",
                    }}
                  >
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                      {count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Col>

      <Col>
        <Card className="border-gray-200 ring-0 shadow-sm p-6 h-full font-inter">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-6">
            Types de biens · lignes sources
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-4">
            <DonutChart
              className="w-40 h-40"
              data={donutData}
              category="value"
              index="name"
              colors={["indigo", "amber", "cyan", "rose"]}
              showAnimation={false}
              variant="pie"
            />
            <Legend
              categories={donutData.map((d) => d.name)}
              colors={["indigo", "amber", "cyan", "rose"]}
              className="mt-4 sm:mt-0 flex flex-col gap-2 max-w-[150px]"
            />
          </div>
        </Card>
      </Col>
    </Grid>
  );
}
