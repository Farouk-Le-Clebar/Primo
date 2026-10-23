import { geometryArea } from "./geometry";
import type { BuildingFeature, BuildingProperties } from "./types";

export type UsageShare = { name: string; value: number };

export type BuildingStats = {
  count: number;
  footprint: number;
  floorArea: number;
  dwellings: number | null;
  maxHeight: number | null;
  oldestYear: number | null;
  usages: UsageShare[];
};

export const toNumber = (value: unknown): number | null => {
  if (value == null || String(value).trim() === "") return null;
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const buildingYear = (p: BuildingProperties): number | null => {
  const year = Number(String(p.date_app || "").slice(0, 4));
  return year > 1000 && year <= new Date().getFullYear() ? year : null;
};

const YEAR_WEIGHT = 2;

const completeness = ({ properties: p }: BuildingFeature): number =>
  [
    p.mat_murs && p.mat_murs !== "00",
    p.mat_toits && p.mat_toits !== "00",
    p.usage1,
    toNumber(p.hauteur),
    toNumber(p.nb_etages),
  ].filter(Boolean).length + (buildingYear(p) ? YEAR_WEIGHT : 0);

export const sortByCompleteness = (
  buildings: BuildingFeature[],
): BuildingFeature[] =>
  [...buildings].sort((a, b) => completeness(b) - completeness(a));

const maxOf = (values: (number | null)[]): number | null => {
  const known = values.filter((v): v is number => v != null);
  return known.length ? Math.max(...known) : null;
};

export function computeBuildingStats(
  buildings: BuildingFeature[],
): BuildingStats {
  const usageCounts = new Map<string, number>();
  let footprint = 0;
  let floorArea = 0;
  buildings.forEach(({ geometry, properties: p }) => {
    const area = geometryArea(geometry);
    footprint += area;
    floorArea += area * (toNumber(p.nb_etages) ?? 1);
    const usage = p.usage1 || "Indifférencié";
    usageCounts.set(usage, (usageCounts.get(usage) ?? 0) + 1);
  });
  const dwellings = buildings.map((b) => toNumber(b.properties.nb_logts));
  const years = buildings
    .map((b) => buildingYear(b.properties))
    .filter((y): y is number => y != null);
  return {
    count: buildings.length,
    footprint,
    floorArea,
    dwellings: dwellings.some((d) => d != null)
      ? dwellings.reduce<number>((sum, d) => sum + (d ?? 0), 0)
      : null,
    maxHeight: maxOf(buildings.map((b) => toNumber(b.properties.hauteur))),
    oldestYear: years.length ? Math.min(...years) : null,
    usages: [...usageCounts]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value),
  };
}

export const squareMeters = (value: number | null): string =>
  value == null || value <= 0
    ? "—"
    : `${Math.round(value).toLocaleString("fr-FR")} m²`;

export const coverageRatio = (
  footprint: number,
  parcelArea: number | null,
): number | null =>
  parcelArea ? Math.min(100, Math.round((footprint / parcelArea) * 100)) : null;
