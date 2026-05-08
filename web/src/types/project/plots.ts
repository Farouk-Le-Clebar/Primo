export type AddPlotToProjectPayload = {
    projectId: string;
    plotId: string;
    plotBanId: string;
    adress: string;
    coordinates: string;
    geometry: any;
};

export type UsefullPlotData = {
    plotId: string;
    plotBanId: string;
    adress: string;
    coordinates: string;
    geometry: any;
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
