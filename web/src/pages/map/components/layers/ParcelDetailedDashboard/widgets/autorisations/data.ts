import { text, validDate, type SourceRow } from "../shared/format";
import type { Tone } from "../shared/tones";

export const types: Record<string, string> = {
  PC: "Permis de construire",
  DP: "Déclaration préalable",
  PA: "Permis d’aménager",
  PD: "Permis de démolir",
};
export const states: Record<string, string> = {
  "2": "Autorisé",
  "4": "Annulé",
  "5": "Chantier commencé",
  "6": "Travaux achevés",
};
export const categories: Record<string, string> = {
  logements: "Logements",
  locaux: "Locaux",
  amenagements: "Aménagements",
  demolitions: "Démolitions",
};
export type Dossier = {
  key: string;
  type: string;
  numero: string;
  rows: SourceRow[];
  date: string;
};

export function prepareAutorisations(rows: SourceRow[]): Dossier[] {
  const groups = new Map<string, Dossier>();
  rows.forEach((row, i) => {
    const type = text(row.type_autorisation);
    const numero = text(row.numero_autorisation);
    const key = row.numero_autorisation ? `${type}-${numero}` : `missing-${i}`;
    const date = validDate(row.date_reelle_autorisation) || "";
    const existing = groups.get(key);
    if (existing) {
      existing.rows.push(row);
      existing.date = existing.date > date ? existing.date : date;
    } else groups.set(key, { key, type, numero, rows: [row], date });
  });
  return [...groups.values()].sort(
    (a, b) => b.date.localeCompare(a.date) || a.key.localeCompare(b.key),
  );
}

export const TYPE_TONES: Record<string, Tone> = { PC: "emerald", DP: "sky", PA: "violet", PD: "rose" };
export const STATE_TONES: Record<string, Tone> = { "2": "sky", "4": "rose", "5": "amber", "6": "emerald" };

export const dossierState = (dossier: Dossier): string =>
  text(dossier.rows[0]?.etat_autorisation, "");

export const countBy = <T>(values: T[], key: (value: T) => string): { key: string; count: number }[] => {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(key(value), (counts.get(key(value)) ?? 0) + 1));
  return [...counts].map(([k, count]) => ({ key: k, count })).sort((a, b) => b.count - a.count);
};
