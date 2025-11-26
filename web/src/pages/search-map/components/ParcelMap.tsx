import { MapContainer, TileLayer } from "react-leaflet";
import { useEffect, useState, useCallback, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
    FRANCE_BOUNDS,
    ZOOM_THRESHOLDS,
    MAP_CONFIG,
    TILE_URLS,
    DEPARTEMENT_CENTERS,
} from "../../../constants/map.constants";
import type {
    ZoomLevel,
    GeoJSONData,
    ParcelMapProps,
} from "../../../types/map.types";
import { loadMapDataForLevel } from "../../../utils/map.utils";
import SearchBar from "../../../components/search/SearchBar";
import MapEvents from "./MapEvents";
import MapMarker from "./MapMarker";
import ParcelLayer from "./ParcelLayer";
import PoiWidget from "../../../components/poiMapWidget/PoiMapWidget";
import PoiMarkers from "../../../components/poiMapWidget/PoiMarkers";
import type { Poi } from "../../../types/poi.types";

const ParcelMap = ({
    darkMode = false,
    center = MAP_CONFIG.DEFAULT_CENTER,
    zoom = MAP_CONFIG.DEFAULT_ZOOM,
    showSearchBar = false,
}: ParcelMapProps) => {
    const [geoJsonData, setGeoJsonData] = useState<GeoJSONData | null>(null);
    const [currentLevel, setCurrentLevel] = useState<ZoomLevel>("departements");
    const [displayedLevel, setDisplayedLevel] =
        useState<ZoomLevel>("departements");
    const [currentZoom, setCurrentZoom] = useState(zoom);
    const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [markerPosition, setMarkerPosition] = useState<
        [number, number] | null
    >(null);
    const [markerLabel, setMarkerLabel] = useState<string>("");
    const mapRef = useRef<L.Map | null>(null);

    const [pois, setPois] = useState<Poi[]>([]);
    const [enabledPoiTypes, setEnabledPoiTypes] = useState<string[]>([]);
    const [isLoadingPois, setIsLoadingPois] = useState(false);

    const tileUrl = darkMode ? TILE_URLS.DARK : TILE_URLS.LIGHT;

    // Handle address selection from SearchBar
    const handleAddressSelect = useCallback(
        (coords: [number, number], label?: string) => {
            if (mapRef.current) {
                setMarkerPosition(coords);
                setMarkerLabel(label || "Adresse sélectionnée");
                mapRef.current.setView(coords, 18, {
                    animate: true,
                    duration: 1,
                });
            }
        },
        []
    );

    // Unified function to load GeoJSON data based on zoom level
    const loadDataForCurrentLevel = useCallback(
        async (level: ZoomLevel, bounds: L.LatLngBounds) => {
            try {
                const data = await loadMapDataForLevel(
                    level,
                    bounds,
                    DEPARTEMENT_CENTERS
                );
                setGeoJsonData(data);
                setDisplayedLevel(level);
            } catch (err) {
                console.error(`Failed to fetch ${level} data:`, err);
            }
        },
        []
    );

    const loadPois = useCallback(async () => {
        if (!mapBounds || currentZoom < 12 || enabledPoiTypes.length === 0) {
            setPois([]);
            return;
        }

        setIsLoadingPois(true);
        try {
            const bounds = mapBounds;
            const params = new URLSearchParams({
                minLat: bounds.getSouth().toString(),
                minLon: bounds.getWest().toString(),
                maxLat: bounds.getNorth().toString(),
                maxLon: bounds.getEast().toString(),
                types: enabledPoiTypes.join(","),
                zoom: currentZoom.toString(),
            });

            const response = await fetch(`http://localhost:3000/poi?${params}`);
            const data: Poi[] = await response.json();
            setPois(data);
        } catch (error) {
            console.error("Failed to load POIs:", error);
            setPois([]);
        } finally {
            setIsLoadingPois(false);
        }
    }, [mapBounds, currentZoom, enabledPoiTypes]);

    const handleTogglePoi = useCallback((type: string, enabled: boolean) => {
        setEnabledPoiTypes((prev) =>
            enabled ? [...prev, type] : prev.filter((t) => t !== type)
        );
    }, []);

    // Calculate current level based on zoom
    useEffect(() => {
        let newLevel: ZoomLevel;
        console.log("Current Zoom:", currentZoom);

        if (currentZoom <= ZOOM_THRESHOLDS.DEPARTEMENTS_MAX) {
            newLevel = "departements";
        } else if (currentZoom <= ZOOM_THRESHOLDS.COMMUNES_MAX) {
            newLevel = "communes";
        } else if (currentZoom <= ZOOM_THRESHOLDS.DIVISIONS_MAX) {
            newLevel = "divisions";
        } else {
            newLevel = "parcelles";
        }

        if (newLevel !== currentLevel) {
            setCurrentLevel(newLevel);
        }
    }, [currentZoom, currentLevel]);

    // Load data when level or bounds change
    useEffect(() => {
        if (!mapBounds) return;

        loadDataForCurrentLevel(currentLevel, mapBounds);
    }, [currentLevel, refreshTrigger, loadDataForCurrentLevel]);

    useEffect(() => {
        loadPois();
    }, [loadPois]);

    const handleZoomChange = useCallback((zoom: number) => {
        setCurrentZoom(zoom);
        setRefreshTrigger((prev) => prev + 1);
    }, []);

    const handleBoundsChange = useCallback((bounds: L.LatLngBounds) => {
        setMapBounds(bounds);
        setRefreshTrigger((prev) => prev + 1);
    }, []);

    const handleMapReady = useCallback((map: L.Map) => {
        mapRef.current = map;
    }, []);

    return (
        <div className="h-130 w-full rounded-lg shadow-lg relative">
            {showSearchBar && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-96 z-[1000]">
                    <SearchBar onAddressSelect={handleAddressSelect} />
                </div>
            )}

            <PoiWidget onTogglePoi={handleTogglePoi} darkMode={darkMode} />

            {isLoadingPois && (
                <div className="absolute bottom-4 right-4 z-[1000] bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
                    Chargement des points d'intérêt...
                </div>
            )}

            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom
                className="h-full w-full rounded-lg"
                maxBounds={FRANCE_BOUNDS}
                minZoom={MAP_CONFIG.MIN_ZOOM}
                maxZoom={MAP_CONFIG.MAX_ZOOM}
            >
                <TileLayer url={tileUrl} />
                <MapEvents
                    onZoomChange={handleZoomChange}
                    onBoundsChange={handleBoundsChange}
                    onMapReady={handleMapReady}
                    mapBounds={mapBounds}
                />

                <MapMarker position={markerPosition} label={markerLabel} />

                <ParcelLayer
                    geoJsonData={geoJsonData}
                    displayedLevel={displayedLevel}
                    refreshTrigger={refreshTrigger}
                    mapRef={mapRef}
                />
                <PoiMarkers pois={pois} />
            </MapContainer>
        </div>
    );
};

export default ParcelMap;
