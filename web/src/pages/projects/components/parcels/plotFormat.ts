import type { ProjectPlotWithSummary } from "../../../../types/project/plots";

export const NO_DATA = "—";

export const formatSurface = (m2: number | null | undefined) => {
    if (m2 == null) return NO_DATA;
    return m2 >= 10000 ? `${(m2 / 10000).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} ha` : `${m2.toLocaleString("fr-FR")} m²`;
};

export const formatPrice = (value: number | null | undefined) =>
    value == null ? NO_DATA : value.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export const formatDate = (value: string | null | undefined) =>
    value ? new Date(`${value.slice(0, 10)}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : NO_DATA;

export const formatDistance = (meters: number) =>
    meters >= 1000 ? `${(meters / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} km` : `${meters} m`;

export const cadastralRef = (plot: ProjectPlotWithSummary) =>
    plot.section && plot.parcelNumber ? `${plot.section} ${plot.parcelNumber}` : plot.plotId;

export const isEnriched = (plot: ProjectPlotWithSummary) => !!plot.enrichedAt;

export const zoneLabel = (plot: ProjectPlotWithSummary) => plot.summary?.plu?.zones[0] ?? null;

// DPE F and G are the "passoires thermiques".
export const isEnergySieve = (plot: ProjectPlotWithSummary) => ["F", "G"].includes(plot.summary?.dpe?.lastLabel ?? "");

export type SortKey = "address" | "surface" | "lastSale" | "dpe" | "risks";
export type SortDirection = "asc" | "desc";

const sortValue = (plot: ProjectPlotWithSummary, key: SortKey): string | number | null => {
    switch (key) {
        case "address": return plot.adress?.toLowerCase() ?? null;
        case "surface": return plot.surfaceM2;
        case "lastSale": return plot.summary?.dvf?.lastValue ?? null;
        case "dpe": return plot.summary?.dpe?.lastLabel ?? null;
        case "risks": return plot.summary?.risks?.count ?? null;
    }
};

// Parcels without a value always sink to the bottom, whatever the direction.
export const sortPlots = (plots: ProjectPlotWithSummary[], key: SortKey, direction: SortDirection) =>
    [...plots].sort((a, b) => {
        const left = sortValue(a, key);
        const right = sortValue(b, key);
        if (left == null && right == null) return 0;
        if (left == null) return 1;
        if (right == null) return -1;
        const result = typeof left === "number" && typeof right === "number" ? left - right : String(left).localeCompare(String(right), "fr");
        return direction === "asc" ? result : -result;
    });

export const matchesQuery = (plot: ProjectPlotWithSummary, query: string) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return [plot.adress, plot.plotId, plot.communeCode, plot.section, plot.parcelNumber, zoneLabel(plot)]
        .some((field) => field?.toLowerCase().includes(needle));
};
