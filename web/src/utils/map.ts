import type { FeatureCollection } from 'geojson';
const cartodbToken = window?._env_?.CARTODB_TOKEN;

export const MIN_ZOOM_FOR_PARCELLES = 18;
export const MIN_ZOOM_FOR_DIVISION = 15;
export const MIN_ZOOM_FOR_CITY = 11;

export const isFeatureCollection = (d: any): d is FeatureCollection =>
    !!d && Array.isArray((d as any).features);

export const defaultShapeStyle = {
    color: "#ffffff",
    opacity: 0.95,
    weight: 2,
    fillColor: "#ffffff",
    fillOpacity: 0.06,
};

export const hoverShapeStyle = {
    color: "#67e8f9",
    opacity: 1,
    weight: 3,
    fillColor: "#22d3ee",
    fillOpacity: 0.15,
};

export const selectedShapeStyle = {
    color: "#22d3ee",
    opacity: 1,
    weight: 4.5,
    fillColor: "#06b6d4",
    fillOpacity: 0.28,
};

export type DataType = {
    departements: FeatureCollection | null;
    parcelles: FeatureCollection | null;
    city: FeatureCollection | null;
    divisions: FeatureCollection | null;
};


export type ShapeLevel = keyof DataType;

export const EMPTY_SHAPES: DataType = {
    departements: null,
    parcelles: null,
    city: null,
    divisions: null,
};

export const getShapeLevel = (zoom: number): ShapeLevel => {
    if (zoom >= MIN_ZOOM_FOR_PARCELLES) return "parcelles";
    if (zoom >= MIN_ZOOM_FOR_DIVISION) return "divisions";
    if (zoom >= MIN_ZOOM_FOR_CITY) return "city";
    return "departements";
};

const shapeKeys = new WeakMap<FeatureCollection, number>();
let nextShapeKey = 0;

export const getShapeKey = (data: FeatureCollection): number => {
    if (!shapeKeys.has(data)) shapeKeys.set(data, nextShapeKey++);
    return shapeKeys.get(data)!;
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
