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

export const getParcellesByBboxAndDepartments = async (bbox: string, departments: string[]) => {
    const promises = departments.map(dept => {
        const layerName = `primo:parcelles_${dept}`;
        const params = new URLSearchParams({
            service: 'WFS',
            version: '2.0.0',
            request: 'GetFeature',
            typeName: layerName,
            outputFormat: 'application/json',
            srsName: 'EPSG:4326',
            bbox: `${bbox},EPSG:4326`
        });

        return axios
            .get(`${apiUrl}/geoserver/primo/wfs?${params}`)
            .then((response) => response.data)
            .catch((error) => {
                console.warn(`No parcelles found for department ${dept}:`, error);
                return null;
            });
    });

    const results = await Promise.all(promises);

    const allFeatures = results
        .filter(result => result?.features)
        .flatMap(result => result.features);

    return {
        type: 'FeatureCollection',
        features: allFeatures
    };
};

export const getDivisionsByBboxAndDepartments = async (bbox: string, departments: string[]) => {
    const promises = departments.map(dept => {
        const layerName = `primo:sections_${dept}`;
        const params = new URLSearchParams({
            service: 'WFS',
            version: '2.0.0',
            request: 'GetFeature',
            typeName: layerName,
            outputFormat: 'application/json',
            srsName: 'EPSG:4326',
            bbox: `${bbox},EPSG:4326`
        });

        return axios
            .get(`${apiUrl}/geoserver/primo/wfs?${params}`)
            .then((response) => response.data)
            .catch((error) => {
                console.warn(`No divisions found for department ${dept}:`, error);
                return null;
            });
    });

    const results = await Promise.all(promises);

    const allFeatures = results
        .filter(result => result?.features)
        .flatMap(result => result.features);

    return {
        type: 'FeatureCollection',
        features: allFeatures
    };
};