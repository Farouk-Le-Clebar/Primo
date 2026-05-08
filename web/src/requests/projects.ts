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