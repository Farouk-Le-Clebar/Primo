import { mutationKey, parseLines, type DvfLine } from "./parse";
import { dedupeLocals, isDependance, priceOf, type DvfLocal, type PriceStatus } from "./pricing";

export { positiveNumber } from "./parse";

export type DvfRecord = {
  key: string;
  date_mutation: string;
  nature_mutation: string;
  valeur_fonciere: number;
  type_local: string | null;
  surface_reelle_bati: number | null;
  surface_terrain: number | null;
  locals: DvfLocal[];
  dependances: number;
  parcels: number;
  priceM2: number | null;
  priceStatus: PriceStatus;
};

const toLocal = (l: DvfLine): DvfLocal[] =>
  l.type ? [{ parcel: l.parcel, type: l.type, surface: l.surface, lot: l.lot, carrez: l.carrez, rooms: l.rooms }] : [];

function landOf(lines: DvfLine[]): number | null {
  const plots = new Map(lines.filter((l) => l.land).map((l) => [`${l.parcel}|${l.culture}|${l.land}`, l.land as number]));
  return plots.size ? [...plots.values()].reduce((sum, land) => sum + land, 0) : null;
}

function toRecord(key: string, lines: DvfLine[]): DvfRecord {
  const [{ date, nature, value }] = lines;
  const locals = dedupeLocals(lines.flatMap(toLocal));
  const mainLocals = locals.filter((l) => !isDependance(l.type));
  const types = [...new Set(mainLocals.map((l) => l.type))];
  const { priceM2, status } = priceOf(nature, value, mainLocals);
  return {
    key,
    date_mutation: date,
    nature_mutation: nature,
    valeur_fonciere: value,
    type_local: types.length === 1 ? types[0] : types.length ? "Ensemble immobilier" : locals[0]?.type ?? null,
    surface_reelle_bati: mainLocals.reduce<number | null>((sum, l) => (l.surface ? (sum ?? 0) + l.surface : sum), null),
    surface_terrain: landOf(lines),
    locals,
    dependances: locals.length - mainLocals.length,
    parcels: new Set(lines.map((l) => l.parcel).filter(Boolean)).size,
    priceM2,
    priceStatus: status,
  };
}

export function prepareDvf(input: unknown) {
  const payload = input && typeof input === "object" && !Array.isArray(input) ? (input as Record<string, unknown>) : null;
  const parcelSource = payload ? payload.historique : input;
  const parcelLines = parseLines(parcelSource);
  const mutationLines = payload && Array.isArray(payload.lignes_mutations) ? parseLines(payload.lignes_mutations) : parcelLines;
  const groups = new Map<string, DvfLine[]>(parcelLines.map((line) => [mutationKey(line), []]));
  mutationLines.forEach((line) => groups.get(mutationKey(line))?.push(line));
  parcelLines.forEach((line) => {
    const group = groups.get(mutationKey(line));
    if (group && !group.length) group.push(line);
  });
  const records = [...groups]
    .map(([key, lines]) => toRecord(key, lines))
    .sort((a, b) => b.date_mutation.localeCompare(a.date_mutation));
  return {
    records,
    rejected: (Array.isArray(parcelSource) ? parcelSource.length : 0) - parcelLines.length,
  };
}

export function median(values: number[]): number | null {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return null;
  return (sorted[Math.floor((sorted.length - 1) / 2)] + sorted[Math.floor(sorted.length / 2)]) / 2;
}
