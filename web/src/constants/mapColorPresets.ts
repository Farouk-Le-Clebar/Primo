import type { ColorMode, MapColorPreset, MapColors, MapPalette } from "../types/mapColors";

export const MAP_COLORS_VERSION = 1;

export const MAP_BACKGROUNDS: Record<ColorMode, string> = {
  light: "#fafaf8",
  dark: "#262626",
};

const DEFAULT_PALETTE: MapPalette = {
  default: { fill: "#ffffff", stroke: "#ffffff", fillOpacity: 0.06 },
  hover: { fill: "#22d3ee", stroke: "#67e8f9", fillOpacity: 0.15 },
  selected: { fill: "#06b6d4", stroke: "#22d3ee", fillOpacity: 0.28 },
};

export const DEFAULT_MAP_COLORS: MapColors = {
  version: MAP_COLORS_VERSION,
  light: DEFAULT_PALETTE,
  dark: DEFAULT_PALETTE,
};

export const MAP_COLOR_PRESETS: MapColorPreset[] = [
  { id: "primo", label: "Primo", colors: DEFAULT_MAP_COLORS },
  {
    id: "ardoise",
    label: "Ardoise",
    colors: {
      version: MAP_COLORS_VERSION,
      light: {
        default: { fill: "#64748b", stroke: "#475569", fillOpacity: 0.08 },
        hover: { fill: "#3b82f6", stroke: "#2563eb", fillOpacity: 0.16 },
        selected: { fill: "#2563eb", stroke: "#1e3a8a", fillOpacity: 0.3 },
      },
      dark: {
        default: { fill: "#cbd5e1", stroke: "#cbd5e1", fillOpacity: 0.06 },
        hover: { fill: "#60a5fa", stroke: "#93c5fd", fillOpacity: 0.18 },
        selected: { fill: "#3b82f6", stroke: "#60a5fa", fillOpacity: 0.32 },
      },
    },
  },
  {
    id: "foret",
    label: "Forêt",
    colors: {
      version: MAP_COLORS_VERSION,
      light: {
        default: { fill: "#4d7c0f", stroke: "#3f6212", fillOpacity: 0.08 },
        hover: { fill: "#22c55e", stroke: "#15803d", fillOpacity: 0.18 },
        selected: { fill: "#16a34a", stroke: "#14532d", fillOpacity: 0.3 },
      },
      dark: {
        default: { fill: "#d9f99d", stroke: "#d9f99d", fillOpacity: 0.06 },
        hover: { fill: "#22c55e", stroke: "#4ade80", fillOpacity: 0.18 },
        selected: { fill: "#16a34a", stroke: "#22c55e", fillOpacity: 0.32 },
      },
    },
  },
  {
    id: "terre",
    label: "Terre",
    colors: {
      version: MAP_COLORS_VERSION,
      light: {
        default: { fill: "#b45309", stroke: "#92400e", fillOpacity: 0.08 },
        hover: { fill: "#f97316", stroke: "#c2410c", fillOpacity: 0.18 },
        selected: { fill: "#ea580c", stroke: "#7c2d12", fillOpacity: 0.3 },
      },
      dark: {
        default: { fill: "#fde68a", stroke: "#fde68a", fillOpacity: 0.06 },
        hover: { fill: "#fb923c", stroke: "#fdba74", fillOpacity: 0.18 },
        selected: { fill: "#ea580c", stroke: "#f97316", fillOpacity: 0.32 },
      },
    },
  },
  {
    id: "prune",
    label: "Prune",
    colors: {
      version: MAP_COLORS_VERSION,
      light: {
        default: { fill: "#7e22ce", stroke: "#6b21a8", fillOpacity: 0.08 },
        hover: { fill: "#a855f7", stroke: "#9333ea", fillOpacity: 0.18 },
        selected: { fill: "#9333ea", stroke: "#581c87", fillOpacity: 0.3 },
      },
      dark: {
        default: { fill: "#e9d5ff", stroke: "#e9d5ff", fillOpacity: 0.06 },
        hover: { fill: "#c084fc", stroke: "#d8b4fe", fillOpacity: 0.18 },
        selected: { fill: "#a855f7", stroke: "#c084fc", fillOpacity: 0.32 },
      },
    },
  },
  {
    id: "corail",
    label: "Corail",
    colors: {
      version: MAP_COLORS_VERSION,
      light: {
        default: { fill: "#be123c", stroke: "#9f1239", fillOpacity: 0.08 },
        hover: { fill: "#f43f5e", stroke: "#e11d48", fillOpacity: 0.18 },
        selected: { fill: "#e11d48", stroke: "#881337", fillOpacity: 0.3 },
      },
      dark: {
        default: { fill: "#fecdd3", stroke: "#fecdd3", fillOpacity: 0.06 },
        hover: { fill: "#fb7185", stroke: "#fda4af", fillOpacity: 0.18 },
        selected: { fill: "#f43f5e", stroke: "#fb7185", fillOpacity: 0.32 },
      },
    },
  },
  {
    id: "lagon",
    label: "Lagon",
    colors: {
      version: MAP_COLORS_VERSION,
      light: {
        default: { fill: "#0f766e", stroke: "#115e59", fillOpacity: 0.08 },
        hover: { fill: "#14b8a6", stroke: "#0f766e", fillOpacity: 0.18 },
        selected: { fill: "#0d9488", stroke: "#134e4a", fillOpacity: 0.3 },
      },
      dark: {
        default: { fill: "#99f6e4", stroke: "#99f6e4", fillOpacity: 0.06 },
        hover: { fill: "#2dd4bf", stroke: "#5eead4", fillOpacity: 0.18 },
        selected: { fill: "#14b8a6", stroke: "#2dd4bf", fillOpacity: 0.32 },
      },
    },
  },
];
