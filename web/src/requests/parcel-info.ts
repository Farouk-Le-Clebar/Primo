import axios from "axios";

const apiUrl = window?._env_?.API_URL;

export const getBuildingsByGeometry = async (
  geometry: any, 
  departement: string
) => {
  const typeNames = `primo:batiment_${departement}`;

  const wkt = convertGeoJSONToWKT(geometry);

  const params = new URLSearchParams({
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeName: typeNames,
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
    CQL_FILTER: `INTERSECTS(geom, ${wkt})`
  });

  return axios
    .get(`${apiUrl}/geoserver/primo/wfs?${params}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching buildings data:", error);
      throw error;
    });
};

function convertGeoJSONToWKT(geometry: any): string {
  if (geometry.type === 'MultiPolygon') {
    const polygons = geometry.coordinates.map((polygon: number[][][]) => {
      const rings = polygon.map((ring: number[][]) => {
        const coords = ring.map(([lng, lat]) => `${lat} ${lng}`).join(', ');
        return `(${coords})`;
      }).join(', ');
      return `(${rings})`;
    }).join(', ');
    
    return `MULTIPOLYGON(${polygons})`;
  } else if (geometry.type === 'Polygon') {
    const rings = geometry.coordinates.map((ring: number[][]) => {
      const coords = ring.map(([lng, lat]: [number, number]) => `${lat} ${lng}`).join(', ');
      return `(${coords})`;
    }).join(', ');
    
    return `POLYGON(${rings})`;
  }
  
  throw new Error(`Type de géométrie non supporté: ${geometry.type}`);
}