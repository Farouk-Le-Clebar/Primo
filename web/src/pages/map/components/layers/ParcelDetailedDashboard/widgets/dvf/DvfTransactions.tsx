import { useState } from "react";

import PanelCard from "../shared/PanelCard";
import RecordPager from "../shared/RecordPager";
import { chip } from "../shared/tones";
import type { DvfRecord } from "./data";
import type { MatchLevel } from "../logement/types";
import DvfRow from "./DvfRow";

type DvfSort = "recent" | "amount";

type DvfTransactionsProps = {
  transactions: DvfRecord[];
  type: string | null;
  onClearType: () => void;
  matches?: Map<string, MatchLevel>;
};

const PAGE_SIZE = 8;

const SORT_OPTIONS: { id: DvfSort; label: string }[] = [
  { id: "recent", label: "Plus récentes" },
  { id: "amount", label: "Montant décroissant" },
];

const SORTERS: Record<DvfSort, (a: DvfRecord, b: DvfRecord) => number> = {
  recent: (a, b) => b.date_mutation.localeCompare(a.date_mutation),
  amount: (a, b) => b.valeur_fonciere - a.valeur_fonciere,
};

export default function DvfTransactions({ transactions, type, onClearType, matches }: DvfTransactionsProps) {
  const [sort, setSort] = useState<DvfSort>("recent");
  const [page, setPage] = useState(0);
  const sorted = [...transactions].sort(SORTERS[sort]);
  const current = Math.min(page, Math.max(0, Math.ceil(sorted.length / PAGE_SIZE) - 1));

  const handleSort = (next: DvfSort) => {
    setSort(next);
    setPage(0);
  };

  return (
    <PanelCard flush title="Historique des ventes" subtitle="Une ligne par vente · le montant couvre l’ensemble des biens vendus">
      <div className="mt-3 flex flex-wrap items-center gap-2 border-y border-gray-100 px-4 py-3 dark:border-white/5">
        <div className="flex items-center gap-1 rounded-lg bg-gray-50 p-0.5 dark:bg-white/5">
          {SORT_OPTIONS.map((option) => (
            <button key={option.id} onClick={() => handleSort(option.id)} aria-pressed={sort === option.id} className={chip(sort === option.id)}>
              {option.label}
            </button>
          ))}
        </div>
        {type && (
          <button onClick={onClearType} className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
            {type} ✕
          </button>
        )}
        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
          {sorted.length} vente{sorted.length > 1 ? "s" : ""}
        </span>
      </div>
      <ul key={`${current}-${sort}-${type}`} className="primo-stagger">
        {sorted.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE).map((record) => (
          <DvfRow key={record.key} record={record} match={matches?.get(record.key)} />
        ))}
      </ul>
      <div className="px-4 pb-4">
        <RecordPager page={current} total={sorted.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>
    </PanelCard>
  );
}
