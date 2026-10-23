import { dateLabel, text } from "../shared/format";
import type { DpeEntry } from "./data";

type Detail = { label: string; value: string };

const join = (...values: unknown[]): string =>
  values.map((v) => text(v, "")).filter(Boolean).join(" · ") || "Non renseigné";

export default function DpeDetails({ entry }: { entry: DpeEntry }) {
  const { raw } = entry;
  const groups: { title: string; details: Detail[] }[] = [
    {
      title: "Équipements",
      details: [
        { label: "Chauffage", value: join(raw.type_energie_principale_chauffage, raw.type_installation_chauffage) },
        { label: "Eau chaude", value: join(raw.type_energie_principale_ecs, raw.type_installation_ecs) },
        { label: "Ventilation", value: join(raw.type_ventilation) },
      ],
    },
    {
      title: "Enveloppe",
      details: [
        { label: "Isolation murs", value: join(raw.qualite_isolation_enveloppe) },
        { label: "Menuiseries", value: join(raw.qualite_isolation_menuiseries) },
        { label: "Vitrage", value: join(raw.type_vitrage) },
      ],
    },
    {
      title: "Diagnostic",
      details: [
        { label: "Construction", value: join(raw.annee_construction) },
        { label: "Émissions", value: entry.emission ? `${Math.round(entry.emission)} kg CO₂/m²/an` : "Non renseigné" },
        { label: "Fin de validité", value: dateLabel(raw.date_fin_validite_dpe) },
      ],
    },
  ];

  return (
    <div className="primo-page-enter grid gap-4 bg-gray-50/70 px-4 py-4 sm:grid-cols-3 dark:bg-white/[0.02]">
      {groups.map(({ title, details }) => (
        <dl key={title} className="min-w-0">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{title}</p>
          {details.map(({ label, value }) => (
            <div key={label} className="py-1">
              <dt className="text-[11px] text-gray-500 dark:text-gray-400">{label}</dt>
              <dd className="text-xs font-medium text-gray-900 dark:text-white">{value}</dd>
            </div>
          ))}
        </dl>
      ))}
      {text(raw.numero_dpe, "") && (
        <p className="font-mono text-[11px] text-gray-500 sm:col-span-3 dark:text-gray-400">N° DPE {text(raw.numero_dpe)}</p>
      )}
    </div>
  );
}
