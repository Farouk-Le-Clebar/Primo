import PanelCard from "../shared/PanelCard";
import ShareList from "../shared/ShareList";
import type { DvfStats } from "./stats";
import { formatCurrency } from "./utils";

export default function DvfPriceRange({ stats }: { stats: DvfStats }) {
  const range = [
    { label: "Minimum", value: stats.minPrice },
    { label: "Médiane", value: stats.medianPrice },
    { label: "Maximum", value: stats.maxPrice },
  ];

  return (
    <PanelCard title="Prix au m² du bâti" aside={stats.priceScope}>
      <dl className="grid grid-cols-3 divide-x divide-gray-100 rounded-lg border border-gray-100 dark:divide-white/5 dark:border-white/5">
        {range.map(({ label, value }) => (
          <div key={label} className="min-w-0 px-3 py-2.5">
            <dt className="text-[11px] text-gray-500 dark:text-gray-400">{label}</dt>
            <dd className="mt-0.5 truncate text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(value)}</dd>
          </div>
        ))}
      </dl>
      {stats.surfaceBins.length > 0 && (
        <section className="mt-5">
          <h4 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Surfaces bâties
          </h4>
          <ShareList items={stats.surfaceBins} barClass="bg-amber-500/15 dark:bg-amber-500/20" />
        </section>
      )}
      <p className="mt-4 border-t border-gray-100 pt-4 text-[11px] leading-relaxed text-gray-500 dark:border-white/5 dark:text-gray-400">
        Méthode Etalab : prix de la vente ÷ surface bâtie, uniquement pour les ventes d’un seul bien
        (dépendances exclues). Les ventes groupées, sans surface ou au-delà de 100 000 €/m² sont écartées.
      </p>
    </PanelCard>
  );
}
