import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMap } from "react-leaflet";

export default function LocationHandler() {
  const map = useMap();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && (location.state as any).centerOn) {
      const coords = (location.state as any).centerOn;
      
      map.flyTo(coords, 18, { duration: 2 });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, map, navigate]);

  return null;
}