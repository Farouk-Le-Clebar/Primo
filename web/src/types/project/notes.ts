export type ProjectNote = {
    id: string;
    projectId: string;
    title: string;
    content: string;
    version: number;
    isPinned: boolean;
    plotId: string | null;
    authorName?: string | null;
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
