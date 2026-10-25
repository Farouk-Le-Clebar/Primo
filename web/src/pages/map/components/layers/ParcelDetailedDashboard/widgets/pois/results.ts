import axios from "axios";

import type { ProximityResult } from "./utils";

const MAX_CACHED_PARCELS = 20;

const proximityCache = new Map<string, Map<string, ProximityResult | null>>();

export function getParcelCache(
    parcelKey: string,
): Map<string, ProximityResult | null> {
    const entry = proximityCache.get(parcelKey) ?? new Map();
    proximityCache.delete(parcelKey);
    proximityCache.set(parcelKey, entry);
    if (proximityCache.size > MAX_CACHED_PARCELS) {
        const oldest = proximityCache.keys().next().value;
        if (oldest !== undefined) proximityCache.delete(oldest);
    }
    return entry;
}

export function getResultType(result: ProximityResult): string {
    return result.type_code ?? result.code ?? "";
}

export function extractResults(payload: unknown): ProximityResult[] {
    if (Array.isArray(payload)) return payload;
    const envelope = payload as
        | { results?: unknown; data?: unknown }
        | null
        | undefined;
    if (Array.isArray(envelope?.results)) return envelope.results;
    if (Array.isArray(envelope?.data)) return envelope.data;
    return [];
}

export function indexResultsByType(
    results: ProximityResult[],
): Map<string, ProximityResult> {
    const map = new Map<string, ProximityResult>();
    for (const result of results) {
        const code = getResultType(result);
        if (code) map.set(code, result);
    }
    return map;
}

export function getErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const detail =
            typeof err.response?.data?.message === "string"
                ? err.response.data.message
                : err.message;
        return status
            ? `Erreur API (${status}) : ${detail}`
            : `API inaccessible : ${detail}`;
    }
    return err instanceof Error
        ? err.message
        : "Impossible de calculer les proximités.";
}
