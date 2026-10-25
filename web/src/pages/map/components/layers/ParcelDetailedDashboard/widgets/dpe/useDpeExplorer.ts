import { useMemo, useState } from "react";

import type { DpeEntry } from "./data";

export type DpeSort = "recent" | "conso";

const PAGE_SIZE = 6;

const SORTERS: Record<DpeSort, (a: DpeEntry, b: DpeEntry) => number> = {
  recent: (a, b) => (b.date ?? "").localeCompare(a.date ?? ""),
  conso: (a, b) => (b.conso ?? -1) - (a.conso ?? -1),
};

export function useDpeExplorer(entries: DpeEntry[]) {
  const [label, setLabel] = useState<string | null>(null);
  const [sort, setSort] = useState<DpeSort>("recent");
  const [validOnly, setValidOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      entries
        .filter((e) => !label || e.label === label)
        .filter((e) => !validOnly || e.expired === false)
        .sort(SORTERS[sort]),
    [entries, label, sort, validOnly],
  );

  const resetPage = () => {
    setPage(0);
    setOpenKey(null);
  };

  const handleLabel = (next: string | null) => {
    setLabel(next);
    resetPage();
  };

  const handleSort = (next: DpeSort) => {
    setSort(next);
    resetPage();
  };

  const handleValidOnly = () => {
    setValidOnly((current) => !current);
    resetPage();
  };

  const handlePage = (next: number) => {
    setPage(next);
    setOpenKey(null);
  };

  const handleToggle = (key: string) =>
    setOpenKey((current) => (current === key ? null : key));

  return {
    label,
    sort,
    validOnly,
    page,
    openKey,
    pageSize: PAGE_SIZE,
    total: filtered.length,
    visible: filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    handleLabel,
    handleSort,
    handleValidOnly,
    handlePage,
    handleToggle,
  };
}

export type DpeExplorerState = ReturnType<typeof useDpeExplorer>;
