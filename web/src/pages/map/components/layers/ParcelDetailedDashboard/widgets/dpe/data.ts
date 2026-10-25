import { median, positiveNumber } from "../dvf/data";
import { text, validDate, type SourceRow } from "../shared/format";
import { ORDERED_LABELS } from "./utils";

export type DpeEntry = {
  key: string;
  label: string;
  ges: string;
  date: string | null;
  expired: boolean | null;
  conso: number | null;
  emission: number | null;
  cost: number | null;
  surface: number | null;
  raw: SourceRow;
};

export type ClassShare = { label: string; count: number };
export type NamedShare = { name: string; value: number };

const POOR_LABELS = ["E", "F", "G"];
const TODAY = new Date().toISOString().slice(0, 10);

const classOf = (value: unknown): string => {
  const label = text(value, "").trim().toUpperCase();
  return (ORDERED_LABELS as readonly string[]).includes(label) ? label : "?";
};

export function prepareDpe(rows: SourceRow[]): DpeEntry[] {
  return rows
    .map((raw, index) => {
      const end = validDate(raw.date_fin_validite_dpe);
      return {
        key: text(raw.numero_dpe, "") || `dpe-${index}`,
        label: classOf(raw.etiquette_dpe),
        ges: classOf(raw.etiquette_ges),
        date: validDate(raw.date_etablissement_dpe),
        expired: end ? end < TODAY : null,
        conso: positiveNumber(raw.conso_5_usages_ep_m2_an),
        emission: positiveNumber(raw.emission_ges_5_usages_m2_an),
        cost: positiveNumber(raw.cout_total_5_usages),
        surface: positiveNumber(raw.surface_habitable_logement),
        raw,
      };
    })
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

const distributionOf = (values: string[]): ClassShare[] =>
  ORDERED_LABELS.map((label) => ({
    label,
    count: values.filter((v) => v === label).length,
  }));

const sharesOf = (values: string[]): NamedShare[] => {
  const counts = new Map<string, number>();
  values.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
  return [...counts]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

const dominantOf = (distribution: ClassShare[]): string => {
  const max = Math.max(0, ...distribution.map((d) => d.count));
  return distribution.find((d) => max > 0 && d.count === max)?.label ?? "?";
};

const known = (values: (number | null)[]): number[] =>
  values.filter((v): v is number => v != null);

export function computeDpeStats(entries: DpeEntry[]) {
  const distribution = distributionOf(entries.map((e) => e.label));
  const gesDistribution = distributionOf(entries.map((e) => e.ges));
  const poor = entries.filter((e) => POOR_LABELS.includes(e.label)).length;
  const dates = known(entries.map((e) => (e.date ? Number(e.date.slice(0, 4)) : null)));
  return {
    count: entries.length,
    distribution,
    gesDistribution,
    dominant: dominantOf(distribution),
    dominantGes: dominantOf(gesDistribution),
    medianConso: median(known(entries.map((e) => e.conso))),
    medianCost: median(known(entries.map((e) => e.cost))),
    poor,
    poorShare: entries.length ? Math.round((poor / entries.length) * 100) : 0,
    expired: entries.filter((e) => e.expired).length,
    period: dates.length ? { from: Math.min(...dates), to: Math.max(...dates) } : null,
    heating: sharesOf(entries.map((e) => text(e.raw.type_energie_principale_chauffage, "Non renseigné"))),
    buildingTypes: sharesOf(entries.map((e) => text(e.raw.type_batiment, "Non renseigné"))),
  };
}

export type DpeStats = ReturnType<typeof computeDpeStats>;
