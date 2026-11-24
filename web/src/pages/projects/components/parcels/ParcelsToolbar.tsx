import { ArrowLeftRight, Download, Search } from "lucide-react";
import FilterChips, { type FilterChip } from "../ui/FilterChips";
import type { ParcelFilter } from "./useParcelsFilters";

type ParcelsToolbarProps = {
  chips: FilterChip<ParcelFilter>[];
  filter: ParcelFilter;
  onFilterChange: (filter: ParcelFilter) => void;
  query: string;
  onQueryChange: (query: string) => void;
  compareCount: number;
  onCompare: () => void;
  onExport: () => void;
};

const OUTLINE = "group flex items-center gap-2 rounded-lg border border-[#1c1c1e]/14 bg-tremor-background px-3.5 py-2 text-[13px] font-semibold text-[#1c1c1e] transition-colors hover:bg-[#1c1c1e]/4 disabled:opacity-50 dark:border-white/16 dark:bg-dark-tremor-background dark:text-[#fafafa] dark:hover:bg-white/6";

export default function ParcelsToolbar({ chips, filter, onFilterChange, query, onQueryChange, compareCount, onCompare, onExport }: ParcelsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterChips chips={chips} active={filter} onChange={onFilterChange} layoutId="parcel-filters" />
      <span className="flex-1" />
      <label className="flex h-[34px] w-[214px] items-center gap-2 rounded-lg border border-[#1c1c1e]/12 bg-tremor-background px-3 text-[#82828c] transition-shadow focus-within:ring-2 focus-within:ring-[#1c1c1e]/10 dark:border-white/12 dark:bg-dark-tremor-background">
        <Search className="h-3.5 w-3.5 shrink-0" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Adresse, référence, zone…"
          aria-label="Rechercher une parcelle"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-[#1c1c1e] outline-none placeholder:text-[#82828c] dark:text-white"
        />
      </label>
      <button onClick={onCompare} disabled={compareCount !== 2} className={OUTLINE}>
        <ArrowLeftRight className="h-3.5 w-3.5 transition-transform group-enabled:group-hover:rotate-180" />
        Comparer ({compareCount}/2)
      </button>
      <button onClick={onExport} className={OUTLINE}>
        <Download className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
        Exporter
      </button>
    </div>
  );
}
