import { useState, useCallback, useRef } from "react";
import { TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { FeatureCollection } from "geojson";

// COMPONENTS
import MapBounds from "./layers/MapBounds";
import ZoomHandler from "./layers/ZoomHandler";
import ShapesLayer from "./layers/ShapesLayer";
import PoiLayer from "./layers/POI/PoiLayer";
import { MIN_ZOOM_FOR_POIS, POI_CONFIGS } from "./PoiConfig";
import LocationHandler from "./layers/LocationHandler";
import NoScrollZone from "../wrapper/NoScrollZone";
import MapControls from "./layers/MapControls/MapControls";
import ParcelInfoPanel from "./layers/ParcelPanel/ParcelInfoPanel";
import ParcelDetailedDashboard from "./layers/ParcelDetailedDashboard/ParcelDetailedDashboard";
import Navbar from "./layers/Navbar/Navbar";
import { mapPreference } from "../../../utils/map";
import { addOkReverseRequest } from "../../../requests/addok";

const getUserMapPreference = (): "basic" | "satellite" => {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return user.mapPreference === "satellite" ? "satellite" : "basic";
    } catch (e) {
        return "basic";
    }
};

const Layers = () => {
    const map = useMap();
    const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
    const [currentZoom, setCurrentZoom] = useState<number>(6);
    
    const [selectedParcelle, setSelectedParcelle] = useState<{
        bounds: L.LatLngBounds; 
        feature: any; 
        layer: L.Path;
        addokData?: any;
    } | null>(null);
    
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const selectedIdRef = useRef<string | null>(null);

    const [departementsBoundData, setDepartementsBoundData] = useState<FeatureCollection | null>(null);
    const [pacellesBoundData, setPacellesBoundData] = useState<FeatureCollection | null>(null);
    const [cityBoundData, setCityBoundData] = useState<FeatureCollection | null>(null);
    const [divisionsBoundData, setDivisionsBoundData] = useState<FeatureCollection | null>(null);
    const [mapType, setMapType] = useState<"basic" | "satellite">(getUserMapPreference());
    const [poisData, setPoisData] = useState<FeatureCollection | null>(null);
    const [enabledPoiTypes, setEnabledPoiTypes] = useState<string[]>(
        Object.entries(POI_CONFIGS).filter(([_, config]) => config.enabled).map(([key]) => key)
    );

    const handleMapBoundsChange = useCallback((bounds: L.LatLngBounds) => setMapBounds(bounds), []);
    const handleZoomChange = useCallback((zoom: number) => setCurrentZoom(zoom), []);
    const handleCityBoundChange = useCallback((data: any) => setCityBoundData(data), []);
    const handleDepartementsBoundChange = useCallback((data: any) => setDepartementsBoundData(data), []);
    const handleDivisionsBoundChange = useCallback((data: any) => setDivisionsBoundData(data), []);
    const handlePacellesBoundChange = useCallback((data: any) => setPacellesBoundData(data), []);
    const handlePoisChange = useCallback((data: FeatureCollection | null) => setPoisData(data), []);

    const handleParcelleSelect = useCallback(async (bounds: L.LatLngBounds, feature: any, layer: L.Path) => {
        const id = feature.id;
        selectedIdRef.current = id;
        setSelectedParcelle({ bounds, feature, layer });
        setIsDashboardOpen(false);

        try {
            const center = bounds.getCenter();
            const addokResponse = await addOkReverseRequest(center.lng, center.lat);
            setSelectedParcelle(prev => {
                if (!prev || prev.feature.id !== id) return prev;
                return { ...prev, addokData: addokResponse };
            });
        } catch (error) {
            console.error("Erreur Addok:", error);
        }
    }, []);

    const handleChangeMapType = useCallback((type: "basic" | "satellite") => {
        setMapType(type);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        user.mapPreference = type;
        localStorage.setItem("user", JSON.stringify(user));
    }, []);

    const handleTogglePoi = useCallback((type: string, enabled: boolean) => {
        setEnabledPoiTypes(prev => enabled ? [...prev, type] : prev.filter(t => t !== type));
    }, []);

    return (
        <>
            <TileLayer url={mapPreference[mapType]} />
            <LocationHandler />
            <MapBounds onChange={handleMapBoundsChange} />
            <ZoomHandler onZoomChange={handleZoomChange} />
    
            <ShapesLayer
                onCityBoundChange={handleCityBoundChange}
                onDepartementsBoundChange={handleDepartementsBoundChange}
                onDivisionsBoundChange={handleDivisionsBoundChange}
                onPacellesBoundChange={handlePacellesBoundChange}
                currentZoom={currentZoom}
                mapBounds={mapBounds}
                dataShape={{ 
                    departements: departementsBoundData, 
                    parcelles: pacellesBoundData, 
                    city: cityBoundData, 
                    divisions: divisionsBoundData 
                }}
                onParcelleSelect={handleParcelleSelect}
                selectedIdRef={selectedIdRef}
            />
            
            <PoiLayer 
                onPoisChange={handlePoisChange} 
                mapBounds={mapBounds} 
                currentZoom={currentZoom} 
                enabledPoiTypes={enabledPoiTypes} 
                dataPois={{ pois: poisData }} 
            />

            <div className="fixed inset-0 z-[1001] flex flex-col pointer-events-none">
                <header className="flex w-full h-15 items-center shrink-0 pointer-events-auto">
                    <NoScrollZone>
                        <Navbar 
                            parcelleBounds={pacellesBoundData}
                            onParcelleSelect={handleParcelleSelect}
                        />
                    </NoScrollZone>
                </header>

                {selectedParcelle && (
                    <>
                        {isDashboardOpen ? (
                            <div className="fixed top-15 left-0 right-0 bottom-0 z-[1005] bg-white animate-in fade-in duration-300 pointer-events-auto">
                                <NoScrollZone>
                                    <ParcelDetailedDashboard 
                                        selectedParcelle={selectedParcelle}
                                        onClose={() => setIsDashboardOpen(false)}
                                    />
                                </NoScrollZone>
                            </div>
                        ) : (
                            <div className="absolute inset-0 z-[1002] pointer-events-none p-6 flex flex-col justify-end">
                                <div className="pointer-events-auto w-full max-w-4xl mx-auto rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10 bg-white overflow-hidden">
                                    <NoScrollZone>
                                        <ParcelInfoPanel 
                                            selectedParcelle={selectedParcelle}
                                            onOpenDashboard={() => setIsDashboardOpen(true)}
                                        />
                                    </NoScrollZone>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className="absolute top-14 right-0 z-[1003] pointer-events-auto">
                    <NoScrollZone>
                        <MapControls 
                            onZoomIn={() => map.zoomIn()} 
                            onZoomOut={() => map.zoomOut()}
                            onLocateUser={() => map.locate({ setView: true, maxZoom: 16 })}
                            currentMapType={mapType}
                            onChangeMapType={handleChangeMapType}
                            enabledPoiTypes={enabledPoiTypes}
                            onTogglePoi={handleTogglePoi}
                            currentZoom={currentZoom}
                            minZoomForPois={MIN_ZOOM_FOR_POIS}
                        />
                    </NoScrollZone>
                </div>
            </div>
        </>
    );
};

export default Layers;