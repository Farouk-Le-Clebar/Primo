import { MapColors, MapPalette } from './map-colors.types';

export const MAP_COLORS_VERSION = 1;

const DEFAULT_PALETTE: MapPalette = {
  default: { fill: '#ffffff', stroke: '#ffffff', fillOpacity: 0.06 },
  hover: { fill: '#22d3ee', stroke: '#67e8f9', fillOpacity: 0.15 },
  selected: { fill: '#06b6d4', stroke: '#22d3ee', fillOpacity: 0.28 },
};

export const DEFAULT_MAP_COLORS: MapColors = {
  version: MAP_COLORS_VERSION,
  light: DEFAULT_PALETTE,
  dark: DEFAULT_PALETTE,
};
