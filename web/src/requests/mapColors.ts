import axios from "axios";
import type { MapColors } from "../types/mapColors";

const apiUrl = window?._env_?.API_URL || import.meta.env.VITE_API_URL;

const getHeaders = () => {
    return {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
};

export const getMapColors = async (): Promise<MapColors> => {
    return axios
        .get(`${apiUrl}/map-colors`, getHeaders())
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error fetching map colors:", error);
            throw error;
        });
};

export const updateMapColors = async (colors: MapColors): Promise<MapColors> => {
    return axios
        .put(`${apiUrl}/map-colors`, colors, getHeaders())
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error updating map colors:", error);
            throw error;
        });
};

export const resetMapColors = async (): Promise<MapColors> => {
    return axios
        .delete(`${apiUrl}/map-colors`, getHeaders())
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error resetting map colors:", error);
            throw error;
        });
};
