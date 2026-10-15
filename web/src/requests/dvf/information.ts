import axios from "axios";

const apiUrl = window?._env_?.API_URL || "http://localhost:3000";

export const getDvfParcelle = async (idParcelle: string) => {
  try {
    const response = await axios.get(`${apiUrl}/dvf/parcelle/${idParcelle}`, {
      validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
    });
    if (response.status === 404) {
      return null;
    }
    return response.data;
  } catch (error: any) {
    console.error(`[DVF] Erreur de récupération pour ${idParcelle}`, error);
    throw error;
  }
};