import { prepareAutorisations, types as PERMIT_TYPES } from "../widgets/autorisations/data";
import { ORDERED_LABELS } from "../widgets/dpe/utils";
import { median, prepareDvf } from "../widgets/dvf/data";
import { prepareGeorisques } from "../widgets/georisques/data";
import { prepareRiskCards } from "../widgets/georisques/riskCards";
import { text, validDate, type SourceRow } from "../widgets/shared/format";
import type { DpePayload, SourceCollection } from "./useSummaryQueries";

export type DpeShare = { label: string; count: number };

export function summarizePlu(data: SourceCollection | undefined) {
  const zones = (data?.features ?? []).map((f) => f.properties ?? {});
  const labels = [
    ...new Set(zones.map((z) => text(z.libelle, "") || text(z.typezone, "")).filter(Boolean)),
  ];
  return {
    labels,
    type: text(zones[0]?.typezone, ""),
    description: text(zones[0]?.libelong, ""),
  };
}

export function summarizeDpe(data: DpePayload | undefined) {
  const diagnostics: SourceRow[] = Array.isArray(data) ? data : (data?.historique ?? []);
  const distribution: DpeShare[] = ORDERED_LABELS.map((label) => ({
    label,
    count: diagnostics.filter((d) => text(d.etiquette_dpe, "").trim().toUpperCase() === label).length,
  }));
  const max = Math.max(0, ...distribution.map((d) => d.count));
  const dates = diagnostics
    .map((d) => validDate(d.date_etablissement_dpe))
    .filter((d): d is string => d != null)
    .sort();
  return {
    count: diagnostics.length,
    distribution,
    dominant: distribution.filter((d) => max > 0 && d.count === max).map((d) => d.label),
    lastDate: dates.at(-1) ?? null,
  };
}

export function summarizeDvf(data: unknown) {
  const records = prepareDvf(data).records;
  const ratios = records.flatMap((r) => (r.priceM2 !== null ? [r.priceM2] : []));
  const latest = [...records]
    .filter((r) => validDate(r.date_mutation))
    .sort((a, b) => b.date_mutation.localeCompare(a.date_mutation))[0];
  return {
    count: records.length,
    ratiosCount: ratios.length,
    medianPrice: median(ratios),
    latestDate: latest?.date_mutation ?? null,
    latestValue: latest?.valeur_fonciere ?? null,
  };
}

export function summarizeRisks(data: SourceCollection | undefined) {
  const properties = data?.features?.[0]?.properties;
  if (!properties) return null;
  const prepared = prepareGeorisques(properties);
  return {
    commune: prepared.commune,
    risks: prepareRiskCards(prepared).filter((c) => c.identified).map((c) => c.title),
    seismic: text(properties.zone_sismicite, "Non renseigné"),
    radon: prepared.radon,
    catnat: prepared.catnat?.length ?? 0,
  };
}

export function summarizePermits(data: SourceRow[] | undefined) {
  const dossiers = prepareAutorisations(data ?? []);
  return {
    count: dossiers.length,
    latestDate: dossiers[0]?.date || null,
    latestType: dossiers[0] ? PERMIT_TYPES[dossiers[0].type] || dossiers[0].type : null,
    types: [...new Set(dossiers.map((d) => d.type))].map((type) => ({
      name: PERMIT_TYPES[type] || type,
      value: dossiers.filter((d) => d.type === type).length,
    })),
  };
}
