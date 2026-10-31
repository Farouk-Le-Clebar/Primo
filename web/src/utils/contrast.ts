import type { MapPalette, ParcelColors, ParcelState } from "../types/mapColors";

type Rgb = [number, number, number];

export type ReadabilityIssue =
  | { kind: "stroke-background"; state: ParcelState; ratio: number }
  | { kind: "fill-background"; state: ParcelState }
  | { kind: "states-close"; states: [ParcelState, ParcelState] };

export const MIN_STROKE_CONTRAST = 3;
const MIN_FILL_CONTRAST = 1.1;
const CLOSE_STROKE_CONTRAST = 1.2;
const CLOSE_STROKE_DISTANCE = 12;
const CLOSE_FILL_DISTANCE = 5;

const STATES: ParcelState[] = ["default", "hover", "selected"];
const STATE_PAIRS: [ParcelState, ParcelState][] = [["default", "hover"], ["hover", "selected"], ["default", "selected"]];
const WHITE_POINT: Rgb = [0.95047, 1, 1.08883];

const hexToRgb = (hex: string): Rgb => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

const toLinear = (channel: number): number => {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

const toHexChannel = (value: number): string => Math.round(value).toString(16).padStart(2, "0");

export const relativeLuminance = (hex: string): number => {
  const [red, green, blue] = hexToRgb(hex).map(toLinear);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

export const contrastRatio = (first: string, second: string): number => {
  const luminances = [relativeLuminance(first), relativeLuminance(second)];
  return (Math.max(...luminances) + 0.05) / (Math.min(...luminances) + 0.05);
};

export const blendOver = (hex: string, background: string, opacity: number): string => {
  const backgroundRgb = hexToRgb(background);
  const blended = hexToRgb(hex).map((channel, index) => channel * opacity + backgroundRgb[index] * (1 - opacity));
  return `#${blended.map(toHexChannel).join("")}`;
};

const toLab = (hex: string): Rgb => {
  const [red, green, blue] = hexToRgb(hex).map(toLinear);
  const xyz: Rgb = [
    0.4124 * red + 0.3576 * green + 0.1805 * blue,
    0.2126 * red + 0.7152 * green + 0.0722 * blue,
    0.0193 * red + 0.1192 * green + 0.9505 * blue,
  ];
  const [x, y, z] = xyz.map((value, index) => {
    const ratio = value / WHITE_POINT[index];
    return ratio > 0.008856 ? Math.cbrt(ratio) : 7.787 * ratio + 16 / 116;
  });
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
};

export const colorDistance = (first: string, second: string): number => {
  const secondLab = toLab(second);
  return Math.hypot(...toLab(first).map((value, index) => value - secondLab[index]));
};

const blendFill = (colors: ParcelColors, background: string): string =>
  blendOver(colors.fill, background, colors.fillOpacity);

const areStatesClose = (first: ParcelColors, second: ParcelColors, background: string): boolean => {
  const areStrokesClose =
    contrastRatio(first.stroke, second.stroke) < CLOSE_STROKE_CONTRAST &&
    colorDistance(first.stroke, second.stroke) < CLOSE_STROKE_DISTANCE;
  return areStrokesClose && colorDistance(blendFill(first, background), blendFill(second, background)) < CLOSE_FILL_DISTANCE;
};

export const getReadabilityIssues = (palette: MapPalette, background: string): ReadabilityIssue[] => {
  const strokeIssues = STATES.flatMap((state): ReadabilityIssue[] => {
    const ratio = contrastRatio(palette[state].stroke, background);
    return ratio < MIN_STROKE_CONTRAST ? [{ kind: "stroke-background", state, ratio }] : [];
  });
  const fillIssues = STATES.filter((state) => state !== "default").flatMap((state): ReadabilityIssue[] =>
    contrastRatio(blendFill(palette[state], background), background) < MIN_FILL_CONTRAST ? [{ kind: "fill-background", state }] : [],
  );
  const stateIssues = STATE_PAIRS.flatMap((states): ReadabilityIssue[] =>
    areStatesClose(palette[states[0]], palette[states[1]], background) ? [{ kind: "states-close", states }] : [],
  );
  return [...strokeIssues, ...fillIssues, ...stateIssues];
};
