import { memo, useMemo } from "react";
import { useMap } from "react-leaflet";
import type { Feature, Point } from "geojson";
import L from "leaflet";
import { getMaxFeaturesForZoom, getPoiLabelDensity, MIN_ZOOM_FOR_POIS } from "../../PoiConfig";
import { filterOverlappingPois, selectPoiLabels } from "../../../../../utils/pois";
import { usePoisData } from "./usePoisData";
import PoiMarker from "./PoiMarker";

type PoiLayerProps = {
    mapBounds: L.LatLngBounds | null;
    currentZoom: number;
    enabledPoiTypes: string[];
    hidden: boolean;
};

type VisiblePoi = Feature<Point> & { _showLabel?: boolean };

const PoiLayer = ({ mapBounds, currentZoom, enabledPoiTypes, hidden }: PoiLayerProps) => {
    const map = useMap();
    const pois = usePoisData(mapBounds, currentZoom, enabledPoiTypes);

    const visibleFeatures = useMemo<VisiblePoi[]>(() => {
        if (!pois || currentZoom < MIN_ZOOM_FOR_POIS) return [];
        const features = pois.features.slice(0, getMaxFeaturesForZoom(currentZoom));
        const labelFeatures = selectPoiLabels(features, map, getPoiLabelDensity(currentZoom));
        return filterOverlappingPois(features, map, labelFeatures);
    }, [pois, currentZoom, map, mapBounds]);

    if (hidden || visibleFeatures.length === 0) return null;

    return (
        <>
            {visibleFeatures.map((feature, index) => (
                <PoiMarker
                    key={`poi-${feature.properties?.id ?? feature.properties?.osm_id ?? index}`}
                    feature={feature}
                    showLabel={feature._showLabel === true}
                />
            ))}
        </>
    );
};

export default memo(PoiLayer);
