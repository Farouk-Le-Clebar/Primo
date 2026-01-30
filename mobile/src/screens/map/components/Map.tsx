import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { LeafletView, MapShapeType } from 'react-native-leaflet-view';
import { useMapHtml } from '../hooks/useMapHtml';
import { useQuery } from '@tanstack/react-query';
import { getDepartementByBbox } from '../../../requests/map';
import { FRANCE_BBOX, isFeatureCollection } from '../../../utils/map';
import type { FeatureCollection, Feature } from "geojson";

interface MapProps {
    center: { lat: number; lng: number };
    zoom: number;
    onMessageReceived: (message: any) => void;
    bounds?: any;
}

const convertGeoJSONToMapShapes = (geojson: FeatureCollection) => {
    const shapes: any[] = [];

    geojson.features.forEach((feature: Feature, index: number) => {
        if (feature.geometry.type === 'Polygon') {
            const coordinates = feature.geometry.coordinates[0];
            const positions = coordinates.map((coord: number[]) => ({
                lat: coord[1],
                lng: coord[0]
            }));

            shapes.push({
                shapeType: MapShapeType.POLYGON,
                positions: positions,
                color: '#50B587',
                weight: 1,
                id: `departement-${index}`,
            });
        } else if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates.forEach((polygon: number[][][], polyIndex: number) => {
                const coordinates = polygon[0];
                const positions = coordinates.map((coord: number[]) => ({
                    lat: coord[1],
                    lng: coord[0]
                }));

                shapes.push({
                    shapeType: MapShapeType.POLYGON,
                    positions: positions,
                    color: '#50B587',
                    weight: 2,
                    id: `departement-${index}-${polyIndex}`,
                });
            });
        }
    });

    return shapes;
};

const Map: React.FC<MapProps> = ({ center, zoom, onMessageReceived, bounds }) => {
    const { htmlContent, loading } = useMapHtml();

    const [departementsBoundData, setDepartementsBoundData] =
        useState<FeatureCollection | null>(null);

    const { data: allDepartements } = useQuery({
        queryKey: ['allDepartements'],
        queryFn: () => getDepartementByBbox(FRANCE_BBOX),
        staleTime: Infinity,
    });

    useEffect(() => {
        if (allDepartements && isFeatureCollection(allDepartements)) {
            setDepartementsBoundData(allDepartements);
            console.log("Loaded all departements data:", allDepartements.features?.length, "features");
        }
    }, [allDepartements]);

    if (loading || !htmlContent) {
        return <ActivityIndicator size="large" />
    }

    const mapShapes = departementsBoundData
        ? convertGeoJSONToMapShapes(departementsBoundData)
        : [];

    console.log("Map shapes count:", mapShapes.length);

    return (
        <LeafletView
            doDebug={false}
            source={{ html: htmlContent }}
            mapCenterPosition={center}
            zoom={zoom}
            zoomControl={false}
            onMessageReceived={onMessageReceived}
            mapLayers={[
                {
                    baseLayerIsChecked: true,
                    baseLayerName: 'OpenStreetMap',
                    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                },
            ]}
            mapShapes={mapShapes}
        />
    );
};

export default Map;
