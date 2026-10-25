// Example parcel shared by the intro and the scroll story (illustrative data).
import { CloudSun, Euro, House, Landmark, LandPlot, MapPinned, ShieldAlert, Zap } from 'lucide-react';

export const PARCEL = {
  id: '31555000AB0142',
  short: 'AB 0142',
  address: '14 Rue des Lilas, 31500 Toulouse',
  area: 640,
};

export type DatasetKey = 'cadastre' | 'plu' | 'dvf' | 'dpe' | 'risques' | 'bati' | 'climat' | 'quartier';

export type Dataset = {
  key: DatasetKey;
  source: string;
  title: string;
  value: string;
  detail: string;
  extra?: string[];
};

// One entry per public source Primo centralises.
export const DATASETS: Dataset[] = [
  {
    key: 'cadastre',
    source: 'Cadastre',
    title: 'Parcelle',
    value: '640 m²',
    detail: 'Section AB · n° 0142',
    extra: ['Commune de Toulouse'],
  },
  {
    key: 'plu',
    source: 'PLU',
    title: 'Zonage',
    value: 'UB2',
    detail: 'Zone urbaine mixte',
    extra: ['Emprise max. 60 %', 'Hauteur max. 12 m'],
  },
  {
    key: 'dvf',
    source: 'DVF',
    title: 'Prix médian',
    value: '3 400 €/m²',
    detail: '+4,2 % sur 12 mois',
    extra: ['38 ventes dans le secteur', 'Dernière vente : 2024'],
  },
  {
    key: 'dpe',
    source: 'DPE',
    title: 'Énergie',
    value: 'Classe D',
    detail: '182 kWh/m²/an',
    extra: ['GES : classe C', 'Diagnostic de 2023'],
  },
  {
    key: 'risques',
    source: 'Géorisques',
    title: 'Risques',
    value: 'Faibles',
    detail: 'Inondation faible · argiles moyen',
    extra: ['Séisme : très faible', '0 arrêté CatNat récent'],
  },
  {
    key: 'bati',
    source: 'Bâti',
    title: 'Bâtiment',
    value: '132 m²',
    detail: 'Maison · 1978 · R+1',
    extra: ['Emprise au sol 86 m²', '5 pièces'],
  },
  {
    key: 'climat',
    source: 'Climat',
    title: 'Ensoleillement',
    value: '2 050 h/an',
    detail: 'Moyennes sur 30 ans',
    extra: ['Température moyenne 14 °C', '86 jours de pluie'],
  },
  {
    key: 'quartier',
    source: 'Quartier',
    title: 'À proximité',
    value: 'Métro 600 m',
    detail: 'École 350 m · commerces 200 m',
    extra: ['Parc 450 m', 'Pharmacie 300 m'],
  },
];

export const DATASET_ICONS: Record<DatasetKey, typeof LandPlot> = {
  cadastre: LandPlot,
  plu: Landmark,
  dvf: Euro,
  dpe: Zap,
  risques: ShieldAlert,
  bati: House,
  climat: CloudSun,
  quartier: MapPinned,
};

// Official DPE label colours, A → G.
export const DPE_CLASSES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;
export const DPE_COLORS = [
  '#009c6d',
  '#52b153',
  '#a5cc3b',
  '#f2dd2c',
  '#f2b02c',
  '#eb7a2b',
  '#d7312c',
] as const;
