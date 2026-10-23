export type InfraType = { code: string; label: string };
export type InfraCategory = { label: string; types: InfraType[] };

export const INFRA_CATEGORIES: InfraCategory[] = [
    {
        label: "Culture",
        types: [
            { code: "bibliotheque", label: "Bibliothèque" },
            { code: "cinema", label: "Cinéma" },
            { code: "musee", label: "Musée" },
            { code: "centre_culturel", label: "Centre culturel" },
            { code: "theatre", label: "Théâtre" },
        ],
    },
    {
        label: "Sport",
        types: [
            { code: "terrain_sport", label: "Terrain de sport" },
            { code: "centre_sportif", label: "Centre sportif" },
            { code: "stade", label: "Stade" },
        ],
    },

    {
        label: "Santé",
        types: [
            { code: "hopital", label: "Hôpital" },
            { code: "pharmacie", label: "Pharmacie" },
        ],
    },
    {
        label: "Commerce",
        types: [
            { code: "supermarche", label: "Supermarché" },
            { code: "centre_commercial", label: "Centre commercial" },
            { code: "epicerie", label: "Épicerie" },
            { code: "grand_magasin", label: "Grand magasin" },
        ],
    },
    {
        label: "Transport",
        types: [{ code: "gare", label: "Gare" }],
    },
    {
        label: "Environnement",
        types: [{ code: "parc", label: "Parc" }],
    },
    {
        label: "Sécurité",
        types: [
            { code: "police", label: "Poste de police" },
            { code: "caserne_pompiers", label: "Caserne de pompiers" },
        ],
    },
];

export const DEFAULT_TYPES = [
    "hopital",
    "pharmacie",
    "parc",
    "gare",
    "supermarche",
];

export const DEFAULT_EXPANDED_CATEGORIES = ["Sport"];

export type SortOrder = "asc" | "desc" | "none";

export const DEFAULT_SORT_ORDER: SortOrder = "asc";

export const NEXT_SORT_ORDER: Record<SortOrder, SortOrder> = {
    asc: "desc",
    desc: "none",
    none: "asc",
};

export const API_URL = window?._env_?.API_URL;

export const INFRA_TYPE_BY_CODE: ReadonlyMap<
    string,
    { label: string; family: string }
> = new Map(
    INFRA_CATEGORIES.flatMap((category) =>
        category.types.map(
            (type) =>
                [
                    type.code,
                    { label: type.label, family: category.label },
                ] as const,
        ),
    ),
);

export const SCORE_COLOR_STOPS: {
    at: number;
    color: [number, number, number];
}[] = [
    { at: 0, color: [169, 0, 3] }, // #A90003
    { at: 25, color: [232, 117, 40] }, // orange
    { at: 50, color: [230, 194, 41] }, // yellow
    { at: 75, color: [154, 205, 50] }, // yellow-green
    { at: 100, color: [52, 199, 89] }, // #16e44a
];
