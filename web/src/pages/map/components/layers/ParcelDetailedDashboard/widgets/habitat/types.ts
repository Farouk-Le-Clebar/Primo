export type Numeric = number | string | null;

export type Rattachement = "parcelle" | "parcelle_eloignee" | "adresse";

export type Copropriete = {
  numero_immatriculation: string;
  nom_usage: string | null;
  adresse_reference: string | null;
  code_commune: string | null;
  nombre_parcelles: number | null;
  date_immatriculation: string | null;
  date_derniere_maj: string | null;
  date_reglement: string | null;
  periode_construction: string | null;
  type_syndic: string | null;
  syndic: string | null;
  mandat: string | null;
  date_fin_mandat: string | null;
  nombre_lots: number | null;
  nombre_lots_principaux: number | null;
  nombre_lots_habitation: number | null;
  nombre_lots_stationnement: number | null;
  residence_service: boolean | null;
  syndicat_principal: boolean | null;
  copro_aidee: boolean | null;
  quartier_prioritaire: string | null;
  rattachement: Rattachement;
  distance_adresse: number | null;
};

export type LogementSocial = {
  id: number;
  adresse: string | null;
  nom_programme: string | null;
  etage: number | null;
  nombre_pieces: number | null;
  surface_habitable: Numeric;
  annee_construction: number | null;
  annee_mise_en_location: number | null;
  type_construction: string | null;
  financement: string | null;
  conventionne: boolean | null;
  dpe_energie: string | null;
  dpe_ges: string | null;
  accessibilite_pmr: string | null;
  quartier_prioritaire: string | null;
};

export type TypeBien = "appartement" | "appartement_t1_t2" | "appartement_t3_plus" | "maison";

export type LoyerCommune = {
  code_commune: string;
  type_bien: TypeBien;
  annee: number;
  loyer_m2: Numeric;
  loyer_m2_bas: Numeric;
  loyer_m2_haut: Numeric;
  echelle: string | null;
  nombre_annonces: number | null;
};

export type EncadrementLoyer = {
  id: number;
  territoire: string;
  periode: string;
  zone: string | null;
  nombre_pieces: number;
  epoque: string;
  annee_min: number | null;
  annee_max: number | null;
  meuble: boolean;
  loyer_reference: Numeric;
  loyer_majore: Numeric;
  loyer_minore: Numeric;
};

export type LoyersParcelle = { commune: LoyerCommune[]; encadrement: EncadrementLoyer[] };

export const toNumber = (value: Numeric | undefined): number | null => {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) ? n : null;
};
