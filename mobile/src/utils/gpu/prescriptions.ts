export const CNIG_DESCRIPTIONS: Record<string, string> = {
  "17": "Mixité Sociale : Impose un quota de logements sociaux selon la surface construite.",
  "22": "Secteur de programmation spécifique : Favorise ou protège certaines activités (commerce, artisanat, hôtellerie).",
  "44": "Règles de densité ou de stationnement : Peut imposer un minimum de places ou une densité minimale/maximale.",
  "01": "Espace Boisé Classé : Interdiction stricte de couper des arbres.",
  "07": "Protection du Patrimoine Bâti : Démolition interdite ou encadrée.",
  "04": "Périmètre de protection monument historique.",
  "03": "Zone à risques naturels (mouvements de terrain, etc.).",
  "19": "Zone inondable : Constructibilité fortement réglementée.",
  "05": "Emplacement Réservé : Terrain bloqué pour futur projet public (voie, équipement).",
  "13": "Espaces Verts Protégés : Obligation de maintenir de la pleine terre.",
  DEFAULT: "Prescription d'urbanisme spécifique (Consulter le règlement complet).",
};

function guessPrescriptionType(libelle: string): string {
  if (!libelle) return "DEFAULT";
  const text = libelle.toLowerCase();
  if (text.includes("stationnement") || text.includes("densité") || text.includes("transports")) return "44";
  if (text.includes("hotel") || text.includes("commerces")) return "22";
  if (text.includes("logements sociaux")) return "17";
  if (text.includes("boise") || text.includes("ebc")) return "01";
  if (text.includes("inondation")) return "19";
  if (text.includes("patrimoine")) return "07";
  return "DEFAULT";
}

export function getPrescriptionDescription(typepsc: string, libelle?: string): string {
  if (typepsc) {
    const code = typepsc.split("_")[0];
    if (CNIG_DESCRIPTIONS[code]) return CNIG_DESCRIPTIONS[code];
  }
  if (libelle) {
    const guessedCode = guessPrescriptionType(libelle);
    if (guessedCode !== "DEFAULT") return CNIG_DESCRIPTIONS[guessedCode];
  }
  return CNIG_DESCRIPTIONS["DEFAULT"];
}

export function getPrescriptionColorBar(typepsc: string, libelle?: string): string {
  let code = typepsc?.split("_")[0] || "";
  if (!code && libelle) code = guessPrescriptionType(libelle);
  switch (code) {
    case "03":
    case "19":
      return "#ef4444";
    case "01":
    case "13":
    case "29":
      return "#22c55e";
    case "07":
    case "04":
      return "#6366f1";
    case "44":
    case "12":
    case "16":
      return "#94a3b8";
    case "22":
      return "#8b5cf6";
    case "17":
      return "#ec4899";
    case "05":
      return "#f59e0b";
    default:
      return "#94a3b8";
  }
}
