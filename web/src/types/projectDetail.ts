export interface ProjectDetail {
    id: string;
    name: string;
    isFavorite: boolean;
    parcels?: Parcel[];
    parameters?: any; // À définir
    notes?: string;
    createdAt: string;
    modifiedAt: string;
}

export interface Parcel {
    id: string;
    coordinates: [number, number];
    // le reste é à definir 
}
