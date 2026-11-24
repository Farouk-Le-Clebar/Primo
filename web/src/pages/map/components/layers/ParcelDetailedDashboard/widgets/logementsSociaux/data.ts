import { median } from "../dvf/data";
import { sameAddress } from "../habitat/address";
import { toNumber, type LogementSocial } from "../habitat/types";
import type { ShareItem } from "../shared/ShareList";

export type SocialAddress = { key: string; adresse: string; programme: string | null; selected: boolean; logements: LogementSocial[] };

const POOR_LABELS = ["F", "G"];

const countBy = <K extends string>(rows: LogementSocial[], keyOf: (row: LogementSocial) => K | null): Map<K, number> => {
  const counts = new Map<K, number>();
  rows.forEach((row) => {
    const key = keyOf(row);
    if (key !== null) counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return counts;
};

export const piecesLabel = (pieces: number | null): string => (pieces === null ? "?" : pieces >= 5 ? "T5+" : `T${pieces}`);

export const floorShort = (etage: number | null): string => (etage === null ? "—" : etage === 0 ? "RDC" : `${etage}e`);

export function socialStats(logements: LogementSocial[]) {
  const surfaces = logements.map((l) => toNumber(l.surface_habitable)).filter((s): s is number => s !== null);
  const pieces = countBy(logements, (l) => (l.nombre_pieces === null ? null : piecesLabel(l.nombre_pieces)));
  const dpe = countBy(logements, (l) => l.dpe_energie);
  const years = logements.map((l) => l.annee_construction).filter((y): y is number => y !== null);
  const rated = [...dpe.values()].reduce((sum, n) => sum + n, 0);
  const poor = POOR_LABELS.reduce((sum, label) => sum + (dpe.get(label) ?? 0), 0);
  const topPieces = [...pieces.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  return {
    count: logements.length,
    medianSurface: median(surfaces),
    topPieces,
    poorShare: rated ? Math.round((poor / rated) * 100) : null,
    rated,
    years: years.length ? [Math.min(...years), Math.max(...years)] : null,
    piecesShares: [...pieces.entries()].sort().map(([label, count]): ShareItem => ({ key: label, label, count })),
    dpeShares: [...dpe.entries()].sort().map(([label, count]): ShareItem => ({ key: label, label: `Classe ${label}`, count })),
  };
}

export function groupByAddress(logements: LogementSocial[], selectedAddress?: string): SocialAddress[] {
  const groups = new Map<string, SocialAddress>();
  logements.forEach((logement) => {
    const adresse = logement.adresse ?? "Adresse non renseignée";
    const key = `${adresse}|${logement.nom_programme ?? ""}`;
    const group = groups.get(key) ?? {
      key,
      adresse,
      programme: logement.nom_programme,
      selected: sameAddress(logement.adresse, selectedAddress),
      logements: [],
    };
    group.logements.push(logement);
    groups.set(key, group);
  });
  return [...groups.values()].sort((a, b) => Number(b.selected) - Number(a.selected) || b.logements.length - a.logements.length);
}

export type SocialStats = ReturnType<typeof socialStats>;
