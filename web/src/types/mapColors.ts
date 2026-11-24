export type ColorMode = "light" | "dark";

export type ParcelState = "default" | "hover" | "selected";

export type ParcelColors = {
  fill: string;
  stroke: string;
  fillOpacity: number;
};

export type MapPalette = Record<ParcelState, ParcelColors>;

export type MapColors = {
  version: number;
  light: MapPalette;
  dark: MapPalette;
};

export type MapColorPreset = {
  id: string;
  label: string;
  colors: MapColors;
};
