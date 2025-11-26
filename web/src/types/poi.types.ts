export interface Poi {
  id: string;
  name: string;
  type: string;
  category: string;
  lat: number;
  lon: number;
  tags?: Record<string, any>;
}

export interface PoiTypeConfig {
  type: string;
  category: string;
  label: string;
  icon: string;
  color: string;
  enabled: boolean;
}

export const POI_CONFIGS: Record<string, PoiTypeConfig> = {
  hospital: {
    type: 'hospital',
    category: 'amenity',
    label: 'Hôpitaux',
    icon: '🏥',
    color: '#e74c3c',
    enabled: false,
  },
  pharmacy: {
    type: 'pharmacy',
    category: 'amenity',
    label: 'Pharmacies',
    icon: '💊',
    color: '#27ae60',
    enabled: false,
  },
  school: {
    type: 'school',
    category: 'amenity',
    label: 'Écoles',
    icon: '🏫',
    color: '#3498db',
    enabled: false,
  },
  college: {
    type: 'college',
    category: 'amenity',
    label: 'Collèges',
    icon: '🎓',
    color: '#9b59b6',
    enabled: false,
  },
  university: {
    type: 'university',
    category: 'amenity',
    label: 'Universités',
    icon: '🎓',
    color: '#8e44ad',
    enabled: false,
  },
  supermarket: {
    type: 'supermarket',
    category: 'shop',
    label: 'Supermarchés',
    icon: '🛒',
    color: '#f39c12',
    enabled: false,
  },
  cinema: {
    type: 'cinema',
    category: 'amenity',
    label: 'Cinémas',
    icon: '🎬',
    color: '#e67e22',
    enabled: false,
  },
  library: {
    type: 'library',
    category: 'amenity',
    label: 'Bibliothèques',
    icon: '📚',
    color: '#16a085',
    enabled: false,
  },
};