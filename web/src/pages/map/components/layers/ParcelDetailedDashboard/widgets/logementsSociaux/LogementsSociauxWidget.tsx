import { useMemo } from "react";
import type { Feature } from "geojson";

import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import { useLogementsSociaux } from "../habitat/useHabitat";
import { SourceNote, WidgetEmpty, WidgetLoading } from "../shared/WidgetStatus";
import { groupByAddress, socialStats } from "./data";
import LogementsSociauxBreakdown from "./LogementsSociauxBreakdown";
import LogementsSociauxKpis from "./LogementsSociauxKpis";
import SocialAddressTable from "./SocialAddressTable";

export default function LogementsSociauxWidget({ feature, address }: { feature: Feature; address?: string }) {
  const { data, isLoading, isError, refetch } = useLogementsSociaux(feature);
  const logements = useMemo(() => data ?? [], [data]);
  const stats = useMemo(() => socialStats(logements), [logements]);
  const groups = useMemo(() => groupByAddress(logements, address), [logements, address]);

  if (isLoading) return <WidgetLoading label="Recherche des logements sociaux…" />;
  if (isError || !logements.length)
    return (
      <WidgetEmpty
        message={isError ? "Le répertoire des logements sociaux est momentanément indisponible." : "Aucun logement social recensé sur cette parcelle."}
        onRetry={isError ? () => void refetch() : undefined}
      />
    );

  return (
    <div className="flex w-full flex-col gap-4 font-inter lg:gap-6">
      <LogementsSociauxKpis stats={stats} />
      <ParcelAnalysisLayout summary={<LogementsSociauxBreakdown stats={stats} />}>
        {groups.map((group) => (
          <SocialAddressTable key={group.key} group={group} />
        ))}
        <SourceNote>
          Source : répertoire des logements locatifs des bailleurs sociaux (RPLS, SDES), situation au 1er janvier.
          Logements rattachés par la géolocalisation de leur adresse (parcelle et 10 m autour). Les loyers et
          l’identité des bailleurs ne sont pas publics.
        </SourceNote>
      </ParcelAnalysisLayout>
    </div>
  );
}
