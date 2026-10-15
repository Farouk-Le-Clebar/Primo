import DataCard from "../shared/DataCard";
import { dateLabel, text } from "../shared/format";
import type { GeorisquesData } from "./data";

export default function GeorisquesSummary({ data }: { data: GeorisquesData }) {
  return (
    <DataCard
      title={data.commune}
      subtitle={`Données communales · ${text(data.properties.code_insee)}`}
    >
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        {data.risques?.length ?? "—"}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        types et sous-types de risques recensés dans GASPAR
      </p>
      <dl className="my-6 space-y-4 text-sm">
        {[
          ["Arrêtés CatNat", data.catnat?.length ?? "Non renseigné"],
          ["Export GASPAR", dateLabel(data.properties.date_export_gaspar)],
          ["Collecte", dateLabel(data.properties.fetched_at)],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3">
            <dt className="text-gray-500">{label}</dt>
            <dd className="text-right font-medium text-gray-900 dark:text-white">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-gray-100 pt-4 text-xs leading-relaxed text-gray-500 dark:border-white/5">
        Ces informations concernent la commune. Elles ne déterminent pas
        l’exposition de la parcelle ou du bâtiment. Une absence de donnée ne
        signifie pas une absence de risque.
      </p>
      <p className="mt-3 text-xs text-gray-500">
        Sources : Géorisques · GASPAR
      </p>
    </DataCard>
  );
}
