import { AlertTriangle } from "lucide-react";

import PanelCard from "../shared/PanelCard";
import type { GpuFeature } from "./types";
import { formatDate, getDocumentAction, zoneInfo, zoneTone } from "./utils";

type PluZoneCardProps = {
  zones: GpuFeature[];
  inseeCode?: string;
};

export default function PluZoneCard({ zones, inseeCode }: PluZoneCardProps) {
  const props = zones[0].properties;
  const info = zoneInfo(props.libelle);
  const action = getDocumentAction(props, inseeCode);
  const facts = [
    { label: "Libellé complet", value: props.libelong || props.libelle || "Non renseigné" },
    { label: "Approbation", value: formatDate(props.datvalid) },
    { label: "Destination dominante", value: props.destdomi || "Mixte / indéfinie" },
  ];

  return (
    <PanelCard title="Zonage applicable" aside="PLU · GPU">
      <div className="flex items-center gap-3">
        <span className={`flex h-12 min-w-12 items-center justify-center rounded-lg px-2 text-lg font-bold ${zoneTone(props.libelle)}`}>
          {props.libelle || "—"}
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-gray-900 dark:text-white">{info.label}</p>
          <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{info.desc}</p>
        </div>
      </div>
      {zones.length > 1 && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>
            Parcelle multi-zonée :{" "}
            {zones.map(({ properties: p }) => (
              <span key={p.libelle} className={`mr-1 inline-block rounded px-1.5 font-semibold ${zoneTone(p.libelle)}`}>{p.libelle}</span>
            ))}
          </span>
        </div>
      )}
      <dl className="mt-4 divide-y divide-gray-100 border-y border-gray-100 dark:divide-white/5 dark:border-white/5">
        {facts.map(({ label, value }) => (
          <div key={label} className="flex items-baseline justify-between gap-3 py-2.5">
            <dt className="shrink-0 text-xs text-gray-500 dark:text-gray-400">{label}</dt>
            <dd className="truncate text-right text-xs font-medium text-gray-900 dark:text-white" title={value}>{value}</dd>
          </div>
        ))}
      </dl>
      {action && (
        <a
          href={action.url}
          target="_blank"
          rel="noopener noreferrer"
          download={action.type === "zip"}
          className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          <action.icon size={14} />
          {action.label}
        </a>
      )}
      <p className="mt-4 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
        Le zonage seul ne permet pas de conclure à la constructibilité : se référer au règlement écrit.
      </p>
    </PanelCard>
  );
}
