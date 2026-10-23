export type ProjectDocument = {
    id: string;
    projectId: string;
    documentName: string;
    mimetype: string;
    documentType: string;
    size: number;
    createdAt: string;
};

export type StorageUsage = {
    used: number;
    quota: number;
};

export type DocumentUploadResponse = {
    documentId: string;
    uploadUrl: string;
};
