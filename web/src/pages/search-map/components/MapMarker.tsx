import { Marker, Popup } from "react-leaflet";
import { useMemo } from "react";
import L from "leaflet";
import type { MapMarkerProps } from "../../../types/map.types";

const MapMarker = ({ position, label }: MapMarkerProps) => {
  const customIcon = useMemo(() => {
    return L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }, []);

  if (!position) return null;

  return (
    <Marker position={position} icon={customIcon}>
      <Popup>
        <div style={{ fontFamily: "sans-serif" }}>
          <strong>{label}</strong>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;
