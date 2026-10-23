import { memo, useMemo } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { getPoiDisplayRatio, MIN_ZOOM_FOR_POIS } from "../../PoiConfig";
import { usePoisData } from "./usePoisData";
import { buildPoiDisplay } from "./PoiDisplay";
import PoiMarker from "./PoiMarker";
import PoiDotMarker from "./PoiDotMarker";

type PoiLayerProps = {
    mapBounds: L.LatLngBounds | null;
    currentZoom: number;
    enabledPoiTypes: string[];
    hidden: boolean;
};

const getPoiKey = (props: Record<string, unknown> | null, index: number): string =>
    String(props?.id ?? props?.osm_id ?? index);

const PoiLayer = ({ mapBounds, currentZoom, enabledPoiTypes, hidden }: PoiLayerProps) => {
    const map = useMap();
    const pois = usePoisData(mapBounds, currentZoom, enabledPoiTypes);

    const { featured, dots } = useMemo(() => {
        if (!pois || currentZoom < MIN_ZOOM_FOR_POIS) return { featured: [], dots: [] };
        return buildPoiDisplay(pois, map, currentZoom);
    }, [pois, currentZoom, map, mapBounds]);

    if (hidden || (featured.length === 0 && dots.length === 0)) return null;

    const dotSize = getPoiDisplayRatio(currentZoom).dotSize;

    return (
        <>
            {dots.map((feature, index) => (
                <PoiDotMarker
                    key={`dot-${getPoiKey(feature.properties, index)}`}
                    feature={feature}
                    size={dotSize}
                />
            ))}
            {featured.map((feature, index) => (
                <PoiMarker
                    key={`poi-${getPoiKey(feature.properties, index)}`}
                    feature={feature}
                    showLabel={feature._showLabel === true}
                />
            ))}
        </>
    );
};

export default memo(PoiLayer);
