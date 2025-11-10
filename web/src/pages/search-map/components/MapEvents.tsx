import { useMapEvents } from "react-leaflet";
import { useEffect } from "react";
import type { MapEventsProps } from "../../../types/map.types";

const MapEvents = ({
  onZoomChange,
  onBoundsChange,
  onMapReady,
  mapBounds,
}: MapEventsProps) => {
  const map = useMapEvents({
    zoomend(e) {
      const z = e.target.getZoom();
      onZoomChange(z);
      const bounds = e.target.getBounds();
      onBoundsChange(bounds);
    },
    moveend(e) {
      const bounds = e.target.getBounds();
      onBoundsChange(bounds);
    },
  });

  // Initialize map on first render
  useEffect(() => {
    if (map && !mapBounds) {
      onMapReady(map);
      const bounds = map.getBounds();
      const z = map.getZoom();
      onBoundsChange(bounds);
      onZoomChange(z);
    }
  }, [map, mapBounds, onMapReady, onBoundsChange, onZoomChange]);

  return null;
};

export default MapEvents;
