export type ProjectAddress = {
    id: string;
    projectId: string;
    address: string;
    latitude: number;
    longitude: number;
    description: string | null;
    name: string | null;
    category: AddressCategory | null;
    createdBy: string | null;
    createdByName?: string | null;
    createdAt: string;
};

export type CreateProjectAddressPayload = {
    address: string;
    latitude: number;
    longitude: number;
    description?: string;
    name?: string;
    category?: AddressCategory;
};

export type AddressCategory = "agence" | "client" | "ecole" | "transport" | "travail" | "sante" | "autre";
