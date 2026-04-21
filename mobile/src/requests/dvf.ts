import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

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
