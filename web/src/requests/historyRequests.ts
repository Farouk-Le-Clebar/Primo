import axios from "axios";
import type { ActivityHistoryPage } from "../types/project/projectHistory";
import { getAuthHeaders } from "../utils/auth";

const apiUrl = window?._env_?.API_URL;


export const fetchActivityHistory = (
  projectId: string,
  cursor?: string,
  limit = 20,
): Promise<ActivityHistoryPage> =>
  axios
    .get(`${apiUrl}/projects/${projectId}/activity-history`, {
      headers: getAuthHeaders(),
      params: {
        ...(cursor ? { cursor } : {}),
        limit,
      },
    })
    .then((r) => r.data as ActivityHistoryPage)
    .catch((err) => {
      const message =
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? "Impossible de charger l'historique"
          : "Impossible de charger l'historique";
      throw new Error(message);
    });
