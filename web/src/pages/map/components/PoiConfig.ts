import type { FeatureCollection } from "geojson";
import {
    Baby,
    BriefcaseMedical,
    Building2,
    Dumbbell,
    Film,
    Flame,
    Goal,
    GraduationCap,
    HeartPulse,
    Hospital,
    Landmark,
    Library,
    Mailbox,
    Palette,
    ParkingSquare,
    Pill,
    School,
    Shield,
    ShoppingBag,
    ShoppingCart,
    Smile,
    Stethoscope,
    Store,
    Theater,
    TrainFront,
    Trees,
    Trophy,
    Warehouse,
} from "lucide-react";

export const MIN_ZOOM_FOR_POIS = 16;

export const POI_COLLISION_PADDING = 6;

export const POI_LABEL_CHAR_WIDTH = 7;

export const POI_LABEL_HEIGHT = 20;

export const POI_ICON_SIZE = 28;

export type PoiType = {
    pois: FeatureCollection | null;
};

// Doit rester synchronisé avec les familles définies dans poi-types.csv (back-end).
export type PoiFamille =
    | "sante"
    | "education"
    | "culture"
    | "sport"
    | "nature"
    | "commerce"
    | "securite"
    | "administration"
    | "transport";

// Libellés humains des familles, utilisés pour regrouper les types dans PoiWidget.
export const FAMILLE_LABELS: Record<PoiFamille, string> = {
    sante: "Santé",
    education: "Éducation",
    culture: "Culture",
    sport: "Sport",
    nature: "Nature",
    commerce: "Commerce",
    securite: "Sécurité",
    administration: "Administration",
    transport: "Transport",
};

export interface PoiConfig {
    type: string;
    famille: PoiFamille;
    label: string;
    ticon: any;
    svgIcon: string;
    color: string;
    enabled: boolean;
}


const svgWrap = (inner: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

// Catalogue des types d'infrastructure affichables sur la carte.
// Pour ajouter un type : ajouter une entree ici avec le meme code que celui
// utilise cote back (poi-types.csv), rien d'autre a modifier ailleurs.
export const POI_CONFIGS: Record<string, PoiConfig> = {
    // --- Santé ---
    hopital: {
        type: "hopital",
        famille: "sante",
        label: "Hôpitaux",
        ticon: Hospital,
        svgIcon: svgWrap(
            '<path d="M12 6v4"/><path d="M14 14h-4"/><path d="M14 18h-4"/><path d="M14 8h-4"/><path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/><path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18"/>',
        ),
        color: "#e74c3c",
        enabled: false,
    },
    pharmacie: {
        type: "pharmacie",
        famille: "sante",
        label: "Pharmacies",
        ticon: Pill,
        svgIcon: svgWrap(
            '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
        ),
        color: "#27ae60",
        enabled: false,
    },
    medecin: {
        type: "medecin",
        famille: "sante",
        label: "Médecins généralistes",
        ticon: Stethoscope,
        svgIcon: svgWrap(
            '<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>',
        ),
        color: "#c0392b",
        enabled: false,
    },
    clinique: {
        type: "clinique",
        famille: "sante",
        label: "Cliniques",
        ticon: BriefcaseMedical,
        svgIcon: svgWrap(
            '<path d="M12 11v4"/><path d="M14 13h-4"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M18 6v14"/><path d="M6 6v14"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
        ),
        color: "#d35400",
        enabled: false,
    },
    dentiste: {
        type: "dentiste",
        famille: "sante",
        label: "Dentistes",
        ticon: Smile,
        svgIcon: svgWrap(
            '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',
        ),
        color: "#e17055",
        enabled: false,
    },
    sante_healthcare: {
        type: "sante_healthcare",
        famille: "sante",
        label: "Établissements de santé",
        ticon: HeartPulse,
        svgIcon: svgWrap(
            '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
        ),
        color: "#eb5e28",
        enabled: false,
    },
    // --- Éducation ---
    ecole: {
        type: "ecole",
        famille: "education",
        label: "Écoles",
        ticon: School,
        svgIcon: svgWrap(
            '<path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M18 5v17"/><path d="m4 6 8-4 8 4"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/>',
        ),
        color: "#3498db",
        enabled: false,
    },
    enseignement_superieur: {
        type: "enseignement_superieur",
        famille: "education",
        label: "Enseignement supérieur",
        ticon: GraduationCap,
        svgIcon: svgWrap(
            '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
        ),
        color: "#9b59b6",
        enabled: false,
    },
    universite: {
        type: "universite",
        famille: "education",
        label: "Universités",
        ticon: Building2,
        svgIcon: svgWrap(
            '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
        ),
        color: "#8e44ad",
        enabled: false,
    },
    bibliotheque: {
        type: "bibliotheque",
        famille: "education",
        label: "Bibliothèques",
        ticon: Library,
        svgIcon: svgWrap(
            '<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',
        ),
        color: "#16a085",
        enabled: false,
    },
    creche: {
        type: "creche",
        famille: "education",
        label: "Crèches",
        ticon: Baby,
        svgIcon: svgWrap(
            '<path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>',
        ),
        color: "#5dade2",
        enabled: false,
    },
    // --- Culture ---
    cinema: {
        type: "cinema",
        famille: "culture",
        label: "Cinémas",
        ticon: Film,
        svgIcon: svgWrap(
            '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>',
        ),
        color: "#e67e22",
        enabled: false,
    },
    theatre: {
        type: "theatre",
        famille: "culture",
        label: "Théâtres",
        ticon: Theater,
        svgIcon: svgWrap(
            '<path d="M2 10s3-3 3-8"/><path d="M22 10s-3-3-3-8"/><path d="M10 2c0 4.4-3.6 8-8 8"/><path d="M14 2c0 4.4 3.6 8 8 8"/><path d="M2 10s2 2 2 5"/><path d="M22 10s-2 2-2 5"/><path d="M8 15h8"/><path d="M2 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"/><path d="M14 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"/>',
        ),
        color: "#d68910",
        enabled: false,
    },
    musee: {
        type: "musee",
        famille: "culture",
        label: "Musées",
        ticon: Palette,
        svgIcon: svgWrap(
            '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
        ),
        color: "#af7ac5",
        enabled: false,
    },
    centre_culturel: {
        type: "centre_culturel",
        famille: "culture",
        label: "Centres culturels",
        ticon: Building2,
        svgIcon: svgWrap(
            '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
        ),
        color: "#a569bd",
        enabled: false,
    },
    // --- Sport ---
    terrain_sport: {
        type: "terrain_sport",
        famille: "sport",
        label: "Terrains de sport",
        ticon: Goal,
        svgIcon: svgWrap(
            '<path d="M12 13V2l8 4-8 4"/><path d="M20.561 10.222a9 9 0 1 1-12.55-5.29"/><path d="M8.002 9.997a5 5 0 1 0 8.9 2.02"/>',
        ),
        color: "#2ecc71",
        enabled: false,
    },
    centre_sportif: {
        type: "centre_sportif",
        famille: "sport",
        label: "Centres sportifs",
        ticon: Dumbbell,
        svgIcon: svgWrap(
            '<path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/>',
        ),
        color: "#229954",
        enabled: false,
    },
    stade: {
        type: "stade",
        famille: "sport",
        label: "Stades",
        ticon: Trophy,
        svgIcon: svgWrap(
            '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
        ),
        color: "#f1c40f",
        enabled: false,
    },
    // --- Nature ---
    parc: {
        type: "parc",
        famille: "nature",
        label: "Parcs & espaces verts",
        ticon: Trees,
        svgIcon: svgWrap(
            '<path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/>',
        ),
        color: "#58d68d",
        enabled: false,
    },
    // --- Commerces ---
    supermarche: {
        type: "supermarche",
        famille: "commerce",
        label: "Supermarchés",
        ticon: ShoppingCart,
        svgIcon: svgWrap(
            '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
        ),
        color: "#f39c12",
        enabled: false,
    },
    centre_commercial: {
        type: "centre_commercial",
        famille: "commerce",
        label: "Centres commerciaux",
        ticon: Store,
        svgIcon: svgWrap(
            '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>',
        ),
        color: "#ca8a04",
        enabled: false,
    },
    epicerie: {
        type: "epicerie",
        famille: "commerce",
        label: "Épiceries",
        ticon: ShoppingBag,
        svgIcon: svgWrap(
            '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
        ),
        color: "#f6b93b",
        enabled: false,
    },
    grand_magasin: {
        type: "grand_magasin",
        famille: "commerce",
        label: "Grands magasins",
        ticon: Warehouse,
        svgIcon: svgWrap(
            '<path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect width="12" height="12" x="6" y="10"/>',
        ),
        color: "#eb9532",
        enabled: false,
    },
    // --- Sécurité ---
    police: {
        type: "police",
        famille: "securite",
        label: "Police & gendarmerie",
        ticon: Shield,
        svgIcon: svgWrap(
            '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
        ),
        color: "#34495e",
        enabled: false,
    },
    caserne_pompiers: {
        type: "caserne_pompiers",
        famille: "securite",
        label: "Casernes de pompiers",
        ticon: Flame,
        svgIcon: svgWrap(
            '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
        ),
        color: "#c0392b",
        enabled: false,
    },
    // --- Administration ---
    mairie: {
        type: "mairie",
        famille: "administration",
        label: "Mairies",
        ticon: Landmark,
        svgIcon: svgWrap(
            '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
        ),
        color: "#7f8c8d",
        enabled: false,
    },
    poste: {
        type: "poste",
        famille: "administration",
        label: "Bureaux de poste",
        ticon: Mailbox,
        svgIcon: svgWrap(
            '<path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"/><polyline points="15,9 18,9 18,11"/><path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2v0"/><line x1="6" x2="7" y1="10" y2="10"/>',
        ),
        color: "#95a5a6",
        enabled: false,
    },
    // --- Transport ---
    gare: {
        type: "gare",
        famille: "transport",
        label: "Gares",
        ticon: TrainFront,
        svgIcon: svgWrap(
            '<path d="M8 3.1V7a4 4 0 0 0 8 0V3.1"/><path d="m9 15-1-1"/><path d="m15 15 1-1"/><path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z"/><path d="m8 19-2 3"/><path d="m16 19 2 3"/>',
        ),
        color: "#2980b9",
        enabled: false,
    },
    parking: {
        type: "parking",
        famille: "transport",
        label: "Parkings",
        ticon: ParkingSquare,
        svgIcon: svgWrap(
            '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
        ),
        color: "#34495e",
        enabled: false,
    },
};


export const getMaxFeaturesForZoom = (zoom: number): number => {
    if (zoom < 11) return 0;

    if (zoom < 12) return 120;
    if (zoom < 13) return 180;
    if (zoom < 14) return 260;
    if (zoom < 15) return 360;
    if (zoom < 16) return 500;
    if (zoom < 17) return 700;

    return 1000;
};

export const getPoiLabelDensity = (zoom: number): number => {
    if (zoom < 12) return 0;
    if (zoom < 13) return 0.02;
    if (zoom < 14) return 0.04;
    if (zoom < 15) return 0.07;
    if (zoom < 16) return 0.12;
    if (zoom < 17) return 0.25;
    if (zoom < 18) return 0.50;

    return 1;
};
