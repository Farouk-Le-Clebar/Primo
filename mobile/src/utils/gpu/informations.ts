export const CNIG_INFO_DESCRIPTIONS: Record<string, string> = {
  "03": "Droit de Préemption Urbain (DPU) : La commune est prioritaire pour racheter ce terrain.",
  "16": "Droit de priorité : La collectivité a un droit prioritaire d'acquisition.",
  "10": "Secteur de Taxe d'Aménagement (TA) : Taux spécifique sur les nouvelles constructions.",
  "02": "Zone d'Aménagement Concerté (ZAC) : Vaste projet d'aménagement en cours.",
  "01": "Zone d'Aménagement Différé (ZAD) : Secteur gelé par la collectivité.",
  "11": "Projet Urbain Partenarial (PUP).",
  "12": "Périmètre de Lotissement.",
  "04": "Périmètre de Sursis à Statuer : La mairie peut repousser sa décision.",
  "05": "Périmètre d'Étude : La collectivité mène une étude sur ce secteur.",
  "07": "Espaces Naturels Sensibles (ENS) : Zone naturelle protégée.",
  "14": "Information sur des servitudes ou risques spécifiques.",
  DEFAULT: "Information annexe (Consultez les documents d'urbanisme pour le détail).",
};

function guessInformationType(libelle: string): string {
  if (!libelle) return "DEFAULT";
  const text = libelle.toLowerCase();
  if (text.includes("préemption") || text.includes("dpu")) return "03";
  if (text.includes("taxe") || text.includes("ta")) return "10";
  if (text.includes("zac") || text.includes("concerté")) return "02";
  if (text.includes("zad") || text.includes("différé")) return "01";
  if (text.includes("sursis")) return "04";
  if (text.includes("étude")) return "05";
  if (text.includes("lotissement")) return "12";
  if (text.includes("naturel") || text.includes("ens")) return "07";
  return "DEFAULT";
}

export function getInformationDescription(typeinf: string, libelle?: string): string {
  if (typeinf) {
    const code = typeinf.split("_")[0];
    if (CNIG_INFO_DESCRIPTIONS[code]) return CNIG_INFO_DESCRIPTIONS[code];
  }
  if (libelle) {
    const guessedCode = guessInformationType(libelle);
    if (guessedCode !== "DEFAULT") return CNIG_INFO_DESCRIPTIONS[guessedCode];
  }
  return CNIG_INFO_DESCRIPTIONS["DEFAULT"];
}

export function getInformationColorBar(typeinf: string, libelle?: string): string {
  let code = typeinf?.split("_")[0] || "";
  if (!code && libelle) code = guessInformationType(libelle);
  switch (code) {
    case "03":
    case "16":
    case "10":
      return "#f59e0b";
    case "01":
    case "02":
    case "11":
    case "12":
      return "#6366f1";
    case "04":
    case "05":
      return "#ef4444";
    case "07":
      return "#22c55e";
    default:
      return "#38bdf8";
  }
}
