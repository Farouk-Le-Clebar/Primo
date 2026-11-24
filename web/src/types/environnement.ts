export type ParcelPoint = {
  latitude: number;
  longitude: number;
  codeInsee: string;
};

export type SitePollue = {
  id: string;
  nom: string | null;
  adresse: string | null;
  statut: string | null;
  distanceMetres: number | null;
  fiche: string | null;
};

export type InstallationClassee = {
  id: string;
  nom: string | null;
  adresse: string | null;
  regime: string | null;
  seveso: string | null;
  distanceMetres: number | null;
};

export type SolsPollues = {
  rayonSitesMetres: number;
  rayonInstallationsMetres: number;
  sis: SitePollue[];
  instructions: SitePollue[];
  servitudes: SitePollue[];
  anciensSitesTotal: number;
  anciensSites: SitePollue[];
  installationsTotal: number;
  installations: InstallationClassee[];
};

export type QualiteAir = {
  indiceEuropeen: number | null;
  pm10: number | null;
  pm25: number | null;
  dioxydeAzote: number | null;
  ozone: number | null;
  mesureLe: string | null;
};

export type PollutionParcelle = {
  sols: SolsPollues | null;
  air: QualiteAir | null;
};

export type Generation = "2G" | "3G" | "4G" | "5G";

export type OperateurMobile = {
  operateur: string;
  meilleureGeneration: Generation | null;
  distance4gMetres: number | null;
  distance5gMetres: number | null;
};

export type ReseauMobile = {
  rayonMetres: number;
  antennesActives: number;
  operateurs: OperateurMobile[];
};

export type ConnexionFixe = {
  commune: string;
  locaux: number;
  partFibre: number;
  partCable: number;
  partCuivre: number;
  part4gFixe: number;
  partSatellite: number;
  partTresHautDebit: number;
  partGigabit: number;
  miseAJour: string;
};

export type ConnectiviteParcelle = {
  mobile: ReseauMobile | null;
  fixe: ConnexionFixe | null;
};
