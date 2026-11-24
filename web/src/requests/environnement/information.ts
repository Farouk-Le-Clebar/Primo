import axios from "axios";
import type { ConnectiviteParcelle, ParcelPoint, PollutionParcelle } from "../../types/environnement";

const apiUrl = window?._env_?.API_URL || "http://localhost:3000";

const postEnvironnement = async <T>(route: string, point: ParcelPoint): Promise<T> => {
  const response = await axios.post<T>(`${apiUrl}/environnement/${route}`, point, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

export const getPollution = (point: ParcelPoint) => postEnvironnement<PollutionParcelle>("pollution", point);

export const getConnectivite = (point: ParcelPoint) => postEnvironnement<ConnectiviteParcelle>("connectivite", point);
