import axios from "axios";
import type { Geometry } from "geojson";

const apiUrl = window?._env_?.API_URL || "http://localhost:3000";

const postHabitat = async <T>(route: string, idParcelle: string, geometry: Geometry): Promise<T> => {
  const response = await axios.post<T>(
    `${apiUrl}/habitat/${route}`,
    { idParcelle, geometry },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
  );
  return response.data;
};

export const getCoproprietes = <T>(idParcelle: string, geometry: Geometry) =>
  postHabitat<T>("coproprietes", idParcelle, geometry);

export const getLogementsSociaux = <T>(idParcelle: string, geometry: Geometry) =>
  postHabitat<T>("logements-sociaux", idParcelle, geometry);

export const getLoyers = <T>(idParcelle: string, geometry: Geometry) =>
  postHabitat<T>("loyers", idParcelle, geometry);
