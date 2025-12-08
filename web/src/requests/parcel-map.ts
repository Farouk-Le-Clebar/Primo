import axios from "axios";
import { apiCartoRequest } from "./apicarto";
import type { FeatureCollection } from 'geojson';

const apiUrl = window?._env_?.API_URL || "http://localhost:3000";

export function fetchDepartements() {
  return axios.get<FeatureCollection>(`${apiUrl}/geo/departements`)
    .then((response) => response.data)
    .catch(() => {
      throw new Error("Failed to fetch departements data");
    });
}

export function fetchCommunes(departementCode: string) {
  return axios
    .get<FeatureCollection>(`${apiUrl}/geo/communes/${departementCode}`)
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

export function fetchCity(geomPolygon: object, limit = 500) {
  const geomParam = encodeURIComponent(JSON.stringify(geomPolygon));
  return apiCartoRequest(
    `api/cadastre/commune?geom=${geomParam}&limit=${limit}`
  ).catch(() => {
    throw new Error("Failed to fetch parcelles data");
  });
}
