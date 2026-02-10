export interface ClientProject {
    id: string;
    name: string;
    parameters: number;
    parcels: number;
    createdAt: string;
    modifiedAt: string;
    isFavorite: boolean;
}


export type SortKey =
    | "name"
    | "parameters"
    | "parcels"
    | "createdAt"
    | "modifiedAt";


export type SortDirection = "asc" | "desc";


export interface SortConfig {
    key: SortKey | null;
    direction: SortDirection;
}


export interface ProjectFilters {
    parametersMin: string;
    parametersMax: string;
    parcelsMin: string;
    parcelsMax: string;
    timeRange: string;
    customStartDate: string;
    customEndDate: string;
}


export interface DeleteModalState {
    isOpen: boolean;
    project: ClientProject | null;
}
