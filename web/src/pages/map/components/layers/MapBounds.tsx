import { useEffect } from "react";
import { useMapEvents } from "react-leaflet";

type MapBoundsProps = {
    onChange: (bounds: L.LatLngBounds) => void;
}

const MapBounds = ({ onChange }: MapBoundsProps) => {
    const map = useMapEvents({
        moveend: () => {
            const bounds = map.getBounds();
            onChange(bounds);
        },
    });

    useEffect(() => {
        if (map)
            onChange(map.getBounds());
    }, [map]);

    return null;
}

export default MapBounds;