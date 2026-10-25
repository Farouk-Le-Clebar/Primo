import MatchBadge from "../logement/MatchBadge";
import type { MatchLevel } from "../logement/types";
import type { DvfRecord } from "./data";
import { PRICE_STATUS_LABELS } from "./pricing";
import { formatCurrency, formatDate, getTypeLocalStyle } from "./utils";

const plural = (count: number, word: string): string => `${count} ${word}${count > 1 ? "s" : ""}`;

const area = (value: number): string => `${value.toLocaleString("fr-FR")} m²`;

function contentsOf(record: DvfRecord): string {
  const mains = record.locals.filter((l) => !/d[ée]pendance/i.test(l.type));
  const single = mains.length === 1 ? mains[0] : null;
  const parts = [
    single ? `${single.type}${single.rooms ? ` ${single.rooms} p.` : ""}` : mains.length ? plural(mains.length, "bien") : record.dependances ? "Dépendance seule" : "Terrain ou parcelle non bâtie",
    record.surface_reelle_bati ? `${area(record.surface_reelle_bati)} bâtis` : "",
    single?.carrez ? `Carrez ${area(single.carrez)}` : "",
    single?.lot ? `lot ${single.lot}` : "",
    record.dependances && mains.length ? `+ ${plural(record.dependances, "dépendance")}` : "",
    record.surface_terrain ? `terrain ${area(record.surface_terrain)}` : "",
    record.parcels > 1 ? `sur ${record.parcels} parcelles` : "",
  ];
  return parts.filter(Boolean).join(" · ");
}

export default function DvfRow({ record, match }: { record: DvfRecord; match?: MatchLevel }) {
  const { icon: Icon, tone } = getTypeLocalStyle(record.type_local);
  const grouped = record.parcels > 1 || record.locals.length - record.dependances > 1;

  return (
    <li className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-gray-100 px-4 py-3 last:border-0 dark:border-white/5">
      <span className={`flex h-9 w-9 items-center justify-center rounded-md ${tone}`}>
        <Icon size={16} />
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(record.valeur_fonciere)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {record.nature_mutation} · {formatDate(record.date_mutation)}
          </span>
          {match && <MatchBadge level={match} />}
        </span>
        <span className="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">{contentsOf(record)}</span>
        {grouped && (
          <span className="mt-1 inline-block rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
            Prix global de la vente, pas celui de ce seul bien
          </span>
        )}
      </span>
      <span className="text-right">
        {record.priceM2 !== null ? (
          <>
            <span className="block text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">{formatCurrency(record.priceM2)}</span>
            <span className="block text-[10px] text-gray-500 dark:text-gray-400">par m² bâti</span>
          </>
        ) : (
          <span className="block max-w-28 text-[11px] leading-tight text-gray-400 dark:text-gray-500">
            {PRICE_STATUS_LABELS[record.priceStatus]}
          </span>
        )}
      </span>
    </li>
  );
}
