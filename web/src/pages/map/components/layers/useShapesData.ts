import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import type { Feature, FeatureCollection, MultiPolygon } from "geojson";
import L from "leaflet";
import { boundToBbox, EMPTY_SHAPES, FRANCE_BBOX, getShapeLevel, isFeatureCollection, type DataType, type ShapeLevel } from "../../../../utils/map";
import { getCityByBbox, getDepartementByBbox, getDivisionsByBboxAndDepartments, getParcellesByBboxAndDepartments } from "../../../../requests/map";

type DepartementBox = {
    code: string;
    minLon: number;
    maxLon: number;
    minLat: number;
    maxLat: number;
};

const SHAPES_STALE_TIME = 5 * 60 * 1000;
const SHAPES_GC_TIME = 2 * 60 * 1000;

const toDepartementBox = (departement: Feature): DepartementBox => {
    const ring = (departement.geometry as MultiPolygon).coordinates[0][0];
    const box = { code: String(departement.properties?.ddep_c_cod), minLon: Infinity, maxLon: -Infinity, minLat: Infinity, maxLat: -Infinity };
    for (const [lon, lat] of ring) {
        box.minLon = Math.min(box.minLon, lon);
        box.maxLon = Math.max(box.maxLon, lon);
        box.minLat = Math.min(box.minLat, lat);
        box.maxLat = Math.max(box.maxLat, lat);
    }
    return box;
};

const intersects = (box: DepartementBox, bounds: L.LatLngBounds): boolean =>
    !(bounds.getEast() < box.minLon ||
        bounds.getWest() > box.maxLon ||
        bounds.getNorth() < box.minLat ||
        bounds.getSouth() > box.maxLat);

const fetchShapes = (level: ShapeLevel, bbox: string, departements: string[], signal: AbortSignal): Promise<FeatureCollection | null> => {
    if (level === "city") return getCityByBbox(bbox, signal);
    if (level === "divisions") return getDivisionsByBboxAndDepartments(bbox, departements, signal) as Promise<FeatureCollection>;
    return getParcellesByBboxAndDepartments(bbox, departements, signal) as Promise<FeatureCollection>;
};

export const useShapesData = (
    mapBounds: L.LatLngBounds | null,
    zoom: number,
    onShapesChange: (shapes: DataType) => void,
) => {
    const { data: allDepartements, isLoading: isAllDepartementsLoading } = useQuery<FeatureCollection>({
        queryKey: ["allDepartements"],
        queryFn: () => getDepartementByBbox(FRANCE_BBOX),
        staleTime: Infinity,
        gcTime: Infinity,
    });

    const departementBoxes = useMemo(
        () => (isFeatureCollection(allDepartements) ? allDepartements.features.map(toDepartementBox) : []),
        [allDepartements],
    );

    const visibleDepartements = useMemo(
        () => (mapBounds ? departementBoxes.filter((box) => intersects(box, mapBounds)).map((box) => box.code) : []),
        [departementBoxes, mapBounds],
    );

    const level = getShapeLevel(zoom);
    const bbox = mapBounds ? boundToBbox(mapBounds) : null;
    const needsDepartements = level === "divisions" || level === "parcelles";

    const { data, isFetching } = useQuery({
        queryKey: ["shapes", level, bbox, visibleDepartements],
        queryFn: ({ signal }) => fetchShapes(level, bbox!, visibleDepartements, signal),
        enabled: !!bbox && level !== "departements" && (!needsDepartements || visibleDepartements.length > 0),
        staleTime: SHAPES_STALE_TIME,
        gcTime: SHAPES_GC_TIME,
        retry: false,
    });

    useEffect(() => {
        if (level === "departements" && isFeatureCollection(allDepartements))
            onShapesChange({ ...EMPTY_SHAPES, departements: allDepartements });
    }, [level, allDepartements, onShapesChange]);

    useEffect(() => {
        if (level !== "departements" && isFeatureCollection(data))
            onShapesChange({ ...EMPTY_SHAPES, [level]: data });
    }, [level, data, onShapesChange]);

    return {
        isInitialLoading: isAllDepartementsLoading,
        isFetchingShapes: !isAllDepartementsLoading && isFetching,
        level,
        parcelles: level === "parcelles" && isFeatureCollection(data) ? data : null,
    };
};
