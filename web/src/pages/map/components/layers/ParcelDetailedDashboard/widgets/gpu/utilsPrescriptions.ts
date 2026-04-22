import { 
  Landmark, Trees, ShieldAlert, FileText, 
  Users, Car, ShoppingBag, Construction
} from "lucide-react";

export function extractDepartementForPrescription(featureId: string): string | null {
  if (!featureId) return null;
  const parts = featureId.split('_');
  if (parts.length >= 2) {
    const potentialDept = parts[1].split('.')[0];
    if (/^(\d{2,3}|2[AB])$/.test(potentialDept)) return potentialDept;
  }
  const parcelMatch = featureId.match(/(\d{2,3}|2[AB])\d{3}\d{6}/);
  return parcelMatch ? parcelMatch[1] : null;
}

export const CNIG_DESCRIPTIONS: Record<string, string> = {
  '17': "Mixité Sociale : Imose un quota de logements sociaux selon la surface construite.",
  '22': "Secteur de programmation spécifique : Favorise ou protège certaines activités (commerce, artisanat, hôtellerie).",
  '44': "Règles de densité ou de stationnement : Peut imposer un minimum de places ou une densité minimale/maximale.",
  '01': "Espace Boisé Classé : Interdiction stricte de couper des arbres.",
  '07': "Protection du Patrimoine Bâti : Démolition interdite ou encadrée.",
  '04': "Périmètre de protection monument historique.",
  '03': "Zone à risques naturels (mouvements de terrain, etc.).",
  '19': "Zone inondable : Constructibilité fortement réglementée.",
  '05': "Emplacement Réservé : Terrain bloqué pour futur projet public (voie, équipement).",
  '13': "Espaces Verts Protégés : Obligation de maintenir de la pleine terre.",
  'DEFAULT': "Prescription d'urbanisme spécifique (Consulter le règlement complet)."
};

function guessPrescriptionType(libelle: string): string {
  if (!libelle) return 'DEFAULT';
  const text = libelle.toLowerCase();

  if (text.includes('stationnement')) return '44';
  if (text.includes('densité') || text.includes('transports')) return '44';
  if (text.includes('hotel') || text.includes('commerces')) return '22';
  if (text.includes('logements sociaux')) return '17';

  if (text.includes('boise') || text.includes('ebc')) return '01';
  if (text.includes('inondation')) return '19';
  if (text.includes('patrimoine')) return '07';
  
  return 'DEFAULT';
}

export function getPrescriptionDescription(typepsc: string, libelle?: string): string {
  if (typepsc) {
    const code = typepsc.split('_')[0];
    if (CNIG_DESCRIPTIONS[code]) return CNIG_DESCRIPTIONS[code];
  }
  if (libelle) {
    const guessedCode = guessPrescriptionType(libelle);
    if (guessedCode !== 'DEFAULT') return CNIG_DESCRIPTIONS[guessedCode];
  }
  return CNIG_DESCRIPTIONS['DEFAULT'];
}

export function getPrescriptionStyle(typepsc: string, libelle?: string) {
  let code = typepsc?.split('_')[0] || "";
  if (!code && libelle) code = guessPrescriptionType(libelle);

  switch (code) {
    case '03': case '19':
      return { icon: ShieldAlert, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", bar: "bg-rose-500" };

    case '01': case '13': case '29':
      return { icon: Trees, color: "text-[#10B981]", bg: "bg-[#EBF9F5]", bar: "bg-emerald-500" };

    case '07': case '04':
      return { icon: Landmark, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", bar: "bg-indigo-500" };

    case '44': case '12': case '16': 
      return { icon: Construction, color: "text-[#EF4444]", bg: "bg-[#FEF0F0]", bar: "bg-slate-400" };

    case '22': 
      return { icon: ShoppingBag, color: "text-[#14B8A6]", bg: "bg-[#ECF9F8]", bar: "bg-violet-500" };

    case '17': 
       return { icon: Users, color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-100", bar: "bg-pink-500" };

    case '05':
       return { icon: Car, color: "text-[#FEF7EB]", bg: "bg-[#F59E0B]", bar: "bg-amber-500" };

    default:
      return { icon: FileText, color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-100", bar: "bg-slate-300" };
  }
}