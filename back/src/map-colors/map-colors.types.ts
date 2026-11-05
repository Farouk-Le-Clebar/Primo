export interface ParcelColors {
  fill: string;
  stroke: string;
  fillOpacity: number;
}

export interface MapPalette {
  default: ParcelColors;
  hover: ParcelColors;
  selected: ParcelColors;
}

export interface MapColors {
  version: number;
  light: MapPalette;
  dark: MapPalette;
}
