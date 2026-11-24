import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { Feature, MultiPolygon, Polygon } from "geojson";
import { booleanPointInPolygon, point, pointOnFeature } from "@turf/turf";

const PARAM_X = "coo_x";
const PARAM_Y = "coo_y";
const PARAM_VIEW = "vue";
const PARAM_TAB = "onglet";
const DETAIL_VIEW = "detail";
const DEFAULT_TAB = "synthese";
const COORDINATE_PRECISION = 7;

const isPolygonFeature = (feature: Feature): feature is Feature<Polygon | MultiPolygon> =>
    feature.geometry?.type === "Polygon" || feature.geometry?.type === "MultiPolygon";

const isUrlPointInside = (params: URLSearchParams, feature: Feature<Polygon | MultiPolygon>): boolean => {
    if (!params.has(PARAM_X) || !params.has(PARAM_Y)) return false;
    const urlPoint = point([Number(params.get(PARAM_X)), Number(params.get(PARAM_Y))]);
    return booleanPointInPolygon(urlPoint, feature);
};

export function useParcelUrlState() {
    const [searchParams, setSearchParams] = useSearchParams();
    const isDetailOpen = searchParams.get(PARAM_VIEW) === DETAIL_VIEW;
    const activeTab = searchParams.get(PARAM_TAB) ?? DEFAULT_TAB;

    const syncSelection = useCallback((feature: Feature) => {
        if (!isPolygonFeature(feature) || isUrlPointInside(new URLSearchParams(window.location.search), feature)) return;
        const [lng, lat] = pointOnFeature(feature).geometry.coordinates;
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set(PARAM_X, lng.toFixed(COORDINATE_PRECISION));
            next.set(PARAM_Y, lat.toFixed(COORDINATE_PRECISION));
            next.delete(PARAM_VIEW);
            next.delete(PARAM_TAB);
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    const openDetail = useCallback(() => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set(PARAM_VIEW, DETAIL_VIEW);
            return next;
        });
    }, [setSearchParams]);

    const closeDetail = useCallback(() => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.delete(PARAM_VIEW);
            next.delete(PARAM_TAB);
            return next;
        });
    }, [setSearchParams]);

    const setActiveTab = useCallback((tab: string) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (tab === DEFAULT_TAB) next.delete(PARAM_TAB);
            else next.set(PARAM_TAB, tab);
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    return { isDetailOpen, activeTab, syncSelection, openDetail, closeDetail, setActiveTab };
}
