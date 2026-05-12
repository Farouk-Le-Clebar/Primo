import axios from "axios";
import type { AddPlotToProjectPayload } from "../types/project/plots";
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