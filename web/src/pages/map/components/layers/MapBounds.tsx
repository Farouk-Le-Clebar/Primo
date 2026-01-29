import { useMapEvents } from "react-leaflet";

type MapBoundsProps = {
    onChange: (bounds: L.LatLngBounds) => void;
}

const MapBounds= ({ onChange }: MapBoundsProps) => {
    const map = useMapEvents({
        moveend: () => {
            const bounds = map.getBounds();
            onChange(bounds);
        },
    });
    return null;
}

export default MapBounds;