import axios from "axios";

const apiUrl = window?._env_?.API_URL || "http://localhost:3000";

export const getDpeBan = async (identifiantBan: string) => {
  console.log(`🔍 [DPE] Interrogation de la base pour le BAN : ${identifiantBan}`);
  try {
    const response = await axios.get(`${apiUrl}/dpe/ban/${identifiantBan}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.log(`ℹ️ [DPE] Aucun DPE trouvé pour le BAN ${identifiantBan}`);
      return null; 
    }
    console.error(`❌ [DPE] Erreur serveur pour le BAN ${identifiantBan}`, error);
    throw error;
  }
};