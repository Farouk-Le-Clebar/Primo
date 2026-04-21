import axios from "axios";
import { apiUrl, getBboxFromGeometry } from "./_shared";

export interface MeteoData {
  temp_moy_annuelle: number;
  temp_max_annuelle: number;
  temp_min_annuelle: number;
  temp_moy_ete: number;
  temp_max_ete: number;
  temp_min_ete: number;
  temp_max_abs_ete: number;
  temp_moy_hiver: number;
  temp_max_hiver: number;
  temp_min_hiver: number;
  temp_min_abs_hiver: number;
  prec_annuelles: number;
  prec_max_mensuel: number;
  prec_min_mensuel: number;
  prec_ete_total: number;
  prec_ete_moy: number;
  prec_hiver_total: number;
  prec_hiver_moy: number;
}

const VALID_DATA_FILTER = "temp_moy_annuelle > -1000 AND temp_moy_annuelle < 1000";

const METEO_KEYS: (keyof MeteoData)[] = [
  "temp_moy_annuelle", "temp_max_annuelle", "temp_min_annuelle",
  "temp_moy_ete", "temp_max_ete", "temp_min_ete", "temp_max_abs_ete",
  "temp_moy_hiver", "temp_max_hiver", "temp_min_hiver", "temp_min_abs_hiver",
  "prec_annuelles", "prec_max_mensuel", "prec_min_mensuel",
  "prec_ete_total", "prec_ete_moy", "prec_hiver_total", "prec_hiver_moy",
];

export const getAverageMeteoForParcel = async (
  geometry: any,
  departement: string,
): Promise<MeteoData | null> => {
  const typeName = `primo:meteo_dept_${departement}`;
  const bbox = getBboxFromGeometry(geometry, 0.45);

  const params = new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    typeName,
    outputFormat: "application/json",
    srsName: "EPSG:4326",
    CQL_FILTER: `BBOX(geom,${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng}) AND ${VALID_DATA_FILTER}`,
  });

  const data = await axios
    .get(`${apiUrl}/geoserver/primo/wfs?${params}`)
    .then((r) => r.data)
    .catch(() => null);

  if (!data?.features || data.features.length === 0) return null;

  const features = data.features;
  const count = features.length;
  const sum: Partial<MeteoData> = {};
  METEO_KEYS.forEach((key) => { sum[key] = 0; });

  features.forEach((feature: any) => {
    const props = feature.properties;
    METEO_KEYS.forEach((key) => {
      if (props[key] != null && !isNaN(props[key])) (sum[key] as number) += props[key];
    });
  });

  const average: MeteoData = {} as MeteoData;
  METEO_KEYS.forEach((key) => {
    average[key] = Math.round((sum[key]! / count) * 100) / 100;
  });

  return average;
};
