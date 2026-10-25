import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import LoadingPrimoLogo from "../../../../../../../components/animations/LoadingPrimoLogo";
import { getDpeBan } from "../../../../../../../requests/dpe/information";
import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import { matchDpe, toLevelMap } from "../logement/matching";
import TargetBanner from "../logement/TargetBanner";
import { hasCriteria, type TargetingProps } from "../logement/types";
import { targetFromDpe } from "../logement/units";
import type { SourceRow } from "../shared/format";
import { computeDpeStats, prepareDpe, type DpeEntry } from "./data";
import DpeEnergyLabel from "./DpeEnergyLabel";
import DpeExplorer from "./DpeExplorer";
import DpeInsights from "./DpeInsights";
import DpeKpis from "./DpeKpis";
import { useDpeExplorer } from "./useDpeExplorer";

type DpeWidgetProps = TargetingProps & {
  selectedParcelle: {
    addokData?: { features?: { properties?: { id?: string } }[] };
  };
};

type DpePayload = SourceRow[] | { historique?: SourceRow[] } | null;

export default function DpeWidget({ selectedParcelle, target, onOpenTarget, onShowTarget }: DpeWidgetProps) {
  const banId = selectedParcelle?.addokData?.features?.[0]?.properties?.id;
  const { data, isLoading, isError, refetch } = useQuery<DpePayload>({
    queryKey: ["dpe-ban", banId],
    queryFn: () => getDpeBan(String(banId)),
    enabled: !!banId,
    staleTime: 300000,
    retry: false,
  });
  const entries = useMemo(
    () => prepareDpe(Array.isArray(data) ? data : (data?.historique ?? [])),
    [data],
  );
  const stats = useMemo(() => computeDpeStats(entries), [entries]);
  const explorer = useDpeExplorer(entries);
  const matches = useMemo(() => toLevelMap(target && hasCriteria(target) ? matchDpe(entries, target) : []), [entries, target]);
  const handleTarget = onOpenTarget ? (entry: DpeEntry) => onOpenTarget(targetFromDpe(entry)) : undefined;

  if (isLoading)
    return (
      <div className="flex items-center gap-2 font-inter">
        <LoadingPrimoLogo className="h-6 w-6" />
        <span className="text-[11px] font-medium text-[#878D96] dark:text-gray-400">
          Analyse énergétique en cours…
        </span>
      </div>
    );

  if (isError || !entries.length)
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-8 text-center font-inter text-sm text-[#878D96] dark:border-white/10 dark:bg-[#171717] dark:text-gray-400">
        {isError
          ? "Le service est momentanément indisponible."
          : banId
            ? "Aucun diagnostic disponible pour cette adresse."
            : "L’adresse BAN est nécessaire pour retrouver les diagnostics."}
        {isError && (
          <button
            onClick={() => void refetch()}
            className="mt-3 block w-full font-medium text-emerald-700 underline dark:text-emerald-400"
          >
            Réessayer
          </button>
        )}
      </div>
    );

  return (
    <div className="flex w-full flex-col gap-4 font-inter lg:gap-6">
      <DpeKpis stats={stats} />
      <ParcelAnalysisLayout
        summary={
          <div className="primo-stagger flex flex-col gap-4">
            <DpeEnergyLabel
              distribution={stats.distribution}
              activeLabel={explorer.label}
              onSelect={explorer.handleLabel}
            />
            <DpeInsights stats={stats} />
          </div>
        }
      >
        {target && hasCriteria(target) && <TargetBanner target={target} matches={matches.size} onShow={onShowTarget} />}
        <DpeExplorer explorer={explorer} matches={matches} onTarget={handleTarget} />
        <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          Source : ADEME · base DPE logements. Les diagnostics peuvent concerner
          plusieurs logements de l’adresse et se succéder dans le temps.
        </p>
      </ParcelAnalysisLayout>
    </div>
  );
}
