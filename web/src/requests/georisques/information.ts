import axios from "axios";

const apiUrl = window?._env_?.API_URL;

export const getGeorisquesByInsee = async (
  insee: string,
  departement: string
) => {
  const typeNames = `primo:georisques_${departement}`;

  const params = new URLSearchParams({
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeName: typeNames,
    outputFormat: 'application/json',
    CQL_FILTER: `code_insee='${insee}'` 
  });

  return axios
    .get(`${apiUrl}/geoserver/primo/wfs?${params}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Erreur WFS Géorisques:", error);
      throw error;
    });
};