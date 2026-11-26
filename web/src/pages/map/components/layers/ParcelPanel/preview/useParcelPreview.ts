import { useMemo } from "react";
import type { Feature } from "geojson";

import { squareMeters, toNumber } from "../../ParcelDetailedDashboard/widgets/buildings/stats";
import { dateLabel } from "../../ParcelDetailedDashboard/widgets/shared/format";
import { zoneInfo } from "../../ParcelDetailedDashboard/widgets/plu/utils";
import { summarizeDpe, summarizeDvf, summarizePlu, summarizeRisks } from "../../ParcelDetailedDashboard/summary/summaryData";
import { useSummaryQueries } from "../../ParcelDetailedDashboard/summary/useSummaryQueries";

export type PreviewMetricData = {
  label: string;
  value: string;
  hint: string;
  loading: boolean;
  accent?: boolean;
};

const euros = (value: number): string => `${Math.round(value).toLocaleString("fr-FR")} €`;

export function useParcelPreview(feature: Feature | undefined, banId?: string) {
  const queries = useSummaryQueries(feature, banId);
  const plu = useMemo(() => summarizePlu(queries.plu.data), [queries.plu.data]);
  const dvf = useMemo(() => summarizeDvf(queries.dvf.data), [queries.dvf.data]);
  const dpe = useMemo(() => summarizeDpe(queries.dpe.data), [queries.dpe.data]);
  const risks = useMemo(() => summarizeRisks(queries.risks.data), [queries.risks.data]);
  const zone = plu.labels[0];

  const metrics: PreviewMetricData[] = [
    {
      label: "Zonage PLU",
      value: zone ?? "—",
      hint: zone ? zoneInfo(zone).label : "Non disponible",
      loading: queries.plu.isLoading,
      accent: !!zone,
    },
    {
      label: "Prix médian",
      value: dvf.medianPrice != null ? `${euros(dvf.medianPrice)}/m²` : "—",
      hint: dvf.ratiosCount ? `Sur ${dvf.ratiosCount} vente${dvf.ratiosCount > 1 ? "s" : ""}` : "Aucune vente exploitable",
      loading: queries.dvf.isLoading,
    },
    {
      label: "Dernière vente",
      value: dvf.latestValue != null ? euros(dvf.latestValue) : "—",
      hint: dvf.latestDate ? dateLabel(dvf.latestDate) : "Aucune mutation",
      loading: queries.dvf.isLoading,
    },
  ];

  return {
    area: squareMeters(toNumber(feature?.properties?.contenance)),
    metrics,
    dpe: { data: dpe, loading: queries.dpe.isLoading, hasAddress: !!banId },
    risks: { data: risks, loading: queries.risks.isLoading },
  };
}
