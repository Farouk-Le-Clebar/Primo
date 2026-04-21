import axios from "axios";
import {
  apiUrl,
  NATIONAL_WFS_URL,
  convertGeoJSONToWKTWithSRID,
  getCentroidFromGeometry,
  formatDepartementCode,
} from "./_shared";

export const getZonesUrbaByGeometry = async (geometry: any, departement: string) => {
  const center = getCentroidFromGeometry(geometry);

  if (center) {
    const wfsParams = new URLSearchParams({
      service: "WFS",
      version: "2.0.0",
      request: "GetFeature",
      typeName: "wfs_du:zone_urba",
      outputFormat: "application/json",
      srsName: "EPSG:4326",
      CQL_FILTER: `INTERSECTS(the_geom,POINT(${center.lat} ${center.lon}))`,
      propertyName: "partition,libelle,typezone,idurba,gpu_doc_id",
    });
    try {
      const res = await axios.get(`${NATIONAL_WFS_URL}?${wfsParams.toString()}`, { timeout: 8000 });
      if (res.data?.features?.length > 0) {
        return {
          type: "FeatureCollection",
          features: res.data.features.map((f: any) => ({
            type: "Feature",
            geometry: null,
            properties: {
              _source: "NATIONAL_API",
              gpu_doc_id: f.properties.gpu_doc_id,
              partition: f.properties.partition,
              libelle: f.properties.libelle,
              typezone: f.properties.typezone,
              idurba: f.properties.idurba,
              destdomi: "Non défini",
            },
          })),
        };
      }
    } catch {}
  }

  const deptCode = formatDepartementCode(departement);
  const wkt = convertGeoJSONToWKTWithSRID(geometry);
  const params = new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    typeName: `primo:gpu_${deptCode}_zone_urba`,
    outputFormat: "application/json",
    srsName: "EPSG:4326",
    CQL_FILTER: `INTERSECTS(geom, ${wkt})`,
  });
  try {
    const response = await axios.get(`${apiUrl}/geoserver/primo/wfs?${params}`);
    return response.data || { features: [] };
  } catch {
    return { features: [] };
  }
};
