import { Info, Coins, Map, PauseCircle, Trees} from "lucide-react";

export function extractDepartementForInformation(featureId: string): string | null {
  if (!featureId) return null;
  const parts = featureId.split('_');
  if (parts.length >= 2) {
    const potentialDept = parts[1].split('.')[0];
    if (/^(\d{2,3}|2[AB])$/.test(potentialDept)) return potentialDept;
  }
  const parcelMatch = featureId.match(/(\d{2,3}|2[AB])\d{3}\d{6}/);
  return parcelMatch ? parcelMatch[1] : null;
}

export const CNIG_INFO_DESCRIPTIONS: Record<string, string> = {
  '03': "Droit de Préemption Urbain (DPU) : La commune est prioritaire pour racheter ce terrain en cas de vente.",
  '16': "Droit de priorité : La collectivité a un droit prioritaire d'acquisition sur ce secteur.",
  '10': "Secteur de Taxe d'Aménagement (TA) : Taux spécifique appliqué sur les nouvelles constructions.",
  '02': "Zone d'Aménagement Concerté (ZAC) : Vaste projet d'aménagement public en cours sur ce secteur.",
  '01': "Zone d'Aménagement Différé (ZAD) : Secteur gelé par la collectivité pour un futur projet (prix fixés).",
  '11': "Projet Urbain Partenarial (PUP) : Secteur où les promoteurs participent au financement des équipements publics.",
  '12': "Périmètre de Lotissement : Secteur soumis à des règles spécifiques de lotissement.",
  '04': "Périmètre de Sursis à Statuer : La mairie peut repousser sa décision sur un permis de construire (jusqu'à 2 ans).",
  '05': "Périmètre d'Étude : La collectivité mène une étude sur ce secteur, pouvant geler certains projets.",
  '07': "Espaces Naturels Sensibles (ENS) : Zone naturelle protégée par le Département.",
  '14': "Information sur des servitudes ou risques spécifiques (ex: retrait-gonflement des argiles, mines).",
  'DEFAULT': "Information annexe (Consultez les documents d'urbanisme pour le détail)."
};

function guessInformationType(libelle: string): string {
  if (!libelle) return 'DEFAULT';
  const text = libelle.toLowerCase();

  if (text.includes('préemption') || text.includes('dpu')) return '03';
  if (text.includes('taxe') || text.includes('ta')) return '10';
  if (text.includes('zac') || text.includes('concerté')) return '02';
  if (text.includes('zad') || text.includes('différé')) return '01';
  if (text.includes('sursis')) return '04';
  if (text.includes('étude')) return '05';
  if (text.includes('lotissement')) return '12';
  if (text.includes('naturel') || text.includes('ens')) return '07';

  return 'DEFAULT';
}

export function getInformationDescription(typeinf: string, libelle?: string): string {
  if (typeinf) {
    const code = typeinf.split('_')[0];
    if (CNIG_INFO_DESCRIPTIONS[code]) return CNIG_INFO_DESCRIPTIONS[code];
  }

  if (libelle) {
    const guessedCode = guessInformationType(libelle);
    if (guessedCode !== 'DEFAULT') return CNIG_INFO_DESCRIPTIONS[guessedCode];
  }

  return CNIG_INFO_DESCRIPTIONS['DEFAULT'];
}

export function getInformationStyle(typeinf: string, libelle?: string) {
  let code = typeinf?.split('_')[0] || "";
  if (!code && libelle) code = guessInformationType(libelle);

  switch (code) {
    case '03': case '16': case '10':
      return { icon: Coins, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", bar: "bg-amber-500" };
    case '01': case '02': case '11': case '12':
      return { icon: Map, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", bar: "bg-indigo-500" };
    case '04': case '05':
      return { icon: PauseCircle, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100", bar: "bg-rose-500" };
    case '07':
      return { icon: Trees, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", bar: "bg-emerald-500" };
    default:
      return { icon: Info, color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-100", bar: "bg-sky-400" };
  }
}