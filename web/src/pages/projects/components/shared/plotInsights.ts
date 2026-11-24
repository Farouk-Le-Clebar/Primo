import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import type { Tone } from "../ui/palette";

const NEW_PLOT_DAYS = 7;
const DAY_MS = 86_400_000;

export type VigilanceTag = { label: string; tone: Tone };

export const isNewPlot = (plot: ProjectPlotWithSummary, now: number = Date.now()): boolean =>
  !!plot.addedAt && now - new Date(plot.addedAt).getTime() < NEW_PLOT_DAYS * DAY_MS;

export const isEnergySieve = (plot: ProjectPlotWithSummary): boolean => ["F", "G"].includes(plot.summary?.dpe?.lastLabel ?? "");

export function vigilanceTags(plot: ProjectPlotWithSummary): VigilanceTag[] {
  const names = (plot.summary?.risks?.names ?? []).map((name) => name.toLowerCase());
  const tags: VigilanceTag[] = [];
  if (isEnergySieve(plot)) tags.push({ label: "Passoire", tone: "red" });
  if (names.some((name) => name.includes("inondation"))) tags.push({ label: "Inondation", tone: "blue" });
  if (names.some((name) => name.includes("argile"))) tags.push({ label: "Argile", tone: "amber" });
  if (/Classes? .*3/.test(plot.summary?.risks?.radon ?? "")) tags.push({ label: "Radon", tone: "amber" });
  return tags;
}

export function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
}

export const pricePerM2 = (plot: ProjectPlotWithSummary): number | null => plot.summary?.dvf?.lastPricePerM2 ?? null;

export const formatEuros = (value: number | null | undefined): string =>
  value == null ? "—" : `${value.toLocaleString("fr-FR")} €`;

export const shortName = (name: string | null | undefined): string => {
  const [first, last] = (name ?? "").split(/\s+/);
  return first ? `${first}${last ? ` ${last[0]}.` : ""}` : "—";
};

export const plotTitle = (plot: ProjectPlotWithSummary): string => plot.adress?.split(",")[0]?.trim() || plot.plotId;
