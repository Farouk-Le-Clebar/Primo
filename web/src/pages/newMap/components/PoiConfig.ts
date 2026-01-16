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

export const MIN_ZOOM_FOR_POIS = 11;

export type PoiType = {
    pois: FeatureCollection | null;
};

export interface PoiConfig {
    type: string;
    label: string;
    ticon: any; // Type de lucide-react
    icon: string;
    color: string;
    enabled: boolean;
}

export const POI_CONFIGS: Record<string, PoiConfig> = {
    hospital: {
        type: "hospital",
        label: "Hôpitaux",
        ticon: Hospital,
        icon: "🏥",
        color: "#e74c3c",
        enabled: false,
    },
    pharmacy: {
        type: "pharmacy",
        label: "Pharmacies",
        ticon: Pill,
        icon: "💊",
        color: "#27ae60",
        enabled: false,
    },
    school: {
        type: "school",
        label: "Écoles",
        ticon: School,
        icon: "🏫",
        color: "#3498db",
        enabled: false,
    },
    college: {
        type: "college",
        label: "Collèges",
        ticon: GraduationCap,
        icon: "🎓",
        color: "#9b59b6",
        enabled: false,
    },
    university: {
        type: "university",
        label: "Universités",
        ticon: GraduationCap,
        icon: "🎓",
        color: "#8e44ad",
        enabled: false,
    },
    supermarket: {
        type: "supermarket",
        label: "Supermarchés",
        ticon: ShoppingCart,
        icon: "🛒",
        color: "#f39c12",
        enabled: false,
    },
    cinema: {
        type: "cinema",
        label: "Cinémas",
        ticon: Film,
        icon: "🎬",
        color: "#e67e22",
        enabled: false,
    },
    library: {
        type: "library",
        label: "Bibliothèques",
        ticon: Building2,
        icon: "📚",
        color: "#16a085",
        enabled: false,
    },
};

export const getMaxFeaturesForZoom = (zoom: number): number => {
    if (zoom >= 15) return 50;
    if (zoom >= 13) return 150;
    if (zoom >= 11) return 200;
    return 0;
};
