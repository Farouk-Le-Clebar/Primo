import L from "leaflet";

export function boundsToPolygon(bounds: L.LatLngBounds) {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  const nw = L.latLng(ne.lat, sw.lng);
  const se = L.latLng(sw.lat, ne.lng);

  return {
    type: "Polygon",
    coordinates: [
      [
        [sw.lng, sw.lat],
        [se.lng, se.lat],
        [ne.lng, ne.lat],
        [nw.lng, nw.lat],
        [sw.lng, sw.lat],
      ],
    ],
  };
}
