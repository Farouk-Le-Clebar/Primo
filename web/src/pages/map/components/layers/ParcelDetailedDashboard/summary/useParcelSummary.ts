import { useMemo } from "react";
import type { Feature } from "geojson";

import { computeBuildingStats, coverageRatio, squareMeters, toNumber } from "../widgets/buildings/stats";
import { useParcelBuildings } from "../widgets/buildings/useParcelBuildings";
import { ZONE_DESCRIPTIONS, getMainZoneType } from "../widgets/plu/utils";
import { summarizeDpe, summarizeDvf, summarizePermits, summarizePlu, summarizeRisks } from "./summaryData";
import { queryState, useSummaryQueries } from "./useSummaryQueries";

export type KeyFigure = { label: string; value: string; hint: string; loading: boolean };

export function useParcelSummary(feature: Feature | undefined, banId?: string) {
  const props = feature?.properties ?? {};
  const parcelArea = toNumber(props.contenance);
  const queries = useSummaryQueries(feature, banId);
  const buildings = useParcelBuildings(feature);
  const stats = useMemo(() => computeBuildingStats(buildings.buildings), [buildings.buildings]);
  const plu = useMemo(() => summarizePlu(queries.plu.data), [queries.plu.data]);
  const dpe = useMemo(() => summarizeDpe(queries.dpe.data), [queries.dpe.data]);
  const dvf = useMemo(() => summarizeDvf(queries.dvf.data), [queries.dvf.data]);
  const risks = useMemo(() => summarizeRisks(queries.risks.data), [queries.risks.data]);
  const permits = useMemo(() => summarizePermits(queries.permits.data), [queries.permits.data]);
  const coverage = coverageRatio(stats.footprint, parcelArea);

  const figures: KeyFigure[] = [
    {
      label: "Surface cadastrale",
      value: squareMeters(parcelArea),
      hint: `Section ${props.section || "—"} · n° ${props.numero || "—"}`,
      loading: false,
    },
    {
      label: "Emprise bâtie",
      value: coverage != null && stats.count ? `${coverage} %` : "—",
      hint: stats.count ? `${squareMeters(stats.footprint)} au sol` : "Aucun bâtiment référencé",
      loading: buildings.isLoading,
    },
    {
      label: "Zonage PLU",
      value: plu.labels[0] ?? "—",
      hint: plu.labels.length ? ZONE_DESCRIPTIONS[getMainZoneType(plu.type)].label : "Zonage non disponible",
      loading: queries.plu.isLoading,
    },
    {
      label: "Prix médian DVF",
      value: dvf.medianPrice != null ? `${Math.round(dvf.medianPrice).toLocaleString("fr-FR")} €` : "—",
      hint: dvf.medianPrice != null ? "par m² bâti, historique déclaré" : "Aucune vente exploitable",
      loading: queries.dvf.isLoading,
    },
  ];

  return {
    figures,
    parcelArea,
    buildings: { state: { loading: buildings.isLoading, error: buildings.isError, retry: buildings.refetch }, stats },
    plu: { state: queryState(queries.plu), data: plu },
    dpe: { state: queryState(queries.dpe), data: dpe },
    dvf: { state: queryState(queries.dvf), data: dvf },
    risks: { state: queryState(queries.risks), data: risks },
    permits: { state: queryState(queries.permits), data: permits },
  };
}
