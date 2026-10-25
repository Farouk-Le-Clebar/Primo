import { ArrowDown, ArrowUp, ArrowUpDown, type LucideIcon } from "lucide-react";

import { chip } from "../shared/tones";
import type { SortOrder } from "./constants";
import type { PoisProximityState } from "./usePoisProximity";

type PoisToolbarProps = Pick<PoisProximityState, "sortOrder" | "cycleSort" | "grayNotFound" | "toggleGrayNotFound" | "displayedCodes">;

const SORT: Record<SortOrder, { icon: LucideIcon; label: string }> = {
  asc: { icon: ArrowUp, label: "Plus proches d’abord" },
  desc: { icon: ArrowDown, label: "Plus éloignées d’abord" },
  none: { icon: ArrowUpDown, label: "Ordre de sélection" },
};

export default function PoisToolbar({ sortOrder, cycleSort, grayNotFound, toggleGrayNotFound, displayedCodes }: PoisToolbarProps) {
  const { icon: SortIcon, label } = SORT[sortOrder];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-0.5 dark:bg-white/5">
        <button onClick={cycleSort} aria-pressed={sortOrder !== "none"} className={`${chip(sortOrder !== "none")} flex items-center gap-1.5`}>
          <SortIcon size={13} />
          {label}
        </button>
        <button
          onClick={toggleGrayNotFound}
          aria-pressed={grayNotFound}
          title="Grise les types sans résultat et les place en fin de liste"
          className={chip(grayNotFound)}
        >
          Griser les introuvables
        </button>
      </div>
      <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
        {displayedCodes.length} type{displayedCodes.length > 1 ? "s" : ""} analysé{displayedCodes.length > 1 ? "s" : ""}
      </span>
    </div>
  );
}
