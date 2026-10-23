import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { Feature } from "geojson";

import { getAutorisationsParcelle } from "../../../../../../requests/autorisations/information";
import { getDpeBan } from "../../../../../../requests/dpe/information";
import { getDvfParcelle } from "../../../../../../requests/dvf/information";
import { getGeorisquesByInsee } from "../../../../../../requests/georisques/information";
import { getZonesUrbaByGeometry } from "../../../../../../requests/geoserver/urbanAreas";
import type { SourceRow } from "../widgets/shared/format";
import { parcelDepartment } from "../widgets/buildings/useParcelBuildings";

export type SourceCollection = { features?: { properties?: SourceRow }[] };
export type DpePayload = SourceRow[] | { historique?: SourceRow[] };

export type QueryState = { loading: boolean; error: boolean; retry: () => void };

const STALE_TIME = 300000;
const PARCEL_ID = /^[0-9AB]{5}[0-9]{3}[0-9A-Z]{2}[0-9]{4}$/;

export const queryState = (query: UseQueryResult<unknown>): QueryState => ({
  loading: query.isLoading,
  error: query.isError,
  retry: () => void query.refetch(),
});

export function useSummaryQueries(feature: Feature | undefined, banId?: string) {
  const parcelId = String(feature?.properties?.id || "").trim().toUpperCase();
  const insee = String(feature?.properties?.commune || "");
  const department = parcelDepartment(feature);
  const spatialEnabled = !!feature?.geometry && !!department;

  const plu = useQuery<SourceCollection>({
    queryKey: ["urban-summary", parcelId],
    queryFn: () => getZonesUrbaByGeometry(feature?.geometry, department),
    enabled: spatialEnabled,
    staleTime: STALE_TIME,
    retry: false,
  });
  const dpe = useQuery<DpePayload>({
    queryKey: ["dpe-ban", banId],
    queryFn: () => getDpeBan(String(banId)),
    enabled: !!banId,
    staleTime: STALE_TIME,
    retry: false,
  });
  const dvf = useQuery<unknown>({
    queryKey: ["dvf-parcelle", parcelId],
    queryFn: () => getDvfParcelle(parcelId),
    enabled: parcelId.length === 14,
    staleTime: STALE_TIME,
    retry: false,
  });
  const risks = useQuery<SourceCollection>({
    queryKey: ["georisques-summary", insee, department],
    queryFn: () => getGeorisquesByInsee(insee, department),
    enabled: /^[0-9AB]{5}$/.test(insee) && !!department,
    staleTime: STALE_TIME,
    retry: false,
  });
  const permits = useQuery<SourceRow[]>({
    queryKey: ["autorisations-parcelle", parcelId],
    queryFn: () => getAutorisationsParcelle(parcelId),
    enabled: PARCEL_ID.test(parcelId),
    staleTime: STALE_TIME,
    retry: false,
  });

  return { plu, dpe, dvf, risks, permits };
}
