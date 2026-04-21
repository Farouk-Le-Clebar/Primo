export const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export const NATIONAL_WFS_URL = "https://data.geopf.fr/wfs/ows";

export function convertGeoJSONToWKT(geometry: any): string {
  if (geometry.type === "MultiPolygon") {
    const polygons = geometry.coordinates
      .map((polygon: number[][][]) => {
        const rings = polygon
          .map((ring: number[][]) => {
            const coords = ring.map(([lng, lat]) => `${lat} ${lng}`).join(", ");
            return `(${coords})`;
          })
          .join(", ");
        return `(${rings})`;
      })
      .join(", ");
    return `MULTIPOLYGON(${polygons})`;
  } else if (geometry.type === "Polygon") {
    const rings = geometry.coordinates
      .map((ring: number[][]) => {
        const coords = ring.map(([lng, lat]) => `${lat} ${lng}`).join(", ");
        return `(${coords})`;
      })
      .join(", ");
    return `POLYGON(${rings})`;
  }
  throw new Error(`Type de géométrie non supporté: ${geometry.type}`);
}

export function convertGeoJSONToWKTWithSRID(geometry: any): string {
  let wkt = "";
  if (geometry.type === "MultiPolygon") {
    const polygons = geometry.coordinates
      .map((polygon: number[][][]) => {
        const rings = polygon
          .map((ring: number[][]) => {
            const coords = ring.map((coord: number[]) => `${coord[0]} ${coord[1]}`).join(", ");
            return `(${coords})`;
          })
          .join(", ");
        return `(${rings})`;
      })
      .join(", ");
    wkt = `MULTIPOLYGON(${polygons})`;
  } else if (geometry.type === "Polygon") {
    const rings = geometry.coordinates
      .map((ring: number[][]) => {
        const coords = ring.map((coord: number[]) => `${coord[0]} ${coord[1]}`).join(", ");
        return `(${coords})`;
      })
      .join(", ");
    wkt = `POLYGON(${rings})`;
  } else if (geometry.type === "Point") {
    wkt = `POINT(${geometry.coordinates[0]} ${geometry.coordinates[1]})`;
  }
  return `SRID=4326;${wkt}`;
}

export function getCentroidFromGeometry(geometry: any): { lat: number; lon: number } | null {
  try {
    let coords: number[] = [];
    if (geometry.type === "Point") coords = geometry.coordinates;
    else if (geometry.type === "Polygon") coords = geometry.coordinates[0][0];
    else if (geometry.type === "MultiPolygon") coords = geometry.coordinates[0][0][0];
    if (coords && coords.length >= 2) return { lon: coords[0], lat: coords[1] };
    return null;
  } catch {
    return null;
  }
}

export function formatDepartementCode(dept: string): string {
  return dept.padStart(2, "0");
}

export function getBboxFromGeometry(geometry: any, margin: number = 0) {
  let minLng = Infinity,  maxLng = -Infinity;
  let minLat = Infinity,  maxLat = -Infinity;

  const processCoords = (coords: number[]) => {
    const [lng, lat] = coords;
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  };

  const flatten = (arr: any): void => {
    if (typeof arr[0] === "number") processCoords(arr);
    else arr.forEach(flatten);
  };

  flatten(geometry.coordinates);

  return {
    minLng: minLng - margin,
    maxLng: maxLng + margin,
    minLat: minLat - margin,
    maxLat: maxLat + margin,
  };
}
