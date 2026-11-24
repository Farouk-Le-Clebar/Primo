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
