import type { PathOptions } from "leaflet";
import type { ColorMode, MapColors, MapPalette, ParcelColors, ParcelState } from "../types/mapColors";

export type ShapeStyles = Record<ParcelState, PathOptions>;

export const PARCEL_STATES: ParcelState[] = ["default", "hover", "selected"];

export const PARCEL_STATE_LABELS: Record<ParcelState, string> = {
  default: "Normal",
  hover: "Survol",
  selected: "Sélectionné",
};

export const COLOR_MODE_LABELS: Record<ColorMode, string> = {
  light: "Clair",
  dark: "Sombre",
};

export const SHAPE_STROKES: Record<ParcelState, { opacity: number; weight: number }> = {
  default: { opacity: 0.95, weight: 2 },
  hover: { opacity: 1, weight: 3 },
  selected: { opacity: 1, weight: 4.5 },
};

export const getPaletteColors = (palette: MapPalette): string[] =>
  PARCEL_STATES.map((state) => palette[state].stroke);

const toShapeStyle = (state: ParcelState, colors: ParcelColors): PathOptions => ({
  ...SHAPE_STROKES[state],
  color: colors.stroke,
  fillColor: colors.fill,
  fillOpacity: colors.fillOpacity,
});

export const toShapeStyles = (palette: MapPalette): ShapeStyles => ({
  default: toShapeStyle("default", palette.default),
  hover: toShapeStyle("hover", palette.hover),
  selected: toShapeStyle("selected", palette.selected),
});

const isSameParcelColors = (first: ParcelColors, second: ParcelColors): boolean =>
  first.fill === second.fill && first.stroke === second.stroke && first.fillOpacity === second.fillOpacity;

const isSamePalette = (first: MapPalette, second: MapPalette): boolean =>
  PARCEL_STATES.every((state) => isSameParcelColors(first[state], second[state]));

export const isSameMapColors = (first: MapColors, second: MapColors): boolean =>
  isSamePalette(first.light, second.light) && isSamePalette(first.dark, second.dark);
