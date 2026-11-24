const EARTH_RADIUS_METERS = 6371000;

export type LatLon = { latitude: number; longitude: number };

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

export function distanceMeters(from: LatLon, to: LatLon): number {
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(deltaLon / 2) ** 2;
  return Math.round(2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(a)));
}

function flattenPositions(coordinates: unknown): number[][] {
  if (!Array.isArray(coordinates)) return [];
  if (typeof coordinates[0] === 'number') return [coordinates as number[]];
  return coordinates.flatMap((child) => flattenPositions(child));
}

export function nearestDistance(
  origin: LatLon,
  geometry: { coordinates?: unknown } | null | undefined,
): number | null {
  const positions = flattenPositions(geometry?.coordinates);
  if (positions.length === 0) return null;
  return Math.min(
    ...positions.map(([longitude, latitude]) =>
      distanceMeters(origin, { latitude, longitude }),
    ),
  );
}
