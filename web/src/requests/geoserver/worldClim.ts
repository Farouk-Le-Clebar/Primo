import axios from "axios";

const apiUrl = window?._env_?.API_URL;

const VALID_DATA_FILTER = "temp_moy_annuelle > -1000 AND temp_moy_annuelle < 1000";

export const getMeteoByGeometry = async (
  geometry: any,
  departement: string
) => {
  const typeName = `primo:meteo_dept_${departement}`;
  const wkt = convertGeoJSONToWKT(geometry);

  const params = new URLSearchParams({
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeName: typeName,
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
    CQL_FILTER: `INTERSECTS(geom, ${wkt}) AND ${VALID_DATA_FILTER}`
  });

  return axios
    .get(`${apiUrl}/geoserver/primo/wfs?${params}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching buildings data:", error);
      throw error;
    });
};

export const getMeteoByBboxFromGeometry = async (
  geometry: any,
  departement: string
) => {
  const typeName = `primo:meteo_dept_${departement}`;
  
  const bbox = getBboxFromGeometry(geometry, 0.45);
  
  const params = new URLSearchParams({
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeName: typeName,
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
    CQL_FILTER: `BBOX(geom,${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng}) AND ${VALID_DATA_FILTER}`
  });

  const url = `${apiUrl}/geoserver/primo/wfs?${params}`;
  return axios
    .get(url)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching meteo data:", error);
      throw error;
    });
};

function getBboxFromGeometry(geometry: any, margin: number = 0) {
  let minLng = Infinity, maxLng = -Infinity;
  let minLat = Infinity, maxLat = -Infinity;

  const processCoords = (coords: number[]) => {
    const [lng, lat] = coords;
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  };

  const flatten = (arr: any): void => {
    if (typeof arr[0] === 'number') {
      processCoords(arr);
    } else {
      arr.forEach(flatten);
    }
  };

  flatten(geometry.coordinates);

  return {
    minLng: minLng - margin,
    maxLng: maxLng + margin,
    minLat: minLat - margin,
    maxLat: maxLat + margin
  };
}

export const getAverageMeteoForParcel = async (
  geometry: any,
  departement: string
): Promise<MeteoData | null> => {
  const data = await getMeteoByBboxFromGeometry(geometry, departement);
  
  if (!data?.features || data.features.length === 0) {
    return null;
  }
  const features = data.features;
  const count = features.length;

  const sum: Partial<MeteoData> = {};
  const meteoKeys: (keyof MeteoData)[] = [
    'temp_moy_annuelle', 'temp_max_annuelle', 'temp_min_annuelle',
    'temp_moy_ete', 'temp_max_ete', 'temp_min_ete', 'temp_max_abs_ete',
    'temp_moy_hiver', 'temp_max_hiver', 'temp_min_hiver', 'temp_min_abs_hiver',
    'prec_annuelles', 'prec_max_mensuel', 'prec_min_mensuel',
    'prec_ete_total', 'prec_ete_moy', 'prec_hiver_total', 'prec_hiver_moy'
  ];

  meteoKeys.forEach(key => { sum[key] = 0; });

  features.forEach((feature: any) => {
    const props = feature.properties;
    meteoKeys.forEach(key => {
      if (props[key] != null && !isNaN(props[key])) {
        sum[key]! += props[key];
      }
    });
  });

  const average: MeteoData = {} as MeteoData;
  meteoKeys.forEach(key => {
    average[key] = Math.round((sum[key]! / count) * 100) / 100;
  });

  return average;
};

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

export const METEO_LABELS: Record<keyof MeteoData, string> = {
  temp_moy_annuelle: 'Température moyenne annuelle',
  temp_max_annuelle: 'Température max annuelle',
  temp_min_annuelle: 'Température min annuelle',
  temp_moy_ete: 'Température moyenne été',
  temp_max_ete: 'Température max été',
  temp_min_ete: 'Température min été',
  temp_max_abs_ete: 'Température max absolue été',
  temp_moy_hiver: 'Température moyenne hiver',
  temp_max_hiver: 'Température max hiver',
  temp_min_hiver: 'Température min hiver',
  temp_min_abs_hiver: 'Température min absolue hiver',
  prec_annuelles: 'Précipitations annuelles',
  prec_max_mensuel: 'Précipitations max mensuel',
  prec_min_mensuel: 'Précipitations min mensuel',
  prec_ete_total: 'Précipitations été total',
  prec_ete_moy: 'Précipitations été moyenne',
  prec_hiver_total: 'Précipitations hiver total',
  prec_hiver_moy: 'Précipitations hiver moyenne',
};

export const METEO_UNITS: Record<keyof MeteoData, string> = {
  temp_moy_annuelle: '°C',
  temp_max_annuelle: '°C',
  temp_min_annuelle: '°C',
  temp_moy_ete: '°C',
  temp_max_ete: '°C',
  temp_min_ete: '°C',
  temp_max_abs_ete: '°C',
  temp_moy_hiver: '°C',
  temp_max_hiver: '°C',
  temp_min_hiver: '°C',
  temp_min_abs_hiver: '°C',
  prec_annuelles: 'mm',
  prec_max_mensuel: 'mm',
  prec_min_mensuel: 'mm',
  prec_ete_total: 'mm',
  prec_ete_moy: 'mm',
  prec_hiver_total: 'mm',
  prec_hiver_moy: 'mm',
};

function convertGeoJSONToWKT(geometry: any): string {
  if (geometry.type === 'MultiPolygon') {
    const polygons = geometry.coordinates.map((polygon: number[][][]) => {
      const rings = polygon.map((ring: number[][]) => {
        const coords = ring.map(([lng, lat]) => `${lng} ${lat}`).join(', ');
        return `(${coords})`;
      }).join(', ');
      return `(${rings})`;
    }).join(', ');
    
    return `MULTIPOLYGON(${polygons})`;
  } else if (geometry.type === 'Polygon') {
    const rings = geometry.coordinates.map((ring: number[][]) => {
      const coords = ring.map(([lng, lat]: [number, number]) => `${lng} ${lat}`).join(', ');
      return `(${coords})`;
    }).join(', ');
    
    return `POLYGON(${rings})`;
  } else if (geometry.type === 'Point') {
    const [lng, lat] = geometry.coordinates;
    return `POINT(${lng} ${lat})`;
  }
  
  throw new Error(`Type de géométrie non supporté: ${geometry.type}`);
}