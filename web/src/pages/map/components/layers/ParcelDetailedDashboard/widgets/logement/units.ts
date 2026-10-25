import type { DpeEntry } from "../dpe/data";
import { text } from "../shared/format";
import { floorLabel, normalizeDoor, normalizeFloor } from "./normalize";
import type { HousingType, LogementTarget } from "./types";

export type LogementUnit = {
  key: string;
  type: HousingType;
  floor: string | null;
  door: string | null;
  surface: number | null;
  complement: string;
  latest: DpeEntry;
  count: number;
};

const housingType = (entry: DpeEntry): HousingType | null => {
  const kind = text(entry.raw.type_batiment, "").toLowerCase();
  return kind === "appartement" || kind === "maison" ? kind : null;
};

export function detectUnits(entries: DpeEntry[]): LogementUnit[] {
  const units = new Map<string, LogementUnit>();
  entries.forEach((entry) => {
    const type = housingType(entry);
    if (!type) return;
    const floor = normalizeFloor(entry.raw.logement_etage);
    const door = normalizeDoor(entry.raw.logement_porte);
    const surface = entry.surface ? Math.round(entry.surface) : null;
    if (floor === null && door === null && surface === null) return;
    const key = door ? `${type}|${floor ?? ""}|${door}` : `${type}|${floor ?? ""}||${surface ?? ""}`;
    const unit = units.get(key);
    const complement = text(entry.raw.complement_adresse_logement, "");
    if (!unit) return void units.set(key, { key, type, floor, door, surface, complement, latest: entry, count: 1 });
    unit.count += 1;
    if ((entry.date ?? "") > (unit.latest.date ?? "")) {
      unit.latest = entry;
      unit.surface = surface ?? unit.surface;
    }
  });
  return [...units.values()].sort(
    (a, b) => Number(a.floor ?? 999) - Number(b.floor ?? 999) || (a.door ?? "").localeCompare(b.door ?? "", "fr", { numeric: true }),
  );
}

export const unitTitle = (unit: LogementUnit): string =>
  unit.type === "appartement" && unit.floor === null && unit.door === null && unit.complement
    ? unit.complement
    : [unit.type === "maison" ? "Maison" : floorLabel(unit.floor), unit.door ? `porte ${unit.door}` : ""].filter(Boolean).join(" · ");

export const targetFromUnit = (unit: LogementUnit): LogementTarget => ({
  type: unit.type,
  surface: unit.surface ? String(unit.surface) : "",
  etage: unit.floor ?? "",
  porte: unit.door ?? "",
});

export const targetFromDpe = (entry: DpeEntry): LogementTarget => ({
  type: housingType(entry) ?? "appartement",
  surface: entry.surface ? String(Math.round(entry.surface)) : "",
  etage: normalizeFloor(entry.raw.logement_etage) ?? "",
  porte: normalizeDoor(entry.raw.logement_porte) ?? "",
});

export const targetSummary = (target: LogementTarget): string =>
  [
    target.type === "maison" ? "Maison" : "Appartement",
    target.etage ? floorLabel(normalizeFloor(target.etage)) : "",
    target.porte ? `porte ${target.porte}` : "",
    target.surface ? `${target.surface} m²` : "",
  ]
    .filter(Boolean)
    .join(" · ");
