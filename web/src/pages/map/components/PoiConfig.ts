import type { FeatureCollection } from "geojson";
import {
    Hospital,
    Pill,
    ShoppingCart,
    School,
    GraduationCap,
    Film,
    Building2,
} from "lucide-react";

export const MIN_ZOOM_FOR_POIS = 16;

export const POI_COLLISION_PADDING = 6;

export const POI_LABEL_CHAR_WIDTH = 7;

export const POI_LABEL_HEIGHT = 20;

export const POI_ICON_SIZE = 28;

export type PoiType = {
    pois: FeatureCollection | null;
};

export interface PoiConfig {
    type: string;
    label: string;
    ticon: any;
    svgIcon: string;
    color: string;
    enabled: boolean;
}


const svgWrap = (inner: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

export const POI_CONFIGS: Record<string, PoiConfig> = {
    hospital: {
        type: "hospital",
        label: "Hôpitaux",
        ticon: Hospital,
        svgIcon: svgWrap(
            '<path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><path d="m12 6 0 4"/><path d="m10 8 4 0"/>',
        ),
        color: "#e74c3c",
        enabled: false,
    },
    pharmacy: {
        type: "pharmacy",
        label: "Pharmacies",
        ticon: Pill,
        svgIcon: svgWrap(
            '<path d="m10.5 1.5 3 3L7.5 10.5l-3-3a2.12 2.12 0 0 1 3-3Z"/><path d="m13.5 10.5 3 3a2.12 2.12 0 0 1-3 3l-3-3"/><line x1="7.5" x2="13.5" y1="10.5" y2="16.5"/>',
        ),
        color: "#27ae60",
        enabled: false,
    },
    school: {
        type: "school",
        label: "Écoles",
        ticon: School,
        svgIcon: svgWrap(
            '<path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M18 5v17"/><path d="M6 5v17"/><rect width="12" height="2" x="6" y="3"/>',
        ),
        color: "#3498db",
        enabled: false,
    },
    college: {
        type: "college",
        label: "Collèges",
        ticon: GraduationCap,
        svgIcon: svgWrap(
            '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>',
        ),
        color: "#9b59b6",
        enabled: false,
    },
    university: {
        type: "university",
        label: "Universités",
        ticon: GraduationCap,
        svgIcon: svgWrap(
            '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>',
        ),
        color: "#8e44ad",
        enabled: false,
    },
    supermarket: {
        type: "supermarket",
        label: "Supermarchés",
        ticon: ShoppingCart,
        svgIcon: svgWrap(
            '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
        ),
        color: "#f39c12",
        enabled: false,
    },
    cinema: {
        type: "cinema",
        label: "Cinémas",
        ticon: Film,
        svgIcon: svgWrap(
            '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>',
        ),
        color: "#e67e22",
        enabled: false,
    },
    library: {
        type: "library",
        label: "Bibliothèques",
        ticon: Building2,
        svgIcon: svgWrap(
            '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
        ),
        color: "#16a085",
        enabled: false,
    },
};

export const getMaxFeaturesForZoom = (zoom: number): number => {
    if (zoom >= 16) return 30;
    if (zoom >= 15) return 50;
    if (zoom >= 13) return 50;
    if (zoom >= 11) return 75;
    return 0;
};
