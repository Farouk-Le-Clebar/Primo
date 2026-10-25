import { ChevronDown } from "lucide-react";

import { dateLabel } from "../shared/format";
import { TONES } from "../shared/tones";
import AutorisationDetails from "./AutorisationDetails";
import { STATE_TONES, TYPE_TONES, dossierState, states, types, type Dossier } from "./data";

type AutorisationRowProps = {
  dossier: Dossier;
  open: boolean;
  onToggle: (key: string) => void;
};

export default function AutorisationRow({ dossier, open, onToggle }: AutorisationRowProps) {
  const state = dossierState(dossier);

  return (
    <li className="border-b border-gray-100 last:border-0 dark:border-white/5">
      <button
        onClick={() => onToggle(dossier.key)}
        aria-expanded={open}
        className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-600 dark:hover:bg-white/[0.03]"
      >
        <span className={`flex h-9 w-9 items-center justify-center rounded-md text-xs font-bold ${TONES[TYPE_TONES[dossier.type] ?? "gray"]}`}>
          {dossier.type}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">
            {types[dossier.type] || dossier.type}
          </span>
          <span className="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">
            N° {dossier.numero} · {dateLabel(dossier.date)}
            {dossier.rows.length > 1 ? ` · ${dossier.rows.length} lignes sources` : ""}
          </span>
        </span>
        <span className="flex items-center gap-3">
          <span className={`hidden rounded-md px-2 py-1 text-[11px] font-medium sm:inline ${TONES[STATE_TONES[state] ?? "gray"]}`}>
            {states[state] || "État inconnu"}
          </span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      {open && (
        <div className="primo-page-enter divide-y divide-gray-100 bg-gray-50/70 dark:divide-white/5 dark:bg-white/[0.02]">
          {dossier.rows.map((row, index) => (
            <AutorisationDetails key={`${String(row.id ?? index)}`} row={row} />
          ))}
        </div>
      )}
    </li>
  );
}
