import axios from "axios";

const apiUrl = window?._env_?.API_URL || "http://localhost:3000";

export const getDvfParcelle = async (idParcelle: string) => {
  try {
    const response = await axios.get(`${apiUrl}/dvf/parcelle/${idParcelle}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null; 
    }
    console.error(`❌ [DVF] Erreur de récupération pour ${idParcelle}`, error);
    throw error;
  }
};