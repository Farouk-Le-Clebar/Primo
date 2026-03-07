import type { Tab } from "../types/projectTab";

export const MAX_NAME_LENGTH = 64;

export const TIME_RANGES = [
    { label: "Dernier jour", value: "1" },
    { label: "3 derniers jours", value: "3" },
    { label: "1 semaine", value: "7" },
    { label: "Personnalisé", value: "custom" },
];

export const PROJECT_TABS: Tab[] = [
    { key: "overview", label: "Vue d'ensemble" },
    { key: "parameters", label: "Paramètres" },
    { key: "parcels", label: "Parcelles" },
    { key: "documents", label: "Documents" },
    { key: "activities", label: "Activités" },
    { key: "members", label: "Membres" },
];
