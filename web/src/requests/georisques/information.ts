import axios from "axios";

const apiUrl = window?._env_?.API_URL || "http://localhost:3000";
const token = localStorage.getItem("token");

export const getGeorisquesByInsee = async (
  insee: string,
  departement: string
) => {
  const typeNames = `primo:georisques_${departement}`;

  const params = new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    typeName: typeNames,
    outputFormat: "application/json",
    CQL_FILTER: `code_insee='${insee}'`,
  });

  try {
    const response = await axios.get(
      `${apiUrl}/geoserver/primo/wfs?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erreur WFS Géorisques:", error);
    throw error;
  }
};