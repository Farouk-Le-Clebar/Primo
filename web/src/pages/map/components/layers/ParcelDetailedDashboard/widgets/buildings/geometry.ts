import type { Geometry, Position } from "geojson";

const EARTH_RADIUS = 6378137;
const RAD = Math.PI / 180;

export const polygonsOf = (
  geometry: Geometry | null | undefined,
): Position[][][] =>
  geometry?.type === "Polygon"
    ? [geometry.coordinates]
    : geometry?.type === "MultiPolygon"
      ? geometry.coordinates
      : [];

function ringArea(ring: Position[]): number {
  if (ring.length < 3) return 0;
  const cosLat = Math.cos(ring[0][1] * RAD);
  let area = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = [ring[i][0] * cosLat, ring[i][1]];
    const [x2, y2] = [ring[i + 1][0] * cosLat, ring[i + 1][1]];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area / 2) * (EARTH_RADIUS * RAD) ** 2;
}

export const geometryArea = (geometry: Geometry | null | undefined): number =>
  polygonsOf(geometry).reduce(
    (sum, [outer = [], ...holes]) =>
      sum + ringArea(outer) - holes.reduce((s, hole) => s + ringArea(hole), 0),
    0,
  );

export type SvgFrame = { width: number; height: number; padding: number };

export function toSvgPaths(
  geometries: (Geometry | null | undefined)[],
  { width, height, padding }: SvgFrame,
): string[] | null {
  const points = geometries.flatMap((g) => polygonsOf(g).flat(2));
  if (!points.length) return null;
  const lngs = points.map(([lng]) => lng);
  const lats = points.map(([, lat]) => lat);
  const [minLng, maxLng] = [Math.min(...lngs), Math.max(...lngs)];
  const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)];
  const lngScale = Math.cos(((minLat + maxLat) / 2) * RAD);
  const spanX = (maxLng - minLng) * lngScale;
  const spanY = maxLat - minLat;
  if (Math.max(spanX, spanY) === 0) return null;
  const scale = Math.min(
    spanX ? (width - padding * 2) / spanX : Infinity,
    spanY ? (height - padding * 2) / spanY : Infinity,
  );
  const project = ([lng, lat]: Position) => {
    const x = (width - spanX * scale) / 2 + (lng - minLng) * lngScale * scale;
    const y = (height + spanY * scale) / 2 - (lat - minLat) * scale;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  };
  return geometries.map((g) =>
    polygonsOf(g)
      .flatMap((polygon) =>
        polygon.map((ring) => `M ${ring.map(project).join(" L ")} Z`),
      )
      .join(" "),
  );
}
