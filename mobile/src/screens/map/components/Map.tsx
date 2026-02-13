import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useMapHtml } from '../hooks/useMapHtml';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getDepartementByBbox, getCityByBbox, getDivisionsByBboxAndDepartments, getParcellesByBboxAndDepartments } from '../../../requests/map';
import { FRANCE_BBOX, isFeatureCollection, boundToBbox, MIN_ZOOM_FOR_DIVISION } from '../../../utils/map';

type MapProps = {
    center: { lat: number; lng: number };
    zoom: number;
    onMessageReceived: (message: any) => void;
    bounds?: any;
}

const getGeometryCenter = (geometry: any): { lat: number; lng: number } | null => {
    if (!geometry) return null;

    let allCoords: number[][] = [];

    if (geometry.type === 'Polygon') {
        allCoords = geometry.coordinates[0];
    } else if (geometry.type === 'MultiPolygon') {
        geometry.coordinates.forEach((polygon: number[][][]) => {
            allCoords = allCoords.concat(polygon[0]);
        });
    }

    if (allCoords.length === 0) return null;

    let sumLng = 0;
    let sumLat = 0;
    allCoords.forEach(coord => {
        sumLng += coord[0];
        sumLat += coord[1];
    });

    return {
        lng: sumLng / allCoords.length,
        lat: sumLat / allCoords.length
    };
};

const Map = ({ center, zoom, onMessageReceived, bounds }: MapProps) => {
    const webViewRef = useRef<WebView>(null);
    const { htmlContent, loading } = useMapHtml();
    const isMapReady = useRef(false);
    const pendingGeoJSON = useRef<any>(null);
    const [departmentsShapes, setDepartmentsShapes] = useState<any>(null);
    const currentZoom = useRef(zoom);

    const lastPropCenter = useRef<{ lat: number; lng: number }>({ lat: center.lat, lng: center.lng });
    const ignoreNextCenterUpdate = useRef(false);

    const { data: allDepartements } = useQuery({
        queryKey: ['allDepartements'],
        queryFn: () => getDepartementByBbox(FRANCE_BBOX),
        staleTime: Infinity,
    });

    const departementsVisibles = useMemo(() => {
        if (!allDepartements?.features || !bounds) return [];

        const east = bounds._northEast.lng;
        const west = bounds._southWest.lng;
        const north = bounds._northEast.lat;
        const south = bounds._southWest.lat;

        return allDepartements.features
            .filter((dept: any) => {
                let coords: number[][];
                if (dept.geometry.type === 'Polygon') {
                    coords = dept.geometry.coordinates[0];
                } else if (dept.geometry.type === 'MultiPolygon') {
                    coords = dept.geometry.coordinates[0][0];
                } else {
                    return false;
                }

                const lons = coords.map((c: number[]) => c[0]);
                const lats = coords.map((c: number[]) => c[1]);
                const deptMinLon = Math.min(...lons);
                const deptMaxLon = Math.max(...lons);
                const deptMinLat = Math.min(...lats);
                const deptMaxLat = Math.max(...lats);

                return !(east < deptMinLon ||
                    west > deptMaxLon ||
                    north < deptMinLat ||
                    south > deptMaxLat);
            })
            .map((dept: any) => dept.properties.ddep_c_cod);
    }, [allDepartements, bounds]);

    const { mutate: fetchCity } = useMutation({
        mutationFn: (bbox: string) => getCityByBbox(bbox),
        onSuccess: (data) => {
            if (data && isFeatureCollection(data)) {
                sendGeoJSON(data);
            }
        }
    });

    const { mutate: fetchDivision } = useMutation({
        mutationFn: ({ bbox, departments }: { bbox: string; departments: string[] }) =>
            getDivisionsByBboxAndDepartments(bbox, departments),
        onSuccess: (data) => {
            if (data && isFeatureCollection(data)) {
                sendGeoJSON(data);
            }
        }
    });

    const { mutate: fetchParcelles } = useMutation({
        mutationFn: ({ bbox, departments }: { bbox: string; departments: string[] }) => getParcellesByBboxAndDepartments(bbox, departments),
        onSuccess: (data) => {
            if (data && isFeatureCollection(data)) {
                sendGeoJSON(data);
            }
        }
    });

    const sendGeoJSON = useCallback((geojson: any) => {
        if (webViewRef.current && isMapReady.current) {
            webViewRef.current.postMessage(JSON.stringify({
                type: 'setGeoJSON',
                geojson
            }));
        } else {
            pendingGeoJSON.current = geojson;
        }
    }, []);

    const flyTo = useCallback((lat: number, lng: number, z?: number, duration?: number) => {
        if (webViewRef.current && isMapReady.current) {
            webViewRef.current.postMessage(JSON.stringify({
                type: 'flyTo',
                lat,
                lng,
                zoom: z,
                duration: duration ?? 0.75
            }));
        }
    }, []);

    useEffect(() => {
        if (allDepartements && isFeatureCollection(allDepartements)) {
            setDepartmentsShapes(allDepartements);
            sendGeoJSON(allDepartements);
        }
    }, [allDepartements, sendGeoJSON]);

    useEffect(() => {
        if (ignoreNextCenterUpdate.current) {
            ignoreNextCenterUpdate.current = false;
            return;
        }

        const centerChanged =
            lastPropCenter.current.lat !== center.lat ||
            lastPropCenter.current.lng !== center.lng;

        if (centerChanged) {
            lastPropCenter.current = { lat: center.lat, lng: center.lng };
            flyTo(center.lat, center.lng, zoom);
        }
    }, [center, zoom, flyTo]);

    useEffect(() => {
        if (!bounds) return;

        const bbox = boundToBbox(bounds);
        const currentZ = currentZoom.current;

        if (currentZ < 12) {
            sendGeoJSON(departmentsShapes);
        } else if (currentZ >= 12 && currentZ < 15) {
            fetchCity(bbox);
        } else if (currentZ >= 15 && currentZ < 18 && departementsVisibles.length > 0) {
            fetchDivision({ bbox, departments: departementsVisibles });
        } else if (currentZ >= 18 && departementsVisibles.length > 0) {
            fetchParcelles({ bbox, departments: departementsVisibles });
        }
    }, [bounds, fetchCity, fetchDivision, fetchParcelles, departmentsShapes, departementsVisibles]);

    useEffect(() => {
        currentZoom.current = zoom;
    }, [zoom]);

    const handleMessage = useCallback((event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.event === 'onMapReady') {
                isMapReady.current = true;
                if (pendingGeoJSON.current) {
                    sendGeoJSON(pendingGeoJSON.current);
                    pendingGeoJSON.current = null;
                }
            }

            if (data.event === 'onShapeClick') {
                const geometry = data.payload?.geometry;
                const alreadyCentered = data.payload?.alreadyCentered;

                if (geometry && !alreadyCentered) {
                    const shapeCenter = getGeometryCenter(geometry);
                    if (shapeCenter) {
                        if (currentZoom.current >= 15) {
                            ignoreNextCenterUpdate.current = true;
                            flyTo(shapeCenter.lat, shapeCenter.lng, 18);
                        } else if (currentZoom.current >= 12) {
                            ignoreNextCenterUpdate.current = true;
                            flyTo(shapeCenter.lat, shapeCenter.lng, 15);
                        } else {
                            ignoreNextCenterUpdate.current = true;
                            flyTo(shapeCenter.lat, shapeCenter.lng, 12);
                        }
                    }
                }
            }

            onMessageReceived(data);
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    }, [onMessageReceived, sendGeoJSON, flyTo]);

    if (loading || !htmlContent) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <WebView
            ref={webViewRef}
            source={{ html: htmlContent }}
            style={{ flex: 1 }}
            onMessage={handleMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            originWhitelist={['*']}
        />
    );
};

export default Map;