import axios from "axios";
import type { GeoJSONData } from "../types/map.types";
import { apiCartoRequest } from "./apicarto";

const apiUrl = window?._env_?.API_URL || "http://localhost:3000";

export function fetchDepartements() {
  return axios
    .get<GeoJSONData>(`${apiUrl}/geo/departements`)
    .then((response) => response.data)
    .catch(() => {
      throw new Error("Failed to fetch departements data");
    });
}

export function fetchCommunes(departementCode: string) {
  return axios
    .get<GeoJSONData>(`${apiUrl}/geo/communes/${departementCode}`)
    .then((response) => response.data)
    .catch(() => {
      throw new Error(
        `Failed to fetch communes for departement ${departementCode}`
      );
    });
}

export function fetchDivisions(geomPolygon: object) {
  const geomParam = encodeURIComponent(JSON.stringify(geomPolygon));
  return apiCartoRequest(`api/cadastre/division?geom=${geomParam}`).catch(
    () => {
      throw new Error("Failed to fetch divisions data");
    }
  );
}

export function fetchParcelles(geomPolygon: object, limit = 1000) {
  const geomParam = encodeURIComponent(JSON.stringify(geomPolygon));
  return apiCartoRequest(
    `api/cadastre/parcelle?geom=${geomParam}&limit=${limit}`
  ).catch(() => {
    throw new Error("Failed to fetch parcelles data");
  });
}
