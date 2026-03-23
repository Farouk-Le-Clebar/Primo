export type TabKey =
    | "overview"
    | "parameters"
    | "parcels"
    | "documents"
    | "activities"
    | "members";


export interface Tab {
    key: TabKey;
    label: string;
}