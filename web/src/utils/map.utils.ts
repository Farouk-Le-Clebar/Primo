import L from "leaflet";
import type { ZoomLevel, GeoJSONData } from "../types/map.types";
import {
  fetchDepartements,
  fetchCommunes,
  fetchDivisions,
  fetchParcelles,
} from "../requests/parcel-map";

export function boundsToPolygon(bounds: L.LatLngBounds) {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  const nw = L.latLng(ne.lat, sw.lng);
  const se = L.latLng(sw.lat, ne.lng);

  return {
    type: "Polygon",
    coordinates: [
      [
        [sw.lng, sw.lat],
        [se.lng, se.lat],
        [ne.lng, ne.lat],
        [nw.lng, nw.lat],
        [sw.lng, sw.lat],
      ],
    ],
  };
}

export function getDepartementsInView(
  bounds: L.LatLngBounds,
  departementCenters: Record<string, [number, number]>
): string[] {
  const visibleDepts: string[] = [];

  for (const [code, center] of Object.entries(departementCenters)) {
    const [lat, lng] = center;
    if (bounds.contains([lat, lng]) || bounds.pad(0.5).contains([lat, lng])) {
      visibleDepts.push(code);
    }
  }

  if (visibleDepts.length === 0) {
    const center = bounds.getCenter();
    const sorted = Object.entries(departementCenters)
      .map(([code, [lat, lng]]) => ({
        code,
        distance: Math.sqrt(
          Math.pow(center.lat - lat, 2) + Math.pow(center.lng - lng, 2)
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    return sorted.map((d) => d.code);
  }

  return visibleDepts;
}

export function mergeGeoJSONFeatures(results: any[]): {
  type: "FeatureCollection";
  features: any[];
} {
  const allFeatures: any[] = [];

  results.forEach((data) => {
    if (data.type === "FeatureCollection") {
      allFeatures.push(...data.features);
    } else if (data.type === "Feature") {
      allFeatures.push(data);
    }
  });

  return {
    type: "FeatureCollection",
    features: allFeatures,
  };
}

export async function loadMapDataForLevel(
  level: ZoomLevel,
  bounds: L.LatLngBounds,
  departementCenters: Record<string, [number, number]>
): Promise<GeoJSONData> {
  switch (level) {
    case "departements":
      return await fetchDepartements();

    case "communes": {
      const departementsToLoad = getDepartementsInView(
        bounds,
        departementCenters
      );
      const promises = departementsToLoad.map((code) => fetchCommunes(code));
      const results = await Promise.all(promises);
      return mergeGeoJSONFeatures(results);
    }

    case "divisions": {
      const polygon = boundsToPolygon(bounds);
      return await fetchDivisions(polygon);
    }

    case "parcelles": {
      const polygon = boundsToPolygon(bounds);
      return await fetchParcelles(polygon);
    }

    default:
      throw new Error(`Unknown level: ${level}`);
  }
}
