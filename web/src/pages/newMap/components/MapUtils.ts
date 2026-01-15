import type { FeatureCollection } from 'geojson';

export const MIN_ZOOM_FOR_PARCELLES = 18;
export const MIN_ZOOM_FOR_DIVISION = 15;
export const MIN_ZOOM_FOR_CITY = 11;
export const MIN_ZOOM_FOR_POIS = 11;

export const isFeatureCollection = (d: any): d is FeatureCollection =>
    !!d && Array.isArray((d as any).features);

export const style = {
    fillColor: "#54bb8dff",
    color: "#51b789ff",
    weight: 2,
};

export type DataType = {
    departements: FeatureCollection | null;
    parcelles: FeatureCollection | null;
    city: FeatureCollection | null;
    divisions: FeatureCollection | null;
};

export type PoiType = {
    pois: FeatureCollection | null;
};

export const boundToBbox = (bounds: L.LatLngBounds) => {
    return ([
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth()
    ].join(','));
};

export const getMaxFeaturesForZoom = (zoom: number): number => {
    if (zoom >= 15) return 50;
    if (zoom >= 13) return 150;
    if (zoom >= 11) return 200;
    return 0; // Vue lointaine
};

export interface PoiConfig {
    type: string;
    label: string;
    icon: string;
    color: string;
    enabled: boolean;
}

export const POI_CONFIGS: Record<string, PoiConfig> = {
    hospital: {
        type: 'hospital',
        label: 'Hôpitaux',
        icon: '🏥',
        color: '#e74c3c',
        enabled: true,
    },
    pharmacy: {
        type: 'pharmacy',
        label: 'Pharmacies',
        icon: '💊',
        color: '#27ae60',
        enabled: true,
    },
    school: {
        type: 'school',
        label: 'Écoles',
        icon: '🏫',
        color: '#3498db',
        enabled: false,
    },
    college: {
        type: 'college',
        label: 'Collèges',
        icon: '🎓',
        color: '#9b59b6',
        enabled: false,
    },
    university: {
        type: 'university',
        label: 'Universités',
        icon: '🎓',
        color: '#8e44ad',
        enabled: false,
    },
    supermarket: {
        type: 'supermarket',
        label: 'Supermarchés',
        icon: '🛒',
        color: '#f39c12',
        enabled: false,
    },
    cinema: {
        type: 'cinema',
        label: 'Cinémas',
        icon: '🎬',
        color: '#e67e22',
        enabled: false,
    },
    library: {
        type: 'library',
        label: 'Bibliothèques',
        icon: '📚',
        color: '#16a085',
        enabled: false,
    },
};