import type { QualiteAir } from "../../../../../../../types/environnement";
import PanelCard from "../shared/PanelCard";
import { airLevel, micrograms } from "./pollutionFormat";

export default function AirQualityCard({ air }: { air: QualiteAir | null }) {
  const measures = [
    { label: "Particules fines PM2,5", value: micrograms(air?.pm25 ?? null) },
    { label: "Particules PM10", value: micrograms(air?.pm10 ?? null) },
    { label: "Dioxyde d'azote (NO₂)", value: micrograms(air?.dioxydeAzote ?? null) },
    { label: "Ozone (O₃)", value: micrograms(air?.ozone ?? null) },
  ];
  const measuredAt = air?.mesureLe ? new Date(air.mesureLe).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : null;

  return (
    <PanelCard title="Qualité de l'air" aside={airLevel(air?.indiceEuropeen ?? null)}>
      <dl className="divide-y divide-gray-100 border-y border-gray-100 dark:divide-white/5 dark:border-white/5">
        {measures.map(({ label, value }) => (
          <div key={label} className="flex items-baseline justify-between gap-3 py-2.5">
            <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
            <dd className="text-xs font-medium text-gray-900 dark:text-white">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
        {measuredAt ? `Mesure modélisée du ${measuredAt}, ` : "Mesure modélisée, "}
        mise à jour toutes les heures. Indice européen : 0 à 20 bon, au-delà de 80 mauvais.
      </p>
    </PanelCard>
  );
}
