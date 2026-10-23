import { lazy, Suspense, useState, useCallback } from "react";
import { TileLayer, useMap } from "react-leaflet";
import type { Feature } from "geojson";
import L from "leaflet";

// COMPONENTS
import MapBounds from "./layers/MapBounds";
import ShapesLayer from "./layers/ShapesLayer";
import PoiLayer from "./layers/POI/PoiLayer";
import { MIN_ZOOM_FOR_POIS, POI_CONFIGS } from "./PoiConfig";
import LocationHandler from "./layers/LocationHandler";
import NoScrollZone from "../wrapper/NoScrollZone";
import MapControls from "./layers/MapControls/MapControls";
import ParcelInfoPanel from "./layers/ParcelPanel/ParcelInfoPanel";
import MapPanel from "./layers/Navbar/MapPanel";
import { PARCEL_DASHBOARD_PANEL_ID } from "./layers/Navbar/panelIds";
import Navbar from "./layers/Navbar/Navbar";
import { EMPTY_SHAPES, mapPreference, type DataType } from "../../../utils/map";
import { useTheme } from "../../../context/ThemeProvider";
import { useMapType } from "../../../hooks/useMapType";
import { useMapFreeze } from "../../../hooks/useMapFreeze";
import { useParcelSelection } from "../../../hooks/useParcelSelection";

const ParcelDetailedDashboard = lazy(() => import("./layers/ParcelDetailedDashboard/ParcelDetailedDashboard"));

type LayersProps = {
    initialPlacement: boolean;
    initialCoordinates?: [number, number];
};

type Viewport = {
    bounds: L.LatLngBounds | null;
    zoom: number;
};

const DEFAULT_POI_TYPES = Object.entries(POI_CONFIGS).filter(([, config]) => config.enabled).map(([key]) => key);

const Layers = ({ initialPlacement, initialCoordinates }: LayersProps) => {
    const map = useMap();
    const { theme } = useTheme();
    const { mapType, handleChangeMapType } = useMapType(theme);
    const { selectedParcelle, selectedIdRef, handleParcelleSelect } = useParcelSelection();
    const [viewport, setViewport] = useState<Viewport>({ bounds: null, zoom: map.getZoom() });
    const [shapes, setShapes] = useState<DataType>(EMPTY_SHAPES);
    const [enabledPoiTypes, setEnabledPoiTypes] = useState<string[]>(DEFAULT_POI_TYPES);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const [isMapPanelOpen, setIsMapPanelOpen] = useState(false);

    const isParcelDashboardOpen = !!selectedParcelle && isDashboardOpen && !isMapPanelOpen;
    const isMapCovered = isMapPanelOpen || isParcelDashboardOpen;
    useMapFreeze(map, isMapCovered);

    const handleViewportChange = useCallback((bounds: L.LatLngBounds, zoom: number) => setViewport({ bounds, zoom }), []);
    const handleOpenDashboard = useCallback(() => setIsDashboardOpen(true), []);
    const handleCloseDashboard = useCallback(() => setIsDashboardOpen(false), []);
    const handleSelect = useCallback((bounds: L.LatLngBounds, feature: Feature | undefined, layer: L.Path) => {
        setIsDashboardOpen(false);
        handleParcelleSelect(bounds, feature, layer);
    }, [handleParcelleSelect]);
    const handleTogglePoi = useCallback((type: string, enabled: boolean) => {
        setEnabledPoiTypes(prev => enabled ? [...prev, type] : prev.filter(t => t !== type));
    }, []);
    const handleZoomIn = useCallback(() => map.zoomIn(), [map]);
    const handleZoomOut = useCallback(() => map.zoomOut(), [map]);
    const handleLocateUser = useCallback(() => map.locate({ setView: true, maxZoom: 16 }), [map]);

    return (
        <>
            <TileLayer url={mapPreference[mapType]} />
            <LocationHandler />
            <MapBounds onChange={handleViewportChange} />

            <ShapesLayer
                shapes={shapes}
                onShapesChange={setShapes}
                currentZoom={viewport.zoom}
                mapBounds={viewport.bounds}
                onParcelleSelect={handleSelect}
                selectedIdRef={selectedIdRef}
                initialPlacement={initialPlacement}
                initialCoordinates={initialCoordinates}
            />

            <PoiLayer
                mapBounds={viewport.bounds}
                currentZoom={viewport.zoom}
                enabledPoiTypes={enabledPoiTypes}
                hidden={isMapCovered}
            />

            <div className="map-overlay fixed inset-0 z-[1001] flex flex-col pointer-events-none">
                <header className="absolute inset-x-0 top-0 z-[1004] pointer-events-none">
                    <NoScrollZone>
                        <Navbar
                            parcelleBounds={shapes.parcelles}
                            onParcelleSelect={handleSelect}
                            onPanelsOpenChange={setIsMapPanelOpen}
                            isParcelDashboardOpen={isParcelDashboardOpen}
                        />
                    </NoScrollZone>
                </header>

                {isParcelDashboardOpen && (
                    <div className="relative z-[1003]">
                        <NoScrollZone>
                            <MapPanel id={PARCEL_DASHBOARD_PANEL_ID} label="Détail de la parcelle" onClose={handleCloseDashboard}>
                                <Suspense fallback={null}>
                                    <ParcelDetailedDashboard
                                        selectedParcelle={selectedParcelle}
                                        onClose={handleCloseDashboard}
                                    />
                                </Suspense>
                            </MapPanel>
                        </NoScrollZone>
                    </div>
                )}

                {selectedParcelle && !isMapCovered && (
                    <div className="absolute inset-0 z-[1002] pointer-events-none p-6 flex flex-col justify-end">
                        <div className="pointer-events-auto w-full max-w-4xl mx-auto rounded-2xl border border-black/[0.08] shadow-2xl animate-in slide-in-from-bottom-10 glass overflow-hidden dark:border-white/10">
                            <NoScrollZone>
                                <ParcelInfoPanel
                                    selectedParcelle={selectedParcelle}
                                    onOpenDashboard={handleOpenDashboard}
                                />
                            </NoScrollZone>
                        </div>
                    </div>
                )}

                {!isParcelDashboardOpen && <div className="absolute top-14 right-0 z-[1003] pointer-events-auto">
                    <NoScrollZone>
                        <MapControls
                            onZoomIn={handleZoomIn}
                            onZoomOut={handleZoomOut}
                            onLocateUser={handleLocateUser}
                            currentMapType={mapType}
                            onChangeMapType={handleChangeMapType}
                            enabledPoiTypes={enabledPoiTypes}
                            onTogglePoi={handleTogglePoi}
                            currentZoom={viewport.zoom}
                            minZoomForPois={MIN_ZOOM_FOR_POIS}
                        />
                    </NoScrollZone>
                </div>}
            </div>
        </>
    );
};

export default Layers;
