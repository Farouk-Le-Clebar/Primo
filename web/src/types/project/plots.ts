export type AddPlotToProjectPayload = {
    projectId: string;
    plotId: string;
    plotBanId: string;
    adress: string;
    coordinates: string;
    geometry: any;
    parcelProperties?: Record<string, unknown>;
    addressProperties?: Record<string, unknown>;
};

export type UsefullPlotData = {
    plotId: string;
    plotBanId: string;
    adress: string;
    coordinates: string;
    geometry: any;
    parcelProperties?: Record<string, unknown>;
    addressProperties?: Record<string, unknown>;
};

export type ProjectPlotResponse = {
    projectId: string;
    plotId: string;
    plotBanId: string;
    adress: string;
    id: string;
    geometry: any;
    aiNotes: string | null;
    coordinates: string;
};

export type PlotSummary = {
    dvf: { count: number; lastDate: string | null; lastValue: number | null; lastNature: string | null; lastLocalType: string | null } | null;
    dpe: {
        count: number;
        distribution: Record<string, number>;
        lastLabel: string | null;
        lastGes: string | null;
        lastDate: string | null;
        lastSurface: number | null;
        constructionYear: number | null;
    } | null;
    permits: { count: number; lastDate: string | null; lastType: string | null; lastState: string | null } | null;
    plu: { zones: string[]; zoneType: string | null; description: string | null; prescriptions: number; informations: number } | null;
    buildings: { count: number } | null;
    risks: { commune: string | null; count: number; names: string[]; seismicZone: string | null; radon: string | null; catnatCount: number } | null;
    climate: { meanTemperature: number | null; summerMaxTemperature: number | null; winterMinTemperature: number | null; annualPrecipitation: number | null } | null;
    proximity: { requested: number; found: number; averageScore: number | null; nearest: { label: string | null; name: string | null; distanceM: number }[] } | null;
};

export type ProjectPlotWithSummary = ProjectPlotResponse & {
    communeCode: string | null;
    department: string | null;
    prefix: string | null;
    section: string | null;
    parcelNumber: string | null;
    surfaceM2: number | null;
    enrichedAt: string | null;
    enrichmentErrors: Record<string, string> | null;
    summary: PlotSummary;
};
