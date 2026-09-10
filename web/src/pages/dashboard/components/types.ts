export interface StatCardData {
  label: string;
  value: string;
  delta: string;
  deltaColor: 'violet' | 'emerald' | 'amber';
  icon: 'parcels' | 'saved' | 'budget';
}

export interface PricePoint {
  year: string;
  Appartements: number;
  Maisons: number;
}

export interface UrbanZone {
  name: string;
  code: string;
  value: number;
  color: string;
}

export interface BuildingType {
  name: string;
  count: number;
}

export interface ParcelItem {
  id: string;
  zoneCode: string;
  address: string;
  surface: string;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  userInitials: string;
  userColor: 'violet' | 'emerald' | 'amber' | 'sky';
  message: string;
  tag: string;
  timestamp: string;
}
