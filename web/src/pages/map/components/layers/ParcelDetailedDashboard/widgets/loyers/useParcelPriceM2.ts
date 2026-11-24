import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Feature } from "geojson";

import { getDvfParcelle } from "../../../../../../../requests/dvf/information";
import { median, prepareDvf } from "../dvf/data";
import type { HousingType } from "../logement/types";

export function useParcelPriceM2(feature: Feature | undefined, housing: HousingType): number | null {
  const parcelId = String(feature?.properties?.id ?? "");
  const { data } = useQuery({
    queryKey: ["dvf-parcelle", parcelId],
    queryFn: () => getDvfParcelle(parcelId),
    enabled: parcelId.length === 14,
    staleTime: 300000,
    retry: false,
  });
  return useMemo(() => {
    const pattern = housing === "maison" ? /maison/i : /appartement/i;
    const prices = prepareDvf(data).records
      .filter((record) => record.priceM2 !== null && pattern.test(record.type_local ?? ""))
      .map((record) => record.priceM2 as number);
    return median(prices);
  }, [data, housing]);
}
