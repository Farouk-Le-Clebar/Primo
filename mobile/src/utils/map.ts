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
