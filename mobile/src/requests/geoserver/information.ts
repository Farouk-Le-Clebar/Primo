import axios from "axios";
import {
  apiUrl,
  NATIONAL_WFS_URL,
  convertGeoJSONToWKTWithSRID,
  getCentroidFromGeometry,
  formatDepartementCode,
} from "./_shared";

async function fetchLayer(
  geometry: any,
  departement: string,
  nationalLayer: string,
  localSuffix: string,
) {
  const center = getCentroidFromGeometry(geometry);
  const deptCode = formatDepartementCode(departement);

  if (center) {
    const wfsParams = new URLSearchParams({
      service: "WFS",
      version: "2.0.0",
      request: "GetFeature",
      typeName: nationalLayer,
      outputFormat: "application/json",
      srsName: "EPSG:4326",
      CQL_FILTER: `INTERSECTS(the_geom,POINT(${center.lat} ${center.lon}))`,
    });
    try {
      const res = await axios.get(`${NATIONAL_WFS_URL}?${wfsParams.toString()}`, { timeout: 6000 });
      if (res.data?.features?.length > 0) {
        return res.data.features.map((f: any) => ({
          type: "Feature",
          geometry: null,
          properties: { ...f.properties, _source: "NATIONAL_API" },
        }));
      }
    } catch {}
  }

  const wkt = convertGeoJSONToWKTWithSRID(geometry);
  const localParams = new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    typeName: `primo:gpu_${deptCode}_${localSuffix}`,
    outputFormat: "application/json",
    srsName: "EPSG:4326",
    CQL_FILTER: `INTERSECTS(geom, ${wkt})`,
  });
  try {
    const response = await axios.get(`${apiUrl}/geoserver/primo/wfs?${localParams}`);
    const features = response.data?.features || [];
    features.forEach((f: any) => (f.properties._source = "LOCAL_GEOSERVER"));
    return features;
  } catch {
    return [];
  }
}

export const getInformationsSurf = (geometry: any, dept: string) =>
  fetchLayer(geometry, dept, "wfs_du:info_surf", "info_surf");

export const getInformationsLin = (geometry: any, dept: string) =>
  fetchLayer(geometry, dept, "wfs_du:info_lin", "info_lin");

export const getInformationsPct = (geometry: any, dept: string) =>
  fetchLayer(geometry, dept, "wfs_du:info_pct", "info_pct");
