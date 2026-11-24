import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import ParcelRow from "./ParcelRow";
import { COLUMNS } from "./parcelColumns";
import type { SortDirection, SortKey } from "./plotFormat";

type ParcelsTableProps = {
  plots: ProjectPlotWithSummary[];
  compareIds: string[];
  sortKey: SortKey | null;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
  onToggleCompare: (id: string) => void;
  onOpen: (id: string) => void;
  emptyState: React.ReactNode;
};

type HeaderProps = { label: string; className: string; sortKey?: SortKey; active: SortKey | null; direction: SortDirection; onSort: (key: SortKey) => void };

const HEAD = "flex h-4 items-center gap-1 text-[11px] font-semibold text-[#82828c]";

function Header({ label, className, sortKey, active, direction, onSort }: HeaderProps) {
  if (!sortKey) return <span className={`${HEAD} ${className}`}>{label}</span>;
  const Icon = active !== sortKey ? ArrowUpDown : direction === "asc" ? ArrowUp : ArrowDown;
  return (
    <button onClick={() => onSort(sortKey)} className={`${HEAD} ${className} transition-colors hover:text-[#1c1c1e] dark:hover:text-white ${active === sortKey ? "text-[#1c1c1e] dark:text-white" : ""}`}>
      {label}
      <Icon className="h-3 w-3" />
    </button>
  );
}

export default function ParcelsTable({ plots, compareIds, sortKey, direction, onSort, onToggleCompare, onOpen, emptyState }: ParcelsTableProps) {
  const sortProps = { active: sortKey, direction, onSort };

  return (
    <div className="primo-card animate-rise-in overflow-x-auto p-2">
      <div className="min-w-[1100px]">
        <div className="flex items-center gap-3 px-3 py-3">
          <span className={COLUMNS.check} />
          <Header label="Parcelle" className="flex-1" sortKey="address" {...sortProps} />
          <Header label="Surface" className={COLUMNS.surface} sortKey="surface" {...sortProps} />
          <Header label="Zone PLU" className={COLUMNS.zone} {...sortProps} />
          <Header label="Prix DVF" className={COLUMNS.price} sortKey="price" {...sortProps} />
          <Header label="Dernière vente" className={COLUMNS.lastSale} sortKey="lastSale" {...sortProps} />
          <Header label="DPE" className={COLUMNS.dpe} sortKey="dpe" {...sortProps} />
          <Header label="Copro" className={COLUMNS.copro} {...sortProps} />
          <Header label="Vigilance" className={COLUMNS.vigilance} {...sortProps} />
          <Header label="Ajoutée par" className={COLUMNS.addedBy} {...sortProps} />
        </div>
        <div className="h-px w-full bg-[#1c1c1e]/8 dark:bg-white/8" />
        {plots.length === 0 && <div className="p-3">{emptyState}</div>}
        <div className="flex flex-col divide-y divide-[#1c1c1e]/6 dark:divide-white/6">
          {plots.map((plot, index) => (
            <ParcelRow
              key={plot.id}
              plot={plot}
              index={index}
              checked={compareIds.includes(plot.id)}
              onToggle={() => onToggleCompare(plot.id)}
              onOpen={() => onOpen(plot.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
