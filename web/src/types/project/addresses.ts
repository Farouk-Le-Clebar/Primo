export type ProjectAddress = {
    id: string;
    projectId: string;
    address: string;
    latitude: number;
    longitude: number;
    description: string | null;
    createdBy: string | null;
    createdAt: string;
};

export type CreateProjectAddressPayload = {
    address: string;
    latitude: number;
    longitude: number;
    description?: string;
};
