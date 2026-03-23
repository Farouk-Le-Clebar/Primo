import axios from "axios";

const apiUrl = window?._env_?.API_URL;
const NATIONAL_WFS_URL = "https://data.geopf.fr/wfs/ows";

function convertGeoJSONToWKT(geometry: any): string {
  let wkt = '';
  if (geometry.type === 'MultiPolygon') {
    const polygons = geometry.coordinates.map((polygon: number[][][]) => {
      const rings = polygon.map((ring: number[][]) => {
        const coords = ring.map((coord: number[]) => `${coord[0]} ${coord[1]}`).join(', ');
        return `(${coords})`;
      }).join(', ');
      return `(${rings})`;
    }).join(', ');
    wkt = `MULTIPOLYGON(${polygons})`;
  } else if (geometry.type === 'Polygon') {
    const rings = geometry.coordinates.map((ring: number[][]) => {
      const coords = ring.map((coord: number[]) => `${coord[0]} ${coord[1]}`).join(', ');
      return `(${coords})`;
    }).join(', ');
    wkt = `POLYGON(${rings})`;
  } else if (geometry.type === 'Point') {
    wkt = `POINT(${geometry.coordinates[0]} ${geometry.coordinates[1]})`;
  }
  return `SRID=4326;${wkt}`;
}

function getCentroidFromGeometry(geometry: any): { lat: number, lon: number } | null {
  try {
    let coords: number[] = [];
    if (geometry.type === 'Point') coords = geometry.coordinates;
    else if (geometry.type === 'Polygon') coords = geometry.coordinates[0][0]; 
    else if (geometry.type === 'MultiPolygon') coords = geometry.coordinates[0][0][0];

    if (coords && coords.length >= 2) return { lon: coords[0], lat: coords[1] };
    return null;
  } catch (e) { return null; }
}

function formatDepartementCode(dept: string): string {
  return dept.padStart(2, '0');
}

interface FetchConfig {
  nationalLayer: string; 
  localSuffix: string;   
}

async function fetchPrescriptionLayer(
  geometry: any, 
  departement: string,
  config: FetchConfig
) {
  const center = getCentroidFromGeometry(geometry);
  const deptCode = formatDepartementCode(departement);
  
  if (center) {
    const wfsParams = new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeName: config.nationalLayer,
      outputFormat: 'application/json',
      srsName: 'EPSG:4326',
      CQL_FILTER: `INTERSECTS(the_geom,POINT(${center.lat} ${center.lon}))`
    });

    try {
      const res = await axios.get(`${NATIONAL_WFS_URL}?${wfsParams.toString()}`, { timeout: 6000 });
      
      if (res.data && res.data.features && res.data.features.length > 0) {
        return res.data.features.map((f: any) => ({
            type: "Feature",
            geometry: null,
            properties: { 
              ...f.properties, 
              _source: "NATIONAL_API" 
            }
        }));
      }
    } catch (err) {
      console.error(`❌ [Prescription] Erreur National ${config.nationalLayer}`, err);
    }
  }

  const localTypeName = `primo:gpu_${deptCode}_${config.localSuffix}`;
  const wkt = convertGeoJSONToWKT(geometry);
  
  const localParams = new URLSearchParams({
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeName: localTypeName,
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
    CQL_FILTER: `INTERSECTS(geom, ${wkt})`
  });

  try {
    const response = await axios.get(`${apiUrl}/geoserver/primo/wfs?${localParams}`);
    const features = response.data?.features || [];
    features.forEach((f: any) => f.properties._source = "LOCAL_GEOSERVER");
    return features;
  } catch (err) {
    console.error(`❌ [Prescription] Erreur Local ${localTypeName}`, err);
    return [];
  }
}

export const getPrescriptionsSurf = async (geometry: any, departement: string) => {
  return fetchPrescriptionLayer(geometry, departement, {
    nationalLayer: 'wfs_du:prescription_surf',
    localSuffix: 'prescription_surf'
  });
};

export const getPrescriptionsLin = async (geometry: any, departement: string) => {
  return fetchPrescriptionLayer(geometry, departement, {
    nationalLayer: 'wfs_du:prescription_lin',
    localSuffix: 'prescription_lin'
  });
};

export const getPrescriptionsPct = async (geometry: any, departement: string) => {
  return fetchPrescriptionLayer(geometry, departement, {
    nationalLayer: 'wfs_du:prescription_pct',
    localSuffix: 'prescription_pct'
  });
};