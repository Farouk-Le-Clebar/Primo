import type { FeatureCollection } from 'geojson';
import { DEFAULT_MAP_COLORS } from '../constants/mapColorPresets';
import { toShapeStyles, type ShapeStyles } from './mapColors';

const cartodbToken = window?._env_?.CARTODB_TOKEN;

export const MIN_ZOOM_FOR_PARCELLES = 18;
export const MIN_ZOOM_FOR_DIVISION = 15;
export const MIN_ZOOM_FOR_CITY = 11;

export const isFeatureCollection = (d: any): d is FeatureCollection =>
    !!d && Array.isArray((d as any).features);

let activeShapeStyles: ShapeStyles = toShapeStyles(DEFAULT_MAP_COLORS.light);

export const getShapeStyles = (): ShapeStyles => activeShapeStyles;

export const setShapeStyles = (styles: ShapeStyles) => {
    activeShapeStyles = styles;
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
