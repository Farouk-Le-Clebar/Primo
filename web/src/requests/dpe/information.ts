import axios from "axios";

const apiUrl = window?._env_?.API_URL || "http://localhost:3000";

export const getDpeBan = async (identifiantBan: string) => {
  try {
    const response = await axios.get(`${apiUrl}/dpe/ban/${identifiantBan}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null; 
    }
    console.error(`❌ [DPE] Erreur serveur pour le BAN ${identifiantBan}`, error);
    throw error;
  }
};