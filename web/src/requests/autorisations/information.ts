import axios from "axios";

const apiUrl = window?._env_?.API_URL || "http://localhost:3000";

export type AutorisationUrbanisme = Record<string, unknown>;

export const getAutorisationsParcelle = async (idParcelle: string) => {
  try {
    const response = await axios.get<AutorisationUrbanisme[]>(
      `${apiUrl}/autorisations/parcelle/${encodeURIComponent(idParcelle)}`,
    );

    if (!Array.isArray(response.data)) {
      throw new Error("La réponse doit contenir une liste d’autorisations.");
    }

    console.log(`[Autorisations] Données récupérées pour ${idParcelle} :`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[Autorisations] Erreur de récupération pour ${idParcelle}`, error);
    throw error;
  }
};
