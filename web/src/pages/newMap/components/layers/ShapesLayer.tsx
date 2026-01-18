import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchDepartements, fetchDivisions, fetchParcelles } from "../../../../requests/parcel-map";
import { useEffect } from "react";
import { boundToBbox, isFeatureCollection, MIN_ZOOM_FOR_CITY, MIN_ZOOM_FOR_DIVISION, MIN_ZOOM_FOR_PARCELLES, style, type DataType } from "../../../../utils/map";
import { boundsToGeoJSON } from "../../../../requests/apicarto";
import { GeoJSON, useMap } from "react-leaflet";
import { onEachFeature } from "./ShapesClick";
import { getCityByBbox, getDepartementByBbox } from "../../../../requests/map";
import { useParcelle } from '../../../../context/ParcelleContext';

type ShapesLayerProps = {
    onCityBoundChange: (data: any) => void;
    onDepartementsBoundChange: (data: any) => void;
    onDivisionsBoundChange: (data: any) => void;
    onPacellesBoundChange: (data: any) => void;
    onFirstLayerRequestChange: (data: boolean) => void;
    mapBounds: L.LatLngBounds | null;
    currentZoom: number;
    lastZoom: number;
    firstLayerRequest: boolean;
    dataShape: DataType;
};

const ShapesLayer = ({
    onCityBoundChange,
    onDepartementsBoundChange,
    onDivisionsBoundChange,
    onPacellesBoundChange,
    onFirstLayerRequestChange,
    mapBounds,
    currentZoom,
    lastZoom,
    firstLayerRequest,
    dataShape,
}: ShapesLayerProps) => {
    const map = useMap();
    const { setSelectedParcelle } = useParcelle();
    const { data } = useQuery({
        queryKey: ['departements'],
        queryFn: () => fetchDepartements(),
    });

    useEffect(() => {
        if (data)
            onDepartementsBoundChange(data);
        const geoJsonLayer = L.geoJSON(data, {
        onEachFeature: (feature, layer) => {
            onEachFeature(feature, layer, map, handleParcelleSelect);
        },
        style: {
            fillOpacity: 0.2,
            weight: 2
        }
        });

        geoJsonLayer.addTo(map);

        return () => {
            map.removeLayer(geoJsonLayer);
        };
    }, [data]);

    const handleParcelleSelect = (bounds: L.LatLngBounds, feature: any, layer: L.Path) => {
        setSelectedParcelle({
            bounds,
            feature,
            layer
        });
    }

    const { mutate: departementsBoundsMutation } = useMutation({
        mutationFn: () => getDepartementByBbox(boundToBbox(mapBounds!)),
        onSuccess: (data) => {
            if (data && isFeatureCollection(data)) {
                onDepartementsBoundChange(data);
                onCityBoundChange(null);
                onDivisionsBoundChange(null);
                onPacellesBoundChange(null);
            }
        },
        onError: (error) => {
            console.error("Error fetching departements data:", error);
        }
    });

    const { mutate: parcellesBoundsMutation } = useMutation({
        mutationFn: (geomPolygon: object) => fetchParcelles(geomPolygon),
        onSuccess: (data) => {
            if (data && isFeatureCollection(data)) {
                onPacellesBoundChange(data);
                onCityBoundChange(null);
                onDivisionsBoundChange(null);
                onDepartementsBoundChange(null);
            }
        },
        onError: (error) => {
            console.error("Error fetching parcelles data:", error);
        }
    });

    const { mutate: cityBoundsMutation } = useMutation({
        mutationFn: () => getCityByBbox(boundToBbox(mapBounds!)),
        onSuccess: (data) => {
            if (data && isFeatureCollection(data)) {
                onCityBoundChange(data);
                onPacellesBoundChange(null);
                onDivisionsBoundChange(null);
                onDepartementsBoundChange(null);
            }
        },
        onError: (error) => {
            console.error("Error fetching city data:", error);
        }
    });

    const { mutate: divisionsBoundsMutation } = useMutation({
        mutationFn: (geomPolygon: object) => fetchDivisions(geomPolygon),
        onSuccess: (data) => {
            if (data && isFeatureCollection(data)) {
                onDivisionsBoundChange(data);
                onPacellesBoundChange(null);
                onCityBoundChange(null);
                onDepartementsBoundChange(null);
            }
        },
        onError: (error) => {
            console.error("Error fetching divisions data:", error);
        }
    });

    useEffect(() => {
        if (mapBounds &&
            currentZoom >= MIN_ZOOM_FOR_PARCELLES) {
            parcellesBoundsMutation(boundsToGeoJSON(mapBounds));
            onFirstLayerRequestChange(false);
        }

        if (mapBounds &&
            currentZoom >= MIN_ZOOM_FOR_CITY &&
            currentZoom < MIN_ZOOM_FOR_DIVISION &&
            (lastZoom > currentZoom || firstLayerRequest || lastZoom === currentZoom)) {
            cityBoundsMutation();
            onFirstLayerRequestChange(false);
        }

        if (mapBounds &&
            currentZoom >= MIN_ZOOM_FOR_DIVISION &&
            currentZoom < MIN_ZOOM_FOR_PARCELLES &&
            (lastZoom > currentZoom || firstLayerRequest || lastZoom === currentZoom)) {
            divisionsBoundsMutation(boundsToGeoJSON(mapBounds));
            onFirstLayerRequestChange(false);
        }

        if (mapBounds &&
            currentZoom < MIN_ZOOM_FOR_CITY &&
            (lastZoom > currentZoom || firstLayerRequest || lastZoom === currentZoom)) {

            departementsBoundsMutation();
            onFirstLayerRequestChange(false);
        }
    }, [mapBounds, currentZoom]);

    return (
        <>
            {dataShape.departements && (
                <GeoJSON
                    key={JSON.stringify(dataShape.departements)}
                    data={dataShape.departements}
                    style={style}
                    onEachFeature={(feature, layer) => onEachFeature(feature, layer, map, handleParcelleSelect)}
                />
            )}
            {dataShape.parcelles && (
                <GeoJSON
                    key={JSON.stringify(dataShape.parcelles)}
                    data={dataShape.parcelles}
                    style={style}
                    onEachFeature={(feature, layer) => onEachFeature(feature, layer, map, handleParcelleSelect)}
                />
            )}
            {dataShape.city && (
                <GeoJSON
                    key={JSON.stringify(dataShape.city)}
                    data={dataShape.city}
                    style={style}
                    onEachFeature={(feature, layer) => onEachFeature(feature, layer, map, handleParcelleSelect)}
                />
            )}
            {dataShape.divisions && (
                <GeoJSON
                    key={JSON.stringify(dataShape.divisions)}
                    data={dataShape.divisions}
                    style={style}
                    onEachFeature={(feature, layer) => onEachFeature(feature, layer, map, handleParcelleSelect)}
                />
            )}
        </>
    );
};

export default ShapesLayer;