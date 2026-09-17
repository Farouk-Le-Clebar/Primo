import { Card, BarChart } from "@tremor/react";
import { median, type DvfRecord } from "./data";
import { formatCurrency } from "./utils";

export default function DvfEvolutionChart({
  transactions,
}: {
  transactions: DvfRecord[];
}) {
  const years = new Map<string, number[]>();
  for (const t of transactions) {
    if (t.priceM2 === null) continue;
    const year = t.date_mutation.slice(0, 4);
    years.set(year, [...(years.get(year) || []), t.priceM2]);
  }
  const data = [...years.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, prices]) => ({ year, "Médiane indicative": median(prices) }));
  return (
    <Card className="flex-none rounded-xl border-gray-200 dark:border-white/10 ring-0 shadow-sm p-6 font-inter">
      <h3 className="font-semibold text-gray-900 dark:text-white">
        Prix au m² par année
      </h3>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Médiane des ratios exploitables · les biens observés varient d’une année
        à l’autre
      </p>
      {data.length ? (
        <BarChart
          className="h-60 mt-5"
          data={data}
          index="year"
          categories={["Médiane indicative"]}
          colors={["emerald"]}
          valueFormatter={formatCurrency}
          yAxisWidth={80}
          showLegend={false}
          showAnimation={false}
        />
      ) : (
        <p className="py-12 text-center text-sm text-gray-500">
          Aucune donnée suffisante pour calculer un prix au m².
        </p>
      )}
    </Card>
  );
}
