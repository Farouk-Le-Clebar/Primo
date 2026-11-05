import axios from "axios";
import type { ProjectNote, UpdateNotePayload } from "../types/project/notes";
const apiUrl = window?._env_?.API_URL;
const token = localStorage.getItem("token");

const headers = { Authorization: `Bearer ${token}` };

export const getProjectNotes = async (projectId: string): Promise<ProjectNote[]> => {
    return axios.get(`${apiUrl}/projects/${projectId}/notes`, { headers })
        .then((response) => response.data)
        .catch((error) => {
            throw error.response?.data ?? error;
        });
}

export const createProjectNote = async (projectId: string, payload: { title?: string; content?: string } = {}): Promise<ProjectNote> => {
    return axios.post(`${apiUrl}/projects/${projectId}/notes`, payload, { headers })
        .then((response) => response.data)
        .catch((error) => {
            throw error.response?.data ?? error;
        });
}

export const updateProjectNote = async (projectId: string, noteId: string, payload: UpdateNotePayload): Promise<ProjectNote> => {
    return axios.patch(`${apiUrl}/projects/${projectId}/notes/${noteId}`, payload, { headers })
        .then((response) => response.data)
        .catch((error) => {
            // Keep the status: the autosave hook needs it to detect a conflict (409).
            throw error;
        });
}

// Best-effort save while the page is closing: axios requests are cancelled on unload, fetch with keepalive is not.
export const updateProjectNoteOnUnload = (projectId: string, noteId: string, payload: UpdateNotePayload) => {
    void fetch(`${apiUrl}/projects/${projectId}/notes/${noteId}`, {
        method: "PATCH",
        keepalive: true,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    }).catch(() => undefined);
}

export const deleteProjectNote = async (projectId: string, noteId: string) => {
    return axios.delete(`${apiUrl}/projects/${projectId}/notes/${noteId}`, { headers })
        .then((response) => response.data)
        .catch((error) => {
            throw error.response?.data ?? error;
        });
}
