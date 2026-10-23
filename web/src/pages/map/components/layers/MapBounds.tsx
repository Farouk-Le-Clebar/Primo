import { useEffect } from "react";
import { useMapEvents } from "react-leaflet";

type MapBoundsProps = {
    onChange: (bounds: L.LatLngBounds, zoom: number) => void;
}

const MapBounds = ({ onChange }: MapBoundsProps) => {
    const map = useMapEvents({
        moveend: () => onChange(map.getBounds(), map.getZoom()),
    });

    useEffect(() => {
        onChange(map.getBounds(), map.getZoom());
    }, [map, onChange]);

    return null;
}

export default MapBounds;
