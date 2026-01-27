import axios from "axios";

const apiUrl = window?._env_?.API_URL || "http://localhost:3000";

export interface PoiFeature {
  type: "Feature";
  id: string;
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [lon, lat]
  };
  properties: {
    osm_id: string;
    name: string;
    type: string;
    category: string;
    tags: Record<string, any>;
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
  category: string;
  lat: number;
  lon: number;
  tags?: Record<string, any>;
}

export const getPoisByBbox = async (
  bbox: string,
  types?: string[],
  zoom?: number
): Promise<Poi[]> => {
  try {
    const params = new URLSearchParams({
      bbox,
    });

    if (types && types.length > 0) {
      params.append("types", types.join(","));
    }

    if (zoom) {
      params.append("zoom", zoom.toString());
    }

    const response = await axios.get<PoiFeatureCollection>(
      `${apiUrl}/geo/pois?${params}`
    );

    return convertFeaturesToPois(response.data);
  } catch (error) {
    console.error("Error fetching POI data:", error);
    return [];
  }
};

export const getAvailablePoiTypes = async (): Promise<
  Array<{ type: string; category: string; count: number }>
> => {
  try {
    const response = await axios.get(`${apiUrl}/geo/pois/types`);
    return response.data;
  } catch (error) {
    console.error("Error fetching POI types:", error);
    return [];
  }
};

function convertFeaturesToPois(featureCollection: PoiFeatureCollection): Poi[] {
  if (!featureCollection.features) {
    return [];
  }

  return featureCollection.features
    .filter((feature) => {
      const name = feature.properties?.name;
      return name && name !== "null" && name.trim() !== "";
    })
    .map((feature) => ({
      id: feature.properties.osm_id || feature.id,
      name: feature.properties.name,
      type: feature.properties.type,
      category: feature.properties.category,
      lat: feature.geometry.coordinates[1], // GeoJSON: [lon, lat] donc attention à l'ordre
      lon: feature.geometry.coordinates[0],
      tags: feature.properties.tags,
    }));
}