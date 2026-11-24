export type Generation = '2G' | '3G' | '4G' | '5G';

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
