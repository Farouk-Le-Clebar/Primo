import { SCORE_COLOR_STOPS, type SortOrder } from "./constants";

export type ProximityResult = {
    type_code?: string;
    code?: string;
    type_label?: string;
    categorie?: string;
    label?: string;
    nom?: string | null;
    name?: string | null;
    adresse?: string | null;
    address?: string | null;
    famille?: string | null;
    family?: string | null;
    distance_m?: number | null;
    distance?: number | null;
    score?: number | null;
};

export type FeatureLike = {
    geometry?: { type?: string; coordinates?: unknown };
    properties?: Record<string, unknown>;
};

export type ComputedResults = ReadonlyMap<string, ProximityResult | null>;

export type GlobalScoreSummary = {
    score: number;
    total: number;
    found: number;
};

export function getDistance(
    result: ProximityResult | null | undefined,
): number | null {
    return result?.distance_m ?? result?.distance ?? null;
}

export function sortCodes(
    codes: string[],
    results: ComputedResults,
    order: SortOrder,
    notFoundLast: boolean,
): string[] {
    if (order === "none" && !notFoundLast) return codes;
    const isFound = (code: string) => Boolean(results.get(code));
    const distanceOf = (code: string) =>
        getDistance(results.get(code)) ?? Number.POSITIVE_INFINITY;

    return [...codes].sort((a, b) => {
        if (notFoundLast && isFound(a) !== isFound(b))
            return isFound(a) ? -1 : 1;
        if (order === "none") return 0;
        const da = distanceOf(a);
        const db = distanceOf(b);
        if (da === db) return 0;
        return order === "asc" ? da - db : db - da;
    });
}

export function clampScore(score: unknown): number {
    const value = Number(score ?? 0);
    return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
}
export function computeGlobalScore(
    codes: string[],
    results: ComputedResults,
): GlobalScoreSummary | null {
    if (codes.length === 0) return null;
    const total = codes.reduce(
        (sum, code) => sum + clampScore(results.get(code)?.score),
        0,
    );
    return {
        score: Math.round(total / codes.length),
        total: codes.length,
        found: codes.filter((code) => results.get(code)).length,
    };
}

export function getScoreLabel(score: number): string {
    if (score >= 75) return "Très bien desservi";
    if (score >= 50) return "Bien desservi";
    if (score >= 25) return "Desserte limitée";
    return "Peu desservi";
}

export function scoreColor(score: number): string {
    const stops = SCORE_COLOR_STOPS;
    const value = clampScore(score);
    let lower = stops[0];
    let upper = stops[stops.length - 1];
    for (let i = 0; i < stops.length - 1; i += 1) {
        if (value >= stops[i].at && value <= stops[i + 1].at) {
            lower = stops[i];
            upper = stops[i + 1];
            break;
        }
    }
    const t = (value - lower.at) / (upper.at - lower.at || 1);
    const rgb = lower.color.map((channel, i) =>
        Math.round(channel + (upper.color[i] - channel) * t),
    );
    return `rgb(${rgb.join(",")})`;
}

export function formatDistance(distance: number | null | undefined): string {
    if (distance == null || !Number.isFinite(Number(distance))) return "—";
    const metres = Number(distance);
    if (metres < 1000) return `${Math.round(metres)}m`;
    return `${(metres / 1000).toFixed(1)}km`;
}

