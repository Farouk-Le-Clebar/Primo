import axios from "axios";
import { POI_CONFIGS } from "../pages/map/components/PoiConfig";

const apiUrl = window?._env_?.API_URL;

export interface PoiFeature {
  type: "Feature";
  id: string;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    id: number;
    osm_id: number;
    type: string; // code du type, ex: "pharmacie", "hopital"
    category: string; // grande famille, ex: "sante", "culture"
    label: string; // libellé humain du type
    name: string | null;
    address: string | null;
    housenumber: string | null;
    street: string | null;
    postcode: string | null;
    city: string | null;
    phone: string | null;
    website: string | null;
    opening_hours: string | null;
    tags: Record<string, any> | string; // tags OSM bruts (fallback), jsonb -> peut arriver en string selon le client WFS
  };
}

export interface PoiFeatureCollection {
  type: "FeatureCollection";
  features: PoiFeature[];
  totalFeatures?: number;
  numberReturned?: number;
}

export interface Poi {
  id: string;
  name: string;
  type: string;
  famille: string;
  lat: number;
  lon: number;
  address?: string | null;
  tags?: Record<string, any>;
}

const GEOSERVER_WORKSPACE = "bdtopo";
const GEOSERVER_LAYER = "pois_france_v2";

/**
 * Récupère les infrastructures dans une bbox donnée, filtrées par type,
 * directement depuis la couche WFS GeoServer.
 *
 * @param bbox "minLon,minLat,maxLon,maxLat"
 * @param types codes de types à inclure (ex: ["pharmacie", "hopital"]) — vide/absent = tous les types
 * @param maxFeatures nombre max de features renvoyées par GeoServer
 */
export const getPoisByBbox = async (
  bbox: string,
  types?: string[],
  maxFeatures: number = 200,
): Promise<PoiFeatureCollection> => {
  const params = new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    typeName: `${GEOSERVER_WORKSPACE}:${GEOSERVER_LAYER}`,
    outputFormat: "application/json",
    srsName: "EPSG:4326",
    maxFeatures: maxFeatures.toString(),
  });

  const [minLon, minLat, maxLon, maxLat] = bbox.split(",");
  const bboxFilter = `BBOX(geom,${minLon},${minLat},${maxLon},${maxLat},'EPSG:4326')`;

  let cqlFilter = bboxFilter;
  if (types && types.length > 0) {
    const typeFilter = types.map((type) => `type='${type}'`).join(" OR ");
    cqlFilter = `${bboxFilter} AND (${typeFilter})`;
  }

  params.append("cql_filter", cqlFilter);

  return axios
    .get<PoiFeatureCollection>(`${apiUrl}/geoserver/${GEOSERVER_WORKSPACE}/wfs?${params}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching POI data:", error);
      throw error;
    });
};

/**
 * Types d'infrastructures disponibles.
 * (généré depuis poi-types.csv /back)
 */
export const getAvailablePoiTypes = (): Array<{
  type: string;
  famille: string;
  label: string;
}> =>
  Object.values(POI_CONFIGS).map((config) => ({
    type: config.type,
    famille: config.famille,
    label: config.label,
  }));

export function convertFeaturesToPois(featureCollection: PoiFeatureCollection): Poi[] {
  if (!featureCollection.features) {
    return [];
  }

  return featureCollection.features
    .filter((feature) => {
      const name = feature.properties?.name;
      return name && name !== "null" && name.trim() !== "";
    })
    .map((feature) => ({
      id: String(feature.properties.id ?? feature.properties.osm_id ?? feature.id),
      name: feature.properties.name as string,
      type: feature.properties.type,
      famille: feature.properties.category,
      lat: feature.geometry.coordinates[1], // GeoJSON: [lon, lat] donc attention à l'ordre
      lon: feature.geometry.coordinates[0],
      address: feature.properties.address,
      tags:
        typeof feature.properties.tags === "string"
          ? safeParseTags(feature.properties.tags)
          : feature.properties.tags,
    }));
}

function safeParseTags(raw: string): Record<string, any> {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}