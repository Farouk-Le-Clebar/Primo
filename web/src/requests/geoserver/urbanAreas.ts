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
  } else {
    throw new Error(`Type de géométrie non supporté: ${geometry.type}`);
  }
  return `SRID=4326;${wkt}`;
}

function getCentroidFromGeometry(geometry: any): { lat: number, lon: number } | null {
  try {
    let coords: number[] = [];
    if (geometry.type === 'Point') {
      coords = geometry.coordinates;
    } else if (geometry.type === 'Polygon') {
      coords = geometry.coordinates[0][0]; 
    } else if (geometry.type === 'MultiPolygon') {
      coords = geometry.coordinates[0][0][0];
    }

    if (coords && coords.length >= 2) {
      return { lon: coords[0], lat: coords[1] };
    }
    return null;
  } catch (e) {
    return null;
  }
}

function formatDepartementCode(dept: string): string {
  return dept.padStart(2, '0');
}

async function getNationalData(geometry: any) {
  const center = getCentroidFromGeometry(geometry);
  if (!center) return null;

  const wfsParams = new URLSearchParams({
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeName: 'wfs_du:zone_urba',
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
    CQL_FILTER: `INTERSECTS(the_geom,POINT(${center.lat} ${center.lon}))`,
    propertyName: 'partition,libelle,typezone,idurba,gpu_doc_id'
  });

  try {
    const res = await axios.get(`${NATIONAL_WFS_URL}?${wfsParams.toString()}`, { timeout: 8000 });
    
    if (res.data && res.data.features && res.data.features.length > 0) {
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
             destdomi: "Non défini"
           }
         }))
       };
    }
    return null;
  } catch (err) {
    console.warn("⚠️ [GPU] Échec API Nationale (Timeout ou Erreur). Passage au Local.");
    return null;
  }
}

async function getLocalData(geometry: any, departement: string) {
  const deptCode = formatDepartementCode(departement);
  const typeName = `primo:gpu_${deptCode}_zone_urba`;
  const wkt = convertGeoJSONToWKT(geometry);
  
  const params = new URLSearchParams({
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeName: typeName,
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
    CQL_FILTER: `INTERSECTS(geom, ${wkt})`
  });
  
  try {
    const response = await axios.get(`${apiUrl}/geoserver/primo/wfs?${params}`);
    
    const features = response.data?.features;
    
    if (features && features.length > 0) {
      features[0].properties._source = "LOCAL_GEOSERVER";
      return response.data;
    }
    
    return { features: [] };
  } catch (err) {
    console.error("❌ [GPU] Le GeoServer Local a aussi échoué.", err);
    return { features: [] };
  }
}

export const getZonesUrbaByGeometry = async (geometry: any, departement: string) => {
  const nationalData = await getNationalData(geometry);
  
  if (nationalData) {
    return nationalData;
  }

  return await getLocalData(geometry, departement);
};

export const getPrescriptionsSurfByGeometry = async (geometry: any, departement: string) => {
    const deptCode = formatDepartementCode(departement);
    const typeName = `primo:gpu_${deptCode}_prescription_surf`;
    const wkt = convertGeoJSONToWKT(geometry);
    const params = new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeName: typeName,
      outputFormat: 'application/json',
      srsName: 'EPSG:4326',
      CQL_FILTER: `INTERSECTS(geom, ${wkt})`
    });
    return axios.get(`${apiUrl}/geoserver/primo/wfs?${params}`).then(res => res.data);
};

export const getPrescriptionsLinByGeometry = async (geometry: any, departement: string) => {
    const deptCode = formatDepartementCode(departement);
    const typeName = `primo:gpu_${deptCode}_prescription_lin`;
    const wkt = convertGeoJSONToWKT(geometry);
    const params = new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeName: typeName,
      outputFormat: 'application/json',
      srsName: 'EPSG:4326',
      CQL_FILTER: `INTERSECTS(geom, ${wkt})`
    });
    return axios.get(`${apiUrl}/geoserver/primo/wfs?${params}`).then(res => res.data);
};

export const getPrescriptionsPctByGeometry = async (geometry: any, departement: string) => {
    const deptCode = formatDepartementCode(departement);
    const typeName = `primo:gpu_${deptCode}_prescription_pct`;
    const wkt = convertGeoJSONToWKT(geometry);
    const params = new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeName: typeName,
      outputFormat: 'application/json',
      srsName: 'EPSG:4326',
      CQL_FILTER: `INTERSECTS(geom, ${wkt})`
    });
    return axios.get(`${apiUrl}/geoserver/primo/wfs?${params}`).then(res => res.data);
};

export const getInfosSurfByGeometry = async (geometry: any, departement: string) => {
    const deptCode = formatDepartementCode(departement);
    const typeName = `primo:gpu_${deptCode}_info_surf`;
    const wkt = convertGeoJSONToWKT(geometry);
    const params = new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeName: typeName,
      outputFormat: 'application/json',
      srsName: 'EPSG:4326',
      CQL_FILTER: `INTERSECTS(geom, ${wkt})`
    });
    return axios.get(`${apiUrl}/geoserver/primo/wfs?${params}`).then(res => res.data);
};

export const getAllGpuDataByGeometry = async (geometry: any, departement: string) => {
  const deptCode = formatDepartementCode(departement);
  
  try {
    const [zones, prescSurf, prescLin, prescPct, infoSurf] = await Promise.allSettled([
      getZonesUrbaByGeometry(geometry, deptCode),
      getPrescriptionsSurfByGeometry(geometry, deptCode),
      getPrescriptionsLinByGeometry(geometry, deptCode),
      getPrescriptionsPctByGeometry(geometry, deptCode),
      getInfosSurfByGeometry(geometry, deptCode)
    ]);

    return {
      zones: zones.status === 'fulfilled' ? zones.value.features : [],
      prescriptionsSurf: prescSurf.status === 'fulfilled' ? prescSurf.value.features : [],
      prescriptionsLin: prescLin.status === 'fulfilled' ? prescLin.value.features : [],
      prescriptionsPct: prescPct.status === 'fulfilled' ? prescPct.value.features : [],
      informationsSurf: infoSurf.status === 'fulfilled' ? infoSurf.value.features : []
    };
  } catch (error) {
    console.error(`[GPU] Erreur requête agrégée ${deptCode}:`, error);
    throw error;
  }
};