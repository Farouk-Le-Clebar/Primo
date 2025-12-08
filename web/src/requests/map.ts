import axios from "axios";
const apiUrl = window?._env_?.API_URL;

export const getCityByBbox = async (bbox: string) => {
    const params = new URLSearchParams({
        service: 'WFS',
        version: '2.0.0',
        request: 'GetFeature',
        typeName: 'primo:all_communes',
        outputFormat: 'application/json',
        srsName: 'EPSG:4326',
        bbox: `${bbox},EPSG:4326`
    });
    return axios
        .get(`${apiUrl}/geoserver/primo/wfs?${params}`)
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error fetching city data:", error);
            throw error;
        });
};

export const getDepartementByBbox = async (bbox: string) => {
    const params = new URLSearchParams({
        service: 'WFS',
        version: '2.0.0',
        request: 'GetFeature',
        typeName: 'primo:all_departements',
        outputFormat: 'application/json',
        srsName: 'EPSG:4326',
        bbox: `${bbox},EPSG:4326`
    });
    return axios
        .get(`${apiUrl}/geoserver/primo/wfs?${params}`)
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error fetching departement data:", error);
            throw error;
        });
};