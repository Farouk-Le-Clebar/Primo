import type { ActivityItem, BuildingType, ParcelItem, PricePoint, StatCardData, UrbanZone } from './types';

export const stats: StatCardData[] = [
  {
    label: 'Parcelles analysées',
    value: '137',
    delta: '+18 ce mois',
    deltaColor: 'violet',
    icon: 'parcels',
  },
  {
    label: 'Parcelles sauvegardées',
    value: '48',
    delta: '+6 cette semaine',
    deltaColor: 'emerald',
    icon: 'saved',
  },
  {
    label: 'Budget engagé',
    value: '2,4 M€',
    delta: 'sur 3,1 M€',
    deltaColor: 'amber',
    icon: 'budget',
  },
];

export const priceHistory: PricePoint[] = [
  { year: '2019', Appartements: 4350, Maisons: 2980 },
  { year: '2020', Appartements: 4420, Maisons: 3080 },
  { year: '2021', Appartements: 4780, Maisons: 3320 },
  { year: '2022', Appartements: 5020, Maisons: 3560 },
  { year: '2023', Appartements: 4880, Maisons: 3610 },
  { year: '2024', Appartements: 5150, Maisons: 3780 },
  { year: '2025', Appartements: 5420, Maisons: 3950 },
];

export const urbanZones: UrbanZone[] = [
  { name: 'Urbaine dense', code: 'UA', value: 34, color: 'violet' },
  { name: 'Urbaine', code: 'UB', value: 26, color: 'blue' },
  { name: 'À urbaniser', code: 'AU', value: 18, color: 'amber' },
  { name: 'Naturelle', code: 'N', value: 14, color: 'emerald' },
  { name: 'Agricole', code: 'A', value: 8, color: 'rose' },
];

export const buildingTypes: BuildingType[] = [
  { name: 'Résidentiel', count: 420 },
  { name: 'Commercial', count: 235 },
  { name: 'Industriel', count: 130 },
  { name: 'Agricole', count: 95 },
  { name: 'Annexe', count: 150 },
];

export const recentParcels: ParcelItem[] = [
  {
    id: '75001000AC0023',
    zoneCode: 'UA3',
    address: '14 Rue des Lilas, 75020 Paris',
    surface: '420 m²',
    updatedAt: 'il y a 2 h',
  },
  {
    id: '31555000BH0114',
    zoneCode: 'UB1',
    address: 'Bd de la Marquette, Toulouse',
    surface: '1 240 m²',
    updatedAt: 'il y a 5 h',
  },
  {
    id: '69123000CD0042',
    zoneCode: 'AU2',
    address: 'Chemin des Vignes, Lyon',
    surface: '860 m²',
    updatedAt: 'il y a 1 j',
  },
  {
    id: '33063000EF0087',
    zoneCode: 'UA1',
    address: 'Cours Victor Hugo, Bordeaux',
    surface: '310 m²',
    updatedAt: 'il y a 2 j',
  },
];

export const activityFeed: ActivityItem[] = [
  {
    id: '1',
    userInitials: 'JC',
    userColor: 'violet',
    message: 'Jacques a ajouté une nouvelle parcelle',
    tag: 'Maison de Campagne',
    timestamp: 'il y a 2 h',
  },
  {
    id: '2',
    userInitials: 'SM',
    userColor: 'emerald',
    message: 'Sophie a mis à jour le budget',
    tag: 'Loft Toulouse Centre',
    timestamp: 'il y a 5 h',
  },
  {
    id: '3',
    userInitials: 'FH',
    userColor: 'amber',
    message: 'Félix a validé le critère PLU',
    tag: 'Terrain Bordeaux Sud',
    timestamp: 'il y a 8 h',
  },
  {
    id: '4',
    userInitials: 'LR',
    userColor: 'sky',
    message: 'Léa a sauvegardé une recherche',
    tag: 'Zone UA — Lyon',
    timestamp: 'il y a 1 j',
  },
];
