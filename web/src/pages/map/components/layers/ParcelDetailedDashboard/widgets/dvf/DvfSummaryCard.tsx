import { Card } from "@tremor/react";
import { median, type DvfRecord } from "./data";
import { formatCurrency } from "./utils";

export default function DvfSummaryCard({
  transactions,
}: {
  transactions: DvfRecord[];
}) {
  const prices = transactions.flatMap((t) =>
    t.priceM2 !== null ? [t.priceM2] : [],
  );
  const middle = median(prices);
  const count = transactions.reduce((sum, t) => sum + t.occurrences, 0);
  const missing = transactions
    .filter((t) => t.surface_reelle_bati === null)
    .reduce((sum, t) => sum + t.occurrences, 0);
  return (
    <Card className="rounded-xl border-gray-200 dark:border-white/10 ring-0 shadow-sm p-6 font-inter">
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
        Médiane indicative du bâti
      </p>
      <div className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        {formatCurrency(middle)}
        {middle !== null && (
          <span className="text-sm font-medium text-gray-500"> /m²</span>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {prices.length} enregistrement{prices.length > 1 ? "s" : ""} exploitable
        {prices.length > 1 ? "s" : ""} pour le ratio
      </p>
      <div className="my-6 grid grid-cols-2 gap-3 border-y border-gray-100 py-5 dark:border-white/5">
        {[
          ["Minimum", prices.length ? Math.min(...prices) : null],
          ["Maximum", prices.length ? Math.max(...prices) : null],
        ].map(([label, value]) => (
          <div key={String(label)}>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
              {formatCurrency(value as number | null)}
            </p>
          </div>
        ))}
      </div>
      <dl className="space-y-4 text-sm">
        {[
          ["Lignes sources retenues", count],
          ["Lignes sans surface bâtie", missing],
          ["Fiches affichées", transactions.length],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3">
            <dt className="text-gray-500 dark:text-gray-400">{label}</dt>
            <dd className="font-semibold text-gray-900 dark:text-white">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 border-t border-gray-100 pt-5 text-xs leading-relaxed text-gray-500 dark:border-white/5 dark:text-gray-400">
        Calcul sur les ventes avec montant et surface bâtie positifs, hors
        dépendances et lignes ambiguës. Le montant DVF peut couvrir plusieurs
        biens : ce ratio ne constitue pas une estimation de la parcelle.
      </p>
    </Card>
  );
}
