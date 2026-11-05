import { memo, useCallback, useEffect, useRef } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import type { Feature } from "geojson";
import L from "leaflet";
import { getShapeKey, setShapeStyles, type DataType, type ShapeLevel } from "../../../../utils/map";
import { useMapShapeStyles } from "../../../../hooks/useMapColors";
import { onEachFeature } from "./ShapesClick";
import { useShapesData } from "./useShapesData";
import MapSplashLoader from "./loading/MapSplashLoader";
import MapFetchIndicator from "./loading/MapFetchIndicator";

type ShapesLayerProps = {
    shapes: DataType;
    onShapesChange: (shapes: DataType) => void;
    mapBounds: L.LatLngBounds | null;
    currentZoom: number;
    onParcelleSelect: (bounds: L.LatLngBounds, feature: Feature, layer: L.Path) => void;
    selectedIdRef: React.RefObject<string | null>;
    initialPlacement: boolean;
    initialCoordinates?: [number, number];
};

const SHAPE_LEVELS: ShapeLevel[] = ["departements", "city", "divisions", "parcelles"];

const ShapesLayer = ({
    shapes,
    onShapesChange,
    mapBounds,
    currentZoom,
    onParcelleSelect,
    selectedIdRef,
    initialPlacement,
    initialCoordinates,
}: ShapesLayerProps) => {
    const map = useMap();
    const initialSelectionDoneRef = useRef(!initialPlacement);
    const { isInitialLoading, isFetchingShapes, level, parcelles } = useShapesData(mapBounds, currentZoom, onShapesChange);
    const shapeStyles = useMapShapeStyles();

    useEffect(() => setShapeStyles(shapeStyles), [shapeStyles]);

    useEffect(() => {
        if (!parcelles || !initialCoordinates || initialSelectionDoneRef.current) return;
        initialSelectionDoneRef.current = true;
        const latlng = L.latLng(initialCoordinates[0], initialCoordinates[1]);
        const layer = L.geoJSON(parcelles).getLayers().find((l) => l instanceof L.Polygon && l.getBounds().contains(latlng));
        if (layer instanceof L.Polygon && layer.feature) {
            onParcelleSelect(layer.getBounds(), layer.feature as Feature, layer);
            selectedIdRef.current = layer.feature.id?.toString() ?? null;
        }
    }, [parcelles, initialCoordinates, onParcelleSelect, selectedIdRef]);

    const parcelStyle = useCallback(
        (feature?: Feature) => (feature?.id === selectedIdRef.current ? shapeStyles.selected : shapeStyles.default),
        [selectedIdRef, shapeStyles],
    );

    return (
        <>
            <MapSplashLoader isVisible={isInitialLoading} />
            <MapFetchIndicator isVisible={isFetchingShapes} level={level} />
            {SHAPE_LEVELS.map((level) => {
                const data = shapes[level];
                if (!data) return null;
                const isParcelles = level === "parcelles";
                return (
                    <GeoJSON
                        key={`${level}-${getShapeKey(data)}`}
                        data={data}
                        style={isParcelles ? parcelStyle : shapeStyles.default}
                        onEachFeature={(feature, layer) => onEachFeature(feature, layer, map, onParcelleSelect, isParcelles ? selectedIdRef : undefined)}
                    />
                );
            })}
        </>
    );
};

export default memo(ShapesLayer);
