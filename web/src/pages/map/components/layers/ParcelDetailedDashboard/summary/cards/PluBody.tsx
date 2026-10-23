import { ZONE_DESCRIPTIONS, getMainZoneType } from "../../widgets/plu/utils";
import type { summarizePlu } from "../summaryData";

type PluBodyProps = { plu: ReturnType<typeof summarizePlu> };

export default function PluBody({ plu }: PluBodyProps) {
  const family = ZONE_DESCRIPTIONS[getMainZoneType(plu.type)];

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {plu.labels.map((label) => (
          <span
            key={label}
            className="rounded-md bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300"
          >
            Zone {label}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">{family.label}</p>
      <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {plu.description || family.desc}
      </p>
      <p className="mt-auto pt-4 text-xs text-gray-500 dark:text-gray-400">
        Le zonage seul ne permet pas de conclure à la constructibilité du terrain.
      </p>
    </>
  );
}
