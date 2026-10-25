import { median, type DvfRecord } from "../dvf/data";

export type Valuation = { low: number; mid: number; high: number; comparables: number } | null;

export function estimateValue(records: DvfRecord[], surface: number | null, type: string): Valuation {
  if (!surface) return null;
  const pattern = type === "maison" ? /maison/i : /appartement/i;
  const prices = records
    .filter((r) => r.priceM2 !== null && pattern.test(r.type_local ?? ""))
    .map((r) => r.priceM2 as number)
    .sort((a, b) => a - b);
  const mid = median(prices);
  if (mid === null) return null;
  const quartile = (q: number): number => prices[Math.min(prices.length - 1, Math.floor(q * (prices.length - 1)))];
  return {
    low: quartile(0.25) * surface,
    mid: mid * surface,
    high: quartile(0.75) * surface,
    comparables: prices.length,
  };
}
