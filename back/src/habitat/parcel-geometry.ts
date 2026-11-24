import { BadRequestException } from '@nestjs/common';

export const NEAR_PARCEL_METERS = 10;

export const PARCEL_GEOMETRY_SQL =
  'ST_SetSRID(ST_GeomFromGeoJSON(:parcelGeoJson), 4326)';

export const NEAR_PARCEL_SQL = `ST_Buffer(${PARCEL_GEOMETRY_SQL}::geography, :bufferMeters)::geometry`;

export function parcelGeometry(geometry: Record<string, unknown>): string {
  if (
    !['Polygon', 'MultiPolygon'].includes(String(geometry.type)) ||
    !Array.isArray(geometry.coordinates)
  ) {
    throw new BadRequestException(
      'La géométrie doit être un GeoJSON Polygon ou MultiPolygon.',
    );
  }
  return JSON.stringify({
    type: geometry.type,
    coordinates: geometry.coordinates,
  });
}
