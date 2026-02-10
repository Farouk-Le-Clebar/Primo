import axios from "axios";
import type {
    CreateProjectPayload,
    ProjectResponse,
    UpdateProjectPayload,
} from "../types/projectCreate";
import { getAuthHeaders } from "../utils/auth";

const apiUrl = window?._env_?.API_URL;


export const fetchProjects = (): Promise<ProjectResponse[]> => {
    return axios.get(`${apiUrl}/projects`, {
        headers: getAuthHeaders(),
    })
    .then(response => response.data)
    .catch(() => {
      throw new Error("Failed to fetch projects data");
    });
};


export const fetchProjectById = (id: string): Promise<ProjectResponse> => {
    return axios.get(`${apiUrl}/projects/${id}`, {
        headers: getAuthHeaders(),
    })
    .then(response => response.data)
    .catch(() => {
      throw new Error(`Failed to fetch project with id ${id}`);
    });
};


export const createProject = (data: CreateProjectPayload): Promise<ProjectResponse> => {
    return axios.post(`${apiUrl}/projects`, data, {
        headers: getAuthHeaders(),
    })
    .then(response => response.data)
    .catch(() => {
      throw new Error("Failed to create project");
    });
};


export const updateProject = (id: string, data: UpdateProjectPayload): Promise<ProjectResponse> => {
    return axios.patch(`${apiUrl}/projects/${id}`, data, {
        headers: getAuthHeaders(),
    })
    .then(response => response.data);
};


export const updateProjectNotes = (id: string, notes: string): Promise<ProjectResponse> => {
    return axios.patch(
        `${apiUrl}/projects/${id}/notes`,
        { notes },
        { headers: getAuthHeaders() },
    )
    .then(response => response.data);
};


export const updateProjectFavorite = (id: string, isFavorite: boolean): Promise<ProjectResponse> => {
    return axios.patch(
        `${apiUrl}/projects/${id}/favorite`,
        { isFavorite },
        { headers: getAuthHeaders() },
    )
    .then(response => response.data);
};


export const deleteProject = (id: string): Promise<void> => {
    return axios.delete(`${apiUrl}/projects/${id}`, {
        headers: getAuthHeaders(),
    })
    .then(() => undefined)
    .catch(() => {
      throw new Error(`Failed to delete project with id ${id}`);
    });
};


export const searchProjects = (search: string): Promise<ProjectResponse[]> => {
    return axios.get(`${apiUrl}/projects`, {
        headers: getAuthHeaders(),
        params: { search },
    })
    .then(response => response.data);
};


export const fetchFavoriteProjects = (): Promise<ProjectResponse[]> => {
    return axios.get(`${apiUrl}/projects`, {
        headers: getAuthHeaders(),
        params: { favorites: "true" },
    })
    .then(response => response.data);
};
