import { positiveNumber } from "../dvf/data";
import { text } from "../shared/format";

export function normalizeFloor(value: unknown): string | null {
  const raw = text(value, "").toLowerCase().trim();
  if (!raw) return null;
  if (/rdc|rez|^0$/.test(raw)) return "0";
  const digits = raw.match(/-?\d+/);
  return digits ? String(Number(digits[0])) : null;
}

export function normalizeDoor(value: unknown): string | null {
  const cleaned = text(value, "")
    .toUpperCase()
    .replace(/\b(PORTE|APPARTEMENT|APPT|APT|LOT|LOGEMENT|NO|N°)\b/g, "")
    .replace(/[^0-9A-Z]/g, "");
  return cleaned || null;
}

export const floorLabel = (floor: string | null): string =>
  floor === null ? "Étage inconnu" : floor === "0" ? "Rez-de-chaussée" : `${floor}${floor === "1" ? "er" : "e"} étage`;

export const parseSurface = (value: string): number | null => positiveNumber(value);

export const surfaceTolerance = (surface: number): number => Math.max(2, surface * 0.05);

export const squareMeters = (value: number | null): string =>
  value == null ? "—" : `${Math.round(value).toLocaleString("fr-FR")} m²`;
