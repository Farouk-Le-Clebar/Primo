import type { Tone } from "../shared/tones";

export type RentalOutlook = { tone: Tone; title: string; detail: string };

const BANS: Record<string, number> = { G: 2025, F: 2028, E: 2034 };

export function rentalOutlook(label: string, today = new Date()): RentalOutlook {
  const banYear = BANS[label];
  if (!banYear)
    return /^[A-D]$/.test(label)
      ? { tone: "emerald", title: "Aucune échéance", detail: "Pas d’interdiction de location prévue par la loi Climat." }
      : { tone: "gray", title: "Classe inconnue", detail: "Aucun DPE exploitable pour ce logement." };
  const frozen = label === "F" || label === "G" ? " Loyers gelés depuis août 2022." : "";
  return today.getFullYear() >= banYear
    ? { tone: "rose", title: "Location interdite", detail: `Interdit à la location depuis le 1er janvier ${banYear}.${frozen}` }
    : {
        tone: banYear - today.getFullYear() <= 3 ? "rose" : "amber",
        title: `Interdiction en ${banYear}`,
        detail: `Interdit à la location au 1er janvier ${banYear} sans rénovation.${frozen}`,
      };
}
