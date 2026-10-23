import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import LoadingPrimoLogo from "../../../../../../../components/animations/LoadingPrimoLogo";
import { getDpeBan } from "../../../../../../../requests/dpe/information";
import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import type { SourceRow } from "../shared/format";
import { computeDpeStats, prepareDpe } from "./data";
import DpeEnergyLabel from "./DpeEnergyLabel";
import DpeExplorer from "./DpeExplorer";
import DpeInsights from "./DpeInsights";
import DpeKpis from "./DpeKpis";
import { useDpeExplorer } from "./useDpeExplorer";

type DpeWidgetProps = {
  selectedParcelle: {
    addokData?: { features?: { properties?: { id?: string } }[] };
  };
};

type DpePayload = SourceRow[] | { historique?: SourceRow[] } | null;

export default function DpeWidget({ selectedParcelle }: DpeWidgetProps) {
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
        <DpeExplorer explorer={explorer} />
        <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          Source : ADEME · base DPE logements. Les diagnostics peuvent concerner
          plusieurs logements de l’adresse et se succéder dans le temps.
        </p>
      </ParcelAnalysisLayout>
    </div>
  );
}
