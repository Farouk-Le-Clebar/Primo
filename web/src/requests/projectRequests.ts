import axios from "axios";

const apiUrl = window?._env_?.API_URL;

function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
    };
}

// ---- Types ----

export interface CreateProjectPayload {
    name: string;
    isFavorite?: boolean;
    notes?: string;
}

export interface UpdateProjectPayload {
    name?: string;
    isFavorite?: boolean;
    notes?: string;
    parcels?: Array<{
        id: string;
        coordinates: [number, number];
        properties?: Record<string, any>;
    }>;
    parameters?: Record<string, any>;
}

export interface ProjectResponse {
    id: string;
    name: string;
    isFavorite: boolean;
    notes: string | null;
    parcels: Array<{
        id: string;
        coordinates: [number, number];
        properties?: Record<string, any>;
    }> | null;
    parameters: Record<string, any> | null;
    userId: string;
    createdAt: string;
    modifiedAt: string;
}

// ---- API Calls ----

export const fetchProjects = async (): Promise<ProjectResponse[]> => {
    const response = await axios.get(`${apiUrl}/projects`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const fetchProjectById = async (
    id: string,
): Promise<ProjectResponse> => {
    const response = await axios.get(`${apiUrl}/projects/${id}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const createProject = async (
    data: CreateProjectPayload,
): Promise<ProjectResponse> => {
    const response = await axios.post(`${apiUrl}/projects`, data, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const updateProject = async (
    id: string,
    data: UpdateProjectPayload,
): Promise<ProjectResponse> => {
    const response = await axios.patch(`${apiUrl}/projects/${id}`, data, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const updateProjectNotes = async (
    id: string,
    notes: string,
): Promise<ProjectResponse> => {
    const response = await axios.patch(
        `${apiUrl}/projects/${id}/notes`,
        { notes },
        { headers: getAuthHeaders() },
    );
    return response.data;
};

export const updateProjectFavorite = async (
    id: string,
    isFavorite: boolean,
): Promise<ProjectResponse> => {
    const response = await axios.patch(
        `${apiUrl}/projects/${id}/favorite`,
        { isFavorite },
        { headers: getAuthHeaders() },
    );
    return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
    await axios.delete(`${apiUrl}/projects/${id}`, {
        headers: getAuthHeaders(),
    });
};

export const searchProjects = async (
    search: string,
): Promise<ProjectResponse[]> => {
    const response = await axios.get(`${apiUrl}/projects`, {
        headers: getAuthHeaders(),
        params: { search },
    });
    return response.data;
};

export const fetchFavoriteProjects = async (): Promise<ProjectResponse[]> => {
    const response = await axios.get(`${apiUrl}/projects`, {
        headers: getAuthHeaders(),
        params: { favorites: "true" },
    });
    return response.data;
};
