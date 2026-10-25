import { median, type DvfRecord } from "./data";

export type SurfaceBin = { key: string; label: string; count: number };

const SURFACE_BINS: { label: string; max: number }[] = [
  { label: "Moins de 40 m²", max: 40 },
  { label: "40 à 60 m²", max: 60 },
  { label: "60 à 90 m²", max: 90 },
  { label: "90 à 150 m²", max: 150 },
  { label: "Plus de 150 m²", max: Infinity },
];

const HOUSING = /maison|appartement/i;

export const typeLabel = (record: DvfRecord): string => record.type_local || "Non renseigné";

function surfaceBins(records: DvfRecord[]): SurfaceBin[] {
  return SURFACE_BINS.map(({ label, max }, index) => ({
    key: label,
    label,
    count: records.filter(
      ({ surface_reelle_bati: s }) => s !== null && s < max && s >= (SURFACE_BINS[index - 1]?.max ?? 0),
    ).length,
  })).filter((bin) => bin.count > 0);
}

export function computeDvfStats(records: DvfRecord[]) {
  const priced = records.filter((r) => r.priceM2 !== null);
  const housing = priced.filter((r) => HOUSING.test(r.type_local ?? ""));
  const reference = housing.length ? housing : priced;
  const prices = reference.map((r) => r.priceM2 as number);
  const surfaces = records.flatMap((r) => (r.surface_reelle_bati !== null && r.locals.length === 1 ? [r.surface_reelle_bati] : []));
  const years = records.map((r) => Number(r.date_mutation.slice(0, 4)));
  return {
    count: records.length,
    latest: records[0] ?? null,
    medianPrice: median(prices),
    minPrice: prices.length ? Math.min(...prices) : null,
    maxPrice: prices.length ? Math.max(...prices) : null,
    usablePrices: prices.length,
    priceScope: housing.length ? "logements" : "biens bâtis",
    excluded: records.length - priced.length,
    medianSurface: median(surfaces),
    period: years.length ? { from: Math.min(...years), to: Math.max(...years) } : null,
    surfaceBins: surfaceBins(records),
  };
}

export type DvfStats = ReturnType<typeof computeDvfStats>;

export function typeShares(records: DvfRecord[]): { key: string; count: number }[] {
  const counts = new Map<string, number>();
  records.forEach((r) => counts.set(typeLabel(r), (counts.get(typeLabel(r)) ?? 0) + 1));
  return [...counts].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count);
}
