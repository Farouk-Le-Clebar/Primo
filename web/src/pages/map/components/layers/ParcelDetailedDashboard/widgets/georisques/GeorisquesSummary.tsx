import PanelCard from "../shared/PanelCard";
import ShareList from "../shared/ShareList";
import { dateLabel, text } from "../shared/format";
import type { GeorisquesData } from "./data";

const catnatShares = (data: GeorisquesData) => {
  const counts = new Map<string, number>();
  (data.catnat ?? []).forEach((e) => {
    const label = text(e.lib_risque_jo, "Non renseigné");
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });
  return [...counts].map(([key, count]) => ({ key, label: key, count })).sort((a, b) => b.count - a.count);
};

export default function GeorisquesSummary({ data }: { data: GeorisquesData }) {
  const shares = catnatShares(data);
  const facts = [
    { label: "Code INSEE", value: text(data.properties.code_insee) },
    { label: "Export GASPAR", value: dateLabel(data.properties.date_export_gaspar) },
    { label: "Collecte", value: dateLabel(data.properties.fetched_at) },
  ];

  return (
    <>
      <PanelCard title={data.commune} aside="Échelle communale">
        <dl className="divide-y divide-gray-100 border-y border-gray-100 dark:divide-white/5 dark:border-white/5">
          {facts.map(({ label, value }) => (
            <div key={label} className="flex items-baseline justify-between gap-3 py-2.5">
              <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
              <dd className="text-xs font-medium text-gray-900 dark:text-white">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
          Ces informations concernent la commune : elles ne déterminent pas l’exposition de la parcelle
          ou du bâtiment. Une absence de donnée ne signifie pas une absence de risque.
        </p>
      </PanelCard>
      {shares.length > 0 && (
        <PanelCard title="Catastrophes reconnues" aside={`${data.catnat?.length ?? 0} arrêtés`}>
          <ShareList items={shares} barClass="bg-rose-500/15 dark:bg-rose-500/20" />
        </PanelCard>
      )}
    </>
  );
}
