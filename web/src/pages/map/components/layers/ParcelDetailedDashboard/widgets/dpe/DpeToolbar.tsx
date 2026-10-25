import type { DpeExplorerState, DpeSort } from "./useDpeExplorer";

type DpeToolbarProps = Pick<DpeExplorerState, "label" | "sort" | "validOnly" | "total" | "handleLabel" | "handleSort" | "handleValidOnly">;

const SORT_OPTIONS: { id: DpeSort; label: string }[] = [
  { id: "recent", label: "Plus récents" },
  { id: "conso", label: "Plus énergivores" },
];

const chip = (active: boolean): string =>
  `rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600 ${
    active
      ? "bg-gray-900 text-white dark:bg-white dark:text-black"
      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
  }`;

export default function DpeToolbar({ label, sort, validOnly, total, handleLabel, handleSort, handleValidOnly }: DpeToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-4 py-3 dark:border-white/5">
      <div className="flex items-center gap-1 rounded-lg bg-gray-50 p-0.5 dark:bg-white/5">
        {SORT_OPTIONS.map((option) => (
          <button key={option.id} onClick={() => handleSort(option.id)} aria-pressed={sort === option.id} className={chip(sort === option.id)}>
            {option.label}
          </button>
        ))}
      </div>
      <button onClick={handleValidOnly} aria-pressed={validOnly} className={chip(validOnly)}>
        Valides uniquement
      </button>
      {label && (
        <button onClick={() => handleLabel(null)} className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
          Classe {label} ✕
        </button>
      )}
      <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
        {total} résultat{total > 1 ? "s" : ""}
      </span>
    </div>
  );
}
