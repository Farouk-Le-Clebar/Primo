import axios from "axios";
import type { AddPlotToProjectPayload } from "../types/project/plots";
import type { DocumentUploadResponse, ProjectDocument, StorageUsage } from "../types/project/documents";
const apiUrl = window?._env_?.API_URL;
const token = localStorage.getItem("token");

export const getProjects = async () => {
    return axios.get(`${apiUrl}/projects`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
}

export const addPlotToProject = async (plot: AddPlotToProjectPayload) => {
    return axios.post(`${apiUrl}/projects/plot`, plot, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
}

export const toggleFavorite = async (projectId: string) => {
    return axios.put(`${apiUrl}/projects/${projectId}/favorite`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
}

export const deleteProject = async (projectId: string) => {
    return axios.delete(`${apiUrl}/projects/${projectId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
}

export const getPlotsOfProject = async (projectId: string) => {
    return axios.get(`${apiUrl}/projects/${projectId}/plots`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
}

export const getProjectById = async (projectId: string) => {
    return axios.get(`${apiUrl}/projects/${projectId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
}

export const getUsersOfProject = async (projectId: string) => {
    return axios.get(`${apiUrl}/projects/${projectId}/members`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
}

export const deletePlotFromProject = async (plotId: string) => {
    return axios.delete(`${apiUrl}/projects/plot/${plotId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
}

export const createProject = async (name: string, description?: string) => {
    return axios.post(`${apiUrl}/projects`, {
        name,
        description,
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        });
}

export const inviteUserToProject = async (projectId: string, email: string) => {
    return axios.post(`${apiUrl}/projects/invite`, {
        projectId,
        email,
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error.response.data;
        });
}

export const removeMemberFromProject = async (projectId: string, memberId: string) => {
    return axios.delete(`${apiUrl}/projects/${projectId}/members/${memberId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error.response.data;
        });
}

export const getDocumentsOfProject = async (projectId: string): Promise<ProjectDocument[]> => {
    return axios.get(`${apiUrl}/projects/${projectId}/documents`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error.response.data;
        });
}

export const getStorageUsage = async (): Promise<StorageUsage> => {
    return axios.get(`${apiUrl}/projects/storage`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error.response.data;
        });
}

// The file goes straight to Cloudflare R2 through a presigned URL, never through our backend.
export const uploadDocumentToProject = async (projectId: string, file: File, onProgress?: (percent: number) => void) => {
    const { documentId, uploadUrl }: DocumentUploadResponse = await axios.post(`${apiUrl}/projects/${projectId}/documents/upload-url`, {
        documentName: file.name,
        mimetype: file.type,
        size: file.size,
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error.response.data;
        });

    await axios.put(uploadUrl, file, {
        headers: {
            "Content-Type": file.type
        },
        onUploadProgress: (event) => {
            if (onProgress && event.total)
                onProgress(Math.round((event.loaded * 100) / event.total));
        }
    })
        .catch(() => {
            throw { message: "L'envoi du fichier a échoué." };
        });

    return axios.post(`${apiUrl}/projects/${projectId}/documents/${documentId}/confirm`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error.response.data;
        });
}

export const getDocumentDownloadUrl = async (projectId: string, documentId: string): Promise<string> => {
    return axios.get(`${apiUrl}/projects/${projectId}/documents/${documentId}/download`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => response.data.url)
        .catch((error) => {
            throw error.response.data;
        });
}

export const getDocumentViewUrl = async (projectId: string, documentId: string): Promise<string> => {
    return axios.get(`${apiUrl}/projects/${projectId}/documents/${documentId}/view`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => response.data.url)
        .catch((error) => {
            throw error.response.data;
        });
}

export const deleteDocumentFromProject = async (projectId: string, documentId: string) => {
    return axios.delete(`${apiUrl}/projects/${projectId}/documents/${documentId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error.response.data;
        });
}
