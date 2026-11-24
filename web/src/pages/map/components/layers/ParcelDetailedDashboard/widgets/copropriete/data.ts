import { sameAddress } from "../habitat/address";
import type { Copropriete, LogementSocial } from "../habitat/types";
import type { Tone } from "../shared/tones";

export type CoproAlert = { tone: Tone; title: string; detail: string };

export type SocialShare = { count: number; share: number | null };

const MAJORITY = 0.5;

export function socialShare(copro: Copropriete, logements: LogementSocial[]): SocialShare {
  const count = logements.filter((logement) => sameAddress(copro.adresse_reference, logement.adresse)).length;
  const lots = copro.nombre_lots_habitation;
  return { count, share: lots && count <= lots ? count / lots : null };
}

export const socialLabel = ({ count, share }: SocialShare, lots: number | null): string =>
  !count ? "Aucun recensé" : share === null ? `${count}` : `${count} / ${lots} (${Math.round(share * 100)} %)`;

function socialAlert({ count, share }: SocialShare): CoproAlert | null {
  if (!count || share === null) return null;
  const part = `${count} logements (${Math.round(share * 100)} %) appartiennent à un bailleur social`;
  return share > MAJORITY
    ? { tone: "violet", title: "Bailleur social majoritaire", detail: `${part} : il pèse probablement la majorité des voix en assemblée générale (selon les tantièmes).` }
    : { tone: "sky", title: "Bailleur social présent", detail: `${part} : copropriétaire important, souvent gage de charges payées et d’entretien suivi.` };
}

const PERIODES: Record<string, string> = {
  AVANT_1949: "Avant 1949",
  DE_1949_A_1960: "1949 – 1960",
  DE_1961_A_1974: "1961 – 1974",
  DE_1975_A_1993: "1975 – 1993",
  DE_1994_A_2000: "1994 – 2000",
  DE_2001_A_2010: "2001 – 2010",
  APRES_2010: "Après 2010",
  A_COMPTER_DE_2011: "À partir de 2011",
};

const UNKNOWN = /^(inconnu|non[ _]conn|non renseign)/i;

export const periodeLabel = (value: string | null): string =>
  !value || UNKNOWN.test(value) ? "Non renseignée" : PERIODES[value] ?? value;

export const isReliable = (copro: Copropriete): boolean => copro.rattachement !== "parcelle_eloignee";

export const distanceLabel = (meters: number | null): string =>
  meters === null ? "distance inconnue" : meters >= 1000 ? `${(meters / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} km` : `${meters} m`;

export function mandatTone(mandat: string | null): Tone {
  if (!mandat) return "gray";
  if (mandat === "Mandat en cours") return "emerald";
  return /sans successeur/i.test(mandat) ? "rose" : "amber";
}

export const syndicLabel = (copro: Copropriete): string =>
  copro.syndic ?? (copro.type_syndic === "bénévole" ? "Syndic bénévole" : "Syndic non déclaré");

export function coproAlerts(copro: Copropriete, social?: SocialShare): CoproAlert[] {
  const alerts: CoproAlert[] = [];
  const bailleur = social ? socialAlert(social) : null;
  if (bailleur) alerts.push(bailleur);
  if (!isReliable(copro))
    alerts.push({
      tone: "rose",
      title: "Référence cadastrale douteuse",
      detail: `Le syndic a déclaré cette parcelle, mais l’adresse de la copropriété est à ${distanceLabel(copro.distance_adresse)}. Probable erreur de saisie : exclue des totaux.`,
    });
  if (copro.mandat && copro.mandat !== "Mandat en cours")
    alerts.push({
      tone: mandatTone(copro.mandat),
      title: copro.mandat,
      detail: "Une copropriété sans syndic en fonction ne peut ni voter de travaux ni recouvrer les charges.",
    });
  if (copro.copro_aidee)
    alerts.push({
      tone: "sky",
      title: "Copropriété aidée par l’Anah",
      detail: "Subventions accordées au syndicat : travaux de rénovation ou redressement en cours ou récents.",
    });
  if (copro.quartier_prioritaire)
    alerts.push({ tone: "violet", title: "Quartier prioritaire", detail: copro.quartier_prioritaire });
  if (copro.residence_service)
    alerts.push({ tone: "amber", title: "Résidence-service", detail: "Services spécifiques facturés aux occupants." });
  if (copro.syndicat_principal === false)
    alerts.push({ tone: "gray", title: "Syndicat secondaire", detail: "Rattaché à un syndicat principal pour une partie des décisions." });
  return alerts;
}

export function coproTotals(coproprietes: Copropriete[]) {
  const reliable = coproprietes.filter(isReliable);
  const sum = (key: "nombre_lots" | "nombre_lots_habitation" | "nombre_lots_stationnement" | "nombre_lots_principaux") =>
    reliable.reduce((total, copro) => total + (copro[key] ?? 0), 0);
  return {
    syndicats: reliable.length,
    enCours: reliable.filter((copro) => copro.mandat === "Mandat en cours").length,
    lots: sum("nombre_lots"),
    principaux: sum("nombre_lots_principaux"),
    habitation: sum("nombre_lots_habitation"),
    stationnement: sum("nombre_lots_stationnement"),
  };
}
