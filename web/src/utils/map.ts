import type { FeatureCollection } from 'geojson';
const cartodbToken = window?._env_?.CARTODB_TOKEN;

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


export const boundToBbox = (bounds: L.LatLngBounds) => {
    return ([
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth()
    ].join(','));
};

export const FRANCE_BBOX = "-180,-90,180,90";

export const mapPreference = {
    "basic": "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=" + cartodbToken,
    "basic-dark": "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=" + cartodbToken,
    "satellite": "https://api.maptiler.com/maps/hybrid-v4/{z}/{x}/{y}.jpg?key=UCSo4MgoDF6bXaSkuhU7",
    "oldSatellite": "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
};
