export interface CreateProjectPayload {
    name: string;
    isFavorite?: boolean;
    notes?: string;
}


export interface UpdateProjectPayload {
    name?: string;
    isFavorite?: boolean;
    notes?: string;
    parcels?: Array<{
        id: string;
        coordinates: [number, number];
        properties?: Record<string, any>;
    }>;
    parameters?: Record<string, any>;
}


export interface ProjectResponse {
    id: string;
    name: string;
    isFavorite: boolean;
    notes: string | null;
    parcels: Array<{
        id: string;
        coordinates: [number, number];
        properties?: Record<string, any>;
    }> | null;
    parameters: Record<string, any> | null;
    userId: string;
    createdAt: string;
    modifiedAt: string;
}
