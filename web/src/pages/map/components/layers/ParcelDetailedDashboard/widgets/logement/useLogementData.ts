import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Feature } from "geojson";

import { getDpeBan } from "../../../../../../../requests/dpe/information";
import { getDvfParcelle } from "../../../../../../../requests/dvf/information";
import { useParcelBuildings } from "../buildings/useParcelBuildings";
import { prepareDpe } from "../dpe/data";
import { prepareDvf } from "../dvf/data";
import type { SourceRow } from "../shared/format";

type DpePayload = SourceRow[] | { historique?: SourceRow[] } | null;

export function useLogementData(feature: Feature, banId: string | undefined) {
  const parcelId = String(feature?.properties?.id ?? "");
  const dpe = useQuery<DpePayload>({
    queryKey: ["dpe-ban", banId],
    queryFn: () => getDpeBan(String(banId)),
    enabled: !!banId,
    staleTime: 300000,
    retry: false,
  });
  const dvf = useQuery({
    queryKey: ["dvf-parcelle", parcelId],
    queryFn: () => getDvfParcelle(parcelId),
    enabled: parcelId.length === 14,
    staleTime: 300000,
    retry: false,
  });
  const { buildings, isLoading: buildingsLoading } = useParcelBuildings(feature);
  const dpeEntries = useMemo(
    () => prepareDpe(Array.isArray(dpe.data) ? dpe.data : (dpe.data?.historique ?? [])),
    [dpe.data],
  );
  const dvfRecords = useMemo(() => prepareDvf(dvf.data).records, [dvf.data]);

  return {
    dpeEntries,
    dvfRecords,
    buildings,
    isLoading: dpe.isLoading || dvf.isLoading || buildingsLoading,
    hasBan: !!banId,
  };
}

export type LogementData = ReturnType<typeof useLogementData>;
