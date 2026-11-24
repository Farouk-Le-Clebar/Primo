import { useMemo } from "react";
import { centroid } from "@turf/turf";
import type { Feature, Geometry } from "geojson";

import type { ParcelPoint } from "../../../../../../../types/environnement";

const INSEE_PATTERN = /^[0-9AB]{5}$/;

export function useParcelPoint(feature: Feature | undefined): ParcelPoint | null {
  return useMemo(() => {
    const codeInsee = String(feature?.properties?.commune ?? "");
    if (!feature?.geometry || !INSEE_PATTERN.test(codeInsee)) return null;
    const [longitude, latitude] = centroid(feature.geometry as Geometry).geometry.coordinates;
    return { latitude, longitude, codeInsee };
  }, [feature]);
}

export const formatDistance = (meters: number | null): string => {
  if (meters === null) return "—";
  return meters < 1000 ? `${meters} m` : `${(meters / 1000).toFixed(1).replace(".", ",")} km`;
};
