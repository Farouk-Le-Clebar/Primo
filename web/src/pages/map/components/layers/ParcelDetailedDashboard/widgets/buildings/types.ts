import type { Geometry } from "geojson";

type SourceValue = string | number | null | undefined;

export type BuildingProperties = {
  id?: string;
  nature?: string;
  usage1?: string;
  usage2?: string;
  etat?: string;
  leger?: string;
  hauteur?: SourceValue;
  nb_etages?: SourceValue;
  nb_logts?: SourceValue;
  mat_murs?: string;
  mat_toits?: string;
  date_app?: string;
  ids_rnb?: string;
};

export type BuildingFeature = {
  id?: string;
  geometry: Geometry | null;
  properties: BuildingProperties;
};

export type BuildingColor = {
  fill: string;
  stroke: string;
  bg: string;
  dot: string;
};
