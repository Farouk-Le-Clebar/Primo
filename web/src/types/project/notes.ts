export type ProjectNote = {
    id: string;
    projectId: string;
    title: string;
    content: string;
    version: number;
    createdBy: string | null;
    updatedBy: string | null;
    createdAt: string;
    updatedAt: string;
};

export type UpdateNotePayload = {
    title?: string;
    content?: string;
    version: number;
};
