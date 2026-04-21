import axios from "axios";
import { apiUrl, convertGeoJSONToWKT } from "./_shared";

export const getBuildingsByGeometry = async (geometry: any, departement: string) => {
  const typeNames = `primo:batiment_${departement}`;
  const wkt = convertGeoJSONToWKT(geometry);

  const params = new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    typeName: typeNames,
    outputFormat: "application/json",
    srsName: "EPSG:4326",
    CQL_FILTER: `INTERSECTS(geom, ${wkt})`,
  });

  return axios
    .get(`${apiUrl}/geoserver/primo/wfs?${params}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching buildings data:", error);
      throw error;
    });
};
