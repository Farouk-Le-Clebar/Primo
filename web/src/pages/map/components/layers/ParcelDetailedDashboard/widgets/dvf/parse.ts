export type DvfLine = {
  mutation: string;
  parcel: string;
  date: string;
  nature: string;
  value: number;
  type: string | null;
  surface: number | null;
  lot: string | null;
  carrez: number | null;
  rooms: number | null;
  culture: string;
  land: number | null;
};

export function positiveNumber(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  const normalized =
    typeof value === "string" ? value.trim().replace(/[\s\u00a0\u202f]/g, "").replace(",", ".") : value;
  if (normalized === "") return null;
  const number = Number(normalized);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function mutationDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const day = value.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  const parsed = new Date(`${day}T12:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === day ? day : null;
}

const stringOf = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

export function parseLines(source: unknown): DvfLine[] {
  return (Array.isArray(source) ? source : []).flatMap((row: unknown) => {
    if (!row || typeof row !== "object") return [];
    const raw = row as Record<string, unknown>;
    const date = mutationDate(raw.date_mutation);
    const value = positiveNumber(raw.valeur_fonciere);
    if (!date || value === null) return [];
    return [{
      mutation: stringOf(raw.id_mutation),
      parcel: stringOf(raw.id_parcelle),
      date,
      nature: stringOf(raw.nature_mutation) || "Non renseignée",
      value,
      type: stringOf(raw.type_local) || null,
      surface: positiveNumber(raw.surface_reelle_bati),
      lot: stringOf(raw.lot1_numero) || null,
      carrez: positiveNumber(raw.lot1_surface_carrez),
      rooms: positiveNumber(raw.nombre_pieces_principales),
      culture: stringOf(raw.code_nature_culture),
      land: positiveNumber(raw.surface_terrain),
    }];
  });
}

export const mutationKey = (line: DvfLine): string =>
  line.mutation || `${line.date}|${line.value}|${line.nature.toLowerCase()}`;
