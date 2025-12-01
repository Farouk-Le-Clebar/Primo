import axios from "axios";
const apiUrl = window?._env_?.API_URL;

export const boundsToGeoJSON = (bounds: L.LatLngBounds) => {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();

  return {
    type: "Polygon",
    coordinates: [[
      [sw.lng, sw.lat],
      [ne.lng, sw.lat],
      [ne.lng, ne.lat],
      [sw.lng, ne.lat],
      [sw.lng, sw.lat]
    ]]
  };
};

export function apiCartoRequest(data: string) {
  return axios
    .get(apiUrl + `/apicarto/${data}`)
    .then((response) => response.data)
    .catch(() => {
      throw new Error("Failed to fetch data from ApiCarto API");
    });
}

export function zoneUrba(data: L.LatLngBounds) {
  const geoJSON = boundsToGeoJSON(data);
  return axios
    .get(apiUrl + `/apicarto/api/gpu/zone-urba?geom=${JSON.stringify(geoJSON)}`)
    .then((response) => response.data)
    .catch(() => {
      throw new Error("Failed to fetch data from ApiCarto API");
    });
}