import type { Granularity } from "../types/project/projectHistoryFeed";

export const DEFAULT_DAY_WINDOW = 7;

export const DEFAULT_BUCKET_WINDOW = 7;

export const DEFAULT_ALLOWED_GRANULARITIES: Granularity[] = [
    "day",
    "week",
    "month",
];

export const DEFAULT_GRANULARITY: Granularity = "day";

export const GRANULARITY_LABELS: Record<Granularity, string> = {
    day: "Jours",
    week: "Semaines",
    month: "Mois",
};
