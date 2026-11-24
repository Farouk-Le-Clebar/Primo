import type { HousingType } from "../logement/types";
import { toNumber, type EncadrementLoyer, type LoyerCommune, type TypeBien } from "../habitat/types";

export type MarketRent = { type: TypeBien; m2: number; low: number | null; high: number | null; year: number; ads: number | null };

export type RentCap = { reference: number; ceiling: number; floor: number; epoque: string; pieces: number; meuble: boolean };

export const TYPE_BIEN_LABELS: Record<TypeBien, string> = {
  appartement: "Appartement",
  appartement_t1_t2: "Appartement 1-2 pièces",
  appartement_t3_plus: "Appartement 3 pièces et +",
  maison: "Maison",
};

export const TERRITOIRE_LABELS: Record<string, string> = {
  paris: "Paris",
  lyon: "Lyon et Villeurbanne",
};

export const MAX_PIECES = 4;

export function marketRents(rows: LoyerCommune[]): MarketRent[] {
  const order = Object.keys(TYPE_BIEN_LABELS);
  return rows
    .map((row) => ({
      type: row.type_bien,
      m2: toNumber(row.loyer_m2),
      low: toNumber(row.loyer_m2_bas),
      high: toNumber(row.loyer_m2_haut),
      year: row.annee,
      ads: row.nombre_annonces,
    }))
    .filter((rent): rent is MarketRent => rent.m2 !== null)
    .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
}

export function typeBienFor(housing: HousingType, pieces: number | null): TypeBien {
  if (housing === "maison") return "maison";
  if (pieces === null) return "appartement";
  return pieces <= 2 ? "appartement_t1_t2" : "appartement_t3_plus";
}

export const marketRentFor = (rents: MarketRent[], type: TypeBien): MarketRent | null =>
  rents.find((rent) => rent.type === type) ?? rents.find((rent) => rent.type === "appartement") ?? null;

const inEpoque = (row: EncadrementLoyer, year: number): boolean =>
  (row.annee_min === null || year >= row.annee_min) && (row.annee_max === null || year <= row.annee_max);

export function epoques(rows: EncadrementLoyer[]): EncadrementLoyer[] {
  const seen = new Map<string, EncadrementLoyer>();
  rows.forEach((row) => seen.has(row.epoque) || seen.set(row.epoque, row));
  return [...seen.values()].sort((a, b) => (a.annee_min ?? 0) - (b.annee_min ?? 0));
}

export function rentCap(
  rows: EncadrementLoyer[],
  criteria: { pieces: number; year: number | null; meuble: boolean },
): RentCap | null {
  const pieces = Math.min(Math.max(1, criteria.pieces), MAX_PIECES);
  const row = rows.find(
    (r) =>
      r.nombre_pieces === pieces &&
      r.meuble === criteria.meuble &&
      (criteria.year === null ? r.annee_min === null : inEpoque(r, criteria.year)),
  );
  const reference = toNumber(row?.loyer_reference);
  const ceiling = toNumber(row?.loyer_majore);
  const floor = toNumber(row?.loyer_minore);
  if (!row || reference === null || ceiling === null || floor === null) return null;
  return { reference, ceiling, floor, epoque: row.epoque, pieces, meuble: row.meuble };
}

export const grossYield = (rentM2: number | null, priceM2: number | null): number | null =>
  rentM2 && priceM2 ? ((rentM2 * 12) / priceM2) * 100 : null;

export const euroM2 = (value: number | null): string =>
  value === null ? "—" : `${value.toLocaleString("fr-FR", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} €/m²`;

export const monthly = (value: number | null): string =>
  value === null ? "—" : `${Math.round(value).toLocaleString("fr-FR")} €/mois`;

export const percent = (value: number | null): string =>
  value === null ? "—" : `${value.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;

export type RentEstimate = {
  market: MarketRent | null;
  monthly: number | null;
  low: number | null;
  high: number | null;
  cap: RentCap | null;
  capMonthly: number | null;
};

export function estimateRent(
  rents: MarketRent[],
  encadrement: EncadrementLoyer[],
  criteria: { housing: HousingType; surface: number | null; pieces: number | null; meuble: boolean; year: number | null },
): RentEstimate {
  const market = marketRentFor(rents, typeBienFor(criteria.housing, criteria.pieces));
  const cap =
    encadrement.length && criteria.pieces && criteria.year
      ? rentCap(encadrement, { pieces: criteria.pieces, year: criteria.year, meuble: criteria.meuble })
      : null;
  const times = (m2: number | null | undefined): number | null => (m2 && criteria.surface ? m2 * criteria.surface : null);
  return { market, monthly: times(market?.m2), low: times(market?.low), high: times(market?.high), cap, capMonthly: times(cap?.ceiling) };
}
