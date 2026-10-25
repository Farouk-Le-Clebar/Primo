export type DvfLocal = {
  parcel: string;
  type: string;
  surface: number | null;
  lot: string | null;
  carrez: number | null;
  rooms: number | null;
};

export type PriceStatus = "ok" | "nature" | "terrain" | "multiple" | "mixed" | "noSurface" | "outlier";

export const PRICE_STATUS_LABELS: Record<PriceStatus, string> = {
  ok: "",
  nature: "Hors vente classique",
  terrain: "Sans logement ni local",
  multiple: "Plusieurs biens vendus ensemble",
  mixed: "Biens de types différents",
  noSurface: "Surface bâtie absente",
  outlier: "Prix au m² aberrant",
};

const PRICED_NATURES = ["vente", "vente en l'état futur d'achèvement", "adjudication"];
const MAX_PRICE_M2 = 100000;

export const isDependance = (type: string): boolean => /d[ée]pendance/i.test(type);

const normalizeNature = (nature: string): string => nature.toLowerCase().replace(/[’`]/g, "'");

export function dedupeLocals(locals: DvfLocal[]): DvfLocal[] {
  const seen = new Set<string>();
  return locals.filter((local) => {
    if (!/maison/i.test(local.type) && !local.lot) return true;
    const key = [local.parcel, local.type, local.surface, local.lot, local.rooms].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function priceOf(
  nature: string,
  value: number,
  mainLocals: DvfLocal[],
): { priceM2: number | null; status: PriceStatus } {
  if (!PRICED_NATURES.includes(normalizeNature(nature))) return { priceM2: null, status: "nature" };
  if (!mainLocals.length) return { priceM2: null, status: "terrain" };
  if (mainLocals.length > 1)
    return {
      priceM2: null,
      status: new Set(mainLocals.map((l) => l.type)).size > 1 ? "mixed" : "multiple",
    };
  const surface = mainLocals[0].surface;
  if (!surface) return { priceM2: null, status: "noSurface" };
  const ratio = value / surface;
  return ratio > MAX_PRICE_M2 ? { priceM2: null, status: "outlier" } : { priceM2: ratio, status: "ok" };
}
