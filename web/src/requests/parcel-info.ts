import axios from "axios";

// const apiUrl = window?._env_?.API_URL;
const apiUrl = window?._env_?.API_URL;

export const getBuildingsByBbox = async (bbox: string, departement: string) => {
  const typeNames = `primo:batiment_${departement}`;

  
  const params = new URLSearchParams({
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeName: typeNames,
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
    bbox: `${bbox},EPSG:4326`
  });

  return axios
    .get(`${apiUrl}/geoserver/primo/wfs?${params}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching buildings data:", error);
      throw error;
    });
};