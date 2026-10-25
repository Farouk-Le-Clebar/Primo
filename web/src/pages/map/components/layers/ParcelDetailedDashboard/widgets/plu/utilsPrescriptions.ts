import { Car, Construction, FileText, Landmark, ShieldAlert, ShoppingBag, Trees, Users } from "lucide-react";

import { TONES } from "../shared/tones";
import type { RuleStyle } from "./types";

export const CNIG_DESCRIPTIONS: Record<string, string> = {
  "17": "Mixité sociale : impose un quota de logements sociaux selon la surface construite.",
  "22": "Secteur de programmation : favorise ou protège certaines activités (commerce, artisanat, hôtellerie).",
  "44": "Densité ou stationnement : peut imposer un minimum de places ou une densité minimale/maximale.",
  "01": "Espace boisé classé : interdiction stricte de couper des arbres.",
  "07": "Protection du patrimoine bâti : démolition interdite ou encadrée.",
  "04": "Périmètre de protection d’un monument historique.",
  "03": "Zone à risques naturels (mouvements de terrain, etc.).",
  "19": "Zone inondable : constructibilité fortement réglementée.",
  "05": "Emplacement réservé : terrain bloqué pour un futur projet public (voie, équipement).",
  "13": "Espaces verts protégés : obligation de maintenir de la pleine terre.",
  DEFAULT: "Prescription d’urbanisme spécifique (consulter le règlement complet).",
};

function guessPrescriptionType(libelle: string): string {
  const value = libelle.toLowerCase();
  if (value.includes("stationnement") || value.includes("densité") || value.includes("transports")) return "44";
  if (value.includes("hotel") || value.includes("commerces")) return "22";
  if (value.includes("logements sociaux")) return "17";
  if (value.includes("boise") || value.includes("ebc")) return "01";
  if (value.includes("inondation")) return "19";
  if (value.includes("patrimoine")) return "07";
  return "DEFAULT";
}

const prescriptionCode = (typepsc = "", libelle = ""): string =>
  typepsc.split("_")[0] || guessPrescriptionType(libelle);

export function getPrescriptionDescription(typepsc?: string, libelle?: string): string {
  const exact = CNIG_DESCRIPTIONS[(typepsc ?? "").split("_")[0]];
  return exact ?? CNIG_DESCRIPTIONS[guessPrescriptionType(libelle ?? "")];
}

export function getPrescriptionStyle(typepsc?: string, libelle?: string): RuleStyle {
  switch (prescriptionCode(typepsc, libelle)) {
    case "03": case "19": return { icon: ShieldAlert, tone: TONES.rose };
    case "01": case "13": case "29": return { icon: Trees, tone: TONES.emerald };
    case "07": case "04": return { icon: Landmark, tone: TONES.violet };
    case "44": case "12": case "16": return { icon: Construction, tone: TONES.amber };
    case "22": return { icon: ShoppingBag, tone: TONES.sky };
    case "17": return { icon: Users, tone: TONES.violet };
    case "05": return { icon: Car, tone: TONES.amber };
    default: return { icon: FileText, tone: TONES.gray };
  }
}
