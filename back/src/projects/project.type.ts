export type CreateProjectDto = {
    name: string;
    description?: string;
};

export type AddPlotToProjectDto = {
    projectId: string;
    plotId: string;
    plotBanId: string;
    adress: string;
    coordinates: string;
    geometry: any;
};

export type InviteUserDto = {
    projectId: string;
    email: string;
};