import { text, validDate, type SourceRow } from "../shared/format";

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
