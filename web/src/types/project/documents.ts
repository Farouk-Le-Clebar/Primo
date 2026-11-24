export type ProjectDocument = {
    id: string;
    projectId: string;
    documentName: string;
    mimetype: string;
    documentType: string;
    size: number;
    createdAt: string;
    category: DocumentCategory | null;
    plotId: string | null;
    uploadedBy: string | null;
    uploaderName: string | null;
};

export type DocumentCategory = "mandat" | "diagnostic" | "plan" | "photo" | "autre";

export type DocumentMeta = { category?: DocumentCategory; plotId?: string | null };

export type StorageUsage = {
    used: number;
    quota: number;
};

export type DocumentUploadResponse = {
    documentId: string;
    uploadUrl: string;
};
