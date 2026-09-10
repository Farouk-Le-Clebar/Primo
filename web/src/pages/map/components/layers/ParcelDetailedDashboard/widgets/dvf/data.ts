export type DvfRecord = {
  key: string;
  date_mutation: string;
  nature_mutation: string;
  valeur_fonciere: number;
  surface_reelle_bati: number | null;
  surface_terrain: number | null;
  type_local: string | null;
  occurrences: number;
  priceM2: number | null;
  ambiguous: boolean;
};

export function positiveNumber(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  const normalized =
    typeof value === "string"
      ? value
          .trim()
          .replace(/[\s\u00a0\u202f]/g, "")
          .replace(",", ".")
      : value;
  if (normalized === "") return null;
  const number = Number(normalized);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function mutationDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const day = value.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  const parsed = new Date(`${day}T12:00:00Z`);
  return Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === day
    ? day
    : null;
}

export function prepareDvf(input: unknown) {
  const source =
    input && typeof input === "object" && "historique" in input
      ? input.historique
      : input;
  const rows: unknown[] = Array.isArray(source) ? source : [];
  const groups = new Map<string, DvfRecord>();
  const candidates = new Map<string, number>();
  let rejected = 0;
  for (const row of rows) {
    if (!row || typeof row !== "object") {
      rejected++;
      continue;
    }
    const raw = row as Record<string, unknown>;
    const date = mutationDate(raw.date_mutation);
    const price = positiveNumber(raw.valeur_fonciere);
    if (!date || price === null) {
      rejected++;
      continue;
    }
    const nature =
      typeof raw.nature_mutation === "string" ? raw.nature_mutation.trim() : "";
    const type =
      typeof raw.type_local === "string" ? raw.type_local.trim() || null : null;
    const surface = positiveNumber(raw.surface_reelle_bati);
    const land = positiveNumber(raw.surface_terrain);
    const parcel = typeof raw.id_parcelle === "string" ? raw.id_parcelle : "";
    const candidate = JSON.stringify([
      parcel,
      date,
      price,
      nature.toLowerCase(),
    ]);
    const key = JSON.stringify([candidate, type?.toLowerCase(), surface, land]);
    candidates.set(candidate, (candidates.get(candidate) || 0) + 1);
    const previous = groups.get(key);
    if (previous) previous.occurrences++;
    else
      groups.set(key, {
        key,
        date_mutation: date,
        nature_mutation: nature || "Non renseignée",
        valeur_fonciere: price,
        surface_reelle_bati: surface,
        surface_terrain: land,
        type_local: type,
        occurrences: 1,
        priceM2: null,
        ambiguous: false,
      });
  }
  const records = [...groups.values()]
    .map((record) => {
      const candidate = JSON.parse(record.key)[0] as string;
      record.ambiguous = (candidates.get(candidate) || 0) > 1;
      const isBuilt =
        record.type_local && !/dépendance|dependance/i.test(record.type_local);
      const ratio = record.surface_reelle_bati
        ? record.valeur_fonciere / record.surface_reelle_bati
        : null;
      if (
        !record.ambiguous &&
        record.nature_mutation.toLowerCase() === "vente" &&
        isBuilt &&
        ratio !== null &&
        Number.isFinite(ratio)
      )
        record.priceM2 = ratio;
      return record;
    })
    .sort((a, b) => b.date_mutation.localeCompare(a.date_mutation));
  return {
    records,
    rejected,
    sourceCount: rows.length,
    collapsed: rows.length - rejected - records.length,
  };
}

export function median(values: number[]): number | null {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return null;
  return (
    (sorted[Math.floor((sorted.length - 1) / 2)] +
      sorted[Math.floor(sorted.length / 2)]) /
    2
  );
}
