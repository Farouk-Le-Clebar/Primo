import { BarChart } from "@tremor/react";

import PanelCard from "../shared/PanelCard";
import { median, type DvfRecord } from "./data";
import { formatCurrency } from "./utils";

const SERIES = "Prix médian au m²";

export default function DvfEvolutionChart({ transactions }: { transactions: DvfRecord[] }) {
  const years = new Map<string, number[]>();
  transactions.forEach((t) => {
    if (t.priceM2 === null) return;
    const year = t.date_mutation.slice(0, 4);
    years.set(year, [...(years.get(year) ?? []), t.priceM2]);
  });
  const data = [...years]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, prices]) => ({ year, [SERIES]: median(prices) }));

  return (
    <PanelCard title="Évolution du prix au m²" subtitle="Médiane annuelle des ventes d’un seul bien · les biens observés varient d’une année à l’autre">
      {data.length ? (
        <BarChart
          className="h-56"
          data={data}
          index="year"
          categories={[SERIES]}
          colors={["emerald"]}
          valueFormatter={formatCurrency}
          yAxisWidth={72}
          showLegend={false}
          showAnimation
        />
      ) : (
        <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Aucune vente exploitable pour calculer un prix au m².
        </p>
      )}
    </PanelCard>
  );
}
