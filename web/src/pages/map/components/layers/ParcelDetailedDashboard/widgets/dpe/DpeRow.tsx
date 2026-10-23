import { ChevronDown } from "lucide-react";

import { dateLabel, text } from "../shared/format";
import type { DpeEntry } from "./data";
import DpeDetails from "./DpeDetails";
import { formatEuro, getDpeColors } from "./utils";

type DpeRowProps = {
  entry: DpeEntry;
  open: boolean;
  onToggle: (key: string) => void;
};

const locationOf = (entry: DpeEntry): string =>
  [
    text(entry.raw.logement_etage, "") && `Étage ${text(entry.raw.logement_etage)}`,
    text(entry.raw.logement_porte, "") && `Porte ${text(entry.raw.logement_porte)}`,
  ]
    .filter(Boolean)
    .join(" · ") || text(entry.raw.type_batiment, "Logement");

export default function DpeRow({ entry, open, onToggle }: DpeRowProps) {
  const energy = getDpeColors(entry.label);
  const ges = getDpeColors(entry.ges);

  return (
    <li className="border-b border-gray-100 last:border-0 dark:border-white/5">
      <button
        onClick={() => onToggle(entry.key)}
        aria-expanded={open}
        className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-600 dark:hover:bg-white/[0.03]"
      >
        <span className="flex items-center gap-1">
          <span className={`flex h-9 w-9 items-center justify-center rounded-md text-base font-bold ${energy.bg} ${energy.text}`}>{entry.label}</span>
          <span className={`flex h-6 w-6 items-center justify-center rounded text-[11px] font-bold ${ges.bg} ${ges.text}`} title="Classe GES">{entry.ges}</span>
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold capitalize text-gray-900 dark:text-white">{locationOf(entry)}</span>
            {entry.expired && (
              <span className="shrink-0 rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">Expiré</span>
            )}
          </span>
          <span className="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">
            {dateLabel(entry.date)}
            {entry.surface ? ` · ${entry.surface.toLocaleString("fr-FR")} m²` : ""}
            {entry.cost ? ` · ${formatEuro(entry.cost)}/an` : ""}
          </span>
        </span>
        <span className="flex items-center gap-3">
          <span className="text-right">
            <span className="block text-sm font-semibold tabular-nums text-gray-900 dark:text-white">
              {entry.conso ? Math.round(entry.conso).toLocaleString("fr-FR") : "—"}
            </span>
            <span className="block text-[10px] text-gray-500 dark:text-gray-400">kWh/m²/an</span>
          </span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      {open && <DpeDetails entry={entry} />}
    </li>
  );
}
