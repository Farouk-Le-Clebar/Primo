import { Coins, Info, Map, PauseCircle, Trees } from "lucide-react";

import { TONES } from "../shared/tones";
import type { RuleStyle } from "./types";

export const CNIG_INFO_DESCRIPTIONS: Record<string, string> = {
  "03": "Droit de préemption urbain : la commune est prioritaire pour racheter ce terrain en cas de vente.",
  "16": "Droit de priorité : la collectivité a un droit prioritaire d’acquisition sur ce secteur.",
  "10": "Secteur de taxe d’aménagement : taux spécifique appliqué aux nouvelles constructions.",
  "02": "Zone d’aménagement concerté (ZAC) : projet d’aménagement public en cours sur ce secteur.",
  "01": "Zone d’aménagement différé (ZAD) : secteur réservé par la collectivité pour un futur projet.",
  "11": "Projet urbain partenarial : les constructeurs participent au financement des équipements publics.",
  "12": "Périmètre de lotissement : secteur soumis à des règles spécifiques de lotissement.",
  "04": "Sursis à statuer : la mairie peut différer sa décision sur un permis (jusqu’à 2 ans).",
  "05": "Périmètre d’étude : une étude en cours peut geler certains projets.",
  "07": "Espace naturel sensible : zone naturelle protégée par le Département.",
  "14": "Information sur des servitudes ou risques spécifiques (argiles, mines…).",
  DEFAULT: "Information annexe (consulter les documents d’urbanisme pour le détail).",
};

function guessInformationType(libelle: string): string {
  const value = libelle.toLowerCase();
  if (value.includes("préemption") || value.includes("dpu")) return "03";
  if (value.includes("taxe")) return "10";
  if (value.includes("zac") || value.includes("concerté")) return "02";
  if (value.includes("zad") || value.includes("différé")) return "01";
  if (value.includes("sursis")) return "04";
  if (value.includes("étude")) return "05";
  if (value.includes("lotissement")) return "12";
  if (value.includes("naturel") || value.includes("ens")) return "07";
  return "DEFAULT";
}

const informationCode = (typeinf = "", libelle = ""): string =>
  typeinf.split("_")[0] || guessInformationType(libelle);

export function getInformationDescription(typeinf?: string, libelle?: string): string {
  const exact = CNIG_INFO_DESCRIPTIONS[(typeinf ?? "").split("_")[0]];
  return exact ?? CNIG_INFO_DESCRIPTIONS[guessInformationType(libelle ?? "")];
}

export function getInformationStyle(typeinf?: string, libelle?: string): RuleStyle {
  switch (informationCode(typeinf, libelle)) {
    case "03": case "16": case "10": return { icon: Coins, tone: TONES.rose };
    case "01": case "02": case "11": case "12": return { icon: Map, tone: TONES.violet };
    case "04": case "05": return { icon: PauseCircle, tone: TONES.amber };
    case "07": return { icon: Trees, tone: TONES.emerald };
    default: return { icon: Info, tone: TONES.gray };
  }
}
