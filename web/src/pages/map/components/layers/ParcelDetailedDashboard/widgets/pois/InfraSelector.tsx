import { memo, useCallback, useState } from "react";

import PanelCard from "../shared/PanelCard";
import CategorySection from "./CategorySection";
import { DEFAULT_EXPANDED_CATEGORIES, INFRA_CATEGORIES } from "./constants";
import type { PoisProximityState } from "./usePoisProximity";

type InfraSelectorProps = Pick<
  PoisProximityState,
  "selectedTypes" | "loading" | "isUpToDate" | "error" | "toggleType" | "setTypes" | "resetTypes" | "clearTypes" | "calculate"
> & { canCalculate: boolean };

function InfraSelector({ selectedTypes, loading, isUpToDate, canCalculate, error, toggleType, setTypes, resetTypes, clearTypes, calculate }: InfraSelectorProps) {
  const [expanded, setExpanded] = useState<string[]>(DEFAULT_EXPANDED_CATEGORIES);
  const selectedCount = selectedTypes.length;

  const toggleExpanded = useCallback((label: string) => {
    setExpanded((current) => (current.includes(label) ? current.filter((item) => item !== label) : [...current, label]));
  }, []);

  return (
    <PanelCard title="Infrastructures" aside={`${selectedCount} sélectionnée${selectedCount > 1 ? "s" : ""}`}>
      <div className="flex items-center justify-between text-xs">
        <button type="button" onClick={clearTypes} disabled={!selectedCount} className="text-gray-500 hover:text-gray-900 disabled:opacity-40 dark:text-gray-400 dark:hover:text-white">
          Tout désélectionner
        </button>
        <button type="button" onClick={resetTypes} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
          Réinitialiser
        </button>
      </div>
      <ul className="mt-2 divide-y divide-gray-100 border-y border-gray-100 dark:divide-white/5 dark:border-white/5">
        {INFRA_CATEGORIES.map((category) => (
          <CategorySection
            key={category.label}
            category={category}
            selectedTypes={selectedTypes}
            isExpanded={expanded.includes(category.label)}
            onToggleExpanded={toggleExpanded}
            onToggleType={toggleType}
            onSetTypes={setTypes}
          />
        ))}
      </ul>
      <button
        type="button"
        onClick={() => void calculate()}
        disabled={loading || !canCalculate || !selectedCount}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
      >
        {loading && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-black/30 dark:border-t-black" />}
        {loading ? "Calcul en cours…" : isUpToDate ? "Recalculer la proximité" : "Calculer la proximité"}
      </button>
      {error && (
        <p role="alert" className="mt-3 break-words rounded-md bg-rose-50 px-2.5 py-2 text-xs text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </p>
      )}
      <p className="mt-4 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
        Distances à vol d’oiseau, différentes du trajet réel. L’indice de proximité est calculé sur
        30 km maximum ; au-delà, il vaut 0 %.
      </p>
    </PanelCard>
  );
}

export default memo(InfraSelector);
