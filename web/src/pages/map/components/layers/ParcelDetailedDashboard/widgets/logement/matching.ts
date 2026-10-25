import type { DvfRecord } from "../dvf/data";
import type { DpeEntry } from "../dpe/data";
import { text } from "../shared/format";
import { normalizeDoor, normalizeFloor, parseSurface, surfaceTolerance } from "./normalize";
import type { LogementTarget, Match, MatchLevel } from "./types";

const LEVEL_ORDER: Record<MatchLevel, number> = { forte: 0, probable: 1, possible: 2 };

const levelOf = (score: number): MatchLevel | null =>
  score >= 5 ? "forte" : score >= 3 ? "probable" : score >= 2 ? "possible" : null;

const bySignal = <T>(a: Match<T>, b: Match<T>): number => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level];

function surfaceScore(target: number | null, actual: number | null): { score: number; reason?: string } | null {
  if (target == null || actual == null) return { score: 0 };
  const gap = Math.abs(target - actual);
  if (gap <= 1) return { score: 3, reason: "Surface identique" };
  if (gap <= surfaceTolerance(target)) return { score: 2, reason: `Surface proche (${Math.round(actual)} m²)` };
  return null;
}

function scoreDpe(entry: DpeEntry, target: LogementTarget): Match<DpeEntry> | null {
  const kind = text(entry.raw.type_batiment, "").toLowerCase();
  if (kind === "immeuble")
    return target.type === "appartement" ? { item: entry, level: "possible", reasons: ["DPE collectif de l’immeuble"] } : null;
  if (kind && kind !== target.type) return null;
  const reasons: string[] = [];
  let score = 0;
  const [targetDoor, door] = [normalizeDoor(target.porte), normalizeDoor(entry.raw.logement_porte)];
  if (targetDoor && door) {
    if (targetDoor !== door) return null;
    score += 3;
    reasons.push("Même porte");
  }
  const [targetFloor, floor] = [normalizeFloor(target.etage), normalizeFloor(entry.raw.logement_etage)];
  if (targetFloor && floor) {
    if (targetFloor !== floor) return null;
    score += 2;
    reasons.push("Même étage");
  }
  const surface = surfaceScore(parseSurface(target.surface), entry.surface);
  if (!surface && score < 3) return null;
  score += surface?.score ?? 0;
  if (surface?.reason) reasons.push(surface.reason);
  const level = levelOf(score);
  return level ? { item: entry, level, reasons } : null;
}

export const toLevelMap = <T extends { key: string }>(matches: Match<T>[]): Map<string, MatchLevel> =>
  new Map(matches.map((m) => [m.item.key, m.level]));

export const matchDpe = (entries: DpeEntry[], target: LogementTarget): Match<DpeEntry>[] =>
  entries.flatMap((entry) => scoreDpe(entry, target) ?? []).sort(bySignal);

function scoreDvf(record: DvfRecord, target: LogementTarget): Match<DvfRecord> | null {
  const wanted = parseSurface(target.surface);
  const door = normalizeDoor(target.porte);
  const pattern = target.type === "maison" ? /maison/i : /appartement/i;
  const scored = record.locals
    .filter((local) => pattern.test(local.type))
    .map((local) => {
      const surface = surfaceScore(wanted, local.carrez ?? local.surface);
      const sameLot = !!door && normalizeDoor(local.lot) === door;
      const reasons = [sameLot ? "Même n° de lot" : "", surface?.reason ?? ""].filter(Boolean);
      return { score: (sameLot ? 3 : 0) + (surface?.score ?? 0), reasons };
    })
    .filter((s) => s.reasons.length)
    .sort((a, b) => b.score - a.score)[0];
  if (!scored) return null;
  const single = record.locals.length - record.dependances === 1;
  const level = levelOf(scored.score + (single ? 0 : -1)) ?? "possible";
  return { item: record, level, reasons: [...scored.reasons, single ? "Vente d’un seul bien" : "Inclus dans une vente groupée"] };
}

export const matchDvf = (records: DvfRecord[], target: LogementTarget): Match<DvfRecord>[] =>
  records.flatMap((record) => scoreDvf(record, target) ?? []).sort(bySignal);
