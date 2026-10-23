import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { FeatureCollection } from "geojson";
import L from "leaflet";
import { getPoisByBbox } from "../../../../../requests/map";
import { boundToBbox } from "../../../../../utils/map";
import { getMaxFeaturesForZoom, MIN_ZOOM_FOR_POIS } from "../../PoiConfig";

const POIS_STALE_TIME = 5 * 60 * 1000;
const POIS_GC_TIME = 2 * 60 * 1000;

export const usePoisData = (
    mapBounds: L.LatLngBounds | null,
    zoom: number,
    enabledTypes: string[],
): FeatureCollection | null => {
    const isActive = !!mapBounds && zoom >= MIN_ZOOM_FOR_POIS && enabledTypes.length > 0;
    const bbox = mapBounds ? boundToBbox(mapBounds) : null;
    const maxFeatures = getMaxFeaturesForZoom(zoom);

    const { data } = useQuery<FeatureCollection>({
        queryKey: ["pois", bbox, enabledTypes, maxFeatures],
        queryFn: ({ signal }) => getPoisByBbox(bbox!, enabledTypes, maxFeatures, signal),
        enabled: isActive,
        placeholderData: keepPreviousData,
        staleTime: POIS_STALE_TIME,
        gcTime: POIS_GC_TIME,
        retry: false,
    });

    return isActive && data?.type === "FeatureCollection" ? data : null;
};
