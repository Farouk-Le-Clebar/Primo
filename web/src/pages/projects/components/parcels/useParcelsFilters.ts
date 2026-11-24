import { useMemo, useState } from "react";
import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import { isEnergySieve, isNewPlot, vigilanceTags } from "../shared/plotInsights";
import type { FilterChip } from "../ui/FilterChips";
import { matchesQuery, sortPlots, type SortDirection, type SortKey } from "./plotFormat";

export type ParcelFilter = "all" | "new" | "sieve" | "vigilance" | "copro";

const PREDICATES: Record<ParcelFilter, (plot: ProjectPlotWithSummary) => boolean> = {
  all: () => true,
  new: (plot) => isNewPlot(plot),
  sieve: isEnergySieve,
  vigilance: (plot) => vigilanceTags(plot).length > 0,
  copro: (plot) => (plot.summary?.coproprietes?.count ?? 0) > 0,
};

export function useParcelsFilters(plots: ProjectPlotWithSummary[]) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ParcelFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [direction, setDirection] = useState<SortDirection>("asc");

  const chips: FilterChip<ParcelFilter>[] = [
    { id: "all", label: "Toutes", count: plots.length },
    { id: "new", label: "Nouvelles", count: plots.filter(PREDICATES.new).length, tone: "violet" },
    { id: "sieve", label: "DPE F-G", count: plots.filter(PREDICATES.sieve).length, tone: "red" },
    { id: "vigilance", label: "Vigilance", count: plots.filter(PREDICATES.vigilance).length, tone: "amber" },
    { id: "copro", label: "Copropriété", count: plots.filter(PREDICATES.copro).length, tone: "blue" },
  ];

  const visible = useMemo(() => {
    const matching = plots.filter((plot) => matchesQuery(plot, query) && PREDICATES[filter](plot));
    return sortKey ? sortPlots(matching, sortKey, direction) : matching;
  }, [plots, query, filter, sortKey, direction]);

  const sortBy = (key: SortKey) => {
    if (key === sortKey) setDirection((current) => (current === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setDirection("asc");
    }
  };

  return { query, setQuery, filter, setFilter, chips, visible, sortKey, direction, sortBy };
}
