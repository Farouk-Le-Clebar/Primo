import { toNumber, type LogementSocial } from "../habitat/types";
import { normalizeFloor, surfaceTolerance } from "./normalize";
import type { LogementTarget } from "./types";

export function matchSocial(logements: LogementSocial[], target: LogementTarget, surface: number | null): LogementSocial[] {
  const floor = normalizeFloor(target.etage);
  if (target.type === "maison" || (floor === null && surface === null)) return [];
  return logements.filter((logement) => {
    const sameFloor = floor === null || (logement.etage !== null && String(logement.etage) === floor);
    const area = toNumber(logement.surface_habitable);
    const sameSurface = surface === null || (area !== null && Math.abs(area - surface) <= surfaceTolerance(surface));
    return sameFloor && sameSurface;
  });
}
