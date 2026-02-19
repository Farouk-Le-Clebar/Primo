import type { FeatureCollection } from 'geojson';

export const MIN_ZOOM_FOR_PARCELLES = 18;
export const MIN_ZOOM_FOR_DIVISION = 15;
export const MIN_ZOOM_FOR_CITY = 11;

export const isFeatureCollection = (d: any): d is FeatureCollection =>
    !!d && Array.isArray((d as any).features);

export const style = {
    fillColor: "#54bb8dff",
    color: "#51b789ff",
    weight: 2,
};

export type DataType = {
    departements: FeatureCollection | null;
    parcelles: FeatureCollection | null;
    city: FeatureCollection | null;
    divisions: FeatureCollection | null;
};

export const boundToBbox = (bounds: any) => {
    const { _southWest, _northEast } = bounds;
    return ([
        _southWest.lng,
        _southWest.lat,
        _northEast.lng,
        _northEast.lat
    ].join(','));
};

export const FRANCE_BBOX = "-180,-90,180,90";

export const geometryToBbox = (geometry: any): string | null => {
    if (!geometry) return null;

    let allCoords: number[][] = [];

    if (geometry.type === 'Polygon') {
        allCoords = geometry.coordinates[0];
    } else if (geometry.type === 'MultiPolygon') {
        geometry.coordinates.forEach((polygon: number[][][]) => {
            allCoords = allCoords.concat(polygon[0]);
        });
    }

    if (allCoords.length === 0) return null;

    const lngs = allCoords.map(coord => coord[0]);
    const lats = allCoords.map(coord => coord[1]);

    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    return `${minLng},${minLat},${maxLng},${maxLat}`;
};