import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { Feature, Geometry } from "geojson";

import { getCoproprietes, getLogementsSociaux, getLoyers } from "../../../../../../../requests/habitat/information";
import type { Copropriete, LogementSocial, LoyersParcelle } from "./types";

const PARCEL_ID = /^[0-9AB]{5}[0-9]{3}[0-9A-Z]{2}[0-9]{4}$/;
const STALE_TIME = 300000;

type Fetcher<T> = (idParcelle: string, geometry: Geometry) => Promise<T>;

function useParcelQuery<T>(key: string, feature: Feature | undefined, fetcher: Fetcher<T>): UseQueryResult<T> {
  const parcelId = String(feature?.properties?.id ?? "").trim().toUpperCase();
  const geometry = feature?.geometry;
  return useQuery<T>({
    queryKey: [key, parcelId],
    queryFn: () => fetcher(parcelId, geometry as Geometry),
    enabled: PARCEL_ID.test(parcelId) && !!geometry,
    staleTime: STALE_TIME,
    retry: false,
  });
}

export const useCoproprietes = (feature: Feature | undefined) =>
  useParcelQuery<Copropriete[]>("habitat-coproprietes", feature, getCoproprietes);

export const useLogementsSociaux = (feature: Feature | undefined) =>
  useParcelQuery<LogementSocial[]>("habitat-logements-sociaux", feature, getLogementsSociaux);

export const useLoyers = (feature: Feature | undefined) =>
  useParcelQuery<LoyersParcelle>("habitat-loyers", feature, getLoyers);
