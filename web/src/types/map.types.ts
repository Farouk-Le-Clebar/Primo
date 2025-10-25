import type { LatLngExpression } from "leaflet";

export type ZoomLevel = "departements" | "communes" | "divisions" | "parcelles";

export interface GeoJSONGeometry {
  type: string;
  coordinates: number[] | number[][] | number[][][] | number[][][][];
}

export interface GeoJSONProperties {
  nom?: string;
  nom_departement?: string;
  nom_commune?: string;
  numero?: string;
  id?: string;
  libelle?: string;
  code?: string;
  code_insee?: string;
  population?: number;
  surface?: number;
  [key: string]: unknown;
}

export interface GeoJSONFeature {
  type: "Feature";
  geometry: GeoJSONGeometry;
  properties: GeoJSONProperties;
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export interface ParcelMapProps {
  darkMode?: boolean;
  center?: LatLngExpression;
  zoom?: number;
  showSearchBar?: boolean;
}

export type GeoJSONData = GeoJSONFeatureCollection | GeoJSONFeature;
